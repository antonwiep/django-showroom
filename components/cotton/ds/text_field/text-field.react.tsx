import {
  type ComponentProps,
  forwardRef,
  useId,
  useRef,
  useState,
} from "react";
import { cn } from "../../../react-utils/cn";

const XMark = () => (
  <svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
  </svg>
);

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
              <XMark />
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
