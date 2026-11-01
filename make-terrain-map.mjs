import sharp from "sharp";
import { fileURLToPath } from "node:url";

const width = 2048;
const height = 1024;
const root = new URL("../public/assets/", import.meta.url);

const read = async (name) => {
  const { data } = await sharp(fileURLToPath(new URL(name, root)))
    .resize(width, height, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  return data;
};

const political = await read("political-world.png");
const satellite = await read("earth-texture.jpg");
const color = Buffer.alloc(width * height * 3);
const relief = Buffer.alloc(width * height);

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));
const noise = (x, y) => {
  const n = Math.sin(x * 0.071 + y * 0.119) * 0.5 +
    Math.sin(x * 0.019 - y * 0.031) * 0.32 +
    Math.sin(x * 0.006 + y * 0.011) * 0.18;
  return n;
};

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    const i = (y * width + x) * 3;
    const pR = political[i];
    const pG = political[i + 1];
    const pB = political[i + 2];
    const sR = satellite[i];
    const sG = satellite[i + 1];
    const sB = satellite[i + 2];
    const max = Math.max(sR, sG, sB);
    const min = Math.min(sR, sG, sB);
    const saturation = max ? (max - min) / max : 0;
    const brightness = (sR + sG + sB) / 3;
    const border = pR > 115 && pG > 165 && pB > 175;
    const land = border || (pR > 18 && pG > 53 && pB > 62);
    const n = noise(x, y);

    if (land) {
      const cloudy = saturation < 0.14 && brightness > 145;
      const terrainR = 77 + n * 18;
      const terrainG = 92 + n * 24;
      const terrainB = 61 + n * 10;
      const satelliteWeight = cloudy ? 0.22 : 0.74;
      const tintWeight = 1 - satelliteWeight;
      color[i] = clamp(sR * satelliteWeight + terrainR * tintWeight);
      color[i + 1] = clamp(sG * satelliteWeight + terrainG * tintWeight);
      color[i + 2] = clamp(sB * satelliteWeight + terrainB * tintWeight);
      const terrainLight = (color[i] + color[i + 1] + color[i + 2]) / 3;
      relief[y * width + x] = clamp(84 + terrainLight * 0.5 + n * 20);
    } else {
      const oceanVariation = saturation > 0.18 ? (sB - sR) * 0.12 : 0;
      color[i] = clamp(4 + n * 2);
      color[i + 1] = clamp(35 + n * 5 + oceanVariation * 0.18);
      color[i + 2] = clamp(63 + n * 8 + oceanVariation * 0.38);
      relief[y * width + x] = clamp(22 + n * 5);
    }

    if (border) {
      color[i] = 166;
      color[i + 1] = 225;
      color[i + 2] = 224;
    }
  }
}

await sharp(color, { raw: { width, height, channels: 3 } })
  .png({ compressionLevel: 9, palette: true, quality: 92 })
  .toFile(fileURLToPath(new URL("terrain-political-world.png", root)));

await sharp(relief, { raw: { width, height, channels: 1 } })
  .png({ compressionLevel: 9 })
  .toFile(fileURLToPath(new URL("terrain-relief.png", root)));

console.log("Generated terrain-political-world.png and terrain-relief.png");
