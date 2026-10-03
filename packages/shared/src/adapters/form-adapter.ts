import type { ContactFormData, FeedbackFormData, FormResult } from '@sharpmind/types';

const STUB_DELAY_MS = 600;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function submitContactForm(data: ContactFormData): Promise<FormResult> {
  console.info('[ADAPTER STUB] submitContactForm:', data);
  await delay(STUB_DELAY_MS);
  return {
    success: true,
    message: 'Thank you for reaching out! We’ll get back to you within 48 hours.',
  };
}

export async function submitFeedbackForm(data: FeedbackFormData): Promise<FormResult> {
  console.info('[ADAPTER STUB] submitFeedbackForm:', data);
  await delay(STUB_DELAY_MS);
  return {
    success: true,
    message: 'Thanks for your feedback! It helps us improve SharpMind.',
  };
}

export async function subscribeNewsletter(email: string): Promise<FormResult> {
  console.info('[ADAPTER STUB] subscribeNewsletter:', { email });
  await delay(STUB_DELAY_MS);
  return {
    success: true,
    message: 'You’re on the list! We’ll keep you updated.',
  };
}
