package com.sharpmind.app.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.sharpmind.app.MainApplication
import com.sharpmind.app.focus.FocusTransitionException

class FocusNotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val runtime = (context.applicationContext as MainApplication).focusRuntime
        when (intent.action) {
            FocusForegroundService.ACTION_PAUSE -> {
                try {
                    runtime.pause()
                } catch (_: FocusTransitionException) {
                    // Already paused or ended. The notification will refresh on the next poll.
                }
            }
            FocusForegroundService.ACTION_END -> {
                val session = runtime.snapshot()
                if (session.strictMode) {
                    FocusInterventionActivity::class.java.let { activity ->
                        context.startActivity(
                            Intent(context, activity).apply {
                                flags = Intent.FLAG_ACTIVITY_NEW_TASK
                                putExtra(FocusInterventionActivity.EXTRA_PACKAGE, "SharpMind")
                                putExtra(FocusInterventionActivity.EXTRA_DETAIL, "Strict Mode asks you to end the session in the app. Android settings remain available.")
                            },
                        )
                    }
                } else {
                    try {
                        runtime.stop(confirmStrict = true)
                    } catch (_: FocusTransitionException) {
                        FocusForegroundService.stop(context)
                    }
                }
            }
        }
    }
}
