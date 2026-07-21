'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Mouse-position-driven video scrubber for the hero avatar.
 *
 * Horizontal cursor position maps straight onto the video's currentTime, so
 * the avatar's head turns to follow the pointer. Built to the technique in
 * the tutorial — see public/hero/README.md for how to produce the clip; the
 * re-encode step there is not optional, it is what makes seeking smooth.
 *
 * This renders only once public/hero/avatar-scrub.mp4 exists; until then
 * HeroAvatar falls back to the sprite-based eye tracking.
 */

const SRC = '/hero/avatar-scrub.mp4';
/** Skip a seek if the target is closer than this — roughly one frame at 12fps. */
const SEEK_EPSILON = 1 / 12;

export function AvatarScrub({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const video = videoRef.current;
    if (!root || !video) return;

    // No persistent pointer, or reduced motion requested: leave the poster up.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const fine = window.matchMedia('(pointer: fine)');
    if (reduced.matches || !fine.matches) return;

    const onMove = (e: PointerEvent) => {
      const duration = video.duration;
      if (!duration || Number.isNaN(duration)) return;

      const r = root.getBoundingClientRect();
      // 0 at the left edge, 0.5 dead centre (the neutral pose), 1 at the right.
      const fraction = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const target = fraction * duration;

      // Throttle: a queue of seeks the decoder cannot drain is what stutters,
      // so drop updates while a seek is in flight or the delta is sub-frame.
      // Deliberately no easing on the input — smoothing here makes the video
      // visibly lag and catch up after the pointer stops.
      if (video.seeking) return;
      if (Math.abs(target - video.currentTime) < SEEK_EPSILON) return;

      video.currentTime = target;
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <div ref={rootRef} className={`hero-avatar ${className ?? ''}`}>
      {/* Neutral frame underneath, so there is no flash before metadata loads. */}
      <Image
        src="/avatar.png"
        alt="Sakthi's 3D avatar"
        width={811}
        height={1023}
        priority
        className="h-auto w-full select-none"
      />
      <video
        ref={videoRef}
        src={SRC}
        poster="/avatar.png"
        muted
        playsInline
        preload="auto"
        autoPlay={false}
        loop={false}
        controls={false}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  );
}
