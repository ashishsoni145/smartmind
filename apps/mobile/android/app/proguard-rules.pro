# SharpMind release keep rules. React Native AARs also ship consumer rules.

-keep class com.sharpmind.app.** { *; }
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }

-keepattributes *Annotation*, Signature, InnerClasses, EnclosingMethod

-keepclassmembers class * {
    @com.facebook.react.uimanager.annotations.ReactProp <methods>;
    @com.facebook.react.uimanager.annotations.ReactPropGroup <methods>;
}

-dontwarn com.facebook.react.**
-dontwarn org.bouncycastle.**
-dontwarn org.conscrypt.**
