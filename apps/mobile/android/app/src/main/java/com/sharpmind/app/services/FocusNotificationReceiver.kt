package com.sharpmind.app.services

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import com.sharpmind.app.MainActivity
import com.sharpmind.app.MainApplication
import com.sharpmind.app.focus.FocusTransitionException

/**
 * Handles the Pause / Resume / End actions on the focus notification.
 * Strict Mode never ends from the notification; it opens the session screen so the
 * student confirms in the app. Nothing here can block Settings or other system UI.
 */
class FocusNotificationReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val runtime = (context.applicationContext as MainApplication).focusRuntime
        when (intent.action) {
            FocusForegroundService.ACTION_PAUSE -> {
                try {
                    runtime.pause()
                } catch (_: FocusTransitionException) {
                    // Already paused or ended. The notification refreshes on the next poll.
                }
            }
            FocusForegroundService.ACTION_RESUME -> {
                try {
                    runtime.resume()
                } catch (_: FocusTransitionException) {
                    // Not paused any more.
                }
            }
            FocusForegroundService.ACTION_END -> {
                val session = runtime.snapshot()
                if (session.strictMode) {
                    openSessionScreen(context)
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

    private fun openSessionScreen(context: Context) {
        try {
            context.startActivity(
                Intent(context, MainActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
                    data = android.net.Uri.parse("sharpmind://app/focus/session")
                },
            )
        } catch (_: Exception) {
            // Background activity start refused; tapping the notification body opens the same screen.
        }
    }
}
