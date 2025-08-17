import React from "react";
import { cn } from "@/utils/cn";
import Checkbox from "@/components/atoms/Checkbox";
import Card from "@/components/atoms/Card";

const HabitItem = ({ habit, onToggle, className }) => {
  return (
    <Card className={cn("p-4 hover:scale-[1.01] transition-transform", className)}>
      <div className="flex items-center gap-4">
        <Checkbox
          checked={habit.isCompletedToday}
          onChange={() => onToggle(habit.Id)}
          size="lg"
        />
        <div className="flex-1">
          <h3 className={cn(
            "font-medium transition-colors",
            habit.isCompletedToday 
              ? "text-gray-500 line-through" 
              : "text-gray-900"
          )}>
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HabitItem;