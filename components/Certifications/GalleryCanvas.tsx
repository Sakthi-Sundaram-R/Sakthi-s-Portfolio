'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { GalleryLights } from './GalleryLights';
import { GalleryScene } from './GalleryScene';
import type { Certificate } from './certData';

/**
 * The WebGL stage, split out so that three.js and react-three-fiber live in
 * their own async chunk. Together they are ~410KB of JavaScript for a section
 * most visitors scroll past, and one that phones never render at all — this
 * keeps all of it off the initial load.
 */
export function GalleryCanvas({
  certificates,
  progressRef,
  running,
  onActiveChange,
  onView,
}: {
  certificates: Certificate[];
  progressRef: React.RefObject<number>;
  /** False parks the render loop while the stage is off screen. */
  running: boolean;
  onActiveChange: (index: number) => void;
  onView: (cert: Certificate) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 4.5], fov: 60 }}
      // Uncapped, this renders at the full device pixel ratio — 4x the pixels
      // on a retina panel, for a scene that is mostly flat planes.
      dpr={[1, 1.5]}
      frameloop={running ? 'always' : 'never'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ position: 'absolute', inset: 0 }}
    >
      <GalleryLights />
      <Suspense fallback={null}>
        <GalleryScene
          certificates={certificates}
          progressRef={progressRef}
          onActiveChange={onActiveChange}
          onView={onView}
        />
      </Suspense>
    </Canvas>
  );
}
