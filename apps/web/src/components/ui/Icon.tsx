import React from 'react';
import styles from './Icon.module.css';

export type IconName =
  // Subjects
  | 'physics'
  | 'chemistry'
  | 'mathematics'
  | 'biology'
  | 'computer_science'
  | 'english'
  // Modules
  | 'dashboard'
  | 'classroom'
  | 'library'
  | 'tutor'
  | 'focus'
  | 'planner'
  | 'tests'
  | 'mistakes'
  | 'revision'
  | 'readiness'
  | 'analytics'
  | 'upgrade'
  | 'settings'
  // Affordances & Controls
  | 'search'
  | 'filter'
  | 'chevronRight'
  | 'chevronDown'
  | 'chevronLeft'
  | 'arrowLeft'
  | 'arrowRight'
  | 'close'
  | 'check'
  | 'flame'
  | 'bell'
  | 'lock'
  | 'play'
  | 'fileText'
  | 'video'
  | 'helpCircle'
  | 'lightbulb'
  | 'externalLink'
  | 'star'
  | 'sparkles'
  | 'calendar'
  | 'target'
  | 'clock'
  | 'award'
  | 'layers'
  | 'refresh'
  | 'bookOpen'
  | 'menu'
  | 'user'
  | 'logout'
  | 'info'
  | 'zap'
  | 'zoomIn'
  | 'zoomOut'
  | 'maximize'
  | 'minimize'
  | 'download'
  | 'send'
  | 'paperclip'
  | 'image'
  | 'trash'
  | 'cube'
  | 'pause'
  | 'rotateCw'
  | 'rotateCcw'
  | 'sun'
  | 'moon'
  | 'laptop';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Icon: React.FC<IconProps> = ({
  name,
  size = 'md',
  className = '',
  ...rest
}) => {
  const sizeClass = styles[size] || styles.md;
  const combinedClass = `${styles.icon} ${sizeClass} ${className}`.trim();

  const renderIconPaths = () => {
    switch (name) {
      // Subjects
      case 'physics':
        return (
          <>
            <circle cx="12" cy="12" r="2" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(90 12 12)" />
            <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(150 12 12)" />
          </>
        );
      case 'chemistry':
        return (
          <>
            <path d="M10 2v5.5L4.5 18A2 2 0 0 0 6.2 21h11.6a2 2 0 0 0 1.7-3L14 7.5V2" />
            <path d="M8.5 2h7" />
            <path d="M7 16h10" />
          </>
        );
      case 'mathematics':
        return (
          <>
            <path d="M4 6h16" />
            <path d="M4 6l6 6-6 6" />
            <path d="M4 18h16" />
            <circle cx="17" cy="12" r="2" />
          </>
        );
      case 'biology':
        return (
          <>
            <path d="M2 15c6.667-6 13.333 0 20-6" />
            <path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993" />
            <path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993" />
            <path d="M17 6l-2.5 2.5" />
            <path d="M14 8.5l-2.5 2.5" />
            <path d="M7 18l2.5-2.5" />
            <path d="M10 15.5l2.5-2.5" />
          </>
        );
      case 'computer_science':
        return (
          <>
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
            <line x1="14" y1="4" x2="10" y2="20" />
          </>
        );
      case 'english':
      case 'bookOpen':
        return (
          <>
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </>
        );

      // Workspace Modules
      case 'dashboard':
        return (
          <>
            <rect x="3" y="3" width="7" height="9" rx="1" />
            <rect x="14" y="3" width="7" height="5" rx="1" />
            <rect x="14" y="12" width="7" height="9" rx="1" />
            <rect x="3" y="16" width="7" height="5" rx="1" />
          </>
        );
      case 'classroom':
        return (
          <>
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 3 3 5 6 5s6-2 6-5v-5" />
          </>
        );
      case 'library':
        return (
          <>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            <line x1="12" y1="6" x2="16" y2="6" />
            <line x1="12" y1="10" x2="16" y2="10" />
          </>
        );
      case 'tutor':
        return (
          <>
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="15" x2="8" y2="17" />
            <line x1="16" y1="15" x2="16" y2="17" />
          </>
        );
      case 'focus':
        return (
          <>
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 6 12 12 16 14" />
            <path d="M10 2h4" />
          </>
        );
      case 'planner':
      case 'calendar':
        return (
          <>
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </>
        );
      case 'tests':
      case 'award':
        return (
          <>
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
          </>
        );
      case 'mistakes':
        return (
          <>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </>
        );
      case 'revision':
      case 'refresh':
        return (
          <>
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0 1 15.5-6.5L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 0 1-15.5 6.5L3 16" />
          </>
        );
      case 'readiness':
      case 'target':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
          </>
        );
      case 'analytics':
        return (
          <>
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="3" y1="20" x2="21" y2="20" />
          </>
        );
      case 'upgrade':
      case 'zap':
        return (
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        );
      case 'settings':
        return (
          <>
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </>
        );

      // Controls & Affordances
      case 'search':
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </>
        );
      case 'filter':
        return (
          <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
        );
      case 'chevronRight':
        return <polyline points="9 18 15 12 9 6" />;
      case 'chevronDown':
        return <polyline points="6 9 12 15 18 9" />;
      case 'chevronLeft':
        return <polyline points="15 18 9 12 15 6" />;
      case 'arrowLeft':
        return (
          <>
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </>
        );
      case 'arrowRight':
        return (
          <>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </>
        );
      case 'close':
        return (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        );
      case 'check':
        return <polyline points="20 6 9 17 4 12" />;
      case 'flame':
        return (
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        );
      case 'bell':
        return (
          <>
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </>
        );
      case 'lock':
        return (
          <>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </>
        );
      case 'play':
        return <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />;
      case 'fileText':
        return (
          <>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </>
        );
      case 'video':
        return (
          <>
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </>
        );
      case 'helpCircle':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </>
        );
      case 'lightbulb':
        return (
          <>
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.76.76 1.23 1.52 1.41 2.5" />
          </>
        );
      case 'externalLink':
        return (
          <>
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </>
        );
      case 'star':
        return (
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        );
      case 'sparkles':
        return (
          <>
            <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            <path d="M5 3v4" />
            <path d="M19 17v4" />
            <path d="M3 5h4" />
            <path d="M17 19h4" />
          </>
        );
      case 'clock':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 14 14" />
          </>
        );
      case 'layers':
        return (
          <>
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </>
        );
      case 'menu':
        return (
          <>
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        );
      case 'user':
        return (
          <>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </>
        );
      case 'logout':
        return (
          <>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </>
        );
      case 'info':
        return (
          <>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </>
        );
      case 'zoomIn':
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="11" y1="8" x2="11" y2="14" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </>
        );
      case 'zoomOut':
        return (
          <>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
            <line x1="8" y1="11" x2="14" y2="11" />
          </>
        );
      case 'maximize':
        return (
          <>
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </>
        );
      case 'minimize':
        return (
          <>
            <path d="M4 14h6m0 0v6m0-6L3 21m17-7h-6m0 0v6m0-6l7 7M4 10h6m0 0V4m0 6L3 3m17 7h-6m0 0V4m0 6l7-7" />
          </>
        );
      case 'download':
        return (
          <>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </>
        );
      case 'send':
        return (
          <>
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </>
        );
      case 'paperclip':
        return (
          <>
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </>
        );
      case 'image':
        return (
          <>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </>
        );
      case 'trash':
        return (
          <>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          </>
        );
      case 'cube':
        return (
          <>
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </>
        );
      case 'pause':
        return (
          <>
            <rect x="6" y="4" width="4" height="16" />
            <rect x="14" y="4" width="4" height="16" />
          </>
        );
      case 'rotateCw':
        return (
          <>
            <path d="M23 4v6h-6" />
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
          </>
        );
      case 'rotateCcw':
        return (
          <>
            <path d="M1 4v6h6" />
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </>
        );
      case 'sun':
        return (
          <>
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </>
        );
      case 'moon':
        return (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        );
      case 'laptop':
        return (
          <>
            <rect x="3" y="4" width="18" height="12" rx="2" />
            <line x1="2" y1="20" x2="22" y2="20" />
          </>
        );
      default:
        return <circle cx="12" cy="12" r="4" />;
    }
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={combinedClass}
      {...rest}
    >
      {renderIconPaths()}
    </svg>
  );
};

export default Icon;
