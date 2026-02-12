import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const COMPONENTS_ROOT = path.join(ROOT, "components", "cotton", "ds");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const components = [];

  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const componentJson = path.join(full, "component.json");
      if (fs.existsSync(componentJson)) {
        components.push(full);
      } else {
        components.push(...walk(full));
      }
    }
  }

  return components;
}

const components = walk(COMPONENTS_ROOT);
const missing = [];

for (const componentDir of components) {
  const files = fs.readdirSync(componentDir);
  const hasRecipe = files.some((f) => f.endsWith(".recipe.css"));
  if (!hasRecipe) {
    missing.push(componentDir);
  }
}

if (missing.length) {
  for (const dir of missing) {
    console.error(`Missing recipe CSS: ${dir}`);
  }
  process.exit(1);
}

console.log(`Recipe check passed for ${components.length} component(s).`);
