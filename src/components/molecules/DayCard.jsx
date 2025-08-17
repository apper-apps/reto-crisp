import React from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const DayCard = ({ day, isCompleted, isCurrent, onClick, className }) => {
  return (
    <button
      onClick={() => onClick && onClick(day)}
      className={cn(
        "relative aspect-square rounded-lg border-2 transition-all duration-200",
        "flex items-center justify-center font-bold text-lg",
        "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50",
        isCurrent && "ring-2 ring-primary border-primary bg-primary/10 text-primary",
        isCompleted && !isCurrent && "bg-success border-success text-white",
        !isCompleted && !isCurrent && "bg-white border-gray-200 text-gray-600 hover:border-gray-300",
        className
      )}
    >
      {isCompleted && !isCurrent && (
        <ApperIcon name="Check" size={20} className="absolute inset-0 m-auto" />
      )}
      {!isCompleted && (
        <span>{day}</span>
      )}
      {isCurrent && (
        <span>{day}</span>
      )}
    </button>
  );
};

export default DayCard;