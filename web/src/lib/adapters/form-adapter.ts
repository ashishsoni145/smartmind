/**
 * PLACEHOLDER ADAPTER — Phase 01 Part 02
 *
 * Every public-site form submission routes through this adapter.
 * When the backend exists (Phase 02+), replace each function body
 * with a real API call. The function signatures are the contract.
 *
 * Current behaviour:
 *  - Logs the payload to console with an [ADAPTER STUB] prefix.
 *  - Returns { success: true, message: '...' } after a short delay.
 *  - No network requests are made.
 */

import type { ContactFormData, FeedbackFormData, FormResult } from '@/lib/types/forms';

const STUB_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Submit the Contact form.
 * Replace body with: POST /api/contact { name, email, subject, message }
 */
export async function submitContactForm(data: ContactFormData): Promise<FormResult> {
  console.info('[ADAPTER STUB] submitContactForm:', data);
  await delay(STUB_DELAY_MS);
  return {
    success: true,
    message:
      'Thank you for reaching out! We\u2019ll get back to you within 48 hours.',
  };
}

/**
 * Submit the Feedback form.
 * Replace body with: POST /api/feedback { rating, category, message, email? }
 */
export async function submitFeedbackForm(data: FeedbackFormData): Promise<FormResult> {
  console.info('[ADAPTER STUB] submitFeedbackForm:', data);
  await delay(STUB_DELAY_MS);
  return {
    success: true,
    message: 'Thanks for your feedback! It helps us improve SharpMind.',
  };
}

/**
 * Subscribe to the newsletter.
 * Replace body with: POST /api/newsletter { email }
 */
export async function subscribeNewsletter(email: string): Promise<FormResult> {
  console.info('[ADAPTER STUB] subscribeNewsletter:', { email });
  await delay(STUB_DELAY_MS);
  return {
    success: true,
    message: 'You\u2019re on the list! We\u2019ll keep you updated.',
  };
}
