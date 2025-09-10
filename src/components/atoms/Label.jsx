import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Label = forwardRef(({ 
  className,
  children,
  required = false,
  ...props 
}, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium text-neutral-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-error-500 ml-1">*</span>}
    </label>
  );
});

Label.displayName = "Label";

export default Label;