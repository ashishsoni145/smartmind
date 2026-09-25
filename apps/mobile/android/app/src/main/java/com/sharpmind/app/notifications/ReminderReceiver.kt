package com.sharpmind.app.notifications

import android.app.PendingIntent
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import com.sharpmind.app.MainActivity
import com.sharpmind.app.R

class ReminderReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != ReminderScheduler.ACTION_FIRE) {
            return
        }
        NotificationChannels.ensure(context)
        val title = intent.getStringExtra(ReminderScheduler.EXTRA_TITLE) ?: return
        val body = intent.getStringExtra(ReminderScheduler.EXTRA_BODY) ?: ""
        val id = intent.getStringExtra(ReminderScheduler.EXTRA_ID) ?: title
        val open = PendingIntent.getActivity(
            context,
            id.hashCode(),
            Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                data = android.net.Uri.parse("sharpmind://app/home")
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val notification = NotificationCompat.Builder(context, NotificationChannels.REMINDERS)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(title)
            .setContentText(body)
            .setContentIntent(open)
            .setAutoCancel(true)
            .build()
        NotificationManagerCompat.from(context).notify(id.hashCode(), notification)
        // One-shot reminder has fired: forget it so a later boot does not re-post it.
        ReminderScheduler(context).forget(id)
    }
}

class ReminderBootReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action != Intent.ACTION_BOOT_COMPLETED) {
            return
        }
        ReminderScheduler(context).rescheduleAfterBoot(System.currentTimeMillis())
    }
}
