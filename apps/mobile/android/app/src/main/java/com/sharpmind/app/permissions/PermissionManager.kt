package com.sharpmind.app.permissions

import android.app.AppOpsManager
import android.app.NotificationManager
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Process
import android.provider.Settings
import android.text.TextUtils
import androidx.core.app.NotificationManagerCompat

class PermissionManager(private val context: Context) {
    fun snapshot(): PermissionSnapshot {
        return PermissionSnapshot(
            usageAccess = if (isUsageAccessEnabled()) PermissionGrant.GRANTED else PermissionGrant.DENIED,
            accessibility = if (isAccessibilityEnabled()) PermissionGrant.GRANTED else PermissionGrant.DENIED,
            notifications = notificationGrant(),
        )
    }

    fun isUsageAccessEnabled(): Boolean {
        val appOps = context.getSystemService(Context.APP_OPS_SERVICE) as AppOpsManager
        val mode = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            appOps.unsafeCheckOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.packageName)
        } else {
            @Suppress("DEPRECATION")
            appOps.checkOpNoThrow(AppOpsManager.OPSTR_GET_USAGE_STATS, Process.myUid(), context.packageName)
        }
        return mode == AppOpsManager.MODE_ALLOWED
    }

    fun isAccessibilityEnabled(): Boolean {
        val expected = "${context.packageName}/com.sharpmind.app.accessibility.SharpMindAccessibilityService"
        val enabled = Settings.Secure.getString(
            context.contentResolver,
            Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES,
        ) ?: return false
        val splitter = TextUtils.SimpleStringSplitter(':')
        splitter.setString(enabled)
        while (splitter.hasNext()) {
            if (splitter.next().equals(expected, ignoreCase = true)) {
                return true
            }
        }
        return false
    }

    fun isNotificationEnabled(): Boolean {
        return NotificationManagerCompat.from(context).areNotificationsEnabled()
    }

    fun openUsageAccessSettings() {
        startSettings(Settings.ACTION_USAGE_ACCESS_SETTINGS)
    }

    fun openAccessibilitySettings() {
        startSettings(Settings.ACTION_ACCESSIBILITY_SETTINGS)
    }

    fun openNotificationSettings() {
        val intent = Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS).apply {
            putExtra(Settings.EXTRA_APP_PACKAGE, context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        }
        context.startActivity(intent)
    }

    private fun notificationGrant(): PermissionGrant {
        if (Build.VERSION.SDK_INT < 33) {
            return if (isNotificationEnabled()) PermissionGrant.GRANTED else PermissionGrant.DENIED
        }
        return if (isNotificationEnabled()) PermissionGrant.GRANTED else PermissionGrant.NOT_REQUESTED
    }

    private fun startSettings(action: String) {
        val intent = Intent(action).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
        context.startActivity(intent)
    }
}
