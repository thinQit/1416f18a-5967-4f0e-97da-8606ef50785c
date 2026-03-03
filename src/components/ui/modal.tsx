"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs: Array<string | undefined | null | false>) => twMerge(clsx(inputs));

export type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
};

export function Modal({ open, title, onClose, children, footer, className }: ModalProps) {
  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative z-10 w-full max-w-lg rounded-lg bg-white p-6 shadow-lg",
          className
        )}
      >
        {title ? <h2 className="mb-4 text-lg font-semibold text-gray-900">{title}</h2> : null}
        <div className="text-sm text-gray-700">{children}</div>
        {footer ? <div className="mt-6 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>,
    document.body
  );
}
