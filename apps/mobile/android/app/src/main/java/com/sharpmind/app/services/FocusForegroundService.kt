package com.sharpmind.app.services

import android.app.Notification
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import androidx.core.app.NotificationCompat
import com.sharpmind.app.MainActivity
import com.sharpmind.app.MainApplication
import com.sharpmind.app.R
import com.sharpmind.app.focus.FocusPhase
import com.sharpmind.app.focus.InterventionKind
import com.sharpmind.app.focus.UsagePathPolicy
import com.sharpmind.app.notifications.NotificationChannels
import com.sharpmind.app.usage.AppUsageManager

/**
 * Runs only while a focus session is ACTIVE or PAUSED. Polls the foreground package (usage
 * access) every few seconds while ACTIVE, drives expiry through [com.sharpmind.app.focus.FocusRuntime.tick],
 * and stops itself as soon as the session leaves those phases. START_NOT_STICKY: Android must
 * never restart it on its own, and boot never starts it.
 */
class FocusForegroundService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var usage: AppUsageManager? = null
    private var lastNotifiedMinute: Long = -1L
    private var lastNotifiedPhase: FocusPhase? = null

    private val poll = object : Runnable {
        override fun run() {
            val runtime = (application as MainApplication).focusRuntime
            val session = runtime.tick()
            val phase = session.phase
            if (phase != FocusPhase.ACTIVE && phase != FocusPhase.PAUSED) {
                stopSelf()
                return
            }
            if (phase == FocusPhase.ACTIVE) {
                val packageName = usage?.currentForegroundPackage()
                val match = runtime.onForegroundPackage(packageName)
                val decision = UsagePathPolicy.decide(match)
                if (match != null && decision.intervene && match.rule != null) {
                    val rule = match.rule
                    val key = "${rule.id}:${packageName}:${decision.intervention.name}"
                    if (runtime.shouldIntervene(key, System.currentTimeMillis())) {
                        val target = packageName ?: rule.packageName
                        when (decision.intervention) {
                            InterventionKind.NOTIFY_ONLY -> notifyLimit(target, match.detail)
                            InterventionKind.GO_HOME -> showIntervention(target, rule.ruleType.name, match.detail, decision.intervention)
                            else -> Unit
                        }
                    }
                }
            }
            // The tick above may have expired the session; re-read before touching the notification.
            val current = runtime.snapshot()
            if (current.phase == FocusPhase.ACTIVE || current.phase == FocusPhase.PAUSED) {
                updateNotificationIfChanged(current.phase, current.activeElapsedMs(System.currentTimeMillis()) / 60_000L)
                handler.postDelayed(this, if (current.phase == FocusPhase.ACTIVE) POLL_ACTIVE_MS else POLL_PAUSED_MS)
            } else {
                stopSelf()
            }
        }
    }

    override fun onCreate() {
        super.onCreate()
        NotificationChannels.ensure(this)
        usage = AppUsageManager(this)
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        val runtime = (application as MainApplication).focusRuntime
        val phase = runtime.snapshot().phase
        if (phase != FocusPhase.ACTIVE && phase != FocusPhase.PAUSED) {
            stopSelf()
            return START_NOT_STICKY
        }
        startInForeground(buildNotification())
        handler.removeCallbacks(poll)
        handler.post(poll)
        return START_NOT_STICKY
    }

    override fun onDestroy() {
        handler.removeCallbacks(poll)
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun startInForeground(notification: Notification) {
        if (Build.VERSION.SDK_INT >= 34) {
            startForeground(NOTIFICATION_ID, notification, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        } else {
            startForeground(NOTIFICATION_ID, notification)
        }
    }

    private fun updateNotificationIfChanged(phase: FocusPhase, minutes: Long) {
        if (phase == lastNotifiedPhase && minutes == lastNotifiedMinute) {
            return
        }
        lastNotifiedPhase = phase
        lastNotifiedMinute = minutes
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        manager.notify(NOTIFICATION_ID, buildNotification())
    }

    private fun buildNotification(): Notification {
        val runtime = (application as MainApplication).focusRuntime
        val session = runtime.snapshot()
        val minutes = session.activeElapsedMs(System.currentTimeMillis()) / 60_000L
        val paused = session.phase == FocusPhase.PAUSED
        val open = PendingIntent.getActivity(
            this,
            1,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                data = android.net.Uri.parse("sharpmind://app/focus/session")
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val toggle = PendingIntent.getBroadcast(
            this,
            2,
            Intent(this, FocusNotificationReceiver::class.java).setAction(if (paused) ACTION_RESUME else ACTION_PAUSE),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val end = PendingIntent.getBroadcast(
            this,
            3,
            Intent(this, FocusNotificationReceiver::class.java).setAction(ACTION_END),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val status = if (paused) "Paused" else "$minutes of ${session.targetDurationMinutes} min"
        return NotificationCompat.Builder(this, NotificationChannels.FOCUS)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(if (paused) getString(R.string.focus_notification_paused_title) else getString(R.string.focus_notification_title))
            .setContentText("${session.objective} · $status")
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setSilent(true)
            .setCategory(NotificationCompat.CATEGORY_PROGRESS)
            .setContentIntent(open)
            .addAction(0, if (paused) "Resume" else "Pause", toggle)
            .addAction(0, if (session.strictMode) "End in app" else "End", end)
            .build()
    }

    private fun notifyLimit(packageName: String, detail: String) {
        val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
        val open = PendingIntent.getActivity(
            this,
            5,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                data = android.net.Uri.parse("sharpmind://app/focus/session")
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val notification = NotificationCompat.Builder(this, NotificationChannels.FOCUS)
            .setSmallIcon(R.drawable.ic_notification)
            .setContentTitle(getString(R.string.time_limit_title))
            .setContentText(getString(R.string.time_limit_body, packageName))
            .setStyle(NotificationCompat.BigTextStyle().bigText(getString(R.string.time_limit_body, packageName) + " ($detail)"))
            .setContentIntent(open)
            .setAutoCancel(true)
            .build()
        manager.notify(INTERVENTION_NOTIFICATION_ID, notification)
    }

    private fun showIntervention(packageName: String, ruleType: String, detail: String, kind: InterventionKind) {
        val launch = Intent(this, FocusInterventionActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
            putExtra(FocusInterventionActivity.EXTRA_PACKAGE, packageName)
            putExtra(FocusInterventionActivity.EXTRA_RULE_TYPE, ruleType)
            putExtra(FocusInterventionActivity.EXTRA_DETAIL, detail)
            putExtra(FocusInterventionActivity.EXTRA_KIND, kind.name)
        }
        try {
            // Android 10+ may refuse background activity starts; the notification below is the fallback.
            startActivity(launch)
        } catch (_: Exception) {
            val manager = getSystemService(NOTIFICATION_SERVICE) as NotificationManager
            val pending = PendingIntent.getActivity(
                this,
                4,
                launch,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )
            val notification = NotificationCompat.Builder(this, NotificationChannels.FOCUS)
                .setSmallIcon(R.drawable.ic_notification)
                .setContentTitle(getString(R.string.intervention_title))
                .setContentText(getString(R.string.intervention_body))
                .setContentIntent(pending)
                .setAutoCancel(true)
                .build()
            manager.notify(INTERVENTION_NOTIFICATION_ID, notification)
        }
    }

    companion object {
        const val NOTIFICATION_ID = 4101
        const val INTERVENTION_NOTIFICATION_ID = 4102
        const val ACTION_PAUSE = "com.sharpmind.app.FOCUS_PAUSE"
        const val ACTION_RESUME = "com.sharpmind.app.FOCUS_RESUME"
        const val ACTION_END = "com.sharpmind.app.FOCUS_END"
        private const val POLL_ACTIVE_MS = 3_000L
        private const val POLL_PAUSED_MS = 15_000L

        fun start(context: Context) {
            val intent = Intent(context, FocusForegroundService::class.java)
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                context.startForegroundService(intent)
            } else {
                context.startService(intent)
            }
        }

        fun stop(context: Context) {
            context.stopService(Intent(context, FocusForegroundService::class.java))
            // Clear any intervention notification left over from the session.
            val manager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.cancel(INTERVENTION_NOTIFICATION_ID)
        }
    }
}
