package com.sharpmind.app.focus

enum class RuleType {
    APP_BLOCK,
    CONTENT_RESTRICTION,
    TIME_LIMIT,
    FOCUS_ONLY,
}

data class RestrictionRule(
    val id: String,
    val packageName: String,
    val ruleType: RuleType,
    val target: String,
    val enabled: Boolean,
    val priority: Int,
    val focusSessionId: String?,
    val createdAtEpochMs: Long,
) {
    fun appliesTo(sessionId: String): Boolean {
        return enabled && (focusSessionId == null || focusSessionId == sessionId)
    }
}

enum class DetectionSupport {
    DETECTED,
    ALLOWED,
    UNSUPPORTED,
    NOT_THIS_APP,
}

enum class InterventionKind {
    NONE,
    NAVIGATE_BACK,
    GO_HOME,
    NOTIFY_ONLY,
}

data class UiSignal(
    val packageName: String,
    val className: String?,
    val texts: List<String>,
    val contentDescriptions: List<String>,
    val viewIds: List<String>,
)

data class AdapterDetection(
    val adapterId: String,
    val support: DetectionSupport,
    val target: String?,
    val detail: String,
)

interface AppRestrictionAdapter {
    val id: String
    val packageName: String
    val supportedTargets: Set<String>
    fun detect(signal: UiSignal): AdapterDetection
}

data class MatchResult(
    val matched: Boolean,
    val rule: RestrictionRule?,
    val support: DetectionSupport,
    val adapterId: String,
    val intervention: InterventionKind,
    val detail: String,
) {
    companion object {
        fun none(detail: String): MatchResult = MatchResult(
            matched = false,
            rule = null,
            support = DetectionSupport.ALLOWED,
            adapterId = "none",
            intervention = InterventionKind.NONE,
            detail = detail,
        )
    }
}
