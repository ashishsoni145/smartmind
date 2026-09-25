package com.sharpmind.app.focus

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class RestrictionEngineTest {
    private val engine = RestrictionEngine()
    private val sessionId = "focus-1"

    @Test
    fun appBlockMatchesPackageAndSkipsSettings() {
        val rules = listOf(rule("r1", "com.example.game", RuleType.APP_BLOCK, "*"))
        val blocked = engine.match(signal("com.example.game"), rules, sessionId)
        assertTrue(blocked.matched)
        assertEquals(InterventionKind.GO_HOME, blocked.intervention)
        val settings = engine.match(signal("com.android.settings"), rules, sessionId)
        assertFalse(settings.matched)
        assertEquals("protected_package", settings.detail)
    }

    @Test
    fun shortsPlayerIsRestrictedButNavLabelIsNot() {
        val rules = listOf(rule("r2", YouTubeAdapter().packageName, RuleType.CONTENT_RESTRICTION, "shorts"))
        val player = engine.match(
            UiSignal(YouTubeAdapter().packageName, "player", emptyList(), listOf("Shorts player"), listOf("com.google.android.youtube:id/reel_player")),
            rules,
            sessionId,
        )
        assertTrue(player.matched)
        assertEquals(InterventionKind.NAVIGATE_BACK, player.intervention)
        val navOnly = engine.match(
            UiSignal(YouTubeAdapter().packageName, "home", listOf("Shorts", "Home"), listOf("Shorts"), listOf("com.google.android.youtube:id/pivot_bar")),
            rules,
            sessionId,
        )
        assertFalse(navOnly.matched)
        assertEquals(DetectionSupport.ALLOWED, navOnly.support)
    }

    @Test
    fun emptyHierarchyFailsSafe() {
        val rules = listOf(rule("r3", InstagramAdapter().packageName, RuleType.CONTENT_RESTRICTION, "reels"))
        val result = engine.match(signal(InstagramAdapter().packageName), rules, sessionId)
        assertFalse(result.matched)
        assertEquals(DetectionSupport.UNSUPPORTED, result.support)
    }

    @Test
    fun contentRestrictionDoesNotUpgradeToWholeAppBlock() {
        val rules = listOf(rule("r4", YouTubeAdapter().packageName, RuleType.CONTENT_RESTRICTION, "shorts"))
        val result = engine.match(signal(YouTubeAdapter().packageName), rules, sessionId)
        assertFalse(result.matched)
        assertEquals(InterventionKind.NONE, result.intervention)
    }

    @Test
    fun timeLimitUsesLocalUsageOnly() {
        val rules = listOf(rule("r5", "com.example.game", RuleType.TIME_LIMIT, "60"))
        val under = engine.match(signal("com.example.game"), rules, sessionId, mapOf("com.example.game" to 10_000L))
        assertFalse(under.matched)
        val over = engine.match(signal("com.example.game"), rules, sessionId, mapOf("com.example.game" to 61_000L))
        assertTrue(over.matched)
        assertEquals("time_limit", over.adapterId)
    }

    @Test
    fun higherPriorityRuleWins() {
        val rules = listOf(
            rule("low", "com.example.game", RuleType.APP_BLOCK, "*", priority = 1),
            rule("high", "com.example.game", RuleType.TIME_LIMIT, "1", priority = 9),
        )
        val result = engine.match(signal("com.example.game"), rules, sessionId, mapOf("com.example.game" to 5_000L))
        assertEquals("high", result.rule?.id)
    }

    @Test
    fun disabledRuleDoesNotMatch() {
        val rules = listOf(rule("off", "com.example.game", RuleType.APP_BLOCK, "*").copy(enabled = false))
        assertFalse(engine.match(signal("com.example.game"), rules, sessionId).matched)
    }

    private fun signal(packageName: String) = UiSignal(packageName, null, emptyList(), emptyList(), emptyList())

    private fun rule(
        id: String,
        packageName: String,
        type: RuleType,
        target: String,
        priority: Int = 1,
    ) = RestrictionRule(id, packageName, type, target, true, priority, sessionId, 10L)
}
