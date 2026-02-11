# Adapter Contracts

## Purpose

Adapters make shared story/component contracts render in specific runtimes without redefining the contracts.

## Required adapter capabilities

- Resolve story slug to renderer implementation.
- Accept shared `args` state.
- Emit state changes back through host callback (`onArgsChange`).
- Respect portal/overlay mounting context where relevant.
- Degrade gracefully for unsupported story features.

## Proposed adapter interface (TypeScript)

```ts
export type AdapterRenderContext = {
  componentSlug: string;
  storySlug: string;
  args: Record<string, unknown>;
  onArgsChange?: (patch: Record<string, unknown>) => void;
  portalContainer?: HTMLElement | null;
};

export type StoryRenderer = (context: AdapterRenderContext) => unknown;

export interface FrameworkAdapter {
  framework: "django" | "html" | "cotton" | "alpine" | "js" | "react";
  hasStory(componentSlug: string, storySlug: string): boolean;
  render(context: AdapterRenderContext): unknown;
}
```

## Adapter matrix

- Django adapter: server-side templates and include paths.
- HTML adapter: static templates without Django-specific tags.
- Cotton adapter: component tags + `c-vars` conventions.
- Alpine adapter: runtime directives and state bridge behavior.
- JS adapter: imperative DOM behavior and event bridge.
- React adapter: `stories` registry and render function contract.

## Error behavior

- Missing story: render deterministic placeholder, do not throw uncaught runtime errors.
- Story mismatch: log with component/story IDs.
- Unsupported control type: display disabled control with explanation.

## Compatibility policy

- Contract additions should be backward-compatible when possible.
- Contract removals/renames require deprecation window and migration guide.
