import { cn } from "../../../src/cn";
import { IconTriangleRight } from "../../../src/icons";

export type BadgeType =
  | "neutral"
  | "pending"
  | "info"
  | "danger"
  | "warning"
  | "success"
  | "muted";

export type BadgeProps = {
  label: string;
  type?: BadgeType;
  className?: string;
  onClick?: () => void;
  onArrowClick?: () => void;
};

export const Badge = ({ label, type = "neutral", className, onClick, onArrowClick }: BadgeProps) => {
  const normalizedType: BadgeType = [
    "neutral",
    "pending",
    "info",
    "danger",
    "warning",
    "success",
    "muted",
  ].includes(type)
    ? type
    : "neutral";

  const mainEnabled = typeof onClick === "function";
  const arrowEnabled = typeof onArrowClick === "function";

  return (
    <div className={cn("ds-badge", className)} data-type={normalizedType}>
      <button className="ds-badge-main" disabled={!mainEnabled} onClick={onClick} type="button">
        {label}
      </button>
      <button className="ds-badge-arrow" disabled={!arrowEnabled} onClick={onArrowClick} type="button">
        <IconTriangleRight className="size-4" />
      </button>
    </div>
  );
};
