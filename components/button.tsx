"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { LoaderCircle, Play } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "soft";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-pink-500 text-white shadow-md hover:bg-pink-600 hover:shadow-lg focus-visible:ring-pink-200",
  secondary:
    "border-2 border-pink-200 bg-white text-pink-600 shadow-sm hover:bg-pink-50 focus-visible:ring-pink-100",
  soft:
    "bg-pink-100 text-pink-700 hover:bg-pink-200 focus-visible:ring-pink-100",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-10 px-4 py-2 text-sm",
  md: "min-h-11 px-5 py-2.5 text-sm sm:text-base",
  lg: "min-h-12 px-6 py-3 text-base sm:text-lg",
};

export default function Button({
  children = "Mulai belajar",
  icon,
  variant = "primary",
  size = "lg",
  loading = false,
  disabled,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  const leadingIcon = loading ? (
    <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" />
  ) : (
    icon ?? <Play className="h-5 w-5 fill-current" aria-hidden="true" />
  );

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2
        rounded-full font-semibold
        transition duration-200
        focus-visible:outline-none focus-visible:ring-4
        disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {leadingIcon}
      <span>{children}</span>
    </button>
  );
}
