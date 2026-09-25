package com.sharpmind.app.services

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import android.util.TypedValue
import android.view.Gravity
import android.view.ViewGroup
import android.widget.Button
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import com.sharpmind.app.MainActivity
import com.sharpmind.app.MainApplication
import com.sharpmind.app.R
import com.sharpmind.app.focus.FocusTransitionException

/**
 * SharpMind's own intervention screen. It is a normal activity, not an overlay and not a
 * system dialog: it explains which rule matched and what actually happened, and it always
 * offers a way out. Android may refuse to launch it from the background, in which case the
 * foreground-service notification is the fallback.
 */
class FocusInterventionActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val packageName = intent.getStringExtra(EXTRA_PACKAGE) ?: "an app"
        val ruleType = intent.getStringExtra(EXTRA_RULE_TYPE) ?: ""
        val kind = intent.getStringExtra(EXTRA_KIND) ?: ""
        val label = friendlyLabel(packageName)
        val runtime = (application as? MainApplication)?.focusRuntime
        val session = runtime?.snapshot()

        val scroll = ScrollView(this).apply { setBackgroundColor(Color.parseColor("#0B0B0C")) }
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(dp(24), dp(56), dp(24), dp(32))
            gravity = Gravity.START
        }

        root.addView(text("SharpMind Focus", 13f, "#A1A1AA"))
        root.addView(text(getString(R.string.intervention_title), 26f, "#F4F4F5", bold = true).apply { setPadding(0, dp(6), 0, dp(16)) })
        root.addView(text("Why this appeared", 13f, "#A1A1AA", bold = true))
        root.addView(text(whyText(label, ruleType, session?.objective), 16f, "#F4F4F5").apply { setPadding(0, dp(4), 0, dp(16)) })
        root.addView(text("What SharpMind did", 13f, "#A1A1AA", bold = true))
        root.addView(text(whatText(label, kind), 16f, "#F4F4F5").apply { setPadding(0, dp(4), 0, dp(16)) })
        root.addView(text("What you can do", 13f, "#A1A1AA", bold = true))
        root.addView(
            text(
                "Return to SharpMind and keep going, dismiss this screen and continue in $label, or end the focus session. " +
                    "Android Settings, uninstalling, and every other app stay available.",
                16f,
                "#F4F4F5",
            ).apply { setPadding(0, dp(4), 0, dp(24)) },
        )

        root.addView(
            button(getString(R.string.intervention_return), primary = true) {
                startActivity(
                    Intent(this, MainActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP or Intent.FLAG_ACTIVITY_NEW_TASK
                        data = android.net.Uri.parse("sharpmind://app/focus/session")
                    },
                )
                finish()
            },
        )
        root.addView(button(getString(R.string.intervention_dismiss), primary = false) { finish() })
        if (runtime != null && session != null && session.strictMode.not()) {
            root.addView(
                button(getString(R.string.intervention_end), primary = false) {
                    try {
                        runtime.stop(confirmStrict = true)
                    } catch (_: FocusTransitionException) {
                        // Already ended.
                    }
                    finish()
                },
            )
        } else if (session?.strictMode == true) {
            root.addView(text("Strict Mode is on: end the session from the SharpMind app.", 13f, "#A1A1AA").apply { setPadding(0, dp(8), 0, 0) })
        }

        scroll.addView(root, ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        setContentView(scroll)
    }

    private fun whyText(label: String, ruleType: String, objective: String?): String {
        val rule = when (ruleType) {
            "APP_BLOCK" -> "you blocked $label for this session"
            "CONTENT_RESTRICTION" -> "you restricted a specific surface in $label (such as Shorts or Reels) for this session"
            "FOCUS_ONLY" -> "$label is not on the allowlist for this session"
            "TIME_LIMIT" -> "you set a time limit for $label in this session"
            else -> "a rule you enabled for $label matched"
        }
        val goal = objective?.takeIf { it.isNotBlank() }?.let { " Your objective: \u201c$it\u201d." } ?: ""
        return "$label came to the foreground and $rule.$goal"
    }

    private fun whatText(label: String, kind: String): String {
        return when (kind) {
            "NAVIGATE_BACK" -> "It sent one Back action and opened this screen. It did not close $label, record the screen, or read any text."
            "GO_HOME" -> "It opened this screen on top of $label. Usage access cannot close or force-stop another app, so $label is still running behind this screen."
            "NOTIFY_ONLY" -> "It posted a notification. Nothing else happened."
            else -> "It opened this screen. It did not close $label or record anything."
        }
    }

    private fun friendlyLabel(packageName: String): String = when (packageName) {
        "com.google.android.youtube" -> "YouTube"
        "com.instagram.android" -> "Instagram"
        "com.facebook.katana" -> "Facebook"
        else -> try {
            val info = packageManager.getApplicationInfo(packageName, 0)
            packageManager.getApplicationLabel(info).toString()
        } catch (_: Exception) {
            packageName
        }
    }

    private fun text(value: String, sizeSp: Float, color: String, bold: Boolean = false): TextView {
        return TextView(this).apply {
            text = value
            setTextColor(Color.parseColor(color))
            setTextSize(TypedValue.COMPLEX_UNIT_SP, sizeSp)
            if (bold) setTypeface(typeface, android.graphics.Typeface.BOLD)
        }
    }

    private fun button(label: String, primary: Boolean, onClick: () -> Unit): Button {
        return Button(this).apply {
            text = label
            isAllCaps = false
            minHeight = dp(48)
            setTextColor(Color.parseColor(if (primary) "#FFFFFF" else "#F4F4F5"))
            setBackgroundColor(Color.parseColor(if (primary) "#5B8DEF" else "#1C1C21"))
            layoutParams = LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT).apply {
                topMargin = dp(10)
            }
            setOnClickListener { onClick() }
        }
    }

    private fun dp(value: Int): Int = (value * resources.displayMetrics.density).toInt()

    companion object {
        const val EXTRA_PACKAGE = "packageName"
        const val EXTRA_RULE_TYPE = "ruleType"
        const val EXTRA_DETAIL = "detail"
        const val EXTRA_KIND = "kind"
    }
}
