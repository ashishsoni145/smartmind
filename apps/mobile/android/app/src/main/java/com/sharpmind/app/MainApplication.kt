package com.sharpmind.app

import android.app.Application
import com.facebook.react.PackageList
import com.facebook.react.ReactApplication
import com.facebook.react.ReactHost
import com.facebook.react.ReactNativeApplicationEntryPoint.loadReactNative
import com.facebook.react.defaults.DefaultReactHost.getDefaultReactHost
import com.sharpmind.app.bridge.SharpMindAndroidPackage
import com.sharpmind.app.focus.FocusRuntime
import com.sharpmind.app.notifications.NotificationChannels

class MainApplication : Application(), ReactApplication {
    val focusRuntime: FocusRuntime by lazy { FocusRuntime(this) }

    override val reactHost: ReactHost by lazy {
        getDefaultReactHost(
            context = applicationContext,
            packageList = PackageList(this).packages.apply {
                add(SharpMindAndroidPackage())
            },
        )
    }

    override fun onCreate() {
        super.onCreate()
        loadReactNative(this)
        NotificationChannels.ensure(this)
    }
}
