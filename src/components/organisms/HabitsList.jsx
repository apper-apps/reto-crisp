import React from "react";
import { cn } from "@/utils/cn";
import HabitItem from "@/components/molecules/HabitItem";
import ApperIcon from "@/components/ApperIcon";

const HabitsList = ({ habits, onToggleHabit, className }) => {
  const completedCount = habits.filter(habit => habit.isCompletedToday).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display text-gray-900">
          Hábitos Diarios
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ApperIcon name="CheckCircle" size={16} />
          <span>{completedCount} de {totalCount} completados</span>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="ListTodo" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay hábitos configurados
          </h3>
          <p className="text-gray-600">
            Agrega hábitos para comenzar tu transformación de 21 días.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {habits.map((habit) => (
            <HabitItem
              key={habit.Id}
              habit={habit}
              onToggle={onToggleHabit}
            />
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progreso de Hoy</span>
            <span className="font-semibold">{Math.round(completionPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-purple-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitsList;