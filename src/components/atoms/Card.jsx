import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children,
  className,
  hover = false,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-xl bg-white shadow-card border border-neutral-200",
        "transition-all duration-200",
        hover && "hover:shadow-card-hover hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;