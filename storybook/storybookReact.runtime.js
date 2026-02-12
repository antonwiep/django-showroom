import React from "react";
import { createRoot } from "react-dom/client";

import { storybookReactRegistry } from "./storybookReact.registry.generated";

const roots = new Map();

function renderNotice(message) {
  return React.createElement(
    "div",
    {
      className:
        "flex min-h-52 min-w-[420px] items-center justify-center rounded-10 border border-dashed border-g6 bg-g0 px-4 text-regular text-g9",
    },
    message
  );
}

function getStoryRenderer(componentSlug, storySlug) {
  const componentStories = storybookReactRegistry?.[componentSlug];
  if (!componentStories || typeof componentStories !== "object") {
    return null;
  }

  const storyEntry = componentStories?.[storySlug];
  if (!storyEntry) {
    return null;
  }

  if (typeof storyEntry === "function") {
    return storyEntry;
  }

  if (typeof storyEntry === "object" && typeof storyEntry.render === "function") {
    return storyEntry.render;
  }

  return null;
}

function ensureRoot(element) {
  const existing = roots.get(element);
  if (existing) {
    return existing;
  }

  const root = createRoot(element);
  roots.set(element, root);
  return root;
}

function cleanupRoots() {
  for (const [element, root] of roots.entries()) {
    if (!document.body.contains(element)) {
      root.unmount();
      roots.delete(element);
    }
  }
}

function sync({ componentSlug, storySlug, args = {}, onArgsChange } = {}) {
  cleanupRoots();

  const targets = Array.from(document.querySelectorAll("[data-react-story-root]"));
  if (!targets.length) {
    return;
  }

  const renderer = getStoryRenderer(componentSlug, storySlug);

  for (const target of targets) {
    const root = ensureRoot(target);
    const portalContainer =
      target.closest("[data-storybook-zoom-root]") ??
      target.closest("[data-storybook-preview-pane]") ??
      target.closest("[data-storybook-preview-root]") ??
      target.parentElement ??
      null;

    if (!renderer) {
      root.render(
        renderNotice(
          "React preview not implemented for this component/story yet."
        )
      );
      continue;
    }

    try {
      root.render(
        renderer({
          args,
          onArgsChange,
          portalContainer,
        })
      );
    } catch (error) {
      root.render(
        renderNotice(
          `React preview failed: ${error instanceof Error ? error.message : String(error)}`
        )
      );
    }
  }
}

window.storybookReactPreview = {
  sync,
};
