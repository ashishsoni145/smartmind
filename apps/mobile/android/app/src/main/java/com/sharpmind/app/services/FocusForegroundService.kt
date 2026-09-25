package com.sharpmind.app.services

import android.app.Notification
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

class FocusForegroundService : Service() {
    private val handler = Handler(Looper.getMainLooper())
    private var usage: AppUsageManager? = null
    private val poll = object : Runnable {
        override fun run() {
            val runtime = (application as MainApplication).focusRuntime
            val phase = runtime.snapshot().phase
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
                            InterventionKind.GO_HOME -> showIntervention(target, match.detail, decision.intervention)
                            else -> Unit
                        }
                    }
                }
                updateNotification()
            }
            handler.postDelayed(this, POLL_MS)
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
        return START_STICKY
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

    private fun updateNotification() {
        val manager = getSystemService(NOTIFICATION_SERVICE) as android.app.NotificationManager
        manager.notify(NOTIFICATION_ID, buildNotification())
    }

    private fun buildNotification(): Notification {
        val runtime = (application as MainApplication).focusRuntime
        val session = runtime.snapshot()
        val minutes = session.activeElapsedMs(System.currentTimeMillis()) / 60_000L
        val open = PendingIntent.getActivity(
            this,
            1,
            Intent(this, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                data = android.net.Uri.parse("sharpmind://app/focus")
            },
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val pause = PendingIntent.getBroadcast(
            this,
            2,
            Intent(this, FocusNotificationReceiver::class.java).setAction(ACTION_PAUSE),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        val end = PendingIntent.getBroadcast(
            this,
            3,
            Intent(this, FocusNotificationReceiver::class.java).setAction(ACTION_END),
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )
        return NotificationCompat.Builder(this, com.sharpmind.app.notifications.NotificationChannels.FOCUS)
            .setSmallIcon(R.mipmap.ic_launcher)
            .setContentTitle(getString(R.string.focus_notification_title))
            .setContentText("${session.objective} · ${minutes}m")
            .setOngoing(true)
            .setOnlyAlertOnce(true)
            .setContentIntent(open)
            .addAction(0, "Pause", pause)
            .addAction(0, if (session.strictMode) "End in app" else "End", end)
            .build()
    }

    private fun showIntervention(packageName: String, detail: String, kind: InterventionKind) {
        val launch = Intent(this, FocusInterventionActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK
            putExtra(FocusInterventionActivity.EXTRA_PACKAGE, packageName)
            putExtra(FocusInterventionActivity.EXTRA_DETAIL, detail)
            putExtra(FocusInterventionActivity.EXTRA_KIND, kind.name)
        }
        try {
            startActivity(launch)
        } catch (_: Exception) {
            val manager = getSystemService(NOTIFICATION_SERVICE) as android.app.NotificationManager
            val pending = PendingIntent.getActivity(
                this,
                4,
                launch,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
            )
            val notification = NotificationCompat.Builder(this, com.sharpmind.app.notifications.NotificationChannels.FOCUS)
                .setSmallIcon(R.mipmap.ic_launcher)
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
        const val ACTION_END = "com.sharpmind.app.FOCUS_END"
        private const val POLL_MS = 3_000L

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
        }
    }
}
