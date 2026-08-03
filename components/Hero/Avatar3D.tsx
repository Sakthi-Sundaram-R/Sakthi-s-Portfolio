'use client';

import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef<THREE.Group>(null);
  const targetMouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      // Normalize mouse coordinates to [-1, 1] relative to window center
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetMouse.current = { x, y };
    };

    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  useFrame((_, delta) => {
    if (!modelRef.current) return;

    const { x, y } = targetMouse.current;

    // Target rotation angles (radians) for organic 3D tracking
    const targetRotY = x * 0.40; // Turn left/right
    const targetRotX = -y * 0.20; // Tilt up/down

    // Smooth dampening towards target rotation
    modelRef.current.rotation.y = THREE.MathUtils.damp(
      modelRef.current.rotation.y,
      targetRotY,
      4,
      delta
    );
    modelRef.current.rotation.x = THREE.MathUtils.damp(
      modelRef.current.rotation.x,
      targetRotX,
      4,
      delta
    );
  });

  return (
    <group ref={modelRef} scale={1.22}>
      <primitive object={scene} />
    </group>
  );
}

function FallbackLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[400px]">
      <div className="relative flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#b600a8]/30 border-t-[#b600a8] rounded-full animate-spin" />
      </div>
    </div>
  );
}

export function Avatar3D({ className }: { className?: string }) {
  return (
    <div className={`relative w-full h-[480px] sm:h-[560px] md:h-[640px] lg:h-[720px] ${className ?? ''}`}>
      <Suspense fallback={<FallbackLoader />}>
        <Canvas
          camera={{ position: [0, -0.05, 3.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Ambient studio lights */}
          <ambientLight intensity={1.8} />
          
          {/* Key directional light */}
          <directionalLight position={[3, 4, 5]} intensity={2.5} color="#ffffff" />
          
          {/* Vibrant rim accent lights matching portfolio theme */}
          <pointLight position={[-4, 3, -2]} intensity={4.0} color="#b600a8" />
          <pointLight position={[4, -2, 2]} intensity={2.5} color="#3b82f6" />
          <pointLight position={[0, -3, 3]} intensity={1.5} color="#ffffff" />

          {/* Floating and centering the 3D model */}
          <Float
            speed={2.0}
            rotationIntensity={0.12}
            floatIntensity={0.3}
            floatingRange={[-0.04, 0.04]}
          >
            <Center>
              <Model url="/models/avatar.glb" />
            </Center>
          </Float>

          {/* Ground contact shadow for realism */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.7}
            scale={7}
            blur={2.5}
            far={4}
            color="#b600a8"
          />
        </Canvas>
      </Suspense>
    </div>
  );
}

useGLTF.preload('/models/avatar.glb');
