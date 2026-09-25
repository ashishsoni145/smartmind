package com.sharpmind.app.bridge

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class SharpMindAndroidPackage : BaseReactPackage() {
    override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
        return if (name == SharpMindAndroidModule.NAME) {
            SharpMindAndroidModule(reactContext)
        } else {
            null
        }
    }

    override fun getReactModuleInfoProvider(): ReactModuleInfoProvider {
        return ReactModuleInfoProvider {
            mapOf(
                SharpMindAndroidModule.NAME to ReactModuleInfo(
                    SharpMindAndroidModule.NAME,
                    SharpMindAndroidModule::class.java.name,
                    false,
                    false,
                    false,
                    true,
                ),
            )
        }
    }
}
