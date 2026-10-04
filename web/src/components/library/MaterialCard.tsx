import React from 'react';
import type { CurriculumMaterial } from '@/lib/types/curriculum';
import { Icon, IconName } from '@/components/ui/Icon';
import styles from './MaterialCard.module.css';

interface MaterialCardProps {
  material: CurriculumMaterial;
  onOpen: (material: CurriculumMaterial) => void;
  onDownload?: (material: CurriculumMaterial) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({
  material,
  onOpen,
  onDownload,
}) => {
  const getTypeBadge = () => {
    switch (material.fileType) {
      case 'pdf':
      case 'ncert_reference':
        return {
          label: 'PDF Textbook',
          icon: 'fileText' as IconName,
          className: styles.badgePdf,
        };
      case 'notes':
        return {
          label: 'Master Notes',
          icon: 'bookOpen' as IconName,
          className: styles.badgeNotes,
        };
      case 'cheatsheet':
        return {
          label: 'Cheatsheet',
          icon: 'zap' as IconName,
          className: styles.badgeCheatsheet,
        };
      case 'image':
        return {
          label: 'Visual Diagram',
          icon: 'image' as IconName,
          className: styles.badgeImage,
        };
      case 'summary':
      default:
        return {
          label: 'Revision Capsule',
          icon: 'sparkles' as IconName,
          className: styles.badgeSummary,
        };
    }
  };

  const typeMeta = getTypeBadge();

  return (
    <div className={styles.card}>
      <div className={styles.topRow}>
        <span className={`${styles.typeBadge} ${typeMeta.className}`}>
          <Icon name={typeMeta.icon} size="xs" />
          {typeMeta.label}
        </span>
        {material.subjectName && (
          <span className={styles.subjectTag}>{material.subjectName}</span>
        )}
      </div>

      <h3 className={styles.title}>{material.title}</h3>

      {material.description && (
        <p className={styles.description}>{material.description}</p>
      )}

      <div className={styles.metadataRow}>
        {material.pageCount && (
          <span className={styles.metaItem}>
            <Icon name="layers" size="xs" />
            {material.pageCount} {material.pageCount === 1 ? 'Page' : 'Pages'}
          </span>
        )}
        {material.fileSize && (
          <span className={styles.metaItem}>
            <Icon name="fileText" size="xs" />
            {material.fileSize}
          </span>
        )}
        {material.authoritativeSource && (
          <span className={styles.authoritativeSource} title={material.authoritativeSource}>
            <Icon name="award" size="xs" />
            {material.authoritativeSource.length > 28
              ? `${material.authoritativeSource.slice(0, 28)}...`
              : material.authoritativeSource}
          </span>
        )}
      </div>

      {material.tags && material.tags.length > 0 && (
        <div className={styles.tagsContainer}>
          {material.tags.slice(0, 4).map((tag, idx) => (
            <span key={idx} className={styles.tagPill}>
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className={styles.actionsRow}>
        <button
          type="button"
          className={styles.openBtn}
          onClick={() => onOpen(material)}
          aria-label={`Open ${material.title} in reader`}
        >
          <Icon name={material.fileType === 'image' ? 'image' : 'bookOpen'} size="sm" />
          {material.fileType === 'image' ? 'View Diagram' : 'Open In Reader'}
        </button>

        {onDownload && (
          <button
            type="button"
            className={styles.secondaryBtn}
            onClick={() => onDownload(material)}
            title="Download material"
            aria-label={`Download ${material.title}`}
          >
            <Icon name="download" size="sm" />
          </button>
        )}
      </div>
    </div>
  );
};
