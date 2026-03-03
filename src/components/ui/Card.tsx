import React from 'react';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

type CardSectionProps = React.HTMLAttributes<HTMLDivElement>;

export default function Card({ className = '', ...props }: CardProps) {
  return <div className={`p-4 ${className}`} {...props} />;
}

export function CardHeader({ className = '', ...props }: CardSectionProps) {
  return <div className={`mb-2 ${className}`} {...props} />;
}

export function CardContent({ className = '', ...props }: CardSectionProps) {
  return <div className={className} {...props} />;
}
