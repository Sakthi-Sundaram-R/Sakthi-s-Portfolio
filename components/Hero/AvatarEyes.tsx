'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import geometry from './eyeGeometry.json';

/**
 * The hero avatar with cursor-tracking eyes.
 *
 * The avatar is a flat render, so each iris is a sprite lifted out of the PNG
 * by scripts/generate-eye-sprites.mjs and laid back over the original. The
 * sprite is 1.2x the size of the iris it covers, which is exactly enough that
 * at full travel it never exposes the pixels underneath — so no inpainting is
 * needed. Each sprite is clipped to a feathered ellipse matching the eye
 * socket, so at the extremes the iris slides under the lid like a real eye.
 *
 * A small counter-rotation of the whole avatar sells the effect: the eyes
 * alone move only a few pixels at display size, but paired with the head
 * turning very slightly toward the pointer it reads clearly.
 */

/** Cursor distance at which eye travel saturates. */
const SATURATION_PX = 520;
/** Degrees of head turn at full travel. */
const TILT_Y = 5;
const TILT_X = 3.5;

const NATIVE_WIDTH = geometry.image.width;

export function AvatarEyes({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const irisRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    // Respect the same opt-outs the video scrubber uses: no tracking without a
    // real pointer, and none at all if reduced motion is requested.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');
    if (reduced.matches || !fine.matches) return;

    // Cached so pointermove never reads layout.
    let centreX = 0;
    let centreY = 0;
    let scale = 1;

    const measure = () => {
      const r = root.getBoundingClientRect();
      // Anchor on the eyes rather than the middle of the portrait, or the
      // gaze skews low.
      centreX = r.left + r.width / 2;
      centreY = r.top + r.height * 0.37;
      scale = r.width / NATIVE_WIDTH;
    };

    const onMove = (e: PointerEvent) => {
      const dx = Math.max(-1, Math.min(1, (e.clientX - centreX) / SATURATION_PX));
      const dy = Math.max(-1, Math.min(1, (e.clientY - centreY) / SATURATION_PX));

      const eyes = Object.values(geometry.eyes);
      for (let i = 0; i < irisRefs.current.length; i++) {
        const el = irisRefs.current[i];
        if (!el) continue;
        const travel = eyes[i].travelPx * scale;
        el.style.transform = `translate3d(${dx * travel}px, ${dy * travel * 0.6}px, 0)`;
      }

      if (tiltRef.current) {
        tiltRef.current.style.transform = `rotateY(${dx * TILT_Y}deg) rotateX(${-dy * TILT_X}deg)`;
      }
    };

    measure();
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure);
    };
  }, []);

  return (
    <div ref={rootRef} className={`hero-avatar ${className ?? ''}`}>
      <div ref={tiltRef} className="hero-avatar-tilt">
        <Image
          src="/avatar.png"
          alt="Sakthi's 3D avatar"
          width={geometry.image.width}
          height={geometry.image.height}
          priority
          className="h-auto w-full select-none"
        />

        {Object.entries(geometry.eyes).map(([side, eye], i) => (
          <span
            key={side}
            className="hero-eye"
            style={{
              left: `${eye.opening.left}%`,
              top: `${eye.opening.top}%`,
              width: `${eye.opening.width}%`,
              height: `${eye.opening.height}%`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={(el) => {
                irisRefs.current[i] = el;
              }}
              src={eye.sprite}
              alt=""
              aria-hidden
              style={{
                left: `${eye.sprite_box.left}%`,
                top: `${eye.sprite_box.top}%`,
                width: `${eye.sprite_box.width}%`,
                height: `${eye.sprite_box.height}%`,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
