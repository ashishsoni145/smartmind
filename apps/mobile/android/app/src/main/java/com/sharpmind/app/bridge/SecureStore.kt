package com.sharpmind.app.bridge

import android.content.Context
import android.content.SharedPreferences
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import java.io.File

object SecureStore {
    private const val FILE = "sharpmind_secure"

    fun preferences(context: Context): SharedPreferences {
        val masterKey = MasterKey.Builder(context)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()
        return EncryptedSharedPreferences.create(
            context,
            FILE,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM,
        )
    }
}

object AppCache {
    private const val MAX_VALUE_CHARS = 1_500_000

    fun read(context: Context, key: String): String? {
        rejectSecretKey(key)
        val file = file(context, key)
        if (!file.exists()) {
            return null
        }
        return file.readText()
    }

    fun write(context: Context, key: String, value: String) {
        rejectSecretKey(key)
        if (value.length > MAX_VALUE_CHARS) {
            throw IllegalArgumentException("cache_too_large")
        }
        file(context, key).writeText(value)
    }

    fun remove(context: Context, key: String) {
        rejectSecretKey(key)
        file(context, key).delete()
    }

    private fun rejectSecretKey(key: String) {
        val normalized = key.lowercase()
        if (normalized.startsWith("secure") || normalized.contains("token") || normalized.contains("password") || normalized.contains("secret")) {
            throw IllegalArgumentException("cache_refuses_secrets")
        }
    }

    private fun file(context: Context, key: String): File {
        val safe = key.replace(Regex("[^A-Za-z0-9._-]"), "_").take(80)
        val dir = File(context.filesDir, "cache").apply { mkdirs() }
        return File(dir, safe)
    }
}
