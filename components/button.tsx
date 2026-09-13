"use client";

import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

import { Play } from "lucide-react";

type ButtonProps =
  ButtonHTMLAttributes<HTMLButtonElement> & {
    children?: ReactNode;
    icon?: ReactNode;
  };

export default function Button({
  children = "Mulai belajar",
  icon,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`
        inline-flex
        min-h-12
        items-center
        justify-center
        gap-2

        rounded-full

        bg-pink-500
        px-6
        py-3

        font-semibold
        text-white

        shadow-md

        transition

        hover:bg-pink-600
        hover:shadow-lg

        active:scale-[0.98]

        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-pink-200

        disabled:cursor-not-allowed
        disabled:opacity-50

        ${className}
      `}
      {...props}
    >
      {icon ?? (
        <Play
          className="h-5 w-5 fill-current"
          aria-hidden="true"
        />
      )}

      <span>{children}</span>
    </button>
  );
}
