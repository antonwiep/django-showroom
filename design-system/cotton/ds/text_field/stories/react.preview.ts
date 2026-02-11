import React from "react";

import { IconSearch } from "../../../../src/icons";
import { TextField } from "../text-field.react";

type StoryContext = {
  args: Record<string, unknown>;
  onArgsChange?: (nextArgs: Record<string, unknown>) => void;
};

type StoryEntry = {
  render: (context: StoryContext) => React.ReactElement;
};

type FieldDefaults = {
  label?: string;
  placeholder?: string;
  value?: string;
  showLabel?: boolean;
  optional?: boolean;
  size?: "sm" | "md";
  clearable?: boolean;
  error?: string;
  disabled?: boolean;
  iconStartName?: string;
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

function boolWithFallback(value: unknown, fallback: boolean): boolean {
  if (value === null || value === undefined) {
    return fallback;
  }
  return bool(value);
}

function sizeWithFallback(value: unknown, fallback: "sm" | "md"): "sm" | "md" {
  if (value === "sm" || value === "md") {
    return value;
  }
  return fallback;
}

function patchArgs(
  onArgsChange: StoryContext["onArgsChange"],
  nextArgs: Record<string, unknown>
): void {
  if (typeof onArgsChange === "function") {
    onArgsChange(nextArgs);
  }
}

function resolveStartIcon(name: string): React.ReactNode {
  if (name === "search") {
    return React.createElement(IconSearch);
  }
  return undefined;
}

function field(context: StoryContext, defaults: FieldDefaults): React.ReactElement {
  const args = context.args;
  const value = str(args.value, defaults.value ?? "");
  const errorText = str(args.error, defaults.error ?? "");
  const iconStartName = str(args.iconStartName, defaults.iconStartName ?? "");

  return React.createElement(
    "div",
    { className: "ds-text-field-story-wrap" },
    React.createElement(TextField, {
      label: str(args.label, defaults.label ?? "") || undefined,
      placeholder: str(args.placeholder, defaults.placeholder ?? ""),
      value,
      showLabel: boolWithFallback(args.showLabel, defaults.showLabel ?? true),
      optional: boolWithFallback(args.optional, defaults.optional ?? false),
      size: sizeWithFallback(args.size, defaults.size ?? "md"),
      clearable: boolWithFallback(args.clearable, defaults.clearable ?? false),
      error: errorText.length > 0 ? errorText : undefined,
      disabled: boolWithFallback(args.disabled, defaults.disabled ?? false),
      iconStart: resolveStartIcon(iconStartName),
      onChange: (event) => patchArgs(context.onArgsChange, { value: event.target.value }),
    })
  );
}

export const stories: Record<string, StoryEntry> = {
  default: {
    render: (context) =>
      field(context, {
        label: "Label",
        placeholder: "Value",
        value: "",
      }),
  },
  "with-search-icon": {
    render: (context) =>
      field(context, {
        label: "Search",
        placeholder: "Search...",
        value: "",
        iconStartName: "search",
      }),
  },
  optional: {
    render: (context) =>
      field(context, {
        label: "Notes",
        placeholder: "Optional notes...",
        value: "",
        optional: true,
      }),
  },
  "with-error": {
    render: (context) =>
      field(context, {
        label: "Email",
        value: "invalid-email",
        error: "Invalid email address",
      }),
  },
  clearable: {
    render: (context) =>
      field(context, {
        label: "Search",
        value: "Kevin",
        clearable: true,
        iconStartName: "search",
      }),
  },
  "no-label": {
    render: (context) =>
      field(context, {
        label: "",
        placeholder: "Search...",
        showLabel: false,
        iconStartName: "search",
      }),
  },
  disabled: {
    render: (context) =>
      field(context, {
        label: "Disabled",
        placeholder: "Cannot edit...",
        disabled: true,
      }),
  },
  "disabled-with-value": {
    render: (context) =>
      field(context, {
        label: "Disabled",
        value: "Some value",
        disabled: true,
        clearable: true,
      }),
  },
  small: {
    render: (context) =>
      field(context, {
        label: "Small",
        placeholder: "Value",
        size: "sm",
      }),
  },
};
