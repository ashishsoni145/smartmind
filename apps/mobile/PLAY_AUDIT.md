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
- The APK embeds only the Supabase URL, the Supabase anon key and the API URL. All three are public values; the anon key is the publishable key Supabase intends clients to hold, and Row Level Security (enabled on 26/26 tables) is the access control. The config generator decodes any Supabase JWT it is given and rejects one whose `role` claim is `service_role`, and it rejects provider-key shapes (`sk-or-v1-`, `sk-ant-`, `AIza…`, `gsk_…`, `sb_secret_`), PEM private key blocks and connection strings with embedded passwords.
- Server-only credentials — provider keys, `SUPABASE_SERVICE_ROLE_KEY`, database credentials, signing material, Razorpay/Twilio/MSG91 secrets — are never read by any mobile build step. They live only in the backend environment and in GitHub Actions secrets.
- File reads for attachments accept only `content://` and `file://` URIs, stream at most 8 MB, and the MIME type is sniffed from bytes, not the extension.
- `allowBackup=false`.
- Distributed builds (`qaStandalone`, `release`) refuse to point at localhost, `10.0.2.2`, a loopback or private/LAN address, a `.local`/`.internal` host, or any non-HTTPS URL. The build fails with the name of the missing non-secret variable rather than degrading. `usesCleartextTraffic` is `false` for both.
- The build machine's LAN IPv4, which the React Native Gradle plugin would otherwise write into `res/values` as `react_native_dev_server_ip`, is pinned to `0.0.0.0` for every non-debug build so no developer-machine address ships.
- There is no fallback behaviour of any kind: no mock AI reply, no invented score, mastery, readiness or entitlement, no fake subscription, no hard-coded account. When the backend is unreachable the UI shows a real network error.

## Artifact audit

Every APK and AAB produced by CI is scanned by `apps/mobile/scripts/security-audit.mjs` before it is
uploaded. It verifies that the React Native bundle is inside the artifact and is Hermes bytecode,
that the configured production API URL really is in the bundle, that no developer host is the app's
own API URL and none is baked into the resource table, that no credential shape appears in the
bundle, DEX, resources, manifest, native libraries or assets, and that a distributed artifact is not
signed with the Android debug certificate.

Findings are printed masked, so the audit is safe in public CI logs, and intentionally public values
are allowlisted rather than reported. `audit:selftest` plants real secrets into synthetic APK/AAB
fixtures and asserts they are caught, so a green audit cannot mean the scanner never ran. The audit
report is uploaded next to each artifact
(`sharpmind-android-qa-audit`, `sharpmind-android-release-audit`).

## Billing

There is no Play Billing client. `UserSettings.subscription` from the backend is the only trusted tier. A local `isPro` flag is rejected. Until the backend publishes a purchase-verification endpoint, `features/entitlements/billing.ts` reports `not_available` and the Subscription screen shows the free plan with no purchase button. When billing ships, the purchase token must be verified server-side before any entitlement changes.

## Pre-release checklist

The go/no-go list for a Play submission. Items marked **CI** are enforced by `.github/workflows/android.yml`
and cannot be skipped; items marked **human** cannot be automated and must be signed off by a person.

### Configuration

- [ ] **CI** `verify` green: mobile/web/backend typecheck, Jest, build-script tests, `audit:selftest`, `audit:source`.
- [ ] **CI** `check:config --app-env release` passes, i.e. `SHARPMIND_API_URL` (or the committed
      `config/production.json`) is an HTTPS, non-developer URL and `SHARPMIND_SUPABASE_ANON_KEY` is present.
- [ ] **human** The Supabase key that will ship has been decoded and its JWT `role` claim is `anon`.
      Anything else is rejected by the build — do not work around it.
- [ ] **human** `config/production.json` points at the *production* backend, not a preview deployment.

### Artifact

- [ ] **CI** `android-debug` green: Kotlin unit tests pass and the debug APK contains no credential shape.
- [ ] **CI** `android-qa` green: `assets/index.android.bundle` is inside the APK, so the app cannot need Metro.
- [ ] **CI** `android-release` green: `base/assets/index.android.bundle` is inside the AAB, the AAB carries a
      signing certificate that is **not** the Android debug certificate, and `audit:artifact` is clean.
- [ ] **human** `sharpmind-android-release-audit` downloaded and read, not just seen to be green.
- [ ] **human** `versionName` bumped; `versionCode` (= `run_number + SHARPMIND_VERSION_CODE_OFFSET`) is higher
      than every previously uploaded build.

### Signing

- [ ] **human** `SHARPMIND_KEYSTORE_BASE64`, `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`,
      `SHARPMIND_KEY_PASSWORD` are set in the `production` environment.
- [ ] **human** The upload keystore exists **only** in CI secrets and in an offline backup. It is not in the
      repository, not in a local `.env`, and not in chat. Losing it means losing the app's Play identity.

### Physical device (cannot be automated — see `README.md` → "Physical-device test")

- [ ] **human** QA APK installed on real hardware from the Actions artifact, with the development machine
      switched off, Metro stopped and USB unplugged before first launch.
- [ ] **human** No "Could not connect to development server" dialog appears.
- [ ] **human** Full flow walked: sign-in → onboarding → dashboard → study → tutor → tests → revision →
      mistakes → analytics → notifications → Focus Mode → kill and reopen (session persists).
- [ ] **human** With device data off, the app shows a real network error — never invented data — and Retry
      recovers when data returns.
- [ ] **human** Focus Mode enforcement verified against the actual rules on the device, including permission
      revocation mid-session (`PERMISSION_REQUIRED`) and behaviour after a reboot.

### Play Console

- [ ] **human** Special-use foreground service, AccessibilityService and usage-access declarations completed
      in the Play Console, matching the wording in this file. Do not rebrand or hide the accessibility service
      to avoid a declaration.
- [ ] **human** Data safety form matches reality: no window text, no installed-app list, no screenshots, no raw
      usage data leaves the device.
- [ ] **human** The AAB is uploaded by a person. Nothing in this repository publishes to Play automatically.

### Known non-blocking items

- [ ] Rate limiting is process-local. On Vercel serverless it is per-instance, so it is a best-effort abuse
      brake, not a hard quota. The authoritative per-student budget is the AI token budget in the backend.
- [ ] `apps/web/src/lib/adapters/auth/local-auth-adapter.ts` ships hardcoded demo accounts with the password
      `Password123!` and the login page advertises them. This is web-only and is **not** in the Android bundle,
      but it must be removed before the web app carries real student data.
