'use client';

import { AvatarEyes } from './AvatarEyes';
import { AvatarScrub } from './AvatarScrub';

/**
 * Set to true once public/hero/avatar-scrub.mp4 has been produced (see
 * public/hero/README.md) to hand the hero over to the video scrubber.
 *
 * This was a runtime HEAD probe, which auto-detected the file but meant every
 * visitor paid for a request that 404s until the clip exists. A constant costs
 * nothing and is a one-word change when the footage is ready.
 */
const HAS_SCRUB_VIDEO = false;

/**
 * Picks how the hero avatar reacts to the cursor: real head motion from the
 * scrub clip if it exists, otherwise sprite-based eye tracking, which needs no
 * extra asset.
 */
export function HeroAvatar({ className }: { className?: string }) {
  if (HAS_SCRUB_VIDEO) return <AvatarScrub className={className} />;
  return <AvatarEyes className={className} />;
}
