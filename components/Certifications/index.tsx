'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { certLateral } from './certLayout';
import { CertCard } from './CertCard';
import { CertLightbox } from './CertLightbox';
import { certifications, type Certificate } from './certData';

const MOBILE_BREAKPOINT = 768;

/**
 * three.js + react-three-fiber are ~410KB of JavaScript. Loading them lazily
 * keeps them off the initial page load entirely, and off phones altogether —
 * the mobile branch never mounts this.
 */
const GalleryCanvas = dynamic(() => import('./GalleryCanvas').then((m) => m.GalleryCanvas), {
  ssr: false,
});

export function CertificationsSection() {
  const [lightbox, setLightbox] = useState<Certificate | null>(null);
  const [activeCert, setActiveCert] = useState(0);
  // null until measured, so the server and first client paint agree.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const [stageNear, setStageNear] = useState(false);
  // Starts true so that once mounted the canvas sizes itself and paints a
  // first frame exactly as it always did; the observer below only ever parks
  // it. If IntersectionObserver never reports, this degrades to the old
  // always-on behaviour rather than to a blank stage.
  const [stageVisible, setStageVisible] = useState(true);

  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Two separate concerns, both driven by how near the stage is:
  //  - `stageNear` mounts the WebGL chunk, and never unmounts it again, so the
  //    GL context and its textures are created once.
  //  - `stageVisible` parks the render loop. R3F renders every frame for the
  //    lifetime of the canvas, so without this the gallery would keep driving
  //    the GPU the whole time you are anywhere else on the page.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isMobile !== false) return;

    // Mount straight away if the stage is already in range — covers landing
    // directly on #certifications, and any environment without observers.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight + 600 && rect.bottom > -600) setStageNear(true);

    if (typeof IntersectionObserver === 'undefined') {
      setStageNear(true);
      setStageVisible(true);
      return;
    }

    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStageNear(true);
          near.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    const visible = new IntersectionObserver(
      ([entry]) => setStageVisible(entry.isIntersecting),
      { rootMargin: '200px 0px' }
    );

    near.observe(el);
    visible.observe(el);
    return () => {
      near.disconnect();
      visible.disconnect();
    };
  }, [isMobile]);

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

  /**
   * Caption travel, keyed off the same scroll progress that drives the camera
   * so the text moves in lockstep with the certificate rather than sitting
   * still while the stage pans underneath it.
   *
   * Per leg: the caption rides out in whichever direction the world appears to
   * move (opposite the camera's pan), blanks across the midpoint, then rides
   * back in from the far side — so the hand-off reads as the old caption
   * leaving with its certificate and the new one arriving with the next. The
   * jump between the two sides happens while opacity is 0, so it is unseen,
   * and only ever one caption element exists.
   */
  const { travelStops, travelX, travelOpacity } = useMemo(() => {
    const n = certifications.length;
    if (n < 2) return { travelStops: [0, 1], travelX: [0, 0], travelOpacity: [1, 1] };

    const SLIDE = 64; // px the caption rides out to before handing over
    const legs = n - 1;
    const legLength = 1 / legs;
    const blank = legLength * 0.18; // half-width of the invisible hand-off window

    const stops: number[] = [];
    const xs: number[] = [];
    const opacities: number[] = [];

    for (let i = 0; i < legs; i++) {
      const from = i * legLength;
      const mid = from + legLength / 2;
      // Camera pans toward the next certificate, so the scene — and the
      // caption with it — appears to travel the other way.
      const direction = Math.sign(certLateral(i + 1) - certLateral(i)) || 1;

      stops.push(from, mid - blank, mid + blank);
      xs.push(0, -SLIDE * direction, SLIDE * direction);
      opacities.push(1, 0, 0);
    }

    stops.push(1);
    xs.push(0);
    opacities.push(1);

    return { travelStops: stops, travelX: xs, travelOpacity: opacities };
  }, []);

  const captionX = useTransform(scrollYProgress, travelStops, travelX);
  const captionOpacity = useTransform(scrollYProgress, travelStops, travelOpacity);

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

      {stageNear && (
        <GalleryCanvas
          certificates={certifications}
          progressRef={progressRef}
          running={stageVisible}
          onActiveChange={setActiveCert}
          onView={setLightbox}
        />
      )}

      {/* Caption for whichever certificate currently holds focus.
          Deliberately one plain-DOM element rather than a drei <Html> per
          frame: only one caption can ever exist, so labels cannot overlap
          during a hand-off, and the text is never scaled by perspective,
          so it stays pixel-crisp. */}
      {certifications[activeCert] && (
        <div className="cert-caption-slot">
          <motion.div className="cert-caption" style={{ x: captionX, opacity: captionOpacity }}>
            <span className="cert-label-type">{certifications[activeCert].type}</span>
            <h3 className="cert-label-title">{certifications[activeCert].name}</h3>
            <p className="cert-label-issuer">{certifications[activeCert].issuer}</p>
            <p className="cert-label-date">{certifications[activeCert].date}</p>
            {certifications[activeCert].rank && (
              <span className="cert-label-rank">🏆 {certifications[activeCert].rank}</span>
            )}
            <div className="cert-label-buttons">
              <button type="button" onClick={() => setLightbox(certifications[activeCert])}>
                View Full
              </button>
              {certifications[activeCert].link && (
                <a
                  href={certifications[activeCert].link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Verify ↗
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}

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

      <div className="cert-track-wrapper">
        <div className="cert-track">
          {certifications.map((cert, i) => (
            <CertCard key={cert.name} cert={cert} index={i} onView={setLightbox} />
          ))}
        </div>
      </div>

      <p className="cert-swipe-hint">← Swipe to explore →</p>
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
