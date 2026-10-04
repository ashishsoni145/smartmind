export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface FeedbackFormData {
  rating: number;
  category: 'bug' | 'feature' | 'content' | 'general';
  message: string;
  email?: string;
}

export interface NewsletterData {
  email: string;
}

export interface FormResult {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
}
