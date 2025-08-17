import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  children, 
  className, 
  variant = "default", 
  ...props 
}, ref) => {
  const baseStyles = "rounded-xl transition-all duration-200";
  
  const variants = {
    default: "bg-white shadow-sm border border-gray-200 hover:shadow-md",
    elevated: "bg-white shadow-lg hover:shadow-xl",
    gradient: "bg-gradient-light text-white shadow-lg hover:shadow-xl",
  };
  
  return (
    <div
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";
export default Card;