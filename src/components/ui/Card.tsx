import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

function Card({ className = '', ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm ${className}`}
      {...props}
    />
  );
}

export function CardHeader({ className = '', ...props }: CardSectionProps) {
  return <div className={`mb-3 text-lg font-semibold ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: CardSectionProps) {
  return <div className={`text-sm text-gray-700 ${className}`} {...props} />;
}

export default Card;
