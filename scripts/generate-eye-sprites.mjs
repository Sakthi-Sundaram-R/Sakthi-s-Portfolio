/**
 * Generates the cursor-tracking iris sprites for the hero avatar.
 *
 * The avatar is a flat PNG, so to make the eyes follow the pointer we lift the
 * iris out of the image and move it. Moving the real iris would expose the
 * original underneath on the trailing side, so each sprite is the real iris
 * scaled up by IRIS_SCALE — enough that, at maximum travel, it still fully
 * covers the pixels it came from. No inpainting required.
 *
 * Run: node scripts/generate-eye-sprites.mjs
 * Writes: public/hero/eye-{left,right}.png and components/Hero/eyeGeometry.json
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SOURCE = 'public/avatar.png';
const OUT_DIR = 'public/hero';
const GEOMETRY_OUT = 'components/Hero/eyeGeometry.json';

/**
 * Measured off the avatar by overlaying a coordinate grid on a zoomed crop.
 * `iris` is the brown disc; `opening` is the visible eye socket the iris is
 * clipped to. All values are pixels in the source image.
 */
const EYES = {
  left: {
    iris: { cx: 326, cy: 379, rx: 27, ry: 32 },
    // Tuned by compositing the sprite back over the avatar and eyeballing the
    // result: any larger and the sprite spills over the lash line.
    opening: { cx: 313, cy: 381, rx: 43, ry: 27 },
  },
  right: {
    iris: { cx: 489, cy: 379, rx: 29, ry: 31 },
    opening: { cx: 499, cy: 382, rx: 43, ry: 26 },
  },
};

/**
 * How much bigger the sprite is than the iris it replaces. 1.2 is as far as
 * this can go before the eyes visibly bulge — at 1.3 the enlargement reads as
 * a different face.
 */
const IRIS_SCALE = 1.2;
/** Softness of the sprite's edge, in source pixels. */
const FEATHER = 2.5;
/** Eyes travel less vertically than horizontally. */
const VERTICAL_TRAVEL_RATIO = 0.6;

/** Travel is capped so the enlarged sprite always covers the original iris. */
const travelFor = ({ rx, ry }) => Math.floor(Math.min(rx, ry) * (IRIS_SCALE - 1));

async function buildSprite(name, { iris }) {
  const outRx = Math.round(iris.rx * IRIS_SCALE);
  const outRy = Math.round(iris.ry * IRIS_SCALE);
  const outW = outRx * 2;
  const outH = outRy * 2;

  // Feathered elliptical alpha, inset by the feather so the blur stays inside.
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${outW}" height="${outH}">
       <defs><filter id="f"><feGaussianBlur stdDeviation="${FEATHER}"/></filter></defs>
       <ellipse cx="${outRx}" cy="${outRy}" rx="${outRx - FEATHER * 2}" ry="${outRy - FEATHER * 2}"
                fill="#fff" filter="url(#f)"/>
     </svg>`
  );

  await sharp(SOURCE)
    .extract({
      left: Math.round(iris.cx - iris.rx),
      top: Math.round(iris.cy - iris.ry),
      width: Math.round(iris.rx * 2),
      height: Math.round(iris.ry * 2),
    })
    .resize(outW, outH)
    .ensureAlpha()
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toFile(`${OUT_DIR}/eye-${name}.png`);

  return { outW, outH, outRx, outRy };
}

const { width: IMG_W, height: IMG_H } = await sharp(SOURCE).metadata();

await mkdir(OUT_DIR, { recursive: true });

const geometry = { image: { width: IMG_W, height: IMG_H }, eyes: {} };

for (const [name, eye] of Object.entries(EYES)) {
  const { outW, outH } = await buildSprite(name, eye);
  const { iris, opening } = eye;
  const travel = travelFor(iris);

  geometry.eyes[name] = {
    sprite: `/hero/eye-${name}.png`,
    // Everything below is a percentage of the rendered avatar box, so the
    // overlay scales with the image at any breakpoint.
    opening: {
      left: ((opening.cx - opening.rx) / IMG_W) * 100,
      top: ((opening.cy - opening.ry) / IMG_H) * 100,
      width: ((opening.rx * 2) / IMG_W) * 100,
      height: ((opening.ry * 2) / IMG_H) * 100,
    },
    // Sprite position inside the opening box.
    sprite_box: {
      left: ((iris.cx - outW / 2 - (opening.cx - opening.rx)) / (opening.rx * 2)) * 100,
      top: ((iris.cy - outH / 2 - (opening.cy - opening.ry)) / (opening.ry * 2)) * 100,
      width: (outW / (opening.rx * 2)) * 100,
      height: (outH / (opening.ry * 2)) * 100,
    },
    // Travel as a percentage of the avatar box, so it also scales.
    travel: {
      x: (travel / IMG_W) * 100,
      y: ((travel * VERTICAL_TRAVEL_RATIO) / IMG_H) * 100,
    },
    travelPx: travel,
  };
}

await writeFile(GEOMETRY_OUT, JSON.stringify(geometry, null, 2) + '\n');

console.log('sprites ->', OUT_DIR);
console.log('geometry ->', GEOMETRY_OUT);
console.log(JSON.stringify(geometry, null, 1));
