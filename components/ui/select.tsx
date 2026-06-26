import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 rounded-xl border border-pink-200/45 bg-white/65 px-3 py-2 text-sm outline-none shadow-sm backdrop-blur-md transition focus:border-pink-400 focus-visible:ring-2 focus-visible:ring-pink-400 disabled:opacity-50 dark:border-white/10 dark:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
);
Select.displayName = "Select";
