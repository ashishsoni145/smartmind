package com.sharpmind.app.focus

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class UsagePathPolicyTest {
    private val engine = RestrictionEngine()
    private val sessionId = "focus-usage"

    @Test
    fun usagePathRecordsAppBlockTimeLimitAndFocusOnly() {
        val appBlock = engine.match(signal("com.example.game"), listOf(rule("a", "com.example.game", RuleType.APP_BLOCK, "*")), sessionId)
        val focusOnly = engine.match(signal("com.example.game"), listOf(rule("f", "com.sharpmind.app", RuleType.FOCUS_ONLY, "com.sharpmind.app")), sessionId)
        val timeLimit = engine.match(
            signal("com.example.game"),
            listOf(rule("t", "com.example.game", RuleType.TIME_LIMIT, "30")),
            sessionId,
            mapOf("com.example.game" to 31_000L),
        )
        assertEquals(InterventionKind.GO_HOME, UsagePathPolicy.decide(appBlock).intervention)
        assertEquals(InterventionKind.GO_HOME, UsagePathPolicy.decide(focusOnly).intervention)
        assertEquals(InterventionKind.NOTIFY_ONLY, UsagePathPolicy.decide(timeLimit).intervention)
        assertTrue(UsagePathPolicy.decide(appBlock).record)
        assertTrue(UsagePathPolicy.decide(focusOnly).record)
        assertTrue(UsagePathPolicy.decide(timeLimit).record)
    }

    @Test
    fun unsupportedContentDoesNotBecomeAnAppBlock() {
        val content = engine.match(
            signal(YouTubeAdapter().packageName),
            listOf(rule("c", YouTubeAdapter().packageName, RuleType.CONTENT_RESTRICTION, "shorts")),
            sessionId,
        )
        assertEquals(DetectionSupport.UNSUPPORTED, content.support)
        val decision = UsagePathPolicy.decide(content)
        assertFalse(decision.record)
        assertFalse(decision.intervene)
        assertEquals(InterventionKind.NONE, decision.intervention)
    }

    @Test
    fun contentMatchIsLeftToAccessibilityEvenIfDetected() {
        val detected = MatchResult(
            matched = true,
            rule = rule("c", YouTubeAdapter().packageName, RuleType.CONTENT_RESTRICTION, "shorts"),
            support = DetectionSupport.DETECTED,
            adapterId = "youtube",
            intervention = InterventionKind.NAVIGATE_BACK,
            detail = "shorts_player",
        )
        val decision = UsagePathPolicy.decide(detected)
        assertFalse(decision.record)
        assertEquals(InterventionKind.NONE, decision.intervention)
    }

    @Test
    fun usageSamplesAreCappedAndAttributedToThePreviousPackage() {
        val first = UsagePathPolicy.accumulate(emptyMap(), "com.example.game", 1_000L, 4_000L)
        assertEquals(3_000L, first["com.example.game"])
        val stalled = UsagePathPolicy.accumulate(first, "com.example.game", 4_000L, 4_000L + 60_000L)
        assertEquals(3_000L + UsagePathPolicy.MAX_SAMPLE_MS, stalled["com.example.game"])
        assertEquals(first, UsagePathPolicy.decodeUsage(UsagePathPolicy.encodeUsage(first)))
    }

    private fun signal(packageName: String) = UiSignal(packageName, null, emptyList(), emptyList(), emptyList())

    private fun rule(id: String, packageName: String, type: RuleType, target: String) =
        RestrictionRule(id, packageName, type, target, true, 1, sessionId, 10L)
}
