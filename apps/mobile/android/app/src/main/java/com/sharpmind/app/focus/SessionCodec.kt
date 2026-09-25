package com.sharpmind.app.focus

/**
 * Tiny persistence format so unit tests do not need Android JSON.
 * Not used for secrets.
 */
object SessionCodec {
    fun encodeSession(session: FocusSession): String {
        return listOf(
            "v1",
            "session",
            field("id", session.id),
            field("objective", session.objective),
            field("target", session.targetDurationMinutes.toString()),
            field("strict", session.strictMode.toString()),
            field("phase", session.phase.name),
            field("started", session.startedAtEpochMs?.toString() ?: ""),
            field("accumulated", session.accumulatedActiveMs.toString()),
            field("resumed", session.lastResumedAtEpochMs?.toString() ?: ""),
            field("ended", session.endedAtEpochMs?.toString() ?: ""),
            field("rules", session.restrictionRuleIds.joinToString(",")),
            field("backend", session.backendSessionId ?: ""),
            field("failure", session.failureReason ?: ""),
            field("subject", session.subjectId ?: ""),
            field("node", session.curriculumNodeId ?: ""),
            field("task", session.taskId ?: ""),
        ).joinToString("\n")
    }

    fun decodeSession(raw: String): FocusSession? {
        if (!raw.startsWith("v1")) {
            return null
        }
        val map = raw.lineSequence().mapNotNull { line ->
            val index = line.indexOf('=')
            if (index <= 0) null else line.substring(0, index) to unescape(line.substring(index + 1))
        }.toMap()
        val phase = map["phase"]?.let { runCatching { FocusPhase.valueOf(it) }.getOrNull() } ?: return null
        return FocusSession(
            id = map["id"].orEmpty(),
            objective = map["objective"].orEmpty(),
            targetDurationMinutes = map["target"]?.toIntOrNull() ?: 25,
            strictMode = map["strict"] == "true",
            phase = phase,
            startedAtEpochMs = map["started"]?.toLongOrNull(),
            accumulatedActiveMs = map["accumulated"]?.toLongOrNull() ?: 0,
            lastResumedAtEpochMs = map["resumed"]?.toLongOrNull(),
            endedAtEpochMs = map["ended"]?.toLongOrNull(),
            restrictionRuleIds = map["rules"].orEmpty().split(',').filter { it.isNotEmpty() },
            backendSessionId = map["backend"]?.ifBlank { null },
            failureReason = map["failure"]?.ifBlank { null },
            subjectId = map["subject"]?.ifBlank { null },
            curriculumNodeId = map["node"]?.ifBlank { null },
            taskId = map["task"]?.ifBlank { null },
        )
    }

    fun encodeRules(rules: List<RestrictionRule>): String {
        val lines = mutableListOf("v1", "rules")
        rules.forEach { rule ->
            lines.add(
                listOf(
                    escape(rule.id),
                    escape(rule.packageName),
                    rule.ruleType.name,
                    escape(rule.target),
                    rule.enabled.toString(),
                    rule.priority.toString(),
                    escape(rule.focusSessionId ?: ""),
                    rule.createdAtEpochMs.toString(),
                ).joinToString("|"),
            )
        }
        return lines.joinToString("\n")
    }

    fun decodeRules(raw: String): List<RestrictionRule> {
        if (!raw.startsWith("v1")) {
            return emptyList()
        }
        return raw.lineSequence().drop(2).mapNotNull { line ->
            val parts = line.split('|')
            if (parts.size < 8) {
                return@mapNotNull null
            }
            val type = runCatching { RuleType.valueOf(parts[2]) }.getOrNull() ?: return@mapNotNull null
            RestrictionRule(
                id = unescape(parts[0]),
                packageName = unescape(parts[1]),
                ruleType = type,
                target = unescape(parts[3]),
                enabled = parts[4] == "true",
                priority = parts[5].toIntOrNull() ?: 0,
                focusSessionId = unescape(parts[6]).ifBlank { null },
                createdAtEpochMs = parts[7].toLongOrNull() ?: 0,
            )
        }.toList()
    }

    private fun field(key: String, value: String): String = "$key=${escape(value)}"

    private fun escape(value: String): String {
        return value.replace("\\", "\\\\").replace("\n", "\\n").replace("|", "\\p")
    }

    private fun unescape(value: String): String {
        return value.replace("\\n", "\n").replace("\\p", "|").replace("\\\\", "\\")
    }
}
