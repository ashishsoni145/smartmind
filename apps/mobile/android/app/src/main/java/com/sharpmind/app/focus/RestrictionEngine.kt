package com.sharpmind.app.focus

object ProtectedPackages {
    val packages: Set<String> = setOf(
        "com.sharpmind.app",
        "com.android.settings",
        "com.android.systemui",
        "com.android.permissioncontroller",
        "com.google.android.permissioncontroller",
        "com.google.android.packageinstaller",
        "com.android.packageinstaller",
    )

    fun isProtected(packageName: String): Boolean = packageName in packages
}

class RestrictionEngine(
    private val adapters: List<AppRestrictionAdapter> = SupportedAppCatalog.adapters,
) {
    fun match(
        signal: UiSignal,
        rules: List<RestrictionRule>,
        sessionId: String,
        usageMsByPackage: Map<String, Long> = emptyMap(),
    ): MatchResult {
        if (signal.packageName.isBlank()) {
            return MatchResult.none("empty_package")
        }
        if (ProtectedPackages.isProtected(signal.packageName)) {
            return MatchResult.none("protected_package")
        }
        val applicable = rules
            .filter { it.appliesTo(sessionId) && (it.packageName == signal.packageName || it.ruleType == RuleType.FOCUS_ONLY) }
            .sortedByDescending { it.priority }
        if (applicable.isEmpty()) {
            return MatchResult.none("no_rule")
        }

        var unsupported: MatchResult? = null
        for (rule in applicable) {
            val result = matchRule(signal, rule, usageMsByPackage)
            if (result.matched) {
                return result
            }
            if (result.support == DetectionSupport.UNSUPPORTED && unsupported == null) {
                unsupported = result
            }
        }
        return unsupported ?: MatchResult.none("no_match")
    }

    private fun matchRule(
        signal: UiSignal,
        rule: RestrictionRule,
        usageMsByPackage: Map<String, Long>,
    ): MatchResult {
        return when (rule.ruleType) {
            RuleType.APP_BLOCK -> {
                if (signal.packageName != rule.packageName) {
                    MatchResult.none("app_block_package_mismatch")
                } else {
                    matched(rule, DetectionSupport.DETECTED, "generic", InterventionKind.GO_HOME, "app_block")
                }
            }
            RuleType.CONTENT_RESTRICTION -> matchContent(signal, rule)
            RuleType.TIME_LIMIT -> matchTimeLimit(signal, rule, usageMsByPackage)
            RuleType.FOCUS_ONLY -> matchFocusOnly(signal, rule)
        }
    }

    private fun matchContent(signal: UiSignal, rule: RestrictionRule): MatchResult {
        val adapter = adapters.firstOrNull { it.packageName == signal.packageName }
            ?: GenericAccessibilityAdapter()
        val detection = try {
            adapter.detect(signal)
        } catch (error: Exception) {
            AdapterDetection(adapter.id, DetectionSupport.UNSUPPORTED, rule.target, "adapter_error:${error.javaClass.simpleName}")
        }
        if (detection.support != DetectionSupport.DETECTED) {
            return MatchResult(
                matched = false,
                rule = rule,
                support = detection.support,
                adapterId = detection.adapterId,
                intervention = InterventionKind.NONE,
                detail = detection.detail,
            )
        }
        val target = rule.target.lowercase()
        if (detection.target != null && detection.target.lowercase() != target && target != "*") {
            return MatchResult(
                matched = false,
                rule = rule,
                support = DetectionSupport.ALLOWED,
                adapterId = detection.adapterId,
                intervention = InterventionKind.NONE,
                detail = "target_mismatch",
            )
        }
        return matched(rule, DetectionSupport.DETECTED, detection.adapterId, InterventionKind.NAVIGATE_BACK, detection.detail)
    }

    private fun matchTimeLimit(
        signal: UiSignal,
        rule: RestrictionRule,
        usageMsByPackage: Map<String, Long>,
    ): MatchResult {
        if (signal.packageName != rule.packageName) {
            return MatchResult.none("time_limit_package_mismatch")
        }
        val limitSeconds = rule.target.toLongOrNull()
            ?: return MatchResult(
                matched = false,
                rule = rule,
                support = DetectionSupport.UNSUPPORTED,
                adapterId = "time_limit",
                intervention = InterventionKind.NONE,
                detail = "invalid_limit",
            )
        val used = usageMsByPackage[signal.packageName] ?: 0L
        if (used < limitSeconds * 1000L) {
            return MatchResult.none("under_limit")
        }
        return matched(rule, DetectionSupport.DETECTED, "time_limit", InterventionKind.NOTIFY_ONLY, "time_limit_reached")
    }

    private fun matchFocusOnly(signal: UiSignal, rule: RestrictionRule): MatchResult {
        val allow = rule.target.split(',').map { it.trim() }.filter { it.isNotEmpty() }.toSet()
        if (signal.packageName in allow || signal.packageName == rule.packageName) {
            return MatchResult.none("allowlisted")
        }
        return matched(rule, DetectionSupport.DETECTED, "focus_only", InterventionKind.GO_HOME, "outside_allowlist")
    }

    private fun matched(
        rule: RestrictionRule,
        support: DetectionSupport,
        adapterId: String,
        intervention: InterventionKind,
        detail: String,
    ): MatchResult {
        return MatchResult(
            matched = true,
            rule = rule,
            support = support,
            adapterId = adapterId,
            intervention = intervention,
            detail = detail,
        )
    }
}
