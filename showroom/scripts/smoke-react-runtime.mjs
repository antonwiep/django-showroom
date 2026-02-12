import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const REGISTRY = path.join(ROOT, "static", "showroom", "showroomReact.registry.generated.js");

if (!fs.existsSync(REGISTRY)) {
  console.error(`Registry file missing: ${REGISTRY}`);
  console.error("Run: npm run build:registry");
  process.exit(1);
}

const module = await import(new URL(`file://${REGISTRY}`).href);
const registry = module.showroomReactRegistry;

if (!registry || typeof registry !== "object") {
  console.error("Invalid registry export: expected object");
  process.exit(1);
}

let checked = 0;

for (const [componentSlug, stories] of Object.entries(registry)) {
  if (!stories || typeof stories !== "object") {
    console.error(`Invalid stories object for component '${componentSlug}'`);
    process.exit(1);
  }

  for (const [storySlug, entry] of Object.entries(stories)) {
    let renderFn = null;

    if (typeof entry === "function") {
      renderFn = entry;
    } else if (entry && typeof entry === "object" && typeof entry.render === "function") {
      renderFn = entry.render;
    }

    if (!renderFn) {
      console.error(`Story '${componentSlug}/${storySlug}' has no render function`);
      process.exit(1);
    }

    const output = renderFn({
      args: { label: "Smoke" },
      onArgsChange: () => {},
      portalContainer: null
    });

    if (typeof output !== "string") {
      console.error(
        `Story '${componentSlug}/${storySlug}' render output must be a string in no-Django mode`
      );
      process.exit(1);
    }

    checked += 1;
  }
}

console.log(`Runtime smoke test passed for ${checked} story renderer(s).`);
