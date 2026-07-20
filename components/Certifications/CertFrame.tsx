'use client';

import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import type { Certificate } from './certData';

/**
 * Brushed-steel frame with an azure halo. Azure is the cool end of the
 * cursor's magenta→azure sweep, so it stays in the site's language while
 * reading far cleaner behind a certificate than a warm violet did.
 */
const FRAME = '#D7E2EA';
const ACCENT = '#29C5F6';

/** Longest edge of a certificate plane, in world units. */
const MAX_EDGE = 1.9;
const FRAME_INSET = 0.16;

type CertFrameProps = {
  cert: Certificate;
  index: number;
  position: [number, number, number];
  rotationY: number;
  active: boolean;
  /** Normalised pointer position, shared across the scene. */
  pointer: React.RefObject<{ x: number; y: number }>;
  onView: (cert: Certificate) => void;
};

export function CertFrame({
  cert,
  index,
  position,
  rotationY,
  active,
  pointer,
  onView,
}: CertFrameProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const borderRef = useRef<THREE.MeshStandardMaterial>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  const texture = useTexture(cert.image);

  // Radial falloff for the halo. A plain plane rendered as a flat translucent
  // rectangle — a visible slab behind the frame — so the glow is masked by a
  // soft gradient and blended additively instead.
  const glowTexture = useMemo(() => {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(
        size / 2,
        size / 2,
        0,
        size / 2,
        size / 2,
        size / 2
      );
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.45, 'rgba(255,255,255,0.4)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
    }
    return new THREE.CanvasTexture(canvas);
  }, []);

  // Size the plane from the texture's real aspect ratio so nothing is squashed.
  const image = texture.image as { width: number; height: number } | undefined;
  const aspect = image && image.height ? image.width / image.height : 4 / 3;
  const [w, h] = aspect >= 1 ? [MAX_EDGE, MAX_EDGE / aspect] : [MAX_EDGE * aspect, MAX_EDGE];

  useFrame((state) => {
    const group = groupRef.current;
    if (!group) return;

    const t = state.clock.elapsedTime;

    // Gentle idle float and rock, offset per card so they drift out of sync.
    group.position.y = position[1] + Math.sin(t * 0.6 + index) * 0.05;
    group.rotation.z = Math.sin(t * 0.5 + index) * 0.008;

    // Subtle parallax tilt toward the pointer, only while this card is active.
    const targetY = rotationY + (active ? (pointer.current?.x ?? 0) * 0.12 : 0);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetY, 0.05);

    // Scale, glow and rim light all ease toward the active state.
    const targetScale = active ? 1.05 : 1;
    const s = THREE.MathUtils.lerp(group.scale.x, targetScale, 0.08);
    group.scale.setScalar(s);

    if (glowRef.current) {
      glowRef.current.opacity = THREE.MathUtils.lerp(
        glowRef.current.opacity,
        active ? 0.55 : 0,
        0.08
      );
    }

    if (borderRef.current) {
      borderRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        borderRef.current.emissiveIntensity,
        active ? 0.3 : 0,
        0.08
      );
    }

    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(
        lightRef.current.intensity,
        active ? 1.5 : 0,
        0.08
      );
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={[0, rotationY, 0]}>
      {/* Rim light that switches on as the camera arrives */}
      <pointLight ref={lightRef} color={ACCENT} intensity={0} distance={6} position={[0, 0, 1.2]} />

      {/* Layer 1 — glow, sitting behind everything */}
      <mesh name="glow" position={[0, 0, -0.06]}>
        <planeGeometry args={[w + 1.6, h + 1.6]} />
        <meshBasicMaterial
          ref={glowRef}
          map={glowTexture}
          color={ACCENT}
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Layer 2 — gold frame border */}
      <mesh name="frame-border" position={[0, 0, -0.03]}>
        <boxGeometry args={[w + FRAME_INSET, h + FRAME_INSET, 0.05]} />
        <meshStandardMaterial
          ref={borderRef}
          color={FRAME}
          metalness={0.9}
          roughness={0.15}
          emissive={ACCENT}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Layer 3 — the certificate itself */}
      <mesh name="cert-image" position={[0, 0, 0.005]}>
        <planeGeometry args={[w, h]} />
        {/* Largely self-lit: the accent rim lights would otherwise tint the
            certificate magenta and make it unreadable. The frame still
            catches them, so the scene keeps its colour without costing
            legibility. */}
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.9}
          roughness={0.4}
          metalness={0}
          toneMapped={false}
        />
      </mesh>

      {/* Layer 4 — museum glass */}
      <mesh name="glass" position={[0, 0, 0.02]}>
        <planeGeometry args={[w, h]} />
        <meshPhysicalMaterial
          transmission={0.3}
          roughness={0.05}
          thickness={0.5}
          color="#ffffff"
          transparent
          opacity={0.15}
          depthWrite={false}
        />
      </mesh>

      <Html position={[0, -h / 2 - 0.65, 0]} center distanceFactor={6} zIndexRange={[20, 0]}>
        <div
          className="cert-label"
          style={{
            opacity: active ? 1 : 0,
            transform: active ? 'translateY(0)' : 'translateY(10px)',
            pointerEvents: active ? 'auto' : 'none',
          }}
        >
          <span className="cert-label-type">{cert.type}</span>
          <h3 className="cert-label-title">{cert.name}</h3>
          <p className="cert-label-issuer">{cert.issuer}</p>
          <p className="cert-label-date">{cert.date}</p>
          {cert.rank && <span className="cert-label-rank">🏆 {cert.rank}</span>}
          <div className="cert-label-buttons">
            <button type="button" onClick={() => onView(cert)}>
              View Full
            </button>
            {cert.link && (
              <a href={cert.link} target="_blank" rel="noopener noreferrer">
                Verify ↗
              </a>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
