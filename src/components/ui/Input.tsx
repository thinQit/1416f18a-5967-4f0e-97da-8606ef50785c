import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

export default function Input({ className = "", error, ...props }: InputProps) {
  return (
    <div className="w-full">
      <input
        className={`w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
        {...props}
      />
      {error ? <p className="mt-1 text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
