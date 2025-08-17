import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Progress = forwardRef(({ 
  value = 0, 
  max = 100, 
  className,
  size = "md",
  variant = "primary",
  showText = false,
  ...props 
}, ref) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizes = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  const variants = {
    primary: "bg-gradient-purple-blue",
    success: "bg-success",
    warning: "bg-warning",
    error: "bg-error",
  };

  return (
    <div className={cn("w-full", className)} {...props} ref={ref}>
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn("h-full transition-all duration-300 ease-out rounded-full", variants[variant])}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showText && (
        <div className="mt-1 text-sm text-gray-600 text-center">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
});

Progress.displayName = "Progress";
export default Progress;