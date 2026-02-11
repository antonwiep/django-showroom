import type { ComponentProps, ReactNode } from "react";
import { cn } from "../../../src/cn";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "outline";
export type ButtonSize = "large" | "medium" | "compact" | "small";

export type ButtonProps = ComponentProps<"button"> & {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  isActive?: boolean;
};

export const Button = ({
  children,
  variant = "primary",
  size = "large",
  iconStart,
  iconEnd,
  isActive = false,
  disabled = false,
  className,
  ...props
}: ButtonProps) => {
  const normalizedVariant: ButtonVariant = [
    "primary",
    "secondary",
    "danger",
    "ghost",
    "outline",
  ].includes(variant)
    ? variant
    : "primary";

  const normalizedSize: ButtonSize = ["large", "medium", "compact", "small"].includes(size)
    ? size
    : "large";

  return (
    <button
      {...props}
      className={cn("ds-button", className)}
      data-active={isActive ? "true" : "false"}
      data-disabled={disabled ? "true" : "false"}
      data-size={normalizedSize}
      data-variant={normalizedVariant}
      disabled={disabled}
      type={props.type ?? "button"}
    >
      {iconStart && <span className="ds-button-icon">{iconStart}</span>}
      <span className="ds-button-label" data-size={normalizedSize}>
        {children}
      </span>
      {iconEnd && <span className="ds-button-icon">{iconEnd}</span>}
    </button>
  );
};
