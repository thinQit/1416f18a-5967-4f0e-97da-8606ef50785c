import type { HTMLAttributes } from "react";

export type SpinnerProps = HTMLAttributes<HTMLDivElement>;

export function Spinner({ className = "", ...props }: SpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} {...props}>
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-foreground/20 border-t-primary"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
