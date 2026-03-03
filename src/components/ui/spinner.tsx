import * as React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: number;
};

const cn = (...inputs: Array<string | undefined | null | false>) => twMerge(clsx(inputs));

export const Spinner: React.FC<SpinnerProps> = ({ size = 24, className, ...props }) => {
  return (
    <div
      className={cn("inline-block animate-spin rounded-full border-2 border-current border-t-transparent", className)}
      style={{ width: size, height: size }}
      aria-label="Loading"
      role="status"
      {...props}
    />
  );
};
