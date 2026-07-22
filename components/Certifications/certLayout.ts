/**
 * Where the certificates sit on the 3D stage.
 *
 * Kept free of any three.js import on purpose: the caption in the section
 * shell needs to know which way the camera pans between two certificates so
 * it can travel with them, and importing that from GalleryScene would pull
 * three back into the initial bundle.
 */

/** Gap between consecutive certificates along -Z. */
export const CERT_SPACING = 4;

/**
 * Frames sit slightly above the camera's eye line so the lower third of the
 * stage stays clear for the caption.
 */
export const CERT_Y = 0.1;

/** How far in front of a certificate the camera sits when focused. */
export const VIEW_DISTANCE = 2.5;

/** Lateral offsets, cycled. Starts centred, then alternates outward. */
export const CERT_X_PATTERN = [0, 4, -4, 3, -3];

/** Where certificate `i` sits across the stage. */
export const certLateral = (i: number) => CERT_X_PATTERN[i % CERT_X_PATTERN.length];
