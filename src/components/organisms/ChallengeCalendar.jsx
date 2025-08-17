import React from "react";
import { cn } from "@/utils/cn";
import DayCard from "@/components/molecules/DayCard";
import ApperIcon from "@/components/ApperIcon";

const ChallengeCalendar = ({ challenge, onDayClick, className }) => {
  const days = Array.from({ length: 21 }, (_, i) => i + 1);
  const completionPercentage = Math.round((challenge.completedDays.length / 21) * 100);
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display text-gray-900">
            Mi Reto de 21 Días
          </h2>
          <p className="text-gray-600 mt-1">
            {challenge.name}
          </p>
        </div>
<div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <ApperIcon name="Calendar" size={16} />
            <span>Día {challenge.currentDay} de 21</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-500">Progreso</div>
              <div className="font-semibold text-primary">{completionPercentage}%</div>
            </div>
            <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-success to-primary transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

<div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-3">
        {days.map((day) => (
          <DayCard
            key={day}
            day={day}
            isCompleted={challenge.completedDays.includes(day)}
            isCurrent={day === challenge.currentDay}
            isFuture={day > challenge.currentDay}
            onClick={onDayClick}
            className="h-12 sm:h-16"
            completionPercentage={challenge.completedDays.includes(day) ? 100 : (day === challenge.currentDay ? 50 : 0)}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
          <div className="w-4 h-4 bg-success rounded border-2 border-success"></div>
          <span className="text-sm text-gray-700">Días completados</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-primary/10 rounded-lg">
          <div className="w-4 h-4 bg-primary/10 rounded border-2 border-primary"></div>
          <span className="text-sm text-gray-700">Día actual</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-lg">
          <div className="w-4 h-4 bg-white rounded border-2 border-gray-300"></div>
          <span className="text-sm text-gray-700">Días pendientes</span>
        </div>
      </div>
    </div>
  );
};

export default ChallengeCalendar;