import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@ssu/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap",
    "font-semibold transition-all duration-200 focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand-green text-white hover:bg-brand-green-900 shadow-sm",
        secondary:
          "bg-white text-brand-green border border-brand-green hover:bg-brand-green-50",
        amber: "bg-brand-amber text-white hover:bg-brand-amber-700 shadow-sm",
        ghost: "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900",
        danger: "bg-red-600 text-white hover:bg-red-700 shadow-sm",
        link: "text-brand-green underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        sm: "h-8  px-3   text-small  rounded-[var(--radius-button)]",
        md: "h-10 px-4   text-body   rounded-[var(--radius-button)]",
        lg: "h-12 px-6   text-body   rounded-[var(--radius-button)]",
        icon: "h-10 w-10 rounded-[var(--radius-button)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  asChild = false,
  type = "button",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={asChild ? undefined : disabled || loading}
      {...(!asChild ? { type } : {})}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin shrink-0" />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </Comp>
  );
}
