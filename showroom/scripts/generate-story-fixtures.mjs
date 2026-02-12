import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const COMPONENTS_ROOT = path.join(ROOT, "components", "cotton", "ds");
const OUTPUT_FILE = path.join(ROOT, "static", "showroom", "story-fixtures.generated.json");

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function walkComponentJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkComponentJsonFiles(full));
      continue;
    }

    if (entry.isFile() && entry.name === "component.json") {
      files.push(full);
    }
  }

  return files;
}

function resolveStories(componentDir, storiesValue) {
  if (Array.isArray(storiesValue)) {
    return storiesValue;
  }

  if (typeof storiesValue === "string") {
    return readJson(path.join(componentDir, storiesValue));
  }

  return [];
}

function resolveControls(componentDir, controlsValue) {
  if (!controlsValue) {
    return {};
  }

  if (typeof controlsValue === "object") {
    return controlsValue;
  }

  if (typeof controlsValue === "string") {
    return readJson(path.join(componentDir, controlsValue));
  }

  return {};
}

function main() {
  const fixtures = {
    generatedAt: new Date().toISOString(),
    components: []
  };

  const files = walkComponentJsonFiles(COMPONENTS_ROOT).sort();

  for (const file of files) {
    const component = readJson(file);
    const componentDir = path.dirname(file);
    const stories = resolveStories(componentDir, component.stories);
    const controls = resolveControls(componentDir, component?.cotton?.controls);

    fixtures.components.push({
      slug: component.slug,
      label: component.label,
      type: component.type,
      hasReact: Boolean(component?.react?.preview),
      controls,
      stories: stories.map((story) => ({
        slug: story.slug,
        name: story.name,
        defaults: story.defaults ?? {},
        controls: story.controls ?? []
      }))
    });
  }

  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(fixtures, null, 2), "utf8");
  console.log(`Generated fixtures for ${fixtures.components.length} component(s).`);
}

main();
