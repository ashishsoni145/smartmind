import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '@/components/ui/Icon';
import styles from './TutorInputArea.module.css';

interface TutorInputAreaProps {
  onSendMessage: (content: string, imageUrl?: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export const TutorInputArea: React.FC<TutorInputAreaProps> = ({
  onSendMessage,
  isLoading,
  placeholder = 'Ask any conceptual doubt, request a Socratic clue, or attach rough work...',
}) => {
  const [content, setContent] = useState('');
  const [attachedImage, setAttachedImage] = useState<{ url: string; name: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [content]);

  const handleSend = () => {
    if ((!content.trim() && !attachedImage) || isLoading) return;
    onSendMessage(content.trim(), attachedImage?.url);
    setContent('');
    setAttachedImage(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAttachedImage({
          url: reader.result,
          name: file.name,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div
      className={`${styles.inputWrapper} ${isDragOver ? styles.dragActive : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="region"
      aria-label="Tutor Query Input"
    >
      {/* Attached Image Preview */}
      {attachedImage && (
        <div className={styles.previewContainer}>
          <div className={styles.thumbnailWrapper}>
            <img src={attachedImage.url} alt="Attached thumbnail" className={styles.thumbnail} />
          </div>
          <div className={styles.previewInfo}>
            <span className={styles.previewName}>{attachedImage.name}</span>
            <span className={styles.previewHint}>Image attached • Ready to analyze</span>
          </div>
          <button
            type="button"
            className={styles.removeImgBtn}
            onClick={() => setAttachedImage(null)}
            aria-label="Remove attached image"
            title="Remove image"
          >
            <Icon name="close" size="xs" />
          </button>
        </div>
      )}

      {/* Input controls */}
      <div className={styles.controlsRow}>
        <input
          type="file"
          ref={fileInputRef}
          className={styles.hiddenFileInput}
          accept="image/*"
          onChange={handleFileChange}
          aria-label="Upload handwritten solution or question diagram"
        />

        <button
          type="button"
          className={styles.attachBtn}
          onClick={() => fileInputRef.current?.click()}
          title="Attach image (question or rough work diagram)"
          aria-label="Attach image"
          disabled={isLoading}
        >
          <Icon name="image" size="sm" />
        </button>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          aria-label="Your academic doubt or prompt"
        />

        <button
          type="button"
          className={styles.sendBtn}
          onClick={handleSend}
          disabled={(!content.trim() && !attachedImage) || isLoading}
          title="Send query (Enter)"
          aria-label="Send message"
        >
          <Icon name="send" size="sm" />
        </button>
      </div>

      <div className={styles.footerHint}>
        <span>Press <strong>Enter</strong> to send, <strong>Shift + Enter</strong> for line break</span>
        <span>Drag & drop problem images or screenshots directly</span>
      </div>
    </div>
  );
};
