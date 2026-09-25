# Play distribution audit

This is an engineering audit of what the Android client requests and what it cannot honestly ship. It is not a Play Console approval.

## Permissions

| Permission | Why | When |
| --- | --- | --- |
| `INTERNET` | Supabase and `/api/v1` | Install |
| `POST_NOTIFICATIONS` | Focus notification and reminders the student enables | Requested from the Focus permission screen or when the student turns on a reminder — never at first launch |
| `FOREGROUND_SERVICE` + `FOREGROUND_SERVICE_SPECIAL_USE` | Visible focus session only while enforcing | Session start |
| `RECEIVE_BOOT_COMPLETED` | Re-arm inexact reminders that have not fired yet. Never starts the focus service | After a reminder was scheduled |
| `VIBRATE` | Reminder feedback | With reminders |
| `PACKAGE_USAGE_STATS` | Foreground package for whole-app, focus-only and time-limit rules | Settings, after in-app disclosure |

Not requested: `QUERY_ALL_PACKAGES`, overlay, device-admin, accessibility-tool flag, SMS, contacts, microphone, camera, location, exact alarms, or storage of screen recordings.

Launcher visibility uses a `<queries>` intent for `MAIN`/`LAUNCHER` plus the three packages that have selective adapters. Installed-app names are shown for rule selection only and are never uploaded.

## Mechanisms that need a Play declaration

1. **Special-use foreground service.** The subtype property says the service shows a persistent notification and checks the foreground app only during a consented study session, then stops. Play Console still needs the special-use declaration. `FocusForegroundService.onStartCommand` returns `START_NOT_STICKY`; the service refuses to start unless the session is `ACTIVE` or `PAUSED`, polls every 3 s while active and 15 s while paused, and calls `stopSelf()` as soon as the phase changes. It is never started from boot. The notification uses a monochrome small icon and carries Pause/Resume and End actions; in Strict Mode “End” opens the app instead of ending.

2. **AccessibilityService.** `isAccessibilityTool=false`. It is not a disability service. Disclosure lives in the permission screen and in the service description: what is matched, that window text is not stored, and that the student can turn it off in Settings at any time. Data minimisation in code: the service returns before touching the window unless (a) a session is `ACTIVE`, (b) the event's package is not protected, and (c) that package has an enabled `CONTENT_RESTRICTION` rule in the current session. It then reads at most 40 view ids / content descriptions to depth 6, aborts on any password node, never keeps text, and never uploads window content. Ambiguous hierarchies are `UNSUPPORTED`, not blocked. If Play rejects this service, do not hide it or rebrand it: keep whole-app rules on usage access and leave content rules unsupported.

3. **Usage access.** Special app access granted in system settings. It can see the foreground package; it cannot force-stop or close another app, and the app never claims otherwise. The intervention is SharpMind's own activity (a normal activity, not an overlay) that states which rule matched, what SharpMind did (opened this screen / sent one Back action / posted a notification), and offers Return, Dismiss, and — outside Strict Mode — End session. Time-limit matches notify only. Android may refuse background activity starts; the foreground notification is the fallback.

## Rules that must not be faked

- Content restrictions for YouTube Shorts, Instagram Reels and Facebook Reels match player view ids or player descriptions. A navigation label alone is not a match. Empty hierarchy is `UNSUPPORTED`, not a block.
- Generic apps have no selective adapter. A content rule on them stays unsupported and the setup screen says so.
- Protected packages never match: SharpMind, Settings, System UI, permission controllers, package installers, dialer. Strict Mode does not hide the app, block Settings, or block uninstall; it only requires an in-app confirmation to end.
- If a permission is revoked mid-session the session goes to `PERMISSION_REQUIRED` and enforcement stops. The app never keeps a rule "enabled" it cannot enforce.
- After a process kill or reboot an `ACTIVE` session is frozen as `PAUSED` at the last heartbeat; it is never auto-resumed.
- Restriction telemetry sent to the existing interruption API is `restriction:<type>:<package>`. Raw usage, screenshots, window text and installed-app lists are not uploaded.

## Data and security

- Session tokens live in Keystore-backed `EncryptedSharedPreferences`. The non-secure file cache refuses keys that look like tokens or secrets.
- The APK embeds only the Supabase URL, anon key and API URL. The config generator rejects service-role and LLM provider keys.
- File reads for attachments accept only `content://` and `file://` URIs, stream at most 8 MB, and the MIME type is sniffed from bytes, not the extension.
- `allowBackup=false`; release builds refuse to point at localhost.

## Billing

There is no Play Billing client. `UserSettings.subscription` from the backend is the only trusted tier. A local `isPro` flag is rejected. Until the backend publishes a purchase-verification endpoint, `features/entitlements/billing.ts` reports `not_available` and the Subscription screen shows the free plan with no purchase button. When billing ships, the purchase token must be verified server-side before any entitlement changes.
