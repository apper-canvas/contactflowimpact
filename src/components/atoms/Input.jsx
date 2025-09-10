import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className,
  type = "text",
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm placeholder:text-neutral-500",
        "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-neutral-50",
        "transition-all duration-200",
        error && "border-error-300 focus:ring-error-500",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;