# Play distribution audit

This is an engineering audit of what the Android client requests and what it cannot honestly ship. It is not a Play Console approval.

## Permissions

| Permission | Why | When |
| --- | --- | --- |
| `INTERNET` | Supabase and `/api/v1` | Install |
| `POST_NOTIFICATIONS` | Focus notification and reminders the student enables | Onboarding step, not first launch |
| `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_SPECIAL_USE` | Visible focus session only while enforcing | Session start |
| `RECEIVE_BOOT_COMPLETED` | Reschedule inexact reminders only. Does not resume focus | After a reminder was scheduled |
| `VIBRATE` | Reminder feedback | With reminders |
| `PACKAGE_USAGE_STATS` | Foreground package for whole-app, focus-only, and time-limit rules | Settings, after disclosure |

Not requested: `QUERY_ALL_PACKAGES`, overlay, device-admin, accessibility-tool flag, SMS, contacts, microphone, camera, location, or storage of screen recordings.

Launcher visibility uses a `<queries>` intent for `MAIN`/`LAUNCHER` plus the three packages that have selective adapters. That is not a full installed-app inventory upload.

## Mechanisms that need a Play declaration

1. **Special-use foreground service.** The subtype property says the service shows a persistent notification and checks the foreground app only during a consented study session, then stops. Play Console still needs the special-use declaration. The service is `START_NOT_STICKY` in the sense that it stops itself if the phase is not active or paused, and boot does not restart it.

2. **AccessibilityService.** `isAccessibilityTool=false`. It is not a disability service. Disclosure is in the permission screen: what is matched, that window text is not stored, and that the student can turn it off in Settings. The service walks at most 40 nodes to depth 6, aborts on password fields, and keeps no texts. It runs only in an active focus session. Reviewers have been stricter about accessibility tools since 28 January 2026. If Play rejects this service, do not hide it or rebrand it. Ship whole-app rules through usage access and leave content rules unsupported.

3. **Usage access.** This is special app access, granted in system settings. It can see the foreground package. It cannot force-stop or force-close another app. The closest compliant behavior is implemented: open SharpMind's own intervention activity (with Dismiss always available) or post a notification. Time-limit matches notify only. The UI must not say the other app was closed.

## Rules that must not be faked

- Content restrictions for YouTube Shorts, Instagram Reels, and Facebook Reels match player view ids or player descriptions. A navigation label alone is not a match. Empty hierarchy is `UNSUPPORTED`, not a block.
- Generic apps have no selective adapter. A content rule on them stays unsupported.
- Protected packages never match: SharpMind, Settings, System UI, permission controllers, package installers. Strict Mode does not hide the app or block uninstall.
- Restriction telemetry sent to the existing interruption API is `restriction:<type>:<package>`. Raw usage, screenshots, and installed-app lists are not uploaded.

## Billing

There is no Play Billing client. `UserSettings.subscription` from the backend is the only trusted tier. A local `isPro` flag is rejected. Until a billing endpoint exists, the subscription screen says the entitlement is unavailable rather than granting Pro.
