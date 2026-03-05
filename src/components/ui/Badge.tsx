import type { HTMLAttributes } from 'react';

export function Badge({ className = '', ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground ${className}`}
      {...props}
    />
  );
}

export default Badge;
