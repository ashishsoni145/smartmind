package com.sharpmind.app.focus

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class FocusStateMachineTest {
    private val machine = FocusStateMachine()
    private val now = 1_700_000_000_000L

    @Test
    fun idlePrepareActivatePauseResumeComplete() {
        val prepared = machine.apply(FocusSession.idle(), prepare(), now)
        assertEquals(FocusPhase.PREPARING, prepared.phase)
        val active = machine.apply(prepared, FocusCommand.Activate, now + 1_000)
        assertEquals(FocusPhase.ACTIVE, active.phase)
        val paused = machine.apply(active, FocusCommand.Pause, now + 11_000)
        assertEquals(10_000L, paused.accumulatedActiveMs)
        val resumed = machine.apply(paused, FocusCommand.Resume, now + 20_000)
        val done = machine.apply(resumed, FocusCommand.Stop(confirmStrict = false), now + 25_000)
        assertEquals(FocusPhase.COMPLETED, done.phase)
        assertEquals(15_000L, done.accumulatedActiveMs)
    }

    @Test
    fun strictModeRejectsUnconfirmedStop() {
        val active = activeSession(strict = true)
        try {
            machine.apply(active, FocusCommand.Stop(confirmStrict = false), now)
            throw AssertionError("expected strict confirmation")
        } catch (error: FocusTransitionException) {
            assertEquals("strict_confirmation_required", error.message)
        }
        val done = machine.apply(active, FocusCommand.Stop(confirmStrict = true), now + 5_000)
        assertEquals(FocusPhase.COMPLETED, done.phase)
    }

    @Test
    fun permissionRevocationStopsEnforcementWithoutCompleting() {
        val active = activeSession(strict = false)
        val revoked = machine.apply(active, FocusCommand.PermissionRevoked, now + 2_000)
        assertEquals(FocusPhase.PERMISSION_REQUIRED, revoked.phase)
        assertEquals("permission_revoked", revoked.failureReason)
    }

    @Test
    fun missingPermissionsStayOutOfActive() {
        val prepared = machine.apply(FocusSession.idle(), prepare(), now)
        val blocked = machine.apply(prepared, FocusCommand.PermissionsMissing, now)
        assertEquals(FocusPhase.PERMISSION_REQUIRED, blocked.phase)
    }

    @Test
    fun cannotPrepareOverARunningSession() {
        val active = activeSession(strict = false)
        try {
            machine.apply(active, prepare(), now)
            throw AssertionError("expected rejection")
        } catch (error: FocusTransitionException) {
            assertTrue(error.message!!.contains("already_running"))
        }
    }

    private fun prepare(): FocusCommand.Prepare {
        return FocusCommand.Prepare(
            draft = FocusDraft("Organic chemistry drill", 25, false, "chemistry", null, null, null),
            sessionId = "session-1",
            ruleIds = listOf("rule-1"),
        )
    }

    private fun activeSession(strict: Boolean): FocusSession {
        val prepared = machine.apply(
            FocusSession.idle(),
            FocusCommand.Prepare(
                FocusDraft("Physics block", 40, strict, "physics", null, null, "backend-1"),
                "session-2",
                emptyList(),
            ),
            now,
        )
        return machine.apply(prepared, FocusCommand.Activate, now)
    }
}
