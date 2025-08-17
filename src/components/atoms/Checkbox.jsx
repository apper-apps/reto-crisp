import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = forwardRef(({ 
  checked = false, 
  onChange, 
  disabled = false,
  className,
  size = "md",
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  const iconSizes = {
    sm: 12,
    md: 16,
    lg: 20,
  };

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => onChange && onChange(!checked)}
      disabled={disabled}
      className={cn(
        "relative rounded-md transition-all duration-200 border-2 flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        checked 
          ? "bg-primary border-primary text-white hover:bg-primary/90" 
          : "bg-white border-gray-300 hover:border-gray-400",
        sizes[size],
        className
      )}
      {...props}
    >
      {checked && (
        <ApperIcon 
          name="Check" 
          size={iconSizes[size]} 
          className="animate-in zoom-in-50 duration-200"
        />
      )}
    </button>
  );
});

Checkbox.displayName = "Checkbox";
export default Checkbox;