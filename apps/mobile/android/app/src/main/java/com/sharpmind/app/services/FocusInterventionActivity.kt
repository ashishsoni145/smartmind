package com.sharpmind.app.services

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import com.sharpmind.app.MainActivity
import com.sharpmind.app.R

/**
 * Our own activity, not a system overlay. Android may refuse to launch it from the background.
 * The foreground-service notification is the fallback. Settings and uninstall stay available.
 */
class FocusInterventionActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val packageName = intent.getStringExtra(EXTRA_PACKAGE) ?: "an app"
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setBackgroundColor(Color.parseColor("#0B0B0C"))
            setPadding(48, 96, 48, 48)
            gravity = Gravity.CENTER_HORIZONTAL
        }
        val title = TextView(this).apply {
            text = getString(R.string.intervention_title)
            setTextColor(Color.parseColor("#F4F4F5"))
            textSize = 24f
        }
        val body = TextView(this).apply {
            text = "SharpMind noticed $packageName, which matches a restriction you turned on. No screen contents were saved."
            setTextColor(Color.parseColor("#A1A1AA"))
            textSize = 16f
            setPadding(0, 24, 0, 36)
        }
        val back = Button(this).apply {
            text = "Return to SharpMind"
            setOnClickListener {
                startActivity(
                    Intent(this@FocusInterventionActivity, MainActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
                        data = android.net.Uri.parse("sharpmind://app/focus")
                    },
                )
                finish()
            }
        }
        val dismiss = Button(this).apply {
            text = "Dismiss"
            setOnClickListener { finish() }
        }
        root.addView(title)
        root.addView(body)
        root.addView(back)
        root.addView(dismiss)
        setContentView(root)
    }

    companion object {
        const val EXTRA_PACKAGE = "packageName"
        const val EXTRA_DETAIL = "detail"
        const val EXTRA_KIND = "kind"
    }
}
