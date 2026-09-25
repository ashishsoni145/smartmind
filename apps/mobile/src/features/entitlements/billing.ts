/**
 * Boundary for a future Google Play Billing integration.
 *
 * Nothing here talks to Play, and nothing here can grant Pro. When billing ships, a
 * `BillingProvider` implementation will launch the Play purchase flow and hand the
 * purchase token to the backend, which verifies it with Google and becomes the only
 * source of truth for entitlements (see `resolveEntitlement`). Until the backend
 * publishes that endpoint the app reports `not_available` and shows nothing purchasable.
 */
export type BillingAvailability =
  | { status: 'not_available'; reason: 'backend_endpoint_missing' | 'provider_missing' }
  | { status: 'available' };

export type PurchaseHandoff = {
  /** Play purchase token that the backend must verify server-side. Never trusted locally. */
  purchaseToken: string;
  productId: string;
};

export interface BillingProvider {
  availability(): Promise<BillingAvailability>;
  /** Launches the Play purchase flow; resolves with the token to send to the backend. */
  purchase(productId: string): Promise<PurchaseHandoff>;
}

/** Whether the published backend exposes an endpoint that can verify a purchase. It does not. */
export const BACKEND_BILLING_ENDPOINT_PUBLISHED = false;

export function billingAvailability(provider: BillingProvider | null): Promise<BillingAvailability> {
  if (!BACKEND_BILLING_ENDPOINT_PUBLISHED) {
    return Promise.resolve({ status: 'not_available', reason: 'backend_endpoint_missing' });
  }
  if (!provider) {
    return Promise.resolve({ status: 'not_available', reason: 'provider_missing' });
  }
  return provider.availability();
}

export function describeBilling(availability: BillingAvailability): string {
  if (availability.status === 'available') {
    return 'Purchases are verified by the SharpMind server before any Pro feature unlocks.';
  }
  if (availability.reason === 'backend_endpoint_missing') {
    return 'In-app purchase is not available in this version: the server does not yet verify Play purchases, so the app cannot sell or unlock Pro.';
  }
  return 'In-app purchase is not available on this device.';
}
