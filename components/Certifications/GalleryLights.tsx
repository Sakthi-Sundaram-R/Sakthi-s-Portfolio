'use client';

/**
 * Gallery lighting rig, tuned to the site palette.
 *
 * A dim neutral ambient keeps the near-black background readable, a cool key
 * light lifts whatever the camera is facing, and magenta/violet rim lights
 * echo the accent gradient used across the rest of the portfolio.
 */
export function GalleryLights() {
  return (
    <>
      <ambientLight color="#1a1a1f" intensity={0.35} />

      {/* Cool key light, above and in front of the gallery path */}
      <spotLight
        color="#D7E2EA"
        intensity={2}
        position={[0, 6, 4]}
        angle={0.9}
        penumbra={1}
        distance={40}
      />

      {/* Azure rim from the left — kept low so it grazes the frames
          rather than tinting the certificates themselves */}
      <directionalLight color="#29C5F6" intensity={0.5} position={[-6, 2, 2]} />

      {/* Cool steel fill from the right */}
      <directionalLight color="#7FA9C4" intensity={0.3} position={[6, -1, 2]} />
    </>
  );
}
