'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import NextImage from 'next/image';

const MOBILE_BREAKPOINT = 768;

// Desktop frame sequence
const DESKTOP_FRAMES = { basePath: '/hero-scroll', count: 125 };
// Mobile-only frame sequence — drop frames into public/hero-scroll-mobile/
// as frame-001.webp, frame-002.webp, ... and update count to match.
const MOBILE_FRAMES = { basePath: '/hero-scroll-mobile', count: 135 };

const getFrameSrc = (basePath: string, index: number) =>
  `${basePath}/frame-${String(index + 1).padStart(3, '0')}.webp`;

function FrameSequenceCanvas({
  basePath,
  frameCount,
  aboutOverlay = false,
}: {
  basePath: string;
  frameCount: number;
  aboutOverlay?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);
  const smoothFrameRef = useRef(0);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // About card (mobile): fades in after a little scrolling, out near the end
  const aboutOpacity = useTransform(scrollYProgress, [0.06, 0.18, 0.85, 0.97], [0, 1, 1, 0]);
  const aboutY = useTransform(scrollYProgress, [0.06, 0.18], [24, 0]);

  const paintFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvasWidth / canvasHeight;

    let drawWidth: number;
    let drawHeight: number;
    let offsetX: number;
    let offsetY: number;

    if (imgRatio > canvasRatio) {
      drawHeight = canvasHeight;
      drawWidth = drawHeight * imgRatio;
      offsetX = (canvasWidth - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvasWidth;
      drawHeight = drawWidth / imgRatio;
      offsetX = 0;
      offsetY = (canvasHeight - drawHeight) / 2;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Persistent rAF loop that eases the displayed frame toward the scroll
  // target each repaint. This turns discrete scroll-wheel steps into a
  // glide across intermediate frames instead of hard jumps, and naturally
  // caps drawing at one paint per browser frame.
  useEffect(() => {
    let rafId: number;

    const tick = () => {
      const target = targetFrameRef.current;
      const current = smoothFrameRef.current;
      const delta = target - current;

      if (Math.abs(delta) > 0.01) {
        const next = Math.abs(delta) < 0.06 ? target : current + delta * 0.14;
        smoothFrameRef.current = next;
        const index = Math.min(frameCount - 1, Math.max(0, Math.round(next)));
        if (index !== currentFrameRef.current) {
          currentFrameRef.current = index;
          paintFrame(index);
        }
      }
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameCount]);

  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = getFrameSrc(basePath, i);

      const markLoaded = () => {
        if (cancelled) return;
        loadedCount++;
        setProgress(Math.round((loadedCount / frameCount) * 100));
        if (i === 0) paintFrame(0);
        if (loadedCount === frameCount) setLoaded(true);
      };

      img.onload = () => {
        if ('decode' in img) {
          img.decode().then(markLoaded).catch(markLoaded);
        } else {
          markLoaded();
        }
      };
      img.onerror = markLoaded;

      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basePath, frameCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      paintFrame(currentFrameRef.current);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    // Only set the target; the rAF loop eases the displayed frame toward it.
    targetFrameRef.current = Math.min(
      frameCount - 1,
      Math.max(0, value * (frameCount - 1))
    );
  });

  return (
    <section ref={containerRef} className="relative bg-[#0C0C0C]" style={{ height: '350vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

        {/* Brand-color vignette to blend the frame sequence into the site */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_50%,rgba(12,12,12,0.7)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-transparent to-[#0C0C0C]/30" />

        {aboutOverlay && (
          <motion.div
            style={{ opacity: aboutOpacity, y: aboutY }}
            className="pointer-events-none absolute inset-x-0 bottom-0 px-4 pb-4"
          >
            <div className="ml-auto max-w-[185px] rounded-2xl border border-[#D7E2EA]/15 bg-[#0C0C0C]/60 p-3 backdrop-blur-sm">
              <p className="mb-1 text-[0.55rem] font-medium uppercase tracking-[0.25em] text-[#B600A8]">
                About Me
              </p>
              <h3 className="mb-1 text-xs font-medium uppercase text-[#D7E2EA]">
                Sakthi Sundaram R
              </h3>
              <p className="text-[0.65rem] font-light leading-relaxed text-[#D7E2EA]/75">
                AI &amp; Data Science student building intelligent, real-world software.
              </p>
            </div>
          </motion.div>
        )}

        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0C0C0C]">
            <p className="text-xs uppercase tracking-[0.3em] text-[#D7E2EA]/50">Loading {progress}%</p>
            <div className="h-[2px] w-40 overflow-hidden rounded-full bg-[#D7E2EA]/15">
              <div
                className="h-full bg-[#B600A8] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function StaticFallback() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-[#0C0C0C]">
      <NextImage
        src="/hero-scroll/frame-063.webp"
        alt="Sakthi Sundaram R"
        fill
        priority
        sizes="100vw"
        className="object-cover object-top"
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(12,12,12,0.75)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0C0C0C] via-[#0C0C0C]/20 to-transparent" />

      {/* About Me card, anchored to the bottom for narrow screens */}
      <div className="absolute inset-x-0 bottom-0 px-5 pb-12">
        <div className="rounded-3xl border-2 border-[#D7E2EA]/15 bg-[#0C0C0C]/50 p-5 backdrop-blur-sm">
          <p className="mb-1.5 text-[0.65rem] font-medium uppercase tracking-[0.3em] text-[#B600A8]">
            About Me
          </p>
          <h3 className="mb-2 text-lg font-medium uppercase text-[#D7E2EA]">
            Sakthi Sundaram R
          </h3>
          <p className="text-sm font-light leading-relaxed text-[#D7E2EA]/75">
            AI &amp; Data Science student building intelligent, real-world software.
            From machine learning models to full-stack products, I turn ideas into
            things that actually ship.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ScrollVideoSection() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  // Whether the mobile-only frame sequence exists in public/hero-scroll-mobile/
  const [hasMobileFrames, setHasMobileFrames] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    const probe = new Image();
    probe.onload = () => setHasMobileFrames(true);
    probe.onerror = () => setHasMobileFrames(false);
    probe.src = getFrameSrc(MOBILE_FRAMES.basePath, 0);
  }, []);

  if (isMobile === null) return null;

  if (isMobile) {
    if (hasMobileFrames === null) return null;
    return hasMobileFrames ? (
      <FrameSequenceCanvas
        basePath={MOBILE_FRAMES.basePath}
        frameCount={MOBILE_FRAMES.count}
        aboutOverlay
      />
    ) : (
      <StaticFallback />
    );
  }

  return (
    <FrameSequenceCanvas
      basePath={DESKTOP_FRAMES.basePath}
      frameCount={DESKTOP_FRAMES.count}
    />
  );
}
