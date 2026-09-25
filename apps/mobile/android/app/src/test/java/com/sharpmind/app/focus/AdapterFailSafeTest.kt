package com.sharpmind.app.focus

import org.junit.Assert.assertEquals
import org.junit.Test

class AdapterFailSafeTest {
    @Test
    fun instagramReelsRequireAPlayerSignal() {
        val adapter = InstagramAdapter()
        val nav = adapter.detect(UiSignal(adapter.packageName, "main", listOf("Reels"), listOf("Reels"), listOf("tab_reels")))
        assertEquals(DetectionSupport.ALLOWED, nav.support)
        val player = adapter.detect(UiSignal(adapter.packageName, "clips", emptyList(), listOf("Reel by Ada"), listOf("clips_viewer")))
        assertEquals(DetectionSupport.DETECTED, player.support)
    }

    @Test
    fun facebookWithoutHierarchyIsUnsupported() {
        val adapter = FacebookAdapter()
        val result = adapter.detect(UiSignal(adapter.packageName, null, emptyList(), emptyList(), emptyList()))
        assertEquals(DetectionSupport.UNSUPPORTED, result.support)
    }

    @Test
    fun genericAdapterDoesNotClaimSupport() {
        val result = GenericAccessibilityAdapter().detect(UiSignal("com.example.app", "Main", listOf("Reels"), emptyList(), emptyList()))
        assertEquals(DetectionSupport.UNSUPPORTED, result.support)
    }
}
