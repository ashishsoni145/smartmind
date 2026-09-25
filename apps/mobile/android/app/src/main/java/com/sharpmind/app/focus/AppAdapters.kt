package com.sharpmind.app.focus

/**
 * Adapters identify distracting surfaces from accessibility identifiers, not coordinates.
 * A navigation label such as "Shorts" is not enough: that label is present during ordinary videos.
 * If the hierarchy does not expose a player-level signal, detection fails safe as UNSUPPORTED or ALLOWED.
 */
internal object AdapterSignals {
    fun normalize(value: String): String = value.lowercase()

    fun anyContains(values: List<String>, needles: List<String>): Boolean {
        return values.any { value ->
            val normalized = normalize(value)
            needles.any { needle -> normalized.contains(needle) }
        }
    }
}

class YouTubeAdapter : AppRestrictionAdapter {
    override val id: String = "youtube"
    override val packageName: String = "com.google.android.youtube"
    override val supportedTargets: Set<String> = setOf("shorts")

    override fun detect(signal: UiSignal): AdapterDetection {
        if (signal.packageName != packageName) {
            return AdapterDetection(id, DetectionSupport.NOT_THIS_APP, null, "package_mismatch")
        }
        if (signal.viewIds.isEmpty() && signal.contentDescriptions.isEmpty()) {
            return AdapterDetection(id, DetectionSupport.UNSUPPORTED, "shorts", "empty_hierarchy")
        }
        val playerIds = listOf("reel_watch", "shorts_player", "reel_player", "shorts_shelf")
        val playerDescriptions = listOf("shorts player", "short video")
        val detected = AdapterSignals.anyContains(signal.viewIds, playerIds) ||
            AdapterSignals.anyContains(signal.contentDescriptions, playerDescriptions)
        return if (detected) {
            AdapterDetection(id, DetectionSupport.DETECTED, "shorts", "shorts_player_signal")
        } else {
            AdapterDetection(id, DetectionSupport.ALLOWED, "shorts", "no_shorts_player_signal")
        }
    }
}

class InstagramAdapter : AppRestrictionAdapter {
    override val id: String = "instagram"
    override val packageName: String = "com.instagram.android"
    override val supportedTargets: Set<String> = setOf("reels")

    override fun detect(signal: UiSignal): AdapterDetection {
        if (signal.packageName != packageName) {
            return AdapterDetection(id, DetectionSupport.NOT_THIS_APP, null, "package_mismatch")
        }
        if (signal.viewIds.isEmpty() && signal.contentDescriptions.isEmpty()) {
            return AdapterDetection(id, DetectionSupport.UNSUPPORTED, "reels", "empty_hierarchy")
        }
        val playerIds = listOf("clips_viewer", "reel_viewer", "clips_video", "reel_player")
        val playerDescriptions = listOf("reel by", "reels player", "clip by")
        val detected = AdapterSignals.anyContains(signal.viewIds, playerIds) ||
            AdapterSignals.anyContains(signal.contentDescriptions, playerDescriptions)
        return if (detected) {
            AdapterDetection(id, DetectionSupport.DETECTED, "reels", "reels_player_signal")
        } else {
            AdapterDetection(id, DetectionSupport.ALLOWED, "reels", "no_reels_player_signal")
        }
    }
}

class FacebookAdapter : AppRestrictionAdapter {
    override val id: String = "facebook"
    override val packageName: String = "com.facebook.katana"
    override val supportedTargets: Set<String> = setOf("reels")

    override fun detect(signal: UiSignal): AdapterDetection {
        if (signal.packageName != packageName) {
            return AdapterDetection(id, DetectionSupport.NOT_THIS_APP, null, "package_mismatch")
        }
        if (signal.viewIds.isEmpty() && signal.contentDescriptions.isEmpty()) {
            return AdapterDetection(id, DetectionSupport.UNSUPPORTED, "reels", "empty_hierarchy")
        }
        val playerIds = listOf("reels_viewer", "reel_viewer", "fb_reels_player")
        val playerDescriptions = listOf("reels player", "reel by")
        val detected = AdapterSignals.anyContains(signal.viewIds, playerIds) ||
            AdapterSignals.anyContains(signal.contentDescriptions, playerDescriptions)
        return if (detected) {
            AdapterDetection(id, DetectionSupport.DETECTED, "reels", "facebook_reels_player_signal")
        } else {
            AdapterDetection(id, DetectionSupport.ALLOWED, "reels", "no_reels_player_signal")
        }
    }
}

class GenericAccessibilityAdapter : AppRestrictionAdapter {
    override val id: String = "generic"
    override val packageName: String = "*"
    override val supportedTargets: Set<String> = emptySet()

    override fun detect(signal: UiSignal): AdapterDetection {
        return AdapterDetection(
            id,
            DetectionSupport.UNSUPPORTED,
            null,
            "no_app_adapter:${signal.packageName}",
        )
    }
}

object SupportedAppCatalog {
    val adapters: List<AppRestrictionAdapter> = listOf(
        YouTubeAdapter(),
        InstagramAdapter(),
        FacebookAdapter(),
    )

    fun adapterFor(packageName: String): AppRestrictionAdapter? {
        return adapters.firstOrNull { it.packageName == packageName }
    }
}
