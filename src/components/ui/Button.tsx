import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
};

export const Button = ({ children, className = '', ...props }: ButtonProps) => {
  return (
    <button
      className={`inline-flex items-center justify-center rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
};
