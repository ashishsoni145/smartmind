package com.sharpmind.app

import android.content.ComponentName
import android.content.pm.PackageManager
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.sharpmind.app.accessibility.SharpMindAccessibilityService
import com.sharpmind.app.services.FocusForegroundService
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotNull
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class FocusServiceLifecycleTest {
    @Test
    fun accessibilityServiceIsDeclaredAndNotExported() {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        val info = context.packageManager.getServiceInfo(
            ComponentName(context, SharpMindAccessibilityService::class.java),
            PackageManager.GET_META_DATA,
        )
        assertEquals("com.sharpmind.app.accessibility.SharpMindAccessibilityService", info.name)
        assertFalse(info.exported)
        assertNotNull(info.metaData)
    }

    @Test
    fun focusServiceDeclaresSpecialUse() {
        val context = InstrumentationRegistry.getInstrumentation().targetContext
        val info = context.packageManager.getServiceInfo(
            ComponentName(context, FocusForegroundService::class.java),
            PackageManager.GET_META_DATA,
        )
        assertFalse(info.exported)
        assertEquals(android.content.pm.ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE, info.foregroundServiceType)
    }
}
