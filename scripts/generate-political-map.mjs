import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { feature } from "topojson-client";
import { geoEquirectangular, geoPath } from "d3-geo";

const root = process.cwd();
const topology = JSON.parse(await fs.readFile(path.join(root, "public/assets/countries-110m.json"), "utf8"));
const countries = feature(topology, topology.objects.countries);
const width = 2048;
const height = 1024;
const projection = geoEquirectangular().translate([width / 2, height / 2]).scale(width / (2 * Math.PI)).precision(0.1);
const makePath = geoPath(projection);
const fills = ["#1d5961", "#174b55", "#285a58", "#19485d", "#20516a"];

const grid = [];
for (let lng = -150; lng <= 150; lng += 30) {
  const x = ((lng + 180) / 360) * width;
  grid.push(`<line x1="${x}" y1="0" x2="${x}" y2="${height}"/>`);
}
for (let lat = -60; lat <= 60; lat += 30) {
  const y = ((90 - lat) / 180) * height;
  grid.push(`<line x1="0" y1="${y}" x2="${width}" y2="${y}"/>`);
}

const land = countries.features.map((country, index) => {
  const d = makePath(country);
  return d ? `<path d="${d}" fill="${fills[index % fills.length]}"/>` : "";
}).join("");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <linearGradient id="ocean" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#071d32"/>
      <stop offset="0.52" stop-color="#0a2b43"/>
      <stop offset="1" stop-color="#06192c"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#ocean)"/>
  <g fill="none" stroke="#47afcf" stroke-opacity="0.16" stroke-width="1">${grid.join("")}</g>
  <g stroke="#b8f2f5" stroke-opacity="0.96" stroke-width="1.4" stroke-linejoin="round">${land}</g>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toFile(path.join(root, "public/assets/political-world.png"));
console.log("Generated public/assets/political-world.png");
