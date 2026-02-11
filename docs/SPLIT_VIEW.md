# Split View

## Goal

Enable side-by-side comparison of two frameworks (initially Django and React) with synchronized args and zoom.

## Guarantees

- Same initial story defaults in both panes.
- Changes in controls immediately affect both panes.
- Zoom behavior remains symmetric.
- Overlay/portal behavior remains contained to each pane.

## State model

- Single source of truth: `args`.
- UI mode: `django | react | split`.
- Derived state: `effectivePreviewMode` based on adapter availability.

## Rendering model

1. Resolve active component and story.
2. Hydrate default args.
3. Render selected mode.
4. In split mode, mount each pane with shared args bridge.

## Common edge cases

- Story present in one adapter but missing in another.
- Different default assumptions between adapters.
- Portal content leaking outside pane container.
- Focus traps conflicting across panes.

## Testing checklist

- Switching modes preserves args.
- Updating text/boolean/select controls syncs both panes.
- Missing React story shows placeholder only in React pane.
- Zoom reset works in single and split mode.
