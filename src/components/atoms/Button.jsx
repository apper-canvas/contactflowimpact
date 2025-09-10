import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  children, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white shadow-md hover:shadow-lg focus:ring-primary-500",
    secondary: "bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-300 hover:border-neutral-400 shadow-sm focus:ring-primary-500",
    outline: "bg-transparent hover:bg-primary-50 text-primary-600 border border-primary-300 hover:border-primary-400 focus:ring-primary-500",
    ghost: "bg-transparent hover:bg-neutral-100 text-neutral-600 hover:text-neutral-700 focus:ring-neutral-400",
    danger: "bg-gradient-to-r from-error-500 to-error-600 hover:from-error-600 hover:to-error-700 text-white shadow-md hover:shadow-lg focus:ring-error-500"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-2.5 text-base rounded-lg",
    xl: "px-8 py-3 text-lg rounded-xl"
  };

  return (
    <button
      ref={ref}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;