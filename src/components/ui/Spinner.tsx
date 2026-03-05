import type { HTMLAttributes } from 'react';

export type SpinnerProps = HTMLAttributes<HTMLDivElement>;

export const Spinner = ({ className = '', ...props }: SpinnerProps) => {
  return (
    <div
      className={`inline-block h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${className}`.trim()}
      {...props}
    />
  );
};
