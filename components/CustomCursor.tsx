'use client';

import { useEffect, useRef } from 'react';

const INTERACTIVE_SELECTOR =
  'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reducedMotion) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add('has-custom-cursor');

    const mouse = { x: -100, y: -100 };
    const ringPos = { x: -100, y: -100 };
    let visible = false;
    let hovering = false;
    let rafId = 0;

    const onPointerMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        ringPos.x = mouse.x;
        ringPos.y = mouse.y;
        dot.classList.add('cc-visible');
        ring.classList.add('cc-visible');
      }
    };

    const onPointerOver = (e: PointerEvent) => {
      const isInteractive = !!(e.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR);
      if (isInteractive !== hovering) {
        hovering = isInteractive;
        ring.classList.toggle('cc-hover', hovering);
        dot.classList.toggle('cc-hover', hovering);
      }
    };

    const onLeave = () => {
      visible = false;
      dot.classList.remove('cc-visible');
      ring.classList.remove('cc-visible');
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerover', onPointerOver, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    const tick = () => {
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      ringPos.x += (mouse.x - ringPos.x) * 0.18;
      ringPos.y += (mouse.y - ringPos.y) * 0.18;
      ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerover', onPointerOver);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    };
  }, []);

  return (
    <div className="cc-root" aria-hidden="true">
      <div ref={ringRef} className="cc-ring-wrap">
        <div className="cc-ring" />
      </div>
      <div ref={dotRef} className="cc-dot" />
    </div>
  );
}
