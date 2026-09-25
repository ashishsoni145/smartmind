package com.sharpmind.app.permissions

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class PermissionLogicTest {
    @Test
    fun detectsRevocationWithoutInventingAGrant() {
        val previous = PermissionSnapshot(PermissionGrant.GRANTED, PermissionGrant.GRANTED, PermissionGrant.GRANTED)
        val current = PermissionSnapshot(PermissionGrant.DENIED, PermissionGrant.GRANTED, PermissionGrant.GRANTED)
        val found = PermissionLogic.detectRevocations(previous, current)
        assertEquals(1, found.size)
        assertEquals(PermissionKind.USAGE_ACCESS, found[0].kind)
        assertEquals(PermissionGrant.REVOKED, found[0].current)
    }

    @Test
    fun firstObservationIsNotARevocation() {
        val current = PermissionSnapshot(PermissionGrant.DENIED, PermissionGrant.DENIED, PermissionGrant.NOT_REQUESTED)
        assertTrue(PermissionLogic.detectRevocations(null, current).isEmpty())
    }

    @Test
    fun selectiveRulesRequireAccessibility() {
        val snapshot = PermissionSnapshot(PermissionGrant.GRANTED, PermissionGrant.DENIED, PermissionGrant.GRANTED)
        assertTrue(PermissionLogic.enforcementReady(snapshot, requiresAccessibility = false))
        assertFalse(PermissionLogic.enforcementReady(snapshot, requiresAccessibility = true))
    }
}
