package com.sharpmind.app.permissions

enum class PermissionKind {
    USAGE_ACCESS,
    ACCESSIBILITY,
    NOTIFICATIONS,
}

enum class PermissionGrant {
    GRANTED,
    DENIED,
    NOT_REQUESTED,
    REVOKED,
    UNKNOWN,
}

data class PermissionSnapshot(
    val usageAccess: PermissionGrant,
    val accessibility: PermissionGrant,
    val notifications: PermissionGrant,
)

data class Revocation(
    val kind: PermissionKind,
    val previous: PermissionGrant,
    val current: PermissionGrant,
)

object PermissionLogic {
    fun detectRevocations(previous: PermissionSnapshot?, current: PermissionSnapshot): List<Revocation> {
        if (previous == null) {
            return emptyList()
        }
        val found = mutableListOf<Revocation>()
        compare(PermissionKind.USAGE_ACCESS, previous.usageAccess, current.usageAccess)?.let { found.add(it) }
        compare(PermissionKind.ACCESSIBILITY, previous.accessibility, current.accessibility)?.let { found.add(it) }
        compare(PermissionKind.NOTIFICATIONS, previous.notifications, current.notifications)?.let { found.add(it) }
        return found
    }

    fun enforcementReady(snapshot: PermissionSnapshot, requiresAccessibility: Boolean): Boolean {
        if (snapshot.usageAccess != PermissionGrant.GRANTED) {
            return false
        }
        if (snapshot.notifications == PermissionGrant.DENIED || snapshot.notifications == PermissionGrant.REVOKED) {
            return false
        }
        if (requiresAccessibility && snapshot.accessibility != PermissionGrant.GRANTED) {
            return false
        }
        return true
    }

    private fun compare(kind: PermissionKind, previous: PermissionGrant, current: PermissionGrant): Revocation? {
        val wasGranted = previous == PermissionGrant.GRANTED
        val nowMissing = current == PermissionGrant.DENIED || current == PermissionGrant.REVOKED || current == PermissionGrant.NOT_REQUESTED
        if (wasGranted && nowMissing) {
            return Revocation(kind, previous, PermissionGrant.REVOKED)
        }
        return null
    }
}
