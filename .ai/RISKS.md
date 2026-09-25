# Risks

- Curriculum/PYQ correctness requires authoritative versioned sources.
- AI needs grounding, uncertainty handling, evaluation, and audit metadata.
- Privacy, consent, and role access must be enforced at the data layer.
- Provider quotas and managed-service costs can change.
- Duplicated client logic can cause cross-platform drift. The Android client must keep calling backend contracts instead of copying planner, mastery, or entitlement logic.
- Android focus cannot force-close apps with Usage Access. Claiming otherwise would be a Play-policy and product lie. AccessibilityService review may reject selective Shorts/Reels blocking; the compliant fallback is an explicit unsupported state.
- This environment cannot reach Maven, Google, or Gradle hosts. An APK is not verified until GitHub Actions uploads it.
