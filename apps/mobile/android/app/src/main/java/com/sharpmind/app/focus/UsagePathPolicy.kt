package com.sharpmind.app.focus

/**
 * Usage access can see the foreground package. It cannot see screen content and cannot force-close apps.
 * Content rules stay on the accessibility path. An unsupported content match must not become an app block.
 */
object UsagePathPolicy {
    const val MAX_SAMPLE_MS = 20_000L

    data class Decision(
        val record: Boolean,
        val intervention: InterventionKind,
    ) {
        val intervene: Boolean
            get() = intervention == InterventionKind.GO_HOME || intervention == InterventionKind.NOTIFY_ONLY
    }

    fun decide(match: MatchResult?): Decision {
        val rule = match?.rule
        if (match == null || !match.matched || rule == null) {
            return Decision(false, InterventionKind.NONE)
        }
        return when (rule.ruleType) {
            RuleType.CONTENT_RESTRICTION -> Decision(false, InterventionKind.NONE)
            RuleType.APP_BLOCK, RuleType.FOCUS_ONLY -> Decision(
                record = true,
                intervention = if (match.intervention == InterventionKind.GO_HOME) InterventionKind.GO_HOME else InterventionKind.NONE,
            )
            RuleType.TIME_LIMIT -> Decision(
                record = true,
                intervention = if (match.intervention == InterventionKind.NOTIFY_ONLY) InterventionKind.NOTIFY_ONLY else InterventionKind.NONE,
            )
        }
    }

    fun accumulate(
        usage: Map<String, Long>,
        previousPackage: String?,
        previousAt: Long,
        now: Long,
    ): Map<String, Long> {
        if (previousPackage.isNullOrBlank() || previousAt <= 0L || now <= previousAt) {
            return usage
        }
        val delta = (now - previousAt).coerceAtMost(MAX_SAMPLE_MS)
        val next = usage.toMutableMap()
        next[previousPackage] = (next[previousPackage] ?: 0L) + delta
        return next
    }

    fun encodeUsage(usage: Map<String, Long>): String {
        return usage.entries.joinToString("\n") { "${it.key}=${it.value}" }
    }

    fun decodeUsage(raw: String): Map<String, Long> {
        if (raw.isBlank()) {
            return emptyMap()
        }
        return raw.lineSequence().mapNotNull { line ->
            val index = line.lastIndexOf('=')
            if (index <= 0) {
                null
            } else {
                val packageName = line.substring(0, index)
                val millis = line.substring(index + 1).toLongOrNull() ?: return@mapNotNull null
                packageName to millis
            }
        }.toMap()
    }
}
