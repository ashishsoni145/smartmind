package com.sharpmind.app.bridge

import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.util.Base64
import com.facebook.react.bridge.ActivityEventListener
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.modules.core.DeviceEventManagerModule
import com.sharpmind.app.MainApplication
import com.sharpmind.app.codegen.NativeSharpMindAndroidSpec
import com.sharpmind.app.focus.FocusRuntime
import com.sharpmind.app.focus.FocusTransitionException
import com.sharpmind.app.focus.SupportedAppCatalog
import com.sharpmind.app.notifications.ReminderScheduler
import com.sharpmind.app.permissions.PermissionManager
import org.json.JSONArray
import org.json.JSONObject
import java.util.UUID

class SharpMindAndroidModule(reactContext: ReactApplicationContext) :
    NativeSharpMindAndroidSpec(reactContext),
    ActivityEventListener {

    private val listener: (String, String) -> Unit = { type, payload -> emit(type, payload) }
    private var imagePromise: Promise? = null

    init {
        reactContext.addActivityEventListener(this)
        runtime().addListener(listener)
    }

    override fun invalidate() {
        runtime().removeListener(listener)
        reactApplicationContext.removeActivityEventListener(this)
        super.invalidate()
    }

    override fun startFocusSession(configJson: String, promise: Promise) {
        try {
            val draft = FocusRuntime.parseDraft(configJson)
            val rules = JSONObject(configJson).optJSONArray("ruleIds")
            val ids = mutableListOf<String>()
            if (rules != null) {
                for (index in 0 until rules.length()) {
                    ids.add(rules.getString(index))
                }
            }
            val session = runtime().start(draft, ids)
            promise.resolve(FocusRuntime.sessionToJson(session).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun stopFocusSession(confirmStrict: Boolean, promise: Promise) {
        try {
            promise.resolve(FocusRuntime.sessionToJson(runtime().stop(confirmStrict)).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun cancelFocusSession(confirmStrict: Boolean, promise: Promise) {
        try {
            promise.resolve(FocusRuntime.sessionToJson(runtime().cancel(confirmStrict)).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun pauseFocusSession(promise: Promise) {
        try {
            promise.resolve(FocusRuntime.sessionToJson(runtime().pause()).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun resumeFocusSession(promise: Promise) {
        try {
            promise.resolve(FocusRuntime.sessionToJson(runtime().resume()).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun getFocusStatus(promise: Promise) {
        promise.resolve(runtime().statusJson())
    }

    override fun linkBackendSession(sessionId: String, promise: Promise) {
        try {
            promise.resolve(FocusRuntime.sessionToJson(runtime().linkBackendSession(sessionId)).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun retryFocusPermissions(promise: Promise) {
        try {
            promise.resolve(FocusRuntime.sessionToJson(runtime().retryPermissions()).toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun getRequiredPermissions(promise: Promise) {
        val manager = PermissionManager(reactApplicationContext)
        val snapshot = manager.snapshot()
        promise.resolve(
            JSONObject()
                .put("usageAccess", snapshot.usageAccess.name)
                .put("accessibility", snapshot.accessibility.name)
                .put("notifications", snapshot.notifications.name)
                .put("usageAccessEnabled", manager.isUsageAccessEnabled())
                .put("accessibilityEnabled", manager.isAccessibilityEnabled())
                .put("notificationsEnabled", manager.isNotificationEnabled())
                .toString(),
        )
    }

    override fun openAccessibilitySettings(promise: Promise) {
        PermissionManager(reactApplicationContext).openAccessibilitySettings()
        promise.resolve("opened")
    }

    override fun openUsageAccessSettings(promise: Promise) {
        PermissionManager(reactApplicationContext).openUsageAccessSettings()
        promise.resolve("opened")
    }

    override fun openNotificationSettings(promise: Promise) {
        PermissionManager(reactApplicationContext).openNotificationSettings()
        promise.resolve("opened")
    }

    override fun isAccessibilityEnabled(promise: Promise) {
        promise.resolve(PermissionManager(reactApplicationContext).isAccessibilityEnabled())
    }

    override fun isUsageAccessEnabled(promise: Promise) {
        promise.resolve(PermissionManager(reactApplicationContext).isUsageAccessEnabled())
    }

    override fun getInstalledSupportedApps(promise: Promise) {
        try {
            val pm = reactApplicationContext.packageManager
            val installed = mutableSetOf<String>()
            val intent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_LAUNCHER)
            pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY).forEach { info ->
                installed.add(info.activityInfo.packageName)
            }
            val array = JSONArray()
            SupportedAppCatalog.adapters.forEach { adapter ->
                array.put(
                    JSONObject()
                        .put("packageName", adapter.packageName)
                        .put("label", adapter.id)
                        .put("installed", installed.contains(adapter.packageName) || isInstalled(pm, adapter.packageName))
                        .put("selectiveTargets", JSONArray(adapter.supportedTargets.toList()))
                        .put("supportsAppBlock", true)
                        .put("adapterId", adapter.id),
                )
            }
            var added = 0
            pm.queryIntentActivities(intent, PackageManager.MATCH_DEFAULT_ONLY).forEach { info ->
                if (added >= 180) {
                    return@forEach
                }
                val packageName = info.activityInfo.packageName
                if (SupportedAppCatalog.adapterFor(packageName) != null || packageName == reactApplicationContext.packageName) {
                    return@forEach
                }
                val label = info.loadLabel(pm)?.toString() ?: packageName
                array.put(
                    JSONObject()
                        .put("packageName", packageName)
                        .put("label", label)
                        .put("installed", true)
                        .put("selectiveTargets", JSONArray())
                        .put("supportsAppBlock", true)
                        .put("adapterId", "generic"),
                )
                added += 1
            }
            promise.resolve(array.toString())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun setRestrictionRules(rulesJson: String, promise: Promise) {
        try {
            runtime().setRules(FocusRuntime.parseRules(rulesJson))
            promise.resolve(runtime().rulesJson())
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun getActiveRestrictions(promise: Promise) {
        val array = JSONArray()
        runtime().recentEvents().forEach { event ->
            array.put(
                JSONObject()
                    .put("id", event.id)
                    .put("packageName", event.packageName)
                    .put("ruleId", event.ruleId)
                    .put("ruleType", event.ruleType)
                    .put("target", event.target)
                    .put("support", event.support)
                    .put("atEpochMs", event.atEpochMs),
            )
        }
        promise.resolve(array.toString())
    }

    override fun secureGet(key: String, promise: Promise) {
        try {
            val value = SecureStore.preferences(reactApplicationContext).getString(key, null)
            promise.resolve(value ?: "")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun secureSet(key: String, value: String, promise: Promise) {
        try {
            SecureStore.preferences(reactApplicationContext).edit().putString(key, value).apply()
            promise.resolve("ok")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun secureDelete(key: String, promise: Promise) {
        try {
            SecureStore.preferences(reactApplicationContext).edit().remove(key).apply()
            promise.resolve("ok")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun cacheRead(key: String, promise: Promise) {
        try {
            promise.resolve(AppCache.read(reactApplicationContext, key) ?: "")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun cacheWrite(key: String, value: String, promise: Promise) {
        try {
            AppCache.write(reactApplicationContext, key, value)
            promise.resolve("ok")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun cacheRemove(key: String, promise: Promise) {
        try {
            AppCache.remove(reactApplicationContext, key)
            promise.resolve("ok")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun scheduleReminder(id: String, title: String, body: String, triggerAtEpochMs: Double, promise: Promise) {
        try {
            ReminderScheduler(reactApplicationContext).schedule(id, title, body, triggerAtEpochMs.toLong())
            promise.resolve("scheduled")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun cancelReminder(id: String, promise: Promise) {
        try {
            ReminderScheduler(reactApplicationContext).cancel(id)
            promise.resolve("cancelled")
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun pickImage(promise: Promise) {
        val activity = reactApplicationContext.currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "Image picking needs a foreground activity.")
            return
        }
        imagePromise = promise
        val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
            type = "image/*"
            addCategory(Intent.CATEGORY_OPENABLE)
        }
        activity.startActivityForResult(intent, IMAGE_REQUEST)
    }

    override fun readFileBase64(uri: String, promise: Promise) {
        try {
            val parsed = Uri.parse(uri)
            if (parsed.scheme != "content" && parsed.scheme != "file") {
                throw IllegalArgumentException("unsupported_uri_scheme")
            }
            val stream = reactApplicationContext.contentResolver.openInputStream(parsed)
                ?: throw IllegalArgumentException("unreadable_uri")
            // Read at most MAX_IMAGE_BYTES + 1 so an oversized file is rejected without buffering it fully.
            val buffer = java.io.ByteArrayOutputStream()
            val chunk = ByteArray(64 * 1024)
            var total = 0
            var tooLarge = false
            stream.use { input ->
                while (true) {
                    val read = input.read(chunk)
                    if (read <= 0) break
                    total += read
                    if (total > MAX_IMAGE_BYTES) {
                        tooLarge = true
                        break
                    }
                    buffer.write(chunk, 0, read)
                }
            }
            if (tooLarge) {
                promise.reject("FILE_TOO_LARGE", "Image exceeds 8 MB.")
                return
            }
            promise.resolve(Base64.encodeToString(buffer.toByteArray(), Base64.NO_WRAP))
        } catch (error: Exception) {
            reject(promise, error)
        }
    }

    override fun addListener(eventName: String) = Unit

    override fun removeListeners(count: Double) = Unit

    override fun onActivityResult(activity: Activity, requestCode: Int, resultCode: Int, data: Intent?) {
        if (requestCode != IMAGE_REQUEST) {
            return
        }
        val pending = imagePromise
        imagePromise = null
        if (pending == null) {
            return
        }
        val uri = data?.data
        if (resultCode != Activity.RESULT_OK || uri == null) {
            pending.resolve("")
            return
        }
        pending.resolve(uri.toString())
    }

    override fun onNewIntent(intent: Intent) = Unit

    private fun runtime(): FocusRuntime {
        return (reactApplicationContext.applicationContext as MainApplication).focusRuntime
    }

    private fun emit(type: String, payload: String) {
        if (!reactApplicationContext.hasActiveReactInstance()) {
            return
        }
        val body = Arguments.createMap().apply {
            putString("type", type)
            putString("payload", payload)
        }
        reactApplicationContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(EVENT_NAME, body)
    }

    private fun reject(promise: Promise, error: Exception) {
        val code = if (error is FocusTransitionException) error.message ?: "FOCUS_ERROR" else "NATIVE_ERROR"
        promise.reject(code, error.message ?: error.javaClass.simpleName)
    }

    private fun isInstalled(pm: PackageManager, packageName: String): Boolean {
        return try {
            pm.getPackageInfo(packageName, 0)
            true
        } catch (_: PackageManager.NameNotFoundException) {
            false
        }
    }

    companion object {
        const val NAME = "SharpMindAndroid"
        const val EVENT_NAME = "SharpMindAndroidEvent"
        private const val IMAGE_REQUEST = 4816
        private const val MAX_IMAGE_BYTES = 8 * 1024 * 1024
    }
}
