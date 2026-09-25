export type EntitlementSource = 'server' | 'unavailable';

export type EntitlementSnapshot = {
  source: EntitlementSource;
  tier: string | null;
  status: string | null;
  message: string;
  trusted: boolean;
};

const LOCAL_FLAGS = ['isPro', 'is_pro', 'premium', 'tier'];

/**
 * Premium status is never read from local storage. The published backend does not
 * yet expose a billing authority, so the client reports that honestly.
 */
export function resolveEntitlement(serverPayload: unknown): EntitlementSnapshot {
  if (!serverPayload || typeof serverPayload !== 'object') {
    return unavailable();
  }
  const record = serverPayload as Record<string, unknown>;
  const subscription = record.subscription;
  if (!subscription || typeof subscription !== 'object') {
    return unavailable();
  }
  const sub = subscription as Record<string, unknown>;
  const tier = typeof sub.tier === 'string' ? sub.tier : null;
  const status = typeof sub.status === 'string' ? sub.status : null;
  if (!tier || !status) {
    return unavailable();
  }
  return {
    source: 'server',
    tier,
    status,
    trusted: true,
    message: `Server entitlement: ${tier} (${status}).`,
  };
}

export function unavailable(): EntitlementSnapshot {
  return {
    source: 'unavailable',
    tier: null,
    status: null,
    trusted: false,
    message: 'SharpMind Pro is issued by the server. This device does not store or grant premium status, and the billing endpoint is not published yet.',
  };
}

export function rejectLocalPremiumFlag(storage: Record<string, unknown>): boolean {
  return LOCAL_FLAGS.some((key) => storage[key] === true || storage[key] === 'true');
}
