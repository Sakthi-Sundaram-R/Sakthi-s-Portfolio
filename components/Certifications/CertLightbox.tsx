'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import type { Certificate } from './certData';

/** Full-bleed viewer for a single certificate. Closes on backdrop click or Esc. */
export function CertLightbox({ cert, onClose }: { cert: Certificate; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    // Prevent the pinned gallery from scrolling behind the overlay.
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previous;
    };
  }, [onClose]);

  return (
    <div className="cert-lightbox" role="dialog" aria-modal="true" onClick={onClose}>
      <button type="button" className="cert-lightbox-close" onClick={onClose} aria-label="Close">
        ✕
      </button>

      <div className="cert-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <div className="cert-lightbox-image">
          <Image
            src={cert.image}
            alt={cert.name}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>
        <div className="cert-lightbox-meta">
          <span className="cert-card-pill">{cert.type}</span>
          <h3 className="cert-card-title">{cert.name}</h3>
          <p className="cert-card-issuer">{cert.issuer}</p>
          <p className="cert-card-date">{cert.date}</p>
          <p className="cert-lightbox-detail">{cert.detail}</p>
        </div>
      </div>
    </div>
  );
}
