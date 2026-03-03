import * as React from "react";

export type SpinnerProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-6 w-6 border-2",
  lg: "h-10 w-10 border-4",
};

export default function Spinner({ size = "md", className = "" }: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-block animate-spin rounded-full border-gray-300 border-t-blue-600 ${sizeMap[size]} ${className}`}
    />
  );
}
