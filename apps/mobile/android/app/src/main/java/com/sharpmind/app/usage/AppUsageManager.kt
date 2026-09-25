package com.sharpmind.app.usage

import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import com.sharpmind.app.permissions.PermissionManager

/**
 * Reads the current foreground package locally. Raw usage events are not uploaded.
 */
class AppUsageManager(
    context: Context,
    private val permissions: PermissionManager = PermissionManager(context),
) {
    private val usageStats = context.getSystemService(Context.USAGE_STATS_SERVICE) as UsageStatsManager

    fun currentForegroundPackage(now: Long = System.currentTimeMillis()): String? {
        if (!permissions.isUsageAccessEnabled()) {
            return null
        }
        val events = usageStats.queryEvents(now - LOOKBACK_MS, now)
        var lastPackage: String? = null
        val event = UsageEvents.Event()
        while (events.hasNextEvent()) {
            events.getNextEvent(event)
            val type = event.eventType
            if (type == UsageEvents.Event.ACTIVITY_RESUMED || type == UsageEvents.Event.MOVE_TO_FOREGROUND) {
                lastPackage = event.packageName
            }
        }
        return lastPackage
    }

    companion object {
        private const val LOOKBACK_MS = 15_000L
    }
}
