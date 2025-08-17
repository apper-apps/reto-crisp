import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const DayCard = ({ day, isCompleted, isCurrent, isFuture, onClick, className, completionPercentage = 0 }) => {
  return (
    <button
      onClick={() => onClick && onClick(day)}
className={cn(
        "relative aspect-square rounded-lg border-2 transition-all duration-300",
        "flex items-center justify-center font-bold text-lg overflow-hidden",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50",
        // Current day - purple highlight
        isCurrent && "ring-2 ring-primary border-primary bg-gradient-to-br from-primary/20 to-accent/10 text-primary shadow-md",
        // Completed days - green
        isCompleted && !isCurrent && "bg-gradient-to-br from-success to-success/80 border-success text-white shadow-md",
        // Future days - light gray
        isFuture && !isCompleted && "bg-gray-100 border-gray-200 text-gray-400",
        // Past incomplete days - default white
        !isCompleted && !isCurrent && !isFuture && "bg-white border-gray-300 text-gray-600 hover:border-gray-400",
        className
      )}
    >
{/* Progress indicator background for current day */}
      {isCurrent && completionPercentage > 0 && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/5 transition-all duration-500"
          style={{ width: `${completionPercentage}%` }}
        />
      )}
      
      {/* Completed day - check icon */}
      {isCompleted && !isCurrent && (
        <>
          <ApperIcon name="Check" size={20} className="absolute inset-0 m-auto text-white drop-shadow-sm" />
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
        </>
      )}
      
      {/* Day number for non-completed days */}
      {!isCompleted && (
        <span className="relative z-10 drop-shadow-sm">{day}</span>
      )}
      
      {/* Current day with enhanced styling */}
      {isCurrent && (
        <>
          <span className="relative z-10 drop-shadow-sm">{day}</span>
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg -z-10" />
        </>
      )}
      
      {/* Future day indicator */}
      {isFuture && (
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 bg-gray-300 rounded-full" />
      )}
    </button>
  );
};

export default DayCard;