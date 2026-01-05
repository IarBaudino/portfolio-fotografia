"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#c2a68c] focus:ring-offset-2 focus:ring-offset-[#7d6b59] disabled:opacity-50 disabled:pointer-events-none";

    const variants = {
      primary: "bg-[#c2a68c] text-black hover:bg-[#e6d8c3]",
      secondary: "bg-[#5d866c] text-white hover:bg-[#5d866c]/80",
      outline:
        "border-2 border-[#e6d8c3] text-[#e6d8c3] hover:bg-[#c2a68c] hover:text-black",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
