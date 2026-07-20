'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import type { Certificate } from './certData';

/**
 * Mobile fallback — the 3D gallery is far too heavy for phones, so the same
 * certificates become a horizontal snap carousel: cards slide in from the
 * right and are swiped through one at a time.
 */
export function MobileCertGrid({
  certs,
  onView,
}: {
  certs: Certificate[];
  onView: (cert: Certificate) => void;
}) {
  return (
    <>
      <div className="cert-mobile-track">
        {certs.map((cert, idx) => (
          <motion.article
            key={cert.name}
            className="cert-mobile-card"
            initial={{ opacity: 0, x: 64 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              duration: 0.55,
              delay: idx * 0.06,
              ease: [0.25, 0.1, 0.25, 1],
            }}
          >
            <button
              type="button"
              className="cert-mobile-thumb"
              onClick={() => onView(cert)}
              aria-label={`View ${cert.name}`}
            >
              <Image
                src={cert.image}
                alt={cert.name}
                fill
                sizes="85vw"
                className={cert.portrait ? 'object-contain' : 'object-cover'}
              />
            </button>

            <span className="cert-label-type">{cert.type}</span>
            <h3 className="cert-label-title">{cert.name}</h3>
            <p className="cert-label-issuer">{cert.issuer}</p>
            <p className="cert-label-date">{cert.date}</p>
            {cert.rank && <span className="cert-label-rank">🏆 {cert.rank}</span>}

            <div className="cert-label-buttons">
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
        ))}
      </div>

      <p className="cert-mobile-hint">Swipe to explore →</p>
    </>
  );
}
