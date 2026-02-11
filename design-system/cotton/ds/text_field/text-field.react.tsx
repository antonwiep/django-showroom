import {
  type ComponentProps,
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../../../src/cn";
import { IconXClear } from "../../../src/icons";

export type TextFieldProps = Omit<ComponentProps<"input">, "className"> & {
  className?: string;
  label?: string;
  showLabel?: boolean;
  optional?: boolean;
  size?: "sm" | "md";
  iconStart?: React.ReactNode;
  clearable?: boolean;
  error?: string;
};

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      label,
      showLabel = true,
      optional = false,
      size = "md",
      iconStart,
      clearable = false,
      error,
      disabled,
      id: providedId,
      value: controlledValue,
      defaultValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId ?? generatedId;
    const errorId = `${id}-error`;
    const inputRef = useRef<HTMLInputElement>(null);

    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const value = isControlled ? controlledValue : internalValue;

    const normalizedSize: "sm" | "md" = size === "sm" ? "sm" : "md";
    const hasError = Boolean(error);
    const hasValue = value !== undefined && value !== "";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!isControlled) {
        setInternalValue(e.target.value);
      }
      onChange?.(e);
    };

    const handleClear = () => {
      if (!isControlled) {
        setInternalValue("");
      }

      if (onChange && inputRef.current) {
        const event = {
          target: { ...inputRef.current, value: "" },
          currentTarget: { ...inputRef.current, value: "" },
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(event);
      }

      inputRef.current?.focus();
    };

    return (
      <div
        className={cn("ds-text-field", className)}
        data-disabled={disabled ? "true" : "false"}
        data-error={hasError ? "true" : "false"}
        data-size={normalizedSize}
      >
        {label && showLabel && (
          <div className="ds-text-field-label-row">
            <label className="ds-text-field-label" htmlFor={id}>
              {label}
            </label>
            {optional && <span className="ds-text-field-optional">(optional)</span>}
          </div>
        )}

        <div className="ds-text-field-input-wrapper">
          {iconStart && <span className="ds-text-field-icon">{iconStart}</span>}

          <input
            aria-describedby={hasError ? errorId : undefined}
            aria-invalid={hasError || undefined}
            className="ds-text-field-input"
            disabled={disabled}
            id={id}
            onChange={handleChange}
            ref={(node) => {
              (
                inputRef as React.MutableRefObject<HTMLInputElement | null>
              ).current = node;
              if (typeof ref === "function") {
                ref(node);
              } else if (ref) {
                ref.current = node;
              }
            }}
            value={value}
            {...props}
          />

          {clearable && hasValue && !disabled && (
            <button
              aria-label="Clear input"
              className="ds-text-field-clear"
              onClick={handleClear}
              tabIndex={-1}
              type="button"
            >
              <IconXClear />
            </button>
          )}
        </div>

        {error && (
          <span className="ds-text-field-error" id={errorId}>
            {error}
          </span>
        )}
      </div>
    );
  }
);

TextField.displayName = "TextField";
