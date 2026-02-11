import React from "react";

import {
  IconChevronDownSmall,
  IconEllipsisHorizontal,
  IconSearch,
  IconSquarePlaceholderDashed,
  IconThunder,
  IconTriangleRight,
  IconXClear,
  IconXMark,
} from "../../../../src/icons";
import { Button, type ButtonSize, type ButtonVariant } from "../button.react";

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
  return String(value);
}

function bool(value: unknown): boolean {
  if (typeof value === "string") {
    const lowered = value.trim().toLowerCase();
    if (["", "0", "false", "off", "no"].includes(lowered)) {
      return false;
    }
  }
  return Boolean(value);
}

function variant(value: unknown, fallback: ButtonVariant): ButtonVariant {
  return ["primary", "secondary", "danger", "ghost", "outline"].includes(String(value))
    ? (String(value) as ButtonVariant)
    : fallback;
}

function size(value: unknown, fallback: ButtonSize): ButtonSize {
  return ["large", "medium", "compact", "small"].includes(String(value))
    ? (String(value) as ButtonSize)
    : fallback;
}

function iconByName(value: unknown): React.ReactNode | undefined {
  const name = str(value).trim();
  switch (name) {
    case "thunder":
      return React.createElement(IconThunder, { className: "size-4" });
    case "search":
      return React.createElement(IconSearch, { className: "size-4" });
    case "x-clear":
      return React.createElement(IconXClear, { className: "size-4" });
    case "x-mark":
      return React.createElement(IconXMark, { className: "size-4" });
    case "ellipsis-horizontal":
      return React.createElement(IconEllipsisHorizontal, { className: "size-4" });
    case "triangle-right":
      return React.createElement(IconTriangleRight, { className: "size-4" });
    case "square-placeholder-dashed":
      return React.createElement(IconSquarePlaceholderDashed, { className: "size-4" });
    case "chevron-down-small":
      return React.createElement(IconChevronDownSmall, { className: "size-4" });
    default:
      return undefined;
  }
}

function sharedButton(
  context: StoryContext,
  defaults: {
    label: string;
    variant: ButtonVariant;
    size: ButtonSize;
    disabled?: boolean;
    iconStart?: string;
    iconEnd?: string;
  }
): React.ReactElement {
  const label = str(context.args.label, defaults.label);
  const disabled = bool(context.args.disabled ?? defaults.disabled ?? false);

  return React.createElement(Button, {
    variant: variant(context.args.variant, defaults.variant),
    size: size(context.args.size, defaults.size),
    disabled,
    isActive: bool(context.args.isActive),
    iconStart: iconByName(context.args.iconStart ?? defaults.iconStart ?? ""),
    iconEnd: iconByName(context.args.iconEnd ?? defaults.iconEnd ?? ""),
    children: label,
  });
}

export const stories: Record<string, StoryEntry> = {
  default: {
    render: (context) =>
      sharedButton(context, {
        label: "Primary Button",
        variant: "primary",
        size: "large",
      }),
  },
  secondary: {
    render: (context) =>
      sharedButton(context, {
        label: "Secondary Button",
        variant: "secondary",
        size: "large",
      }),
  },
  danger: {
    render: (context) =>
      sharedButton(context, {
        label: "Danger Button",
        variant: "danger",
        size: "large",
      }),
  },
  ghost: {
    render: (context) =>
      sharedButton(context, {
        label: "Ghost Button",
        variant: "ghost",
        size: "large",
      }),
  },
  outline: {
    render: (context) =>
      sharedButton(context, {
        label: "Outline Button",
        variant: "outline",
        size: "large",
      }),
  },
  "with-icon": {
    render: (context) =>
      sharedButton(context, {
        label: "Button with Icon",
        variant: "primary",
        size: "large",
        iconStart: "thunder",
      }),
  },
  "with-icon-end": {
    render: (context) =>
      sharedButton(context, {
        label: "Button with Icon End",
        variant: "primary",
        size: "large",
        iconEnd: "thunder",
      }),
  },
  "with-icons-both": {
    render: (context) =>
      sharedButton(context, {
        label: "Button with Both Icons",
        variant: "primary",
        size: "large",
        iconStart: "thunder",
        iconEnd: "thunder",
      }),
  },
  disabled: {
    render: (context) =>
      sharedButton(context, {
        label: "Disabled Button",
        variant: "primary",
        size: "large",
        disabled: true,
      }),
  },
};
