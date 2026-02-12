import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT_DIR = process.cwd();
const COMPONENTS_ROOT = path.join(ROOT_DIR, "components", "cotton", "ds");
const TEMPLATE_ROOT = path.join(ROOT_DIR, "components");

const ALLOWED_TOP_LEVEL_KEYS = new Set([
  "slug",
  "label",
  "type",
  "order",
  "stories",
  "cotton",
  "react",
]);
const ALLOWED_COTTON_KEYS = new Set(["template", "controls"]);
const ALLOWED_REACT_KEYS = new Set(["preview"]);
const TOP_LEVEL_DEPRECATED_KEYS = ["template", "controls", "alpine", "recipe", "django"];

function walkComponentJsonFiles(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkComponentJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name === "component.json") {
      files.push(fullPath);
    }
  }

  return files;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    return { __error: error };
  }
}

function ensureFileExists(filePath, errors, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`${label} not found: ${filePath}`);
    return false;
  }
  return true;
}

function extractStoryKeys(previewPath, sourceText) {
  const sourceFile = ts.createSourceFile(
    previewPath,
    sourceText,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) {
      continue;
    }
    const hasExport = statement.modifiers?.some(
      (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword
    );
    if (!hasExport) {
      continue;
    }
    for (const declaration of statement.declarationList.declarations) {
      if (!ts.isIdentifier(declaration.name) || declaration.name.text !== "stories") {
        continue;
      }
      if (!declaration.initializer || !ts.isObjectLiteralExpression(declaration.initializer)) {
        return [];
      }
      const keys = [];
      for (const property of declaration.initializer.properties) {
        if (!ts.isPropertyAssignment(property) && !ts.isMethodDeclaration(property)) {
          continue;
        }
        const name = property.name;
        if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
          keys.push(name.text);
        }
      }
      return keys;
    }
  }

  return [];
}

function validateComponentFile(componentJsonPath, errors, warnings) {
  const componentDir = path.dirname(componentJsonPath);
  const componentDirName = path.basename(componentDir);
  const metadata = readJson(componentJsonPath);

  if (metadata.__error) {
    errors.push(`Invalid JSON: ${componentJsonPath} (${metadata.__error.message})`);
    return;
  }

  const requiredKeys = ["slug", "label", "type", "order", "stories", "cotton"];
  for (const key of requiredKeys) {
    if (!(key in metadata)) {
      errors.push(`Missing required key '${key}' in ${componentJsonPath}`);
    }
  }

  for (const key of TOP_LEVEL_DEPRECATED_KEYS) {
    if (key in metadata) {
      errors.push(`Deprecated key '${key}' in ${componentJsonPath}`);
    }
  }

  for (const key of Object.keys(metadata)) {
    if (!ALLOWED_TOP_LEVEL_KEYS.has(key)) {
      errors.push(`Unsupported key '${key}' in ${componentJsonPath}`);
    }
  }

  const cotton = metadata.cotton;
  if (cotton && typeof cotton === "object" && !Array.isArray(cotton)) {
    for (const key of Object.keys(cotton)) {
      if (!ALLOWED_COTTON_KEYS.has(key)) {
        errors.push(`Unsupported key 'cotton.${key}' in ${componentJsonPath}`);
      }
    }
    if (!cotton.template || typeof cotton.template !== "string") {
      errors.push(`Missing required key 'cotton.template' in ${componentJsonPath}`);
    }
    if (!cotton.controls) {
      warnings.push(`No 'cotton.controls' defined in ${componentJsonPath}`);
    }
  } else {
    errors.push(`'cotton' must be an object in ${componentJsonPath}`);
  }

  const storiesValue = metadata.stories;
  let stories = [];
  if (Array.isArray(storiesValue)) {
    stories = storiesValue;
  } else if (typeof storiesValue === "string" && storiesValue.trim()) {
    const storiesPath = path.join(componentDir, storiesValue);
    if (ensureFileExists(storiesPath, errors, "Stories file")) {
      const parsedStories = readJson(storiesPath);
      if (parsedStories.__error || !Array.isArray(parsedStories)) {
        errors.push(`Invalid stories JSON array: ${storiesPath}`);
      } else {
        stories = parsedStories;
      }
    }
  } else {
    errors.push(`'stories' must be a path string or array in ${componentJsonPath}`);
  }

  if (cotton && typeof cotton === "object" && cotton.controls) {
    if (typeof cotton.controls === "string") {
      const controlsPath = path.join(componentDir, cotton.controls);
      if (ensureFileExists(controlsPath, errors, "Controls file")) {
        const controls = readJson(controlsPath);
        if (controls.__error || typeof controls !== "object" || Array.isArray(controls)) {
          errors.push(`Invalid controls JSON object: ${controlsPath}`);
        }
      }
    } else if (typeof cotton.controls !== "object" || Array.isArray(cotton.controls)) {
      errors.push(`'cotton.controls' must be a path string or object in ${componentJsonPath}`);
    }
  }

  const storiesSlugs = [];
  for (const story of stories) {
    if (!story || typeof story !== "object") {
      errors.push(`Story entry must be an object in ${componentJsonPath}`);
      continue;
    }
    if (typeof story.slug !== "string" || !story.slug.trim()) {
      errors.push(`Story is missing 'slug' in ${componentJsonPath}`);
      continue;
    }
    storiesSlugs.push(story.slug);
    if (typeof story.template !== "string" || !story.template.trim()) {
      errors.push(`Story '${story.slug}' is missing 'template' in ${componentJsonPath}`);
      continue;
    }
    const expectedPrefix = `cotton/ds/${componentDirName}/stories/`;
    if (!story.template.startsWith(expectedPrefix)) {
      errors.push(
        `Story '${story.slug}' template must start with '${expectedPrefix}' in ${componentJsonPath}`
      );
    }
    const templatePath = path.join(TEMPLATE_ROOT, story.template);
    ensureFileExists(templatePath, errors, `Template for story '${story.slug}'`);
  }

  const react = metadata.react;
  if (react && typeof react === "object" && !Array.isArray(react)) {
    for (const key of Object.keys(react)) {
      if (!ALLOWED_REACT_KEYS.has(key)) {
        errors.push(`Unsupported key 'react.${key}' in ${componentJsonPath}`);
      }
    }

    if (typeof react.preview === "string" && react.preview.trim()) {
      const previewPath = path.join(componentDir, react.preview);
      if (ensureFileExists(previewPath, errors, "React preview file")) {
        const sourceText = fs.readFileSync(previewPath, "utf8");
        const reactStoryKeys = extractStoryKeys(previewPath, sourceText);
        const storySlugsSet = new Set(storiesSlugs);
        const reactKeysSet = new Set(reactStoryKeys);

        for (const key of reactStoryKeys) {
          if (!storySlugsSet.has(key)) {
            errors.push(
              `React preview story '${key}' is not defined in stories.json (${componentJsonPath})`
            );
          }
        }

        for (const slug of storiesSlugs) {
          if (!reactKeysSet.has(slug)) {
            warnings.push(
              `React preview not implemented for story '${slug}' in ${componentJsonPath}`
            );
          }
        }
      }
    } else if ("preview" in react) {
      errors.push(`'react.preview' must be a non-empty string in ${componentJsonPath}`);
    }
  } else if (react !== undefined) {
    errors.push(`'react' must be an object when set in ${componentJsonPath}`);
  }
}

function main() {
  const errors = [];
  const warnings = [];
  const metadataFiles = walkComponentJsonFiles(COMPONENTS_ROOT).sort();

  for (const metadataFile of metadataFiles) {
    validateComponentFile(metadataFile, errors, warnings);
  }

  warnings.forEach((warning) => {
    console.warn(`Warning: ${warning}`);
  });

  if (errors.length) {
    errors.forEach((error) => {
      console.error(`Error: ${error}`);
    });
    process.exit(1);
  }

  console.log(
    `Validated ${metadataFiles.length} component metadata file(s). ${warnings.length} warning(s).`
  );
}

main();
