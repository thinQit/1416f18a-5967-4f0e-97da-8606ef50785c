import type React from 'react';
import { cn } from '@/lib/utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg';
  colorClassName?: string;
}

const sizeMap: Record<NonNullable<SpinnerProps['size']>, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-10 w-10 border-4'
};

export default function Spinner({
  size = 'md',
  colorClassName = 'border-blue-600',
  className,
  ...props
}: SpinnerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'inline-block animate-spin rounded-full border-solid border-gray-200 border-t-transparent',
        sizeMap[size],
        colorClassName,
        className
      )}
      {...props}
    />
  );
}
