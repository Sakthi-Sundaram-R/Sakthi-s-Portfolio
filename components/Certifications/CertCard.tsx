'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Certificate } from './certData';

/**
 * One certificate in the horizontal track: thumbnail, type pill, then the
 * meta block. Buttons are pinned to the bottom so every card in a row lines
 * up regardless of how many lines the title wraps to.
 */
export function CertCard({
  cert,
  index,
  onView,
}: {
  cert: Certificate;
  index: number;
  onView: (cert: Certificate) => void;
}) {
  return (
    <motion.article
      className={`cert-card${cert.featured ? ' cert-card--featured' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      {cert.featured && <span className="cert-card-badge">★ Featured</span>}

      <button
        type="button"
        className="cert-card-thumb"
        onClick={() => onView(cert)}
        aria-label={`View ${cert.name}`}
      >
        <Image
          src={cert.image}
          alt={cert.name}
          fill
          sizes="320px"
          className={cert.portrait ? 'object-contain' : 'object-cover'}
        />
      </button>

      <span className="cert-card-pill">{cert.type}</span>
      <h3 className="cert-card-title">{cert.name}</h3>
      <p className="cert-card-issuer">{cert.issuer}</p>
      {cert.rank && <p className="cert-card-rank">🏆 {cert.rank}</p>}
      <p className="cert-card-date">{cert.date}</p>

      <div className="cert-card-buttons">
        <button type="button" onClick={() => onView(cert)}>
          View Full
        </button>
        {cert.link && (
          <a href={cert.link} target="_blank" rel="noopener noreferrer">
            Verify ↗
          </a>
        )}
      </div>
    </motion.article>
  );
}
