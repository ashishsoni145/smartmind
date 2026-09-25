package com.sharpmind.app.focus

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertSame
import org.junit.Test

/**
 * Covers the behaviours added for production hardening: target expiry, backend linking,
 * and reconciliation after a process kill / reboot. None of these may auto-resume enforcement.
 */
class SessionRecoveryTest {
    private val machine = FocusStateMachine()
    private val now = 1_700_000_000_000L
    private val minute = 60_000L

    @Test
    fun expireCompletesOnlyWhenTargetReached() {
        val active = activeSession(targetMinutes = 5)
        try {
            machine.apply(active, FocusCommand.Expire, now + 4 * minute)
            throw AssertionError("expected target_not_reached")
        } catch (error: FocusTransitionException) {
            assertEquals("target_not_reached", error.message)
        }
        val done = machine.apply(active, FocusCommand.Expire, now + 5 * minute)
        assertEquals(FocusPhase.COMPLETED, done.phase)
        assertEquals("target_reached", done.failureReason)
        assertEquals(5 * minute, done.accumulatedActiveMs)
        assertNull(done.lastResumedAtEpochMs)
    }

    @Test
    fun expireIsRejectedWhilePaused() {
        val paused = machine.apply(activeSession(targetMinutes = 5), FocusCommand.Pause, now + 30_000)
        try {
            machine.apply(paused, FocusCommand.Expire, now + 10 * minute)
            throw AssertionError("expected invalid phase")
        } catch (error: FocusTransitionException) {
            assertEquals("invalid_phase_PAUSED", error.message)
        }
    }

    @Test
    fun linkBackendIsIdempotentAndRejectsRelink() {
        val active = activeSession(targetMinutes = 25, backendId = null)
        val linked = machine.apply(active, FocusCommand.LinkBackend("srv-1"), now)
        assertEquals("srv-1", linked.backendSessionId)
        assertEquals(FocusPhase.ACTIVE, linked.phase)
        val again = machine.apply(linked, FocusCommand.LinkBackend("srv-1"), now)
        assertEquals("srv-1", again.backendSessionId)
        try {
            machine.apply(linked, FocusCommand.LinkBackend("srv-2"), now)
            throw AssertionError("expected backend_already_linked")
        } catch (error: FocusTransitionException) {
            assertEquals("backend_already_linked", error.message)
        }
        try {
            machine.apply(FocusSession.idle(), FocusCommand.LinkBackend("srv-3"), now)
            throw AssertionError("expected no_session_to_link")
        } catch (error: FocusTransitionException) {
            assertEquals("no_session_to_link", error.message)
        }
    }

    @Test
    fun recoveryFreezesActiveSessionAtLastHeartbeat() {
        val active = activeSession(targetMinutes = 25)
        val heartbeat = now + 4 * minute
        val recovered = SessionRecovery.reconcile(active, heartbeat, now + 30 * minute)
        assertEquals(FocusPhase.PAUSED, recovered.phase)
        assertEquals(4 * minute, recovered.accumulatedActiveMs)
        assertNull(recovered.lastResumedAtEpochMs)
        assertEquals(SessionRecovery.REASON_PROCESS_RESTART, recovered.failureReason)
        // The frozen clock must not advance any further.
        assertEquals(4 * minute, recovered.activeElapsedMs(now + 60 * minute))
    }

    @Test
    fun recoveryWithoutHeartbeatCreditsNothingAfterResume() {
        val active = activeSession(targetMinutes = 25)
        val recovered = SessionRecovery.reconcile(active, null, now + 30 * minute)
        assertEquals(FocusPhase.PAUSED, recovered.phase)
        assertEquals(0L, recovered.accumulatedActiveMs)
    }

    @Test
    fun recoveryClampsStaleOrFutureHeartbeats() {
        val active = activeSession(targetMinutes = 25)
        // Heartbeat older than the resume timestamp (left over from a previous session) credits nothing.
        val stale = SessionRecovery.reconcile(active, now - minute, now + minute)
        assertEquals(0L, stale.accumulatedActiveMs)
        // Heartbeat in the future (clock change) is clamped to now.
        val future = SessionRecovery.reconcile(active, now + 90 * minute, now + 3 * minute)
        assertEquals(3 * minute, future.accumulatedActiveMs)
    }

    @Test
    fun recoveryFailsPreparingAndLeavesTerminalPhasesAlone() {
        val prepared = machine.apply(FocusSession.idle(), prepare(25, null), now)
        val failed = SessionRecovery.reconcile(prepared, null, now + 5_000)
        assertEquals(FocusPhase.FAILED, failed.phase)
        assertEquals(SessionRecovery.REASON_PROCESS_RESTART, failed.failureReason)

        val idle = FocusSession.idle()
        assertSame(idle, SessionRecovery.reconcile(idle, null, now))
        val paused = machine.apply(activeSession(targetMinutes = 25), FocusCommand.Pause, now + minute)
        assertSame(paused, SessionRecovery.reconcile(paused, now + 2 * minute, now + 3 * minute))
        val done = machine.apply(activeSession(targetMinutes = 25), FocusCommand.Stop(confirmStrict = false), now + minute)
        assertSame(done, SessionRecovery.reconcile(done, null, now + 2 * minute))
    }

    @Test
    fun recoveredSessionSurvivesCodecRoundTrip() {
        val recovered = SessionRecovery.reconcile(activeSession(targetMinutes = 25), now + minute, now + 2 * minute)
        val decoded = SessionCodec.decodeSession(SessionCodec.encodeSession(recovered))
        assertEquals(recovered, decoded)
    }

    private fun prepare(targetMinutes: Int, backendId: String?): FocusCommand.Prepare {
        return FocusCommand.Prepare(
            draft = FocusDraft("Recovery drill", targetMinutes, false, "maths", null, null, backendId),
            sessionId = "session-r",
            ruleIds = listOf("rule-1"),
        )
    }

    private fun activeSession(targetMinutes: Int, backendId: String? = "backend-1"): FocusSession {
        val prepared = machine.apply(FocusSession.idle(), prepare(targetMinutes, backendId), now)
        return machine.apply(prepared, FocusCommand.Activate, now)
    }
}
