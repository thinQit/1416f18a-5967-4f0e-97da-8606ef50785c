import React from "react";

export type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={
        "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm " +
        (className ?? "")
      }
      {...props}
    />
  );
});

export const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(
  function CardHeader({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={"border-b border-gray-100 px-4 py-3 " + (className ?? "")}
        {...props}
      />
    );
  }
);

export const CardContent = React.forwardRef<HTMLDivElement, CardProps>(
  function CardContent({ className, ...props }, ref) {
    return (
      <div
        ref={ref}
        className={"px-4 py-3 " + (className ?? "")}
        {...props}
      />
    );
  }
);

export default Card;
