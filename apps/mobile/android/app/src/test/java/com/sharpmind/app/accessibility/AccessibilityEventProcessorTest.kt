package com.sharpmind.app.accessibility

import com.sharpmind.app.focus.FocusPhase
import com.sharpmind.app.focus.FocusSession
import com.sharpmind.app.focus.RestrictionRule
import com.sharpmind.app.focus.RuleType
import com.sharpmind.app.focus.YouTubeAdapter
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class AccessibilityEventProcessorTest {
    private val processor = AccessibilityEventProcessor()

    @Test
    fun passwordFieldsAreIgnoredAndTextIsNotRetained() {
        val result = processor.process(
            AccessibilitySnapshot(
                packageName = YouTubeAdapter().packageName,
                className = "login",
                isPassword = true,
                texts = listOf("secret-password"),
                contentDescriptions = listOf("password"),
                viewIds = listOf("password"),
            ),
            listOf(blockYouTube()),
            activeSession(),
        )
        assertTrue(result.ignored)
        assertEquals("password_field", result.ignoreReason)
        assertFalse(result.retainedText)
        assertEquals(null, result.match)
    }

    @Test
    fun inactiveSessionDoesNotMatch() {
        val result = processor.process(
            AccessibilitySnapshot(YouTubeAdapter().packageName, null, false, emptyList(), emptyList(), listOf("reel_player")),
            listOf(blockYouTube()),
            activeSession().copy(phase = FocusPhase.PAUSED),
        )
        assertTrue(result.ignored)
        assertEquals("session_not_active", result.ignoreReason)
    }

    @Test
    fun settingsAreNeverMatched() {
        val result = processor.process(
            AccessibilitySnapshot("com.android.settings", "Settings", false, listOf("Accessibility"), emptyList(), emptyList()),
            listOf(RestrictionRule("s", "com.android.settings", RuleType.APP_BLOCK, "*", true, 1, "s1", 1L)),
            activeSession(),
        )
        assertTrue(result.ignored)
        assertEquals("protected_package", result.ignoreReason)
    }

    @Test
    fun shortsPlayerProducesInterventionWithoutStoringText() {
        val result = processor.process(
            AccessibilitySnapshot(
                YouTubeAdapter().packageName,
                "watch",
                false,
                listOf("should-not-be-used"),
                listOf("Shorts player"),
                listOf("reel_player"),
            ),
            listOf(RestrictionRule("c", YouTubeAdapter().packageName, RuleType.CONTENT_RESTRICTION, "shorts", true, 2, "s1", 1L)),
            activeSession(),
        )
        assertFalse(result.ignored)
        assertFalse(result.retainedText)
        assertTrue(result.match?.matched == true)
    }

    private fun blockYouTube() = RestrictionRule(
        "b",
        YouTubeAdapter().packageName,
        RuleType.APP_BLOCK,
        "*",
        true,
        1,
        "s1",
        1L,
    )

    private fun activeSession() = FocusSession.idle().copy(id = "s1", phase = FocusPhase.ACTIVE, objective = "Study")
}
