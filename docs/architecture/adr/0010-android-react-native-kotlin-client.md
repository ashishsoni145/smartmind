# ADR 0010: Android client is React Native plus Kotlin, not a WebView

## Status
Accepted (2026-09-24). Supersedes ADR 0009.

## Context
ADR 0009 shipped Android as a Capacitor shell around the Next.js static export. That made the phone a WebView of `apps/web` and could not enforce focus restrictions. Android focus needs Usage Access, an opted-in AccessibilityService, a foreground service, and a state machine that survives process death. Those are Android SDK responsibilities. The web app remains the product, domain, and backend source of truth, but it is not the Android presentation layer.

## Decision
- `apps/mobile` is a React Native 0.87 + TypeScript client. `com.sharpmind.app` is unchanged. The primary UI does not load `apps/web` or `https://sharpminds.live`.
- One Kotlin TurboModule, `SharpMindAndroid`, owns focus state, rules, permissions, the secure session store, reminders, and the installed-app catalog. Screens talk to `src/features/focus/nativeFocus.ts`, not to Android APIs directly.
- Academic, planner, revision, assessment, tutor, analytics, and entitlement behavior stay on the existing backend. The client does not reimplement mastery, the adaptive planner, the student model, AI orchestration, authorization, or subscription authority.
- The client is untrusted. It embeds only the Supabase URL, anon key, and API URL. It refuses service-role, OpenRouter, admin, and signing secrets. Entitlements come from the backend. There is no local `isPro`.
- Focus HTTP is telemetry. There is no cancel route. Ending early completes the server session with `completedObjective: false`. Restriction events sent to the server are package, rule, and support metadata, not screen text or installed-app lists.
- Usage access detects the foreground package. It cannot force-close another app. Whole-app and focus-only matches open SharpMind's own intervention activity or a notification. Time-limit matches notify only. Content rules stay on the accessibility path. An unsupported content hierarchy is reported as unsupported and is not upgraded to an app block.
- AccessibilityService is off by default, `isAccessibilityTool=false`, and used only after a prominent disclosure for opted-in focus. It does not collect passwords, messages, or recordings. Strict Mode cannot hide the app, block Settings, block uninstall, or block permission revocation.
- The focus foreground service is `specialUse`, visible, and running only while a session is enforcing. Boot does not resume a focus session. Reminders are inexact and user-enabled.
- Play Billing is not implemented. The subscription screen shows the server entitlement and leaves a seam for a later billing module that still asks the backend before granting access.
- CI replaces the Capacitor build. It installs, typechecks, runs JS tests, runs Kotlin unit tests, assembles a debug APK, and builds a release AAB only when signing secrets exist.

## Consequences
- Web and mobile can diverge in presentation. They must not diverge in contracts. Shared types and `@sharpmind/api-client` remain the contract.
- A debug APK from CI without Supabase/API secrets cannot sign in. Release upload to Play requires `SHARPMIND_KEYSTORE_*` and a Play Console declaration for the special-use foreground service and, if content rules ship, the AccessibilityService.
- Usage access cannot guarantee that a distracting app closes. The closest Play-compliant behavior is to return the student to SharpMind and say so. See `apps/mobile/PLAY_AUDIT.md`.
- Gradle and the Android SDK are not available in every sandbox. A green GitHub Actions run is the build proof. Do not claim an APK exists until that run uploads it.
