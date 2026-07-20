'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CertFrame } from './CertFrame';
import type { Certificate } from './certData';

/**
 * Gentle S-curve through the gallery. Tuned for four certificates — the
 * camera drifts left/right as it travels down -Z so each frame swings past
 * the lens instead of arriving head-on.
 */
/**
 * Layout is derived from the certificate count rather than hand-listed, so
 * adding a certificate can't desync the cards from the camera path (it
 * previously meant editing two magic arrays in lockstep).
 *
 * Cards march down -Z at a fixed spacing, alternating left/right of the
 * flight line and angled back toward it. The camera travels linearly in Z —
 * giving every card an equal share of the scroll — while its X sways on a
 * cosine timed to the spacing, so it is always on the *opposite* side of
 * whichever card is coming into focus.
 */
const CERT_SPACING = 4.5;
const CERT_X = 1.5;
const CERT_TILT = 0.32;
const START_Z = 3.5;
const CAMERA_X = 1.4;

const certSide = (i: number) => (i % 2 === 0 ? 1 : -1);

function buildLayout(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    position: [
      CERT_X * certSide(i),
      i % 2 === 0 ? 0.15 : -0.3,
      -CERT_SPACING * i,
    ] as [number, number, number],
    rotationY: -CERT_TILT * certSide(i),
  }));
}

/**
 * A card takes focus while it sits roughly this far *ahead* of the camera.
 * Keying off "ahead" rather than raw distance matters: when the camera is
 * level with a card it is edge-on and unreadable, so focus is centred on the
 * approach instead.
 */
const FOCUS_LEAD = 3.4;
const FOCUS_TOLERANCE = 2.4;

type GallerySceneProps = {
  certificates: Certificate[];
  /** Scroll progress 0..1, written from outside React's render loop. */
  progressRef: React.RefObject<number>;
  onActiveChange: (index: number) => void;
  onView: (cert: Certificate) => void;
};

export function GalleryScene({
  certificates,
  progressRef,
  onActiveChange,
  onView,
}: GallerySceneProps) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });

  const layout = useMemo(() => buildLayout(certificates.length), [certificates.length]);

  // Travel ends just past the last card's focus point so the final
  // certificate still holds focus at the end of the scroll.
  const { travel, swayPeriod, swayPhase } = useMemo(() => {
    const lastZ = -CERT_SPACING * Math.max(certificates.length - 1, 0);
    const endZ = lastZ + FOCUS_LEAD - 1;
    const distance = START_Z - endZ;
    return {
      travel: distance,
      swayPeriod: CERT_SPACING / distance,
      // Anchor the sway to the moment the camera draws level with the first
      // card. Phasing it to the focus point instead left the camera on the
      // same side as the card it was passing, and it flew straight through.
      swayPhase: START_Z / distance,
    };
  }, [certificates.length]);

  // Focus changes a handful of times per scroll, so committing it to state is
  // cheap and keeps the frames declarative.
  const [active, setActive] = useState(-1);

  useFrame((state) => {
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;

    // Walk the camera along the path according to scroll progress.
    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);

    camera.position.z = START_Z - p * travel;
    camera.position.x = -CAMERA_X * Math.cos((Math.PI * (p - swayPhase)) / swayPeriod);
    camera.position.y = 0.25 + 0.15 * Math.sin(p * Math.PI * 2);
    camera.lookAt(0, 0, camera.position.z - 3);

    // Whichever card sits closest to the ideal lead distance wins focus.
    let nearest = -1;
    let bestScore = FOCUS_TOLERANCE;
    for (let idx = 0; idx < layout.length; idx++) {
      const ahead = camera.position.z - layout[idx].position[2];
      const score = Math.abs(ahead - FOCUS_LEAD);
      if (score < bestScore) {
        bestScore = score;
        nearest = idx;
      }
    }

    setActive((prev) => {
      if (prev === nearest) return prev;
      onActiveChange(nearest);
      return nearest;
    });
  });

  return (
    <>
      {certificates.map((cert, idx) => {
        const place = layout[idx];
        return (
          <CertFrame
            key={cert.name}
            cert={cert}
            index={idx}
            position={place.position}
            rotationY={place.rotationY}
            active={active === idx}
            pointer={pointer}
            onView={onView}
          />
        );
      })}
    </>
  );
}
