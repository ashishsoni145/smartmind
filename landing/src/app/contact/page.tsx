'use client';

import { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { submitContactForm, submitFeedbackForm } from '@/lib/adapters/form-adapter';
import type { ContactFormData, FeedbackFormData } from '@/lib/types/forms';
import styles from './page.module.css';

function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '', email: '', subject: '', message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!formData.name.trim()) e.name = 'Name is required.';
    if (!formData.email.trim()) e.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'Enter a valid email.';
    if (!formData.subject.trim()) e.subject = 'Subject is required.';
    if (!formData.message.trim()) e.message = 'Message is required.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus('loading');
    try {
      const result = await submitContactForm(formData);
      setStatus(result.success ? 'success' : 'error');
      setResultMessage(result.message);
      if (result.success) setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setStatus('error');
      setResultMessage('Something went wrong. Please try again.');
    }
  };

  const update = (field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Contact form">
      <Input label="Name" required value={formData.name} error={errors.name}
        onChange={(e) => update('name', e.target.value)} placeholder="Your name" />
      <Input label="Email" type="email" required value={formData.email} error={errors.email}
        onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" />
      <Input label="Subject" required value={formData.subject} error={errors.subject}
        onChange={(e) => update('subject', e.target.value)} placeholder="What is this about?" />
      <Textarea label="Message" required value={formData.message} error={errors.message}
        onChange={(e) => update('message', e.target.value)} placeholder="Your message..." rows={5} />
      <Button type="submit" variant="primary" size="lg" fullWidth loading={status === 'loading'}>
        Send Message
      </Button>
      {(status === 'success' || status === 'error') && (
        <p className={status === 'success' ? styles.success : styles.error} role="status">
          {resultMessage}
        </p>
      )}
    </form>
  );
}

function FeedbackForm() {
  const [formData, setFormData] = useState<FeedbackFormData>({
    rating: 0, category: 'general', message: '', email: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [resultMessage, setResultMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.message.trim()) return;
    setStatus('loading');
    try {
      const result = await submitFeedbackForm(formData);
      setStatus(result.success ? 'success' : 'error');
      setResultMessage(result.message);
      if (result.success) setFormData({ rating: 0, category: 'general', message: '', email: '' });
    } catch {
      setStatus('error');
      setResultMessage('Something went wrong.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate aria-label="Feedback form">
      {/* Rating */}
      <fieldset className={styles.ratingField}>
        <legend className={styles.ratingLegend}>How would you rate your experience?</legend>
        <div className={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star} type="button"
              className={`${styles.star} ${star <= formData.rating ? styles.starActive : ''}`}
              onClick={() => setFormData((p) => ({ ...p, rating: star }))}
              aria-label={`Rate ${star} out of 5`}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      {/* Category */}
      <div className={styles.selectField}>
        <label htmlFor="feedback-category" className={styles.selectLabel}>Category</label>
        <select
          id="feedback-category"
          value={formData.category}
          onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value as FeedbackFormData['category'] }))}
          className={styles.select}
        >
          <option value="general">General Feedback</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="content">Content Issue</option>
        </select>
      </div>

      <Textarea label="Your feedback" required value={formData.message}
        onChange={(e) => setFormData((p) => ({ ...p, message: e.target.value }))}
        placeholder="Tell us what you think..." rows={4} />
      <Input label="Email (optional)" type="email" value={formData.email ?? ''}
        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
        placeholder="you@example.com" helperText="So we can follow up if needed." />
      <Button type="submit" variant="primary" size="lg" fullWidth loading={status === 'loading'}>
        Send Feedback
      </Button>
      {(status === 'success' || status === 'error') && (
        <p className={status === 'success' ? styles.success : styles.error} role="status">
          {resultMessage}
        </p>
      )}
    </form>
  );
}

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<'contact' | 'feedback'>('contact');

  return (
    <>
      <section className={`${styles.hero} section`} aria-labelledby="contact-heading">
        <div className={styles.heroGlow} aria-hidden="true" />
        <div className="container">
          <SectionHeading
            title="Get in Touch"
            subtitle="Have a question, suggestion, or just want to say hello? We'd love to hear from you."
            badge="Contact"
            as="h1"
          />
        </div>
      </section>

      <section className="section">
        <div className={`container ${styles.formContainer}`}>
          {/* Tabs */}
          <div className={styles.tabs} role="tablist" aria-label="Form type">
            <button
              role="tab"
              aria-selected={activeTab === 'contact'}
              className={`${styles.tab} ${activeTab === 'contact' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('contact')}
            >
              Contact Us
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'feedback'}
              className={`${styles.tab} ${activeTab === 'feedback' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              Send Feedback
            </button>
          </div>

          {/* Form */}
          <div className={styles.formCard}>
            {activeTab === 'contact' ? <ContactForm /> : <FeedbackForm />}
          </div>

          {/* Alternative contact */}
          <div className={styles.altContact}>
            <p>You can also reach us at <a href="mailto:hello@sharpmind.app" className={styles.emailLink}>hello@sharpmind.app</a></p>
          </div>
        </div>
      </section>
    </>
  );
}
