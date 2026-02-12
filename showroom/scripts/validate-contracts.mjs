import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const COMPONENTS_ROOT = path.join(ROOT, "components", "cotton", "ds");
const REQUIRED_COMPONENT_KEYS = ["slug", "label", "type", "order", "stories", "cotton"];
const ALLOWED_COMPONENT_KEYS = new Set([
  "slug",
  "label",
  "type",
  "order",
  "stories",
  "cotton",
  "react"
]);

function findComponentJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...findComponentJsonFiles(full));
      continue;
    }

    if (entry.isFile() && entry.name === "component.json") {
      files.push(full);
    }
  }

  return files;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return { __error: error.message };
  }
}

function exists(filePath) {
  return fs.existsSync(filePath);
}

async function validateComponent(componentPath, errors, warnings) {
  const componentDir = path.dirname(componentPath);
  const component = readJson(componentPath);

  if (component.__error) {
    errors.push(`Invalid JSON: ${componentPath} (${component.__error})`);
    return;
  }

  for (const key of REQUIRED_COMPONENT_KEYS) {
    if (!(key in component)) {
      errors.push(`Missing required key '${key}' in ${componentPath}`);
    }
  }

  for (const key of Object.keys(component)) {
    if (!ALLOWED_COMPONENT_KEYS.has(key)) {
      errors.push(`Unsupported key '${key}' in ${componentPath}`);
    }
  }

  const cotton = component.cotton;
  if (!cotton || typeof cotton !== "object" || Array.isArray(cotton)) {
    errors.push(`'cotton' must be an object in ${componentPath}`);
  } else {
    if (typeof cotton.template !== "string" || !cotton.template.trim()) {
      errors.push(`Missing 'cotton.template' string in ${componentPath}`);
    }

    if (typeof cotton.controls === "string") {
      const controlsPath = path.join(componentDir, cotton.controls);
      if (!exists(controlsPath)) {
        errors.push(`Missing controls file: ${controlsPath}`);
      } else {
        const controls = readJson(controlsPath);
        if (controls.__error || typeof controls !== "object" || Array.isArray(controls)) {
          errors.push(`Invalid controls object: ${controlsPath}`);
        }
      }
    }
  }

  let stories = [];
  if (Array.isArray(component.stories)) {
    stories = component.stories;
  } else if (typeof component.stories === "string") {
    const storiesPath = path.join(componentDir, component.stories);
    if (!exists(storiesPath)) {
      errors.push(`Missing stories file: ${storiesPath}`);
    } else {
      const parsed = readJson(storiesPath);
      if (parsed.__error || !Array.isArray(parsed)) {
        errors.push(`Stories must be an array: ${storiesPath}`);
      } else {
        stories = parsed;
      }
    }
  } else {
    errors.push(`'stories' must be a string path or array in ${componentPath}`);
  }

  const storySlugs = [];
  for (const story of stories) {
    if (!story || typeof story !== "object") {
      errors.push(`Story entry must be object in ${componentPath}`);
      continue;
    }

    if (!story.slug || typeof story.slug !== "string") {
      errors.push(`Story missing 'slug' in ${componentPath}`);
      continue;
    }

    storySlugs.push(story.slug);

    if (!story.name || typeof story.name !== "string") {
      errors.push(`Story '${story.slug}' missing 'name' in ${componentPath}`);
    }

    if (!story.template || typeof story.template !== "string") {
      errors.push(`Story '${story.slug}' missing 'template' in ${componentPath}`);
      continue;
    }

    const templatePath = path.join(ROOT, "components", story.template);
    if (!exists(templatePath)) {
      errors.push(`Story template not found: ${templatePath}`);
    }
  }

  const reactPreviewPath = component?.react?.preview;
  if (typeof reactPreviewPath === "string" && reactPreviewPath.trim()) {
    const fullPreviewPath = path.join(componentDir, reactPreviewPath);

    if (!exists(fullPreviewPath)) {
      errors.push(`React preview file not found: ${fullPreviewPath}`);
      return;
    }

    const fileUrl = new URL(`file://${fullPreviewPath}`);
    const module = await import(fileUrl.href);
    const exportedStories = module?.stories;

    if (!exportedStories || typeof exportedStories !== "object") {
      errors.push(`React preview must export 'stories' object: ${fullPreviewPath}`);
      return;
    }

    const reactSlugs = Object.keys(exportedStories);
    for (const reactSlug of reactSlugs) {
      if (!storySlugs.includes(reactSlug)) {
        errors.push(`React story '${reactSlug}' not in stories.json (${componentPath})`);
      }
    }

    for (const storySlug of storySlugs) {
      if (!reactSlugs.includes(storySlug)) {
        warnings.push(`React preview missing story '${storySlug}' (${componentPath})`);
      }
    }
  }
}

async function main() {
  const errors = [];
  const warnings = [];

  if (!exists(COMPONENTS_ROOT)) {
    console.error(`Components root not found: ${COMPONENTS_ROOT}`);
    process.exit(1);
  }

  const files = findComponentJsonFiles(COMPONENTS_ROOT).sort();
  for (const file of files) {
    await validateComponent(file, errors, warnings);
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(`Error: ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validated ${files.length} component contract(s).`);
}

await main();
