package com.sharpmind.app.accessibility

import com.sharpmind.app.focus.DetectionSupport
import com.sharpmind.app.focus.FocusPhase
import com.sharpmind.app.focus.FocusSession
import com.sharpmind.app.focus.MatchResult
import com.sharpmind.app.focus.ProtectedPackages
import com.sharpmind.app.focus.RestrictionEngine
import com.sharpmind.app.focus.RestrictionRule
import com.sharpmind.app.focus.UiSignal

/**
 * Accessibility snapshots are matched and discarded. Text is never retained.
 * Password fields are ignored before any rule matching.
 */
data class AccessibilitySnapshot(
    val packageName: String?,
    val className: String?,
    val isPassword: Boolean,
    val texts: List<String>,
    val contentDescriptions: List<String>,
    val viewIds: List<String>,
)

data class ProcessorResult(
    val ignored: Boolean,
    val ignoreReason: String?,
    val match: MatchResult?,
    val retainedText: Boolean,
)

class AccessibilityEventProcessor(
    private val engine: RestrictionEngine = RestrictionEngine(),
) {
    fun process(
        snapshot: AccessibilitySnapshot,
        rules: List<RestrictionRule>,
        session: FocusSession?,
    ): ProcessorResult {
        if (snapshot.isPassword) {
            return ignored("password_field")
        }
        if (session == null || session.phase != FocusPhase.ACTIVE) {
            return ignored("session_not_active")
        }
        val packageName = snapshot.packageName
        if (packageName.isNullOrBlank()) {
            return ignored("missing_package")
        }
        if (ProtectedPackages.isProtected(packageName)) {
            return ignored("protected_package")
        }
        val signal = UiSignal(
            packageName = packageName,
            className = snapshot.className,
            texts = emptyList(),
            contentDescriptions = snapshot.contentDescriptions.take(MAX_NODES),
            viewIds = snapshot.viewIds.take(MAX_NODES),
        )
        val match = try {
            engine.match(signal, rules, session.id)
        } catch (error: Exception) {
            return ProcessorResult(
                ignored = true,
                ignoreReason = "engine_error",
                match = MatchResult(
                    matched = false,
                    rule = null,
                    support = DetectionSupport.UNSUPPORTED,
                    adapterId = "processor",
                    intervention = com.sharpmind.app.focus.InterventionKind.NONE,
                    detail = error.javaClass.simpleName,
                ),
                retainedText = false,
            )
        }
        return ProcessorResult(
            ignored = false,
            ignoreReason = null,
            match = match,
            retainedText = false,
        )
    }

    private fun ignored(reason: String): ProcessorResult {
        return ProcessorResult(
            ignored = true,
            ignoreReason = reason,
            match = null,
            retainedText = false,
        )
    }

    companion object {
        const val MAX_NODES: Int = 40
    }
}
