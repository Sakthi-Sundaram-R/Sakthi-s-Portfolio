'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { useMotionValueEvent, useScroll } from 'framer-motion';
import { GalleryLights } from './GalleryLights';
import { GalleryScene } from './GalleryScene';
import { MobileCertGrid } from './MobileCertGrid';
import { CertLightbox } from './CertLightbox';
import { certifications, type Certificate } from './certData';

const MOBILE_BREAKPOINT = 768;

export function CertificationsSection() {
  const [lightbox, setLightbox] = useState<Certificate | null>(null);
  const [activeCert, setActiveCert] = useState(0);
  // null until measured, so the server and first client paint agree.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // The section is 500vh tall with a sticky viewport inside, so scroll
  // progress across it drives the camera exactly like a pinned timeline.
  // sectionRef must stay attached to a single, always-rendered element or
  // useScroll will fire "target ref is defined but not hydrated".
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    progressRef.current = v;
  });

  const header = (
    <div className="cert-gallery-header">
      <h2 className="hero-heading font-black uppercase leading-none tracking-tight">
        Certifications
      </h2>
      <p className="section-subtitle">Scroll to explore the gallery</p>
    </div>
  );

  const desktop = (
    <div className="cert-gallery-pin">
      {header}

      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0 }}
      >
        <GalleryLights />
        <Suspense fallback={null}>
          <GalleryScene
            certificates={certifications}
            progressRef={progressRef}
            onActiveChange={setActiveCert}
            onView={setLightbox}
          />
        </Suspense>
      </Canvas>

      {/* Progress dots */}
      <div className="gallery-progress">
        {certifications.map((cert, i) => (
          <div key={cert.name} className={`gallery-dot ${activeCert === i ? 'active' : ''}`} />
        ))}
      </div>

      {/* Scroll hint */}
      <div className="gallery-scroll-hint">
        <span>Scroll to explore</span>
        <div className="scroll-arrow">↓</div>
      </div>
    </div>
  );

  const mobile = (
    <>
      {header}
      <MobileCertGrid certs={certifications} onView={setLightbox} />
    </>
  );

  return (
    <section
      ref={sectionRef}
      id="certifications"
      className={`cert-gallery-section${isMobile ? ' cert-gallery-section--mobile' : ''}`}
      style={isMobile === false ? { height: '500vh' } : undefined}
    >
      {isMobile === null ? null : isMobile ? mobile : desktop}
      {lightbox && <CertLightbox cert={lightbox} onClose={() => setLightbox(null)} />}
    </section>
  );
}
