import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  children,
  variant = "default",
  size = "sm",
  className,
  ...props 
}, ref) => {
  const variants = {
    default: "bg-neutral-100 text-neutral-700 border-neutral-200",
    primary: "bg-primary-100 text-primary-700 border-primary-200",
    success: "bg-success-100 text-success-700 border-success-200",
    warning: "bg-warning-100 text-warning-700 border-warning-200",
    error: "bg-error-100 text-error-700 border-error-200",
    accent: "bg-accent-100 text-accent-700 border-accent-200"
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-sm"
  };

  return (
    <span
      ref={ref}
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        "transition-colors duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;