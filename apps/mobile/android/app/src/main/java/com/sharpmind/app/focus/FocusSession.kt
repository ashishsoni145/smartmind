package com.sharpmind.app.focus

/**
 * Focus session state. The Kotlin service is the source of truth.
 * React Native only mirrors snapshots returned by the bridge.
 */
enum class FocusPhase {
    IDLE,
    PREPARING,
    ACTIVE,
    PAUSED,
    COMPLETED,
    CANCELLED,
    FAILED,
    PERMISSION_REQUIRED,
}

data class FocusDraft(
    val objective: String,
    val targetDurationMinutes: Int,
    val strictMode: Boolean,
    val subjectId: String?,
    val curriculumNodeId: String?,
    val taskId: String?,
    val backendSessionId: String?,
)

data class FocusSession(
    val id: String,
    val objective: String,
    val targetDurationMinutes: Int,
    val strictMode: Boolean,
    val phase: FocusPhase,
    val startedAtEpochMs: Long?,
    val accumulatedActiveMs: Long,
    val lastResumedAtEpochMs: Long?,
    val endedAtEpochMs: Long?,
    val restrictionRuleIds: List<String>,
    val backendSessionId: String?,
    val failureReason: String?,
    val subjectId: String?,
    val curriculumNodeId: String?,
    val taskId: String?,
) {
    fun activeElapsedMs(now: Long): Long {
        val running = if (phase == FocusPhase.ACTIVE && lastResumedAtEpochMs != null) {
            (now - lastResumedAtEpochMs).coerceAtLeast(0)
        } else {
            0
        }
        return accumulatedActiveMs + running
    }

    fun withFrozenElapsed(now: Long): FocusSession {
        return copy(
            accumulatedActiveMs = activeElapsedMs(now),
            lastResumedAtEpochMs = null,
        )
    }

    companion object {
        fun idle(): FocusSession = FocusSession(
            id = "",
            objective = "",
            targetDurationMinutes = 25,
            strictMode = false,
            phase = FocusPhase.IDLE,
            startedAtEpochMs = null,
            accumulatedActiveMs = 0,
            lastResumedAtEpochMs = null,
            endedAtEpochMs = null,
            restrictionRuleIds = emptyList(),
            backendSessionId = null,
            failureReason = null,
            subjectId = null,
            curriculumNodeId = null,
            taskId = null,
        )
    }
}

class FocusTransitionException(message: String) : IllegalStateException(message)

sealed class FocusCommand {
    data class Prepare(val draft: FocusDraft, val sessionId: String, val ruleIds: List<String>) : FocusCommand()
    data object PermissionsMissing : FocusCommand()
    data object PermissionsGranted : FocusCommand()
    data object Activate : FocusCommand()
    data object Pause : FocusCommand()
    data object Resume : FocusCommand()
    data class Stop(val confirmStrict: Boolean) : FocusCommand()
    data class Cancel(val confirmStrict: Boolean) : FocusCommand()
    data class Fail(val reason: String) : FocusCommand()
    data object PermissionRevoked : FocusCommand()
}

class FocusStateMachine {
    fun apply(session: FocusSession, command: FocusCommand, now: Long): FocusSession {
        return when (command) {
            is FocusCommand.Prepare -> {
                if (session.phase == FocusPhase.ACTIVE || session.phase == FocusPhase.PAUSED) {
                    throw FocusTransitionException("session_already_running")
                }
                if (command.draft.objective.trim().length < 3) {
                    throw FocusTransitionException("objective_too_short")
                }
                if (command.draft.targetDurationMinutes !in 5..180) {
                    throw FocusTransitionException("duration_out_of_range")
                }
                FocusSession(
                    id = command.sessionId,
                    objective = command.draft.objective.trim(),
                    targetDurationMinutes = command.draft.targetDurationMinutes,
                    strictMode = command.draft.strictMode,
                    phase = FocusPhase.PREPARING,
                    startedAtEpochMs = null,
                    accumulatedActiveMs = 0,
                    lastResumedAtEpochMs = null,
                    endedAtEpochMs = null,
                    restrictionRuleIds = command.ruleIds,
                    backendSessionId = command.draft.backendSessionId,
                    failureReason = null,
                    subjectId = command.draft.subjectId,
                    curriculumNodeId = command.draft.curriculumNodeId,
                    taskId = command.draft.taskId,
                )
            }
            FocusCommand.PermissionsMissing -> {
                requirePhase(session, FocusPhase.PREPARING, FocusPhase.PERMISSION_REQUIRED, FocusPhase.PAUSED)
                session.copy(phase = FocusPhase.PERMISSION_REQUIRED, failureReason = "permission_required")
            }
            FocusCommand.PermissionsGranted -> {
                if (session.phase != FocusPhase.PERMISSION_REQUIRED && session.phase != FocusPhase.PREPARING) {
                    throw FocusTransitionException("permissions_not_pending")
                }
                val next = if (session.startedAtEpochMs != null) FocusPhase.PAUSED else FocusPhase.PREPARING
                session.copy(phase = next, failureReason = null)
            }
            FocusCommand.Activate -> {
                if (session.phase != FocusPhase.PREPARING) {
                    throw FocusTransitionException("not_prepared")
                }
                session.copy(
                    phase = FocusPhase.ACTIVE,
                    startedAtEpochMs = session.startedAtEpochMs ?: now,
                    lastResumedAtEpochMs = now,
                    failureReason = null,
                )
            }
            FocusCommand.Pause -> {
                requirePhase(session, FocusPhase.ACTIVE)
                session.withFrozenElapsed(now).copy(phase = FocusPhase.PAUSED)
            }
            FocusCommand.Resume -> {
                requirePhase(session, FocusPhase.PAUSED)
                session.copy(phase = FocusPhase.ACTIVE, lastResumedAtEpochMs = now, failureReason = null)
            }
            is FocusCommand.Stop -> end(session, command.confirmStrict, now, FocusPhase.COMPLETED, null)
            is FocusCommand.Cancel -> end(session, command.confirmStrict, now, FocusPhase.CANCELLED, "cancelled")
            is FocusCommand.Fail -> {
                if (session.phase == FocusPhase.IDLE || session.phase == FocusPhase.COMPLETED) {
                    throw FocusTransitionException("cannot_fail")
                }
                session.withFrozenElapsed(now).copy(
                    phase = FocusPhase.FAILED,
                    endedAtEpochMs = now,
                    failureReason = command.reason.ifBlank { "failed" },
                )
            }
            FocusCommand.PermissionRevoked -> {
                if (session.phase != FocusPhase.ACTIVE && session.phase != FocusPhase.PAUSED && session.phase != FocusPhase.PREPARING) {
                    throw FocusTransitionException("not_enforceable")
                }
                session.withFrozenElapsed(now).copy(
                    phase = FocusPhase.PERMISSION_REQUIRED,
                    failureReason = "permission_revoked",
                )
            }
        }
    }

    private fun end(
        session: FocusSession,
        confirmStrict: Boolean,
        now: Long,
        phase: FocusPhase,
        reason: String?,
    ): FocusSession {
        if (session.phase != FocusPhase.ACTIVE && session.phase != FocusPhase.PAUSED && session.phase != FocusPhase.PREPARING && session.phase != FocusPhase.PERMISSION_REQUIRED) {
            throw FocusTransitionException("not_endable")
        }
        if (session.strictMode && session.phase == FocusPhase.ACTIVE && !confirmStrict) {
            throw FocusTransitionException("strict_confirmation_required")
        }
        return session.withFrozenElapsed(now).copy(
            phase = phase,
            endedAtEpochMs = now,
            failureReason = reason,
        )
    }

    private fun requirePhase(session: FocusSession, vararg allowed: FocusPhase) {
        if (session.phase !in allowed) {
            throw FocusTransitionException("invalid_phase_${session.phase}")
        }
    }
}
