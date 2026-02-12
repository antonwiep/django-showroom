import React from "react";

import { Badge, type BadgeType } from "../badge.react";

type StoryContext = {
  args: Record<string, unknown>;
};

type StoryEntry = {
  render: (context: StoryContext) => React.ReactElement;
};

function str(value: unknown, fallback = ""): string {
  if (value === null || value === undefined) {
    return fallback;
  }
  const normalized = String(value);
  return normalized.length > 0 ? normalized : fallback;
}

function bool(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined) {
    return fallback;
  }
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["", "0", "false", "off", "no"].includes(lowered)) {
      return false;
    }
  }
  return Boolean(value);
}

function type(value: unknown, fallback: BadgeType): BadgeType {
  return ["neutral", "pending", "info", "danger", "warning", "success", "muted"].includes(
    String(value)
  )
    ? (String(value) as BadgeType)
    : fallback;
}

function shared(
  context: StoryContext,
  defaults: { label: string; type: BadgeType; mainEnabled: boolean; arrowEnabled: boolean }
): React.ReactElement {
  const mainEnabled = bool(context.args.mainEnabled, defaults.mainEnabled);
  const arrowEnabled = bool(context.args.arrowEnabled, defaults.arrowEnabled);

  return React.createElement(Badge, {
    label: str(context.args.label, defaults.label),
    type: type(context.args.type, defaults.type),
    onClick: mainEnabled ? () => undefined : undefined,
    onArrowClick: arrowEnabled ? () => undefined : undefined,
  });
}

export const stories: Record<string, StoryEntry> = {
  neutral: {
    render: (context) =>
      shared(context, {
        label: "neutral",
        type: "neutral",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
  pending: {
    render: (context) =>
      shared(context, {
        label: "pending",
        type: "pending",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
  info: {
    render: (context) =>
      shared(context, {
        label: "info",
        type: "info",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
  danger: {
    render: (context) =>
      shared(context, {
        label: "danger",
        type: "danger",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
  warning: {
    render: (context) =>
      shared(context, {
        label: "warning",
        type: "warning",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
  success: {
    render: (context) =>
      shared(context, {
        label: "success",
        type: "success",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
  muted: {
    render: (context) =>
      shared(context, {
        label: "muted",
        type: "muted",
        mainEnabled: true,
        arrowEnabled: true,
      }),
  },
};
