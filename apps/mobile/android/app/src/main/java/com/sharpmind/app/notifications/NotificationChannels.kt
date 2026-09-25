package com.sharpmind.app.notifications

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import com.sharpmind.app.R

object NotificationChannels {
    const val FOCUS = "sharpmind_focus"
    const val REMINDERS = "sharpmind_reminders"

    fun ensure(context: Context) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
            return
        }
        val manager = context.getSystemService(NotificationManager::class.java)
        val focus = NotificationChannel(
            FOCUS,
            context.getString(R.string.focus_channel_name),
            NotificationManager.IMPORTANCE_DEFAULT,
        ).apply {
            description = context.getString(R.string.focus_channel_description)
            setShowBadge(false)
        }
        val reminders = NotificationChannel(
            REMINDERS,
            context.getString(R.string.reminder_channel_name),
            NotificationManager.IMPORTANCE_DEFAULT,
        ).apply {
            description = context.getString(R.string.reminder_channel_description)
        }
        manager.createNotificationChannel(focus)
        manager.createNotificationChannel(reminders)
    }
}
