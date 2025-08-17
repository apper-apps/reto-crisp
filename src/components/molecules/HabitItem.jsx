import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import Checkbox from '@/components/atoms/Checkbox';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

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
        <div 
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ backgroundColor: `${habit.color}20`, border: `2px solid ${habit.color}` }}
        >
          <ApperIcon 
            name={habit.icon} 
            size={20} 
            style={{ color: habit.color }}
          />
        </div>
        
        <Checkbox
          checked={habit.isCompletedToday}
          onChange={handleToggle}
          size="lg"
        />
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={cn(
              "font-medium transition-colors",
              habit.isCompletedToday 
                ? "text-gray-500 line-through" 
                : "text-gray-900"
            )}>
              {habit.name}
            </h3>
            <span 
              className="px-2 py-1 text-xs rounded-full font-medium"
              style={{ 
                backgroundColor: `${habit.color}15`, 
                color: habit.color 
              }}
            >
              {habit.category}
            </span>
          </div>
          
          {habit.description && (
            <p className="text-sm text-gray-600 mb-2">{habit.description}</p>
          )}
          
          {habit.goal && (
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div 
                  className="h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.min((habit.goal.current / habit.goal.target) * 100, 100)}%`,
                    backgroundColor: habit.color
                  }}
                />
              </div>
              <span className="text-xs text-gray-600 font-medium min-w-fit">
                {habit.goal.current}/{habit.goal.target} {habit.goal.unit}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default HabitItem;