import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Checkbox from '@/components/atoms/Checkbox';
import Card from '@/components/atoms/Card';
const HabitItem = ({ habit, onToggle, className }) => {
  const [celebrating, setCelebrating] = useState(false);

  const handleToggle = () => {
    if (!habit.isCompletedToday) {
      setCelebrating(true);
      setTimeout(() => setCelebrating(false), 800);
    }
    onToggle(habit.Id);
  };

  return (
    <Card className={cn(
      "p-4 hover:scale-[1.01] transition-all duration-300 relative overflow-hidden",
      celebrating && "animate-celebration ring-2 ring-yellow-400 shadow-lg",
      className
    )}>
      {celebrating && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/20 to-green-200/20 animate-pulse" />
      )}
      
      <div className="flex items-center gap-4 relative z-10">
        <Checkbox
          checked={habit.isCompletedToday}
          onChange={handleToggle}
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