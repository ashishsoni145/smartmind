package com.sharpmind.app.notifications

import android.app.AlarmManager
import android.app.PendingIntent
import android.content.Context
import android.content.Intent
import android.os.Build

/**
 * Inexact alarms only. Study reminders are not allowed to bypass Android exact-alarm policy.
 */
class ReminderScheduler(private val context: Context) {
    private val alarms = context.getSystemService(Context.ALARM_SERVICE) as AlarmManager
    private val prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun schedule(id: String, title: String, body: String, triggerAtEpochMs: Long) {
        if (id.isBlank() || title.isBlank()) {
            throw IllegalArgumentException("reminder_invalid")
        }
        val intent = Intent(context, ReminderReceiver::class.java).apply {
            action = ACTION_FIRE
            putExtra(EXTRA_ID, id)
            putExtra(EXTRA_TITLE, title)
            putExtra(EXTRA_BODY, body)
        }
        val pending = PendingIntent.getBroadcast(
            context,
            id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            alarms.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, triggerAtEpochMs, pending)
        } else {
            alarms.set(AlarmManager.RTC_WAKEUP, triggerAtEpochMs, pending)
        }
        prefs.edit()
            .putBoolean(KEY_ENABLED, true)
            .putString("title:$id", title)
            .putString("body:$id", body)
            .putLong("when:$id", triggerAtEpochMs)
            .putStringSet(KEY_IDS, (prefs.getStringSet(KEY_IDS, emptySet()) ?: emptySet()) + id)
            .apply()
    }

    fun cancel(id: String) {
        val intent = Intent(context, ReminderReceiver::class.java).apply { action = ACTION_FIRE }
        val pending = PendingIntent.getBroadcast(
            context,
            id.hashCode(),
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        alarms.cancel(pending)
        val ids = (prefs.getStringSet(KEY_IDS, emptySet()) ?: emptySet()).toMutableSet()
        ids.remove(id)
        prefs.edit()
            .putStringSet(KEY_IDS, ids)
            .remove("title:$id")
            .remove("body:$id")
            .remove("when:$id")
            .putBoolean(KEY_ENABLED, ids.isNotEmpty())
            .apply()
    }

    /** Drops bookkeeping for a reminder that already fired, without touching AlarmManager. */
    fun forget(id: String) {
        val ids = (prefs.getStringSet(KEY_IDS, emptySet()) ?: emptySet()).toMutableSet()
        ids.remove(id)
        prefs.edit()
            .putStringSet(KEY_IDS, ids)
            .remove("when:$id")
            .remove("title:$id")
            .remove("body:$id")
            .putBoolean(KEY_ENABLED, ids.isNotEmpty())
            .apply()
    }

    fun rescheduleAfterBoot(now: Long) {
        if (!prefs.getBoolean(KEY_ENABLED, false)) {
            return
        }
        val ids = prefs.getStringSet(KEY_IDS, emptySet()) ?: return
        ids.forEach { id ->
            val whenMs = prefs.getLong("when:$id", 0L)
            if (whenMs > now) {
                val title = prefs.getString("title:$id", null) ?: return@forEach
                val body = prefs.getString("body:$id", "") ?: ""
                schedule(id, title, body, whenMs)
            }
        }
    }

    companion object {
        const val PREFS = "sharpmind_reminders"
        const val KEY_ENABLED = "enabled"
        const val KEY_IDS = "ids"
        const val ACTION_FIRE = "com.sharpmind.app.REMINDER"
        const val EXTRA_ID = "id"
        const val EXTRA_TITLE = "title"
        const val EXTRA_BODY = "body"
    }
}
