'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { WorkspaceShell } from '@/components/workspace/WorkspaceShell';
import { Icon } from '@/components/ui/Icon';
import { MaterialCard } from '@/components/library/MaterialCard';
import { LibraryFilterBar, LibraryFilters } from '@/components/library/LibraryFilterBar';
import { PdfViewerModal } from '@/components/library/PdfViewerModal';
import { ImageViewerModal } from '@/components/library/ImageViewerModal';
import { curriculumAdapter } from '@/lib/adapters/curriculum';
import type { CurriculumMaterial } from '@/lib/types/curriculum';
import styles from './library.module.css';

function LibraryPageContent() {
  const searchParams = useSearchParams();
  const docParam = searchParams.get('doc');

  const [materials, setMaterials] = useState<CurriculumMaterial[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filters, setFilters] = useState<LibraryFilters>({
    subjectId: 'all',
    fileType: 'all',
    searchQuery: '',
  });

  // Modals state
  const [activePdfDoc, setActivePdfDoc] = useState<CurriculumMaterial | null>(null);
  const [activeImageDoc, setActiveImageDoc] = useState<CurriculumMaterial | null>(null);

  // Load materials from adapter
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoading(true);
      try {
        const data = await curriculumAdapter.getAllMaterials(filters);
        if (isMounted) {
          setMaterials(data);
        }
      } catch (err) {
        console.error('Failed to load library materials:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  // Handle deep link param ?doc=[id]
  useEffect(() => {
    if (!docParam) return;
    const docId = docParam;
    async function openDeepLinkedDoc() {
      try {
        const doc = await curriculumAdapter.getMaterial(docId);
        if (doc) {
          if (doc.fileType === 'image') {
            setActiveImageDoc(doc);
          } else {
            setActivePdfDoc(doc);
          }
        }
      } catch (err) {
        console.error('Failed to load deep-linked document:', err);
      }
    }
    openDeepLinkedDoc();
  }, [docParam]);

  const handleOpenMaterial = (material: CurriculumMaterial) => {
    if (material.fileType === 'image') {
      setActiveImageDoc(material);
    } else {
      setActivePdfDoc(material);
    }
  };

  const handleDownload = (material: CurriculumMaterial) => {
    // Open in reader to trigger download simulation or direct download
    setActivePdfDoc(material);
  };

  return (
    <div className={styles.container}>
      {/* Top Header */}
      <header className={styles.headerRow}>
        <div className={styles.titleArea}>
          <h1 className={styles.pageTitle}>
            <Icon name="library" size="md" />
            Curriculum Library & Textbooks
          </h1>
          <p className={styles.pageSubtitle}>
            Authoritative NCERT textbook chapters, official revision summaries, and high-yield formula cheatsheets with an inbuilt document reader.
          </p>
        </div>

        <div className={styles.headerBadges}>
          <span className={styles.provenanceBadge}>
            <Icon name="check" size="xs" />
            100% NCERT Verified Provenance
          </span>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <LibraryFilterBar
        filters={filters}
        onChange={setFilters}
        totalCount={materials.length}
      />

      {/* Materials Grid */}
      <main aria-label="Curriculum Materials List">
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Loading verified academic materials...
          </div>
        ) : materials.length === 0 ? (
          <div className={styles.emptyState}>
            <Icon name="search" size="xl" style={{ color: 'var(--text-muted)' }} />
            <h2 className={styles.emptyTitle}>No matching curriculum documents found</h2>
            <p className={styles.emptyText}>
              Try clearing your filters or searching for terms like &quot;Kinematics&quot;, &quot;Projectile&quot;, &quot;Mole Concept&quot;, or &quot;Calculus&quot;.
            </p>
            <button
              type="button"
              className={styles.resetFiltersBtn}
              onClick={() => setFilters({ subjectId: 'all', fileType: 'all', searchQuery: '' })}
            >
              <Icon name="refresh" size="xs" />
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className={styles.materialsGrid}>
            {materials.map((mat) => (
              <MaterialCard
                key={mat.id}
                material={mat}
                onOpen={handleOpenMaterial}
                onDownload={handleDownload}
              />
            ))}
          </div>
        )}
      </main>

      {/* Inbuilt PDF Reader Modal */}
      {activePdfDoc && (
        <PdfViewerModal
          material={activePdfDoc}
          isOpen={true}
          onClose={() => setActivePdfDoc(null)}
        />
      )}

      {/* High-Resolution Diagram Modal */}
      {activeImageDoc && (
        <ImageViewerModal
          material={activeImageDoc}
          isOpen={true}
          onClose={() => setActiveImageDoc(null)}
        />
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <WorkspaceShell>
      <Suspense fallback={<div style={{ padding: '2rem' }}>Loading Library...</div>}>
        <LibraryPageContent />
      </Suspense>
    </WorkspaceShell>
  );
}
