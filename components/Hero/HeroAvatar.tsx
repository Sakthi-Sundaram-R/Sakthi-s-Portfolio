'use client';

import { useEffect, useState } from 'react';
import { AvatarEyes } from './AvatarEyes';
import { AvatarScrub } from './AvatarScrub';

const SCRUB_SRC = '/hero/avatar-scrub.mp4';

/**
 * Picks how the hero avatar reacts to the cursor.
 *
 * If a head-turn clip has been produced (see public/hero/README.md) the video
 * scrubber takes over, since real head motion beats moving the irises. Until
 * then — and if the file is ever removed — the sprite-based eye tracking runs
 * instead. Nothing needs editing to switch: drop the file in and reload.
 */
export function HeroAvatar({ className }: { className?: string }) {
  const [hasScrub, setHasScrub] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(SCRUB_SRC, { method: 'HEAD' })
      .then((res) => {
        if (!cancelled) setHasScrub(res.ok);
      })
      .catch(() => {
        if (!cancelled) setHasScrub(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Eyes are the safe default while probing: they need no extra asset, so a
  // slow HEAD request can never leave the hero empty.
  if (hasScrub) return <AvatarScrub className={className} />;
  return <AvatarEyes className={className} />;
}
