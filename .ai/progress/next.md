# Next

- Confirm the Android GitHub Actions run is green and install the debug APK artifact. Kotlin tests and the APK were not executed in the sandbox.
- Add repository secrets: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`. For a Play AAB, also add `SHARPMIND_KEYSTORE_BASE64`, `SHARPMIND_KEYSTORE_PASSWORD`, `SHARPMIND_KEY_ALIAS`, and `SHARPMIND_KEY_PASSWORD`.
- If Play rejects the AccessibilityService, keep content rules unsupported. Do not hide the service or turn those rules into silent app blocks.
