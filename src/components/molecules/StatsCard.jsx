import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const StatsCard = ({ title, value, subtitle, icon, variant = "default", className }) => {
  const variants = {
    default: "text-gray-900",
    primary: "text-primary",
    success: "text-success",
    gradient: "bg-gradient-light text-white",
  };

  return (
    <Card 
      variant={variant === "gradient" ? "gradient" : "elevated"} 
      className={cn("p-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={cn(
            "text-sm font-medium",
            variant === "gradient" ? "text-white/80" : "text-gray-600"
          )}>
            {title}
          </p>
          <p className={cn(
            "text-3xl font-bold font-display mt-1",
            variants[variant]
          )}>
            {value}
          </p>
          {subtitle && (
            <p className={cn(
              "text-sm mt-1",
              variant === "gradient" ? "text-white/70" : "text-gray-500"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div className={cn(
            "p-3 rounded-lg",
            variant === "gradient" 
              ? "bg-white/20" 
              : "bg-gray-100"
          )}>
            <ApperIcon 
              name={icon} 
              size={24} 
              className={cn(
                variant === "gradient" ? "text-white" : "text-gray-600"
              )}
            />
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatsCard;