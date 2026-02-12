import { cn } from "../../../react-utils/cn";

const ChevronRight = ({ className = "" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
  </svg>
);

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
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
};
