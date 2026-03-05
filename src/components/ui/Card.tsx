import type { ReactNode, HTMLAttributes } from 'react';

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const Card = ({ children, className = '', ...props }: CardProps) => {
  return (
    <div className={`rounded border bg-white p-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export type CardHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const CardHeader = ({ children, className = '', ...props }: CardHeaderProps) => {
  return (
    <div className={`mb-2 font-semibold ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};

export type CardContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const CardContent = ({ children, className = '', ...props }: CardContentProps) => {
  return (
    <div className={`text-sm text-gray-700 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
};
