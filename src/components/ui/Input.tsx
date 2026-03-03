import type { InputHTMLAttributes, ReactNode } from "react";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
};

export function Input({ label, className = "", id, ...props }: InputProps) {
  const inputId = id ?? (typeof props.name === "string" ? props.name : undefined);

  return (
    <label className="flex w-full flex-col gap-2 text-sm text-foreground/80">
      {label && <span className="font-medium text-foreground">{label}</span>}
      <input
        id={inputId}
        className={`h-10 rounded-md border border-foreground/20 bg-background px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-1 focus:ring-primary ${className}`}
        {...props}
      />
    </label>
  );
}
