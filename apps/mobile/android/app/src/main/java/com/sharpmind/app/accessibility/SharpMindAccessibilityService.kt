package com.sharpmind.app.accessibility

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent
import android.view.accessibility.AccessibilityNodeInfo
import com.sharpmind.app.MainApplication
import com.sharpmind.app.focus.InterventionKind
import com.sharpmind.app.services.FocusForegroundService
import com.sharpmind.app.services.FocusInterventionActivity

/**
 * Processes accessibility events only while a focus session is active.
 * Password nodes abort the walk. Window text is not stored or uploaded.
 */
class SharpMindAccessibilityService : AccessibilityService() {
    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null) {
            return
        }
        val app = application as? MainApplication ?: return
        val runtime = app.focusRuntime
        if (runtime.snapshot().phase != com.sharpmind.app.focus.FocusPhase.ACTIVE) {
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
        root?.recycle()
        val snapshot = AccessibilitySnapshot(
            packageName = event.packageName?.toString(),
            className = event.className?.toString(),
            isPassword = password[0],
            texts = emptyList(),
            contentDescriptions = if (password[0]) emptyList() else descriptions,
            viewIds = if (password[0]) emptyList() else ids,
        )
        val result = try {
            runtime.onAccessibility(snapshot)
        } catch (_: Exception) {
            return
        }
        val match = result.match
        if (result.ignored || match == null || !match.matched) {
            return
        }
        val key = "${match.rule?.id}:${snapshot.packageName}"
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
            // Target app or Android refused the action. Fail safe.
        }
        try {
            startActivity(
                android.content.Intent(this, FocusInterventionActivity::class.java).apply {
                    flags = android.content.Intent.FLAG_ACTIVITY_NEW_TASK
                    putExtra(FocusInterventionActivity.EXTRA_PACKAGE, snapshot.packageName)
                    putExtra(FocusInterventionActivity.EXTRA_DETAIL, match.detail)
                    putExtra(FocusInterventionActivity.EXTRA_KIND, match.intervention.name)
                },
            )
        } catch (_: Exception) {
            FocusForegroundService.start(this)
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
        if (node == null || password[0] || depth > 6 || ids.size >= AccessibilityEventProcessor.MAX_NODES) {
            return
        }
        if (node.isPassword) {
            password[0] = true
            return
        }
        node.viewIdResourceName?.let { if (ids.size < AccessibilityEventProcessor.MAX_NODES) ids.add(it) }
        node.contentDescription?.toString()?.let {
            if (descriptions.size < AccessibilityEventProcessor.MAX_NODES) descriptions.add(it)
        }
        for (index in 0 until node.childCount) {
            val child = node.getChild(index) ?: continue
            collect(child, depth + 1, ids, descriptions, password)
            child.recycle()
        }
    }
}
