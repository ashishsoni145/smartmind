import React, { useId } from 'react';
import styles from './Textarea.module.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export function Textarea({
  label,
  error,
  helperText,
  className = '',
  id: providedId,
  ...rest
}: TextareaProps) {
  const generatedId = useId();
  const inputId = providedId || generatedId;
  const helperId = `${inputId}-helper`;
  const errorId = `${inputId}-error`;

  const describedBy = [
    error ? errorId : null,
    helperText && !error ? helperId : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className={`${styles.field} ${error ? styles.hasError : ''} ${className}`}>
      <label htmlFor={inputId} className={styles.label}>
        {label}
        {rest.required && <span className={styles.required} aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={inputId}
        className={styles.textarea}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        rows={rest.rows ?? 4}
        {...rest}
      />
      {error && (
        <p id={errorId} className={styles.error} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperId} className={styles.helper}>
          {helperText}
        </p>
      )}
    </div>
  );
}
