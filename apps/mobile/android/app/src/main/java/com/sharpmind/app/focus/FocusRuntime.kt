package com.sharpmind.app.focus

import android.content.Context
import android.content.Intent
import com.sharpmind.app.accessibility.AccessibilityEventProcessor
import com.sharpmind.app.accessibility.AccessibilitySnapshot
import com.sharpmind.app.accessibility.ProcessorResult
import com.sharpmind.app.permissions.PermissionLogic
import com.sharpmind.app.permissions.PermissionManager
import com.sharpmind.app.permissions.PermissionSnapshot
import com.sharpmind.app.services.FocusForegroundService
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.util.UUID
import java.util.concurrent.CopyOnWriteArrayList

data class RestrictionEvent(
    val id: String,
    val packageName: String,
    val ruleId: String,
    val ruleType: String,
    val target: String,
    val support: String,
    val atEpochMs: Long,
)

/**
 * Single in-process source of truth for the focus session.
 * Screen contents are not stored. Restriction events keep package and rule metadata only.
 */
class FocusRuntime(private val context: Context) {
    private val machine = FocusStateMachine()
    private val engine = RestrictionEngine()
    private val processor = AccessibilityEventProcessor(engine)
    private val permissions = PermissionManager(context)
    private val directory = File(context.filesDir, "focus").apply { mkdirs() }
    private val listeners = CopyOnWriteArrayList<(String, String) -> Unit>()
    private val lock = Any()

    private var session: FocusSession = readSession()
    private var rules: List<RestrictionRule> = readRules()
    private var lastPermission: PermissionSnapshot? = null
    private var lastInterventionAt: Long = 0
    private var lastInterventionKey: String = ""
    private val recentEvents = ArrayDeque<RestrictionEvent>()
    private var usageMsByPackage: MutableMap<String, Long> = readUsage().toMutableMap()
    private var lastUsagePackage: String? = null
    private var lastUsageAt: Long = 0L

    fun addListener(listener: (String, String) -> Unit) {
        listeners.add(listener)
    }

    fun removeListener(listener: (String, String) -> Unit) {
        listeners.remove(listener)
    }

    fun snapshot(): FocusSession = synchronized(lock) { session }

    fun rules(): List<RestrictionRule> = synchronized(lock) { rules }

    fun recentEvents(): List<RestrictionEvent> = synchronized(lock) { recentEvents.toList() }

    fun start(draft: FocusDraft, ruleIds: List<String>): FocusSession {
        val next = synchronized(lock) {
            val prepared = machine.apply(
                session,
                FocusCommand.Prepare(draft, UUID.randomUUID().toString(), ruleIds),
                System.currentTimeMillis(),
            )
            val permission = permissions.snapshot()
            val needsAccessibility = rules.any { it.id in ruleIds && it.ruleType == RuleType.CONTENT_RESTRICTION }
            val ready = PermissionLogic.enforcementReady(permission, needsAccessibility)
            val activated = if (ready) {
                machine.apply(prepared, FocusCommand.Activate, System.currentTimeMillis())
            } else {
                machine.apply(prepared, FocusCommand.PermissionsMissing, System.currentTimeMillis())
            }
            session = activated
            usageMsByPackage = mutableMapOf()
            lastUsagePackage = null
            lastUsageAt = 0L
            persistLocked()
            activated
        }
        if (next.phase == FocusPhase.ACTIVE) {
            FocusForegroundService.start(context)
        }
        emit("focus_status", statusJson())
        return next
    }

    fun pause(): FocusSession = transition(FocusCommand.Pause)

    fun resume(): FocusSession {
        val next = transition(FocusCommand.Resume)
        if (next.phase == FocusPhase.ACTIVE) {
            FocusForegroundService.start(context)
        }
        return next
    }

    fun stop(confirmStrict: Boolean): FocusSession {
        val next = transition(FocusCommand.Stop(confirmStrict))
        if (next.phase == FocusPhase.COMPLETED || next.phase == FocusPhase.CANCELLED) {
            FocusForegroundService.stop(context)
        }
        return next
    }

    fun cancel(confirmStrict: Boolean): FocusSession {
        val next = transition(FocusCommand.Cancel(confirmStrict))
        FocusForegroundService.stop(context)
        return next
    }

    fun setRules(nextRules: List<RestrictionRule>) {
        synchronized(lock) {
            rules = nextRules
            persistLocked()
        }
        emit("rules", rulesJson())
    }

    fun onForegroundPackage(packageName: String?, now: Long = System.currentTimeMillis()): MatchResult? {
        if (packageName.isNullOrBlank()) {
            return null
        }
        val current = snapshot()
        if (current.phase != FocusPhase.ACTIVE) {
            return null
        }
        observePermissions(now)
        val usage = synchronized(lock) {
            usageMsByPackage = UsagePathPolicy.accumulate(usageMsByPackage, lastUsagePackage, lastUsageAt, now).toMutableMap()
            lastUsagePackage = packageName
            lastUsageAt = now
            persistUsageLocked()
            usageMsByPackage.toMap()
        }
        val match = engine.match(
            UiSignal(packageName, null, emptyList(), emptyList(), emptyList()),
            rules(),
            current.id,
            usage,
        )
        if (UsagePathPolicy.decide(match).record) {
            recordAndEmit(match, packageName, now)
        }
        return match
    }

    fun onAccessibility(snapshot: AccessibilitySnapshot, now: Long = System.currentTimeMillis()): ProcessorResult {
        val result = processor.process(snapshot, rules(), this.snapshot())
        val match = result.match
        if (!result.ignored && match != null && match.matched) {
            recordAndEmit(match, snapshot.packageName ?: "", now)
        } else if (!result.ignored && match != null && match.support == DetectionSupport.UNSUPPORTED) {
            emit(
                "unsupported_surface",
                JSONObject()
                    .put("packageName", snapshot.packageName)
                    .put("detail", match.detail)
                    .put("adapterId", match.adapterId)
                    .toString(),
            )
        }
        return result
    }

    fun observePermissions(now: Long = System.currentTimeMillis()): List<String> {
        val current = permissions.snapshot()
        val revocations = synchronized(lock) {
            val found = PermissionLogic.detectRevocations(lastPermission, current)
            lastPermission = current
            if (found.isNotEmpty() && (session.phase == FocusPhase.ACTIVE || session.phase == FocusPhase.PAUSED)) {
                session = machine.apply(session, FocusCommand.PermissionRevoked, now)
                persistLocked()
            }
            found
        }
        if (revocations.isNotEmpty()) {
            FocusForegroundService.stop(context)
            emit("permission_revoked", statusJson())
        }
        return revocations.map { it.kind.name }
    }

    fun statusJson(): String = synchronized(lock) { sessionToJson(session).toString() }

    fun rulesJson(): String {
        val array = JSONArray()
        rules().forEach { array.put(ruleToJson(it)) }
        return array.toString()
    }

    fun shouldIntervene(key: String, now: Long): Boolean {
        synchronized(lock) {
            if (key == lastInterventionKey && now - lastInterventionAt < INTERVENTION_DEBOUNCE_MS) {
                return false
            }
            lastInterventionKey = key
            lastInterventionAt = now
            return true
        }
    }

    private fun transition(command: FocusCommand): FocusSession {
        val next = synchronized(lock) {
            session = machine.apply(session, command, System.currentTimeMillis())
            persistLocked()
            session
        }
        emit("focus_status", statusJson())
        return next
    }

    private fun recordAndEmit(match: MatchResult, packageName: String, now: Long) {
        val rule = match.rule ?: return
        val event = RestrictionEvent(
            id = UUID.randomUUID().toString(),
            packageName = packageName,
            ruleId = rule.id,
            ruleType = rule.ruleType.name,
            target = rule.target,
            support = match.support.name,
            atEpochMs = now,
        )
        synchronized(lock) {
            recentEvents.addLast(event)
            while (recentEvents.size > 50) {
                recentEvents.removeFirst()
            }
        }
        emit(
            "restriction_triggered",
            JSONObject()
                .put("id", event.id)
                .put("packageName", event.packageName)
                .put("ruleId", event.ruleId)
                .put("ruleType", event.ruleType)
                .put("target", event.target)
                .put("support", event.support)
                .put("intervention", match.intervention.name)
                .put("detail", match.detail)
                .put("atEpochMs", event.atEpochMs)
                .toString(),
        )
    }

    private fun emit(type: String, payload: String) {
        listeners.forEach { listener ->
            try {
                listener(type, payload)
            } catch (_: Exception) {
                // A broken JS listener must not crash enforcement.
            }
        }
    }

    private fun persistLocked() {
        File(directory, "session.txt").writeText(SessionCodec.encodeSession(session))
        File(directory, "rules.txt").writeText(SessionCodec.encodeRules(rules))
        persistUsageLocked()
    }

    private fun persistUsageLocked() {
        File(directory, "usage.txt").writeText(UsagePathPolicy.encodeUsage(usageMsByPackage))
    }

    private fun readUsage(): Map<String, Long> {
        val file = File(directory, "usage.txt")
        if (!file.exists()) {
            return emptyMap()
        }
        return UsagePathPolicy.decodeUsage(file.readText())
    }

    private fun readSession(): FocusSession {
        val file = File(directory, "session.txt")
        if (!file.exists()) {
            return FocusSession.idle()
        }
        return SessionCodec.decodeSession(file.readText()) ?: FocusSession.idle()
    }

    private fun readRules(): List<RestrictionRule> {
        val file = File(directory, "rules.txt")
        if (!file.exists()) {
            return emptyList()
        }
        return SessionCodec.decodeRules(file.readText())
    }

    companion object {
        private const val INTERVENTION_DEBOUNCE_MS = 4_000L

        fun sessionToJson(session: FocusSession): JSONObject {
            val now = System.currentTimeMillis()
            return JSONObject()
                .put("id", session.id)
                .put("objective", session.objective)
                .put("targetDurationMinutes", session.targetDurationMinutes)
                .put("strictMode", session.strictMode)
                .put("phase", session.phase.name)
                .put("startedAtEpochMs", session.startedAtEpochMs)
                .put("accumulatedActiveMs", session.accumulatedActiveMs)
                .put("activeElapsedMs", session.activeElapsedMs(now))
                .put("endedAtEpochMs", session.endedAtEpochMs)
                .put("backendSessionId", session.backendSessionId)
                .put("failureReason", session.failureReason)
                .put("subjectId", session.subjectId)
                .put("curriculumNodeId", session.curriculumNodeId)
                .put("taskId", session.taskId)
                .put("restrictionRuleIds", JSONArray(session.restrictionRuleIds))
        }

        fun ruleToJson(rule: RestrictionRule): JSONObject {
            return JSONObject()
                .put("id", rule.id)
                .put("packageName", rule.packageName)
                .put("ruleType", rule.ruleType.name)
                .put("target", rule.target)
                .put("enabled", rule.enabled)
                .put("priority", rule.priority)
                .put("focusSessionId", rule.focusSessionId)
                .put("createdAtEpochMs", rule.createdAtEpochMs)
        }

        fun parseRules(json: String): List<RestrictionRule> {
            val array = JSONArray(json)
            val rules = mutableListOf<RestrictionRule>()
            for (index in 0 until array.length()) {
                val item = array.getJSONObject(index)
                rules.add(
                    RestrictionRule(
                        id = item.getString("id"),
                        packageName = item.getString("packageName"),
                        ruleType = RuleType.valueOf(item.getString("ruleType")),
                        target = item.optString("target", "*"),
                        enabled = item.optBoolean("enabled", true),
                        priority = item.optInt("priority", 0),
                        focusSessionId = item.optString("focusSessionId").ifBlank { null },
                        createdAtEpochMs = item.optLong("createdAtEpochMs", System.currentTimeMillis()),
                    ),
                )
            }
            return rules
        }

        fun parseDraft(json: String): FocusDraft {
            val item = JSONObject(json)
            return FocusDraft(
                objective = item.optString("objective"),
                targetDurationMinutes = item.optInt("targetDurationMinutes", 25),
                strictMode = item.optBoolean("strictMode", false),
                subjectId = item.optString("subjectId").ifBlank { null },
                curriculumNodeId = item.optString("curriculumNodeId").ifBlank { null },
                taskId = item.optString("taskId").ifBlank { null },
                backendSessionId = item.optString("backendSessionId").ifBlank { null },
            )
        }
    }
}
