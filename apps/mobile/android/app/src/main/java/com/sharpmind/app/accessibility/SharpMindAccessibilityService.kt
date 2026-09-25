package com.sharpmind.app.accessibility

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.sharpmind.app.MainApplication
import com.sharpmind.app.focus.FocusPhase
import com.sharpmind.app.focus.InterventionKind
import com.sharpmind.app.focus.ProtectedPackages
import com.sharpmind.app.focus.RuleType
import com.sharpmind.app.services.FocusInterventionActivity

/**
 * Processes accessibility events only while a focus session is ACTIVE and only for packages
 * that have an enabled CONTENT_RESTRICTION rule in that session. Everything else returns before
 * the window is touched. Password nodes abort the walk. Window text is never stored or uploaded.
 */
class SharpMindAccessibilityService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) {
            return
        }
        val app = application as? MainApplication ?: return
        val runtime = app.focusRuntime
        val session = runtime.snapshot()
        if (session.phase != FocusPhase.ACTIVE) {
            return
        }
        val packageName = event.packageName?.toString()
        if (packageName.isNullOrBlank() || ProtectedPackages.isProtected(packageName)) {
            return
        }
        // Data minimisation: walk the hierarchy only when a selective rule targets this package.
        val hasContentRule = runtime.rules().any {
            it.ruleType == RuleType.CONTENT_RESTRICTION && it.packageName == packageName && it.appliesTo(session.id) && it.id in session.restrictionRuleIds
        }
        if (!hasContentRule) {
            return
        }
        val root = try {
            rootInActiveWindow
        } catch (_: Exception) {
            null
        }
        val ids = ArrayList<String>(AccessibilityEventProcessor.MAX_NODES)
        val descriptions = ArrayList<String>(AccessibilityEventProcessor.MAX_NODES)
        val password = booleanArrayOf(event.isPassword)
        if (!password[0]) {
            collect(root, 0, ids, descriptions, password)
        }
        @Suppress("DEPRECATION")
        root?.recycle()
        val snapshot = AccessibilitySnapshot(
            packageName = packageName,
            className = event.className?.toString(),
            isPassword = password[0],
            texts = emptyList(),
            contentDescriptions = if (password[0]) emptyList() else descriptions,
            viewIds = if (password[0]) emptyList() else ids,
        )
        ids.clear()
        descriptions.clear()
        val result = try {
            runtime.onAccessibility(snapshot)
        } catch (_: Exception) {
            return
        }
        val match = result.match
        if (result.ignored || match == null || !match.matched) {
            return
        }
        val key = "${match.rule?.id}:$packageName"
        if (!runtime.shouldIntervene(key, System.currentTimeMillis())) {
            return
        }
        try {
            when (match.intervention) {
                InterventionKind.NAVIGATE_BACK -> performGlobalAction(GLOBAL_ACTION_BACK)
                InterventionKind.GO_HOME -> performGlobalAction(GLOBAL_ACTION_HOME)
                InterventionKind.NOTIFY_ONLY, InterventionKind.NONE -> Unit
            }
        } catch (_: Exception) {
            // The target app or Android refused the action. Fail safe: no further attempts this debounce window.
        }
        if (match.intervention == InterventionKind.NAVIGATE_BACK || match.intervention == InterventionKind.GO_HOME) {
            try {
                startActivity(
                    android.content.Intent(this, FocusInterventionActivity::class.java).apply {
                        flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
                        putExtra(FocusInterventionActivity.EXTRA_PACKAGE, packageName)
                        putExtra(FocusInterventionActivity.EXTRA_RULE_TYPE, match.rule?.ruleType?.name)
                        putExtra(FocusInterventionActivity.EXTRA_DETAIL, match.detail)
                        putExtra(FocusInterventionActivity.EXTRA_KIND, match.intervention.name)
                    },
                )
            } catch (_: Exception) {
                // Background start refused. The Back/Home action above already happened; the foreground
                // service notification remains the visible signal. Nothing is restarted.
            }
        }
    }

    override fun onInterrupt() {
        // Required callback. Nothing to release; we do not hold window content.
    }

    private fun collect(
        node: AccessibilityNodeInfo?,
        depth: Int,
        ids: MutableList<String>,
        descriptions: MutableList<String>,
        password: BooleanArray,
    ) {
        if (node == null || password[0] || depth > MAX_DEPTH || ids.size >= AccessibilityEventProcessor.MAX_NODES) {
            return
        }
        if (node.isPassword) {
            password[0] = true
            return
        }
        node.viewIdResourceName?.let { if (ids.size < AccessibilityEventProcessor.MAX_NODES) ids.add(it) }
        node.contentDescription?.toString()?.let {
            if (descriptions.size < AccessibilityEventProcessor.MAX_NODES) descriptions.add(it.take(MAX_DESCRIPTION_CHARS))
        }
        for (index in 0 until node.childCount) {
            val child = node.getChild(index) ?: continue
            collect(child, depth + 1, ids, descriptions, password)
            @Suppress("DEPRECATION")
            child.recycle()
        }
    }

    companion object {
        private const val MAX_DEPTH = 6
        private const val MAX_DESCRIPTION_CHARS = 80
    }
}
