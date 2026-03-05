import type { ReactNode } from 'react';

type CardProps = {
  children?: ReactNode;
  className?: string;
};

function Card({ children, className }: CardProps) {
  return <div className={`p-4 ${className ?? ''}`.trim()}>{children}</div>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={`p-4 ${className ?? ''}`.trim()}>{children}</div>;
}

export { Card };
export default Card;
