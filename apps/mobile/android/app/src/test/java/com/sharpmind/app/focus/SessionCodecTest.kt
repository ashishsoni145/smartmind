package com.sharpmind.app.focus

import org.junit.Assert.assertEquals
import org.junit.Test

class SessionCodecTest {
    @Test
    fun roundTripsSessionAndRules() {
        val session = FocusSession.idle().copy(
            id = "abc",
            objective = "Revise kinematics",
            phase = FocusPhase.PAUSED,
            strictMode = true,
            accumulatedActiveMs = 12000,
            restrictionRuleIds = listOf("r1", "r2"),
            backendSessionId = "backend",
        )
        val decoded = SessionCodec.decodeSession(SessionCodec.encodeSession(session))
        assertEquals(session, decoded)
        val rules = listOf(
            RestrictionRule("r1", "com.google.android.youtube", RuleType.CONTENT_RESTRICTION, "shorts", true, 3, "abc", 9L),
        )
        assertEquals(rules, SessionCodec.decodeRules(SessionCodec.encodeRules(rules)))
    }
}
