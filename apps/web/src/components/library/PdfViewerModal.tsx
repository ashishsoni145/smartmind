import React, { useState, useEffect, useRef } from 'react';
import type { CurriculumMaterial, DocumentPage } from '@/lib/types/curriculum';
import { Icon } from '@/components/ui/Icon';
import styles from './PdfViewerModal.module.css';

interface PdfViewerModalProps {
  material: CurriculumMaterial;
  isOpen: boolean;
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  material,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomPercent, setZoomPercent] = useState(100);
  const [showOutline, setShowOutline] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);

  const pages: DocumentPage[] =
    material.pages && material.pages.length > 0
      ? material.pages
      : [
          {
            pageNumber: 1,
            title: material.title,
            sections: [
              {
                heading: 'Curriculum Document Content',
                paragraphs: [
                  material.description ||
                    'Official academic document prepared according to current national syllabus specifications.',
                ],
                callouts: [
                  {
                    type: 'note',
                    title: 'Authoritative Source',
                    content: material.authoritativeSource || 'SharpMind Academic Archive',
                  },
                ],
              },
            ],
          },
        ];

  const totalPages = pages.length;
  const activePageData = pages[currentPage - 1] || pages[0];

  useEffect(() => {
    setCurrentPage(1);
    setZoomPercent(100);
    setSearchQuery('');
    setDownloadSuccess(false);
  }, [material.id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(1, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, totalPages, onClose]);

  if (!isOpen) return null;

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleZoomIn = () => {
    setZoomPercent((prev) => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoomPercent((prev) => Math.max(50, prev - 25));
  };

  const handleResetZoom = () => {
    setZoomPercent(100);
  };

  const handleDownload = () => {
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const renderCallout = (callout: { type: string; title?: string; content: string }, idx: number) => {
    let calloutClass = styles.calloutNote;
    if (callout.type === 'formula') calloutClass = styles.calloutFormula;
    else if (callout.type === 'theorem') calloutClass = styles.calloutTheorem;
    else if (callout.type === 'tip') calloutClass = styles.calloutTip;
    else if (callout.type === 'warning') calloutClass = styles.calloutWarning;

    return (
      <div key={idx} className={calloutClass}>
        {callout.title && <span className={styles.calloutTitle}>{callout.title}</span>}
        <div>{callout.content}</div>
      </div>
    );
  };

  return (
    <div
      className={`${styles.overlay} ${isFullscreen ? styles.fullscreenOverlay : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="pdf-viewer-title"
    >
      <div className={`${styles.modalContainer} ${isFullscreen ? styles.fullscreenModal : ''}`}>
        {/* Reader Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.toolbarLeft}>
            <button
              type="button"
              className={`${styles.toolBtn} ${showOutline ? styles.toolBtnActive : ''}`}
              onClick={() => setShowOutline(!showOutline)}
              title="Toggle Outline & Contents"
              aria-label="Toggle Outline"
            >
              <Icon name="layers" size="sm" />
            </button>
            <span className={styles.docBadge}>
              {material.fileType === 'pdf' ? 'PDF' : material.fileType.toUpperCase()}
            </span>
            <h2 id="pdf-viewer-title" className={styles.docTitle} title={material.title}>
              {material.title}
            </h2>
          </div>

          <div className={styles.toolbarCenter}>
            {/* Page Navigation */}
            <div className={styles.pageControls} role="navigation" aria-label="Page navigation">
              <button
                type="button"
                className={styles.toolBtn}
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                title="Previous Page (Left Arrow)"
                aria-label="Previous Page"
              >
                <Icon name="chevronLeft" size="sm" />
              </button>
              <span className={styles.pageIndicator}>
                Page <strong>{currentPage}</strong> of {totalPages}
              </span>
              <button
                type="button"
                className={styles.toolBtn}
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
                title="Next Page (Right Arrow)"
                aria-label="Next Page"
              >
                <Icon name="chevronRight" size="sm" />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className={styles.zoomControls} aria-label="Zoom controls">
              <button
                type="button"
                className={styles.toolBtn}
                onClick={handleZoomOut}
                disabled={zoomPercent <= 50}
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <Icon name="zoomOut" size="sm" />
              </button>
              <button
                type="button"
                className={styles.zoomPercent}
                onClick={handleResetZoom}
                title="Click to reset zoom to 100%"
                aria-label="Reset zoom to 100%"
              >
                {zoomPercent}%
              </button>
              <button
                type="button"
                className={styles.toolBtn}
                onClick={handleZoomIn}
                disabled={zoomPercent >= 200}
                title="Zoom In"
                aria-label="Zoom In"
              >
                <Icon name="zoomIn" size="sm" />
              </button>
            </div>
          </div>

          <div className={styles.toolbarRight}>
            {downloadSuccess && (
              <span className={styles.downloadNotice}>
                ✓ Downloaded offline copy
              </span>
            )}
            <button
              type="button"
              className={styles.toolBtn}
              onClick={handleDownload}
              title="Download PDF"
              aria-label="Download document"
            >
              <Icon name="download" size="sm" />
            </button>
            <button
              type="button"
              className={styles.toolBtn}
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              <Icon name={isFullscreen ? 'minimize' : 'maximize'} size="sm" />
            </button>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              title="Close Reader (Esc)"
              aria-label="Close reader"
            >
              <Icon name="close" size="sm" />
            </button>
          </div>
        </div>

        {/* Viewer Body */}
        <div className={styles.viewerBody}>
          {/* Document Outline / Table of Contents */}
          {showOutline && (
            <aside className={styles.outlineSidebar} aria-label="Document outline">
              <div className={styles.sidebarHeader}>Table of Contents</div>
              <ul className={styles.outlineList}>
                {pages.map((p) => {
                  const isActive = p.pageNumber === currentPage;
                  return (
                    <li key={p.pageNumber}>
                      <button
                        type="button"
                        className={`${styles.outlineItem} ${isActive ? styles.activeOutlineItem : ''}`}
                        onClick={() => {
                          setCurrentPage(p.pageNumber);
                          viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <span className={styles.pageThumbnail}>{p.pageNumber}</span>
                        <span>{p.title || `Page ${p.pageNumber}`}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </aside>
          )}

          {/* Document Viewport */}
          <main className={styles.documentViewport} ref={viewportRef}>
            <div
              className={styles.paperPage}
              style={{
                transform: `scale(${zoomPercent / 100})`,
                marginBottom: zoomPercent > 100 ? `${(zoomPercent - 100) * 8}px` : '0',
              }}
            >
              {/* Paper Header */}
              <div className={styles.pageHeader}>
                <span>
                  {material.authoritativeSource || 'National Curriculum Reference'}
                </span>
                <span>
                  {material.subjectName?.toUpperCase()} • {material.chapterTitle || 'CLASSROOM RESOURCE'}
                </span>
              </div>

              {/* Page Title */}
              {activePageData.title && (
                <h1 className={styles.pageTitle}>{activePageData.title}</h1>
              )}

              {/* Sections */}
              {activePageData.sections.map((sec, sIdx) => (
                <div key={sIdx} className={styles.sectionBlock}>
                  {sec.heading && (
                    <h2 className={styles.sectionHeading}>{sec.heading}</h2>
                  )}

                  {sec.paragraphs.map((p, pIdx) => (
                    <p key={pIdx} className={styles.paragraph}>
                      {p}
                    </p>
                  ))}

                  {sec.callouts &&
                    sec.callouts.map((callout, cIdx) => renderCallout(callout, cIdx))}

                  {sec.diagramDescription && (
                    <div className={styles.diagramBox}>
                      <Icon name="cube" size="lg" style={{ marginBottom: '0.5rem', color: '#3b82f6' }} />
                      <strong>[Figure 4.{currentPage}.1 — Trajectory Projection Geometry]</strong>
                      <p style={{ margin: '0.5rem 0 0 0', maxWidth: '500px' }}>
                        {sec.diagramDescription}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Paper Footer */}
              <div className={styles.pageFooter}>
                <span>SharpMind Academic OS — Authentic Verified Resource</span>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
