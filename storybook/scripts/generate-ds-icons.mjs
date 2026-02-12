import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_SOURCE_DIR = path.resolve(__dirname, '../../components/icons');
const ICONS_OUTPUT_DIR = path.resolve(__dirname, '../../static/icons/design-system');
const MANIFEST_PATH = path.join(ICONS_OUTPUT_DIR, 'manifest.json');

const ATTR_RENAMES = {
  strokeWidth: 'stroke-width',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeMiterlimit: 'stroke-miterlimit',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeOpacity: 'stroke-opacity',
  fillRule: 'fill-rule',
  fillOpacity: 'fill-opacity',
  clipRule: 'clip-rule',
};

function toLabel(iconName) {
  return iconName
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function normalizeSvg(svgMarkup) {
  let normalized = svgMarkup;
  normalized = normalized.replace(/\sclassName=\{className\}/g, '');
  normalized = normalized.replace(/\sclassName="[^"]*"/g, '');

  for (const [source, target] of Object.entries(ATTR_RENAMES)) {
    const matcher = new RegExp(`\\b${source}=`, 'g');
    normalized = normalized.replace(matcher, `${target}=`);
  }

  normalized = normalized.replace(/>\s+</g, '><').trim();
  return normalized;
}

async function generate() {
  await mkdir(ICONS_OUTPUT_DIR, { recursive: true });

  const files = await readdir(ICONS_SOURCE_DIR);
  const iconFiles = files
    .filter((fileName) => fileName.endsWith('.tsx') && fileName !== 'index.ts')
    .sort();

  const manifest = [];

  for (const fileName of iconFiles) {
    const sourcePath = path.join(ICONS_SOURCE_DIR, fileName);
    const source = await readFile(sourcePath, 'utf-8');
    const svgMatch = source.match(/<svg\b[\s\S]*?<\/svg>/m);
    if (!svgMatch) {
      continue;
    }

    const iconName = fileName.replace(/\.tsx$/, '');
    const normalizedSvg = normalizeSvg(svgMatch[0]);
    const outputFileName = `${iconName}.svg`;
    const outputPath = path.join(ICONS_OUTPUT_DIR, outputFileName);

    await writeFile(outputPath, `${normalizedSvg}\n`, 'utf-8');

    manifest.push({
      name: iconName,
      label: toLabel(iconName),
      file: outputFileName,
    });
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
  console.log(`Generated ${manifest.length} DS icons in static/icons/design-system`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
