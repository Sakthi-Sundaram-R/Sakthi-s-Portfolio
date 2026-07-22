'use client';

import { useMemo, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CertFrame } from './CertFrame';
import { CERT_SPACING, CERT_Y, VIEW_DISTANCE, certLateral } from './certLayout';
import type { Certificate } from './certData';

/**
 * Straight-on gallery. Every certificate faces the lens square, and the camera
 * parks directly in front of one at a time — no tilted frames swinging past.
 *
 * Cards march down -Z at a fixed spacing and step side to side on a fixed
 * pattern, so consecutive certificates sit off in the periphery while the
 * focused one is dead centre. Each card's camera waypoint is derived from its
 * own position (straight back along +Z, level with the frame), so the layout
 * and the flight path can never drift apart.
 */

function buildLayout(count: number) {
  return Array.from({ length: count }, (_, i) => {
    const x = certLateral(i);
    const z = -CERT_SPACING * i;
    return {
      position: [x, CERT_Y, z] as [number, number, number],
      /** Camera sits back along +Z, level with the frame and looking at it. */
      camera: [x, 0, z + VIEW_DISTANCE] as [number, number, number],
      lookAt: [x, 0, z] as [number, number, number],
    };
  });
}

/**
 * Eases the travel between two waypoints so the camera settles on each
 * certificate and holds it, rather than sliding through at constant speed.
 */
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

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

  const layout = useMemo(() => buildLayout(certificates.length), [certificates.length]);

  // Reused across frames so the loop allocates nothing.
  const target = useRef(new THREE.Vector3());

  // Focus changes a handful of times per scroll, so committing it to state is
  // cheap and keeps the frames declarative.
  const [active, setActive] = useState(0);

  useFrame(() => {
    if (layout.length === 0) return;

    const p = THREE.MathUtils.clamp(progressRef.current ?? 0, 0, 1);

    // Scroll maps onto the waypoint list: whole part picks the leg, the
    // fraction eases the camera along it.
    const t = p * (layout.length - 1);
    const leg = Math.min(Math.floor(t), layout.length - 2);
    const f = smootherstep(THREE.MathUtils.clamp(t - leg, 0, 1));

    const from = layout[leg];
    const to = layout[leg + 1] ?? from;

    camera.position.set(
      THREE.MathUtils.lerp(from.camera[0], to.camera[0], f),
      THREE.MathUtils.lerp(from.camera[1], to.camera[1], f),
      THREE.MathUtils.lerp(from.camera[2], to.camera[2], f)
    );

    target.current.set(
      THREE.MathUtils.lerp(from.lookAt[0], to.lookAt[0], f),
      THREE.MathUtils.lerp(from.lookAt[1], to.lookAt[1], f),
      THREE.MathUtils.lerp(from.lookAt[2], to.lookAt[2], f)
    );
    camera.lookAt(target.current);

    // Whichever waypoint the camera is closest to holds focus.
    const nearest = Math.round(t);
    setActive((prev) => {
      if (prev === nearest) return prev;
      onActiveChange(nearest);
      return nearest;
    });
  });

  return (
    <>
      {certificates.map((cert, idx) => (
        <CertFrame
          key={cert.name}
          cert={cert}
          index={idx}
          position={layout[idx].position}
          active={active === idx}
          onView={onView}
        />
      ))}
    </>
  );
}
