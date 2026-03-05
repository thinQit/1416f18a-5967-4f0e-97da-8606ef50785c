import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export const Badge = ({ children, className = '', ...props }: BadgeProps) => {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800 ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
};
