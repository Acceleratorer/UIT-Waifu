import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default:
          "bg-pink-500 text-white shadow-sm hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-400",
        secondary:
          "border border-foreground/10 bg-white/60 text-foreground shadow-sm hover:bg-white/80 dark:bg-white/10 dark:hover:bg-white/15",
        outline:
          "border border-pink-200/45 bg-white/55 text-foreground shadow-sm hover:border-pink-300 hover:bg-pink-500/10 dark:border-white/10 dark:bg-white/10",
        ghost:
          "text-foreground/70 hover:bg-foreground/5 hover:text-foreground",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-xs",
        lg: "h-12 px-5",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
