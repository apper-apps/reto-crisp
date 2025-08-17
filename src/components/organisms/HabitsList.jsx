import React from "react";
import ApperIcon from "@/components/ApperIcon";
import HabitItem from "@/components/molecules/HabitItem";
import { cn } from "@/utils/cn";

const HabitsList = ({ habits, onToggleHabit, onAddHabit, className }) => {
  const completedCount = habits.filter(habit => habit.isCompletedToday).length;
  const totalCount = habits.length;
  const completionPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  // Calculate potential points
  const potentialPoints = (totalCount - completedCount) * 10;

// Helper functions
  const groupHabits = () => {
    return habits.reduce((groups, habit) => {
      const category = habit.category || 'Sin categoría';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(habit);
      return groups;
    }, {});
  };

  const getCategoryConfig = (categoryName) => {
    const categories = {
      "Salud": { icon: "Heart", color: "#10B981" },
      "Ejercicio": { icon: "Activity", color: "#EF4444" },
      "Alimentación": { icon: "Apple", color: "#F59E0B" },
      "Mental": { icon: "Brain", color: "#8B5CF6" },
      "Productividad": { icon: "Target", color: "#3B82F6" }
    };
    return categories[categoryName] || { icon: "Circle", color: "#6B7280" };
  };

  const groupedHabits = groupHabits();

  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-display text-gray-900">
          Hábitos por Categorías
        </h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ApperIcon name="CheckCircle" size={16} />
            <span>{completedCount} de {totalCount} completados</span>
          </div>
          <button
            onClick={onAddHabit}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <ApperIcon name="Plus" size={16} />
            Agregar Hábito
          </button>
        </div>
      </div>

      {habits.length === 0 ? (
        <div className="text-center py-12">
          <ApperIcon name="ListTodo" size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay hábitos configurados
          </h3>
          <p className="text-gray-600 mb-4">
            Agrega hábitos para comenzar tu transformación de 21 días.
          </p>
          <button
            onClick={onAddHabit}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Crear mi primer hábito
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedHabits).map(([category, categoryHabits]) => {
            const categoryConfig = getCategoryConfig(category);
            return (
              <div key={category} className="border border-gray-200 rounded-xl overflow-hidden">
                <div 
                  className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                  style={{ borderLeft: `4px solid ${categoryConfig.color}` }}
                >
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-full"
                    style={{ backgroundColor: `${categoryConfig.color}20` }}
                  >
                    <ApperIcon 
                      name={categoryConfig.icon} 
                      size={16} 
                      style={{ color: categoryConfig.color }}
                    />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900">{category}</h3>
                  <span className="text-sm text-gray-500">
                    ({categoryHabits.length} hábito{categoryHabits.length !== 1 ? 's' : ''})
                  </span>
                </div>
                
                <div className="px-4 pb-4 space-y-3">
                  {categoryHabits.map((habit) => (
                    <HabitItem
                      key={habit.Id}
                      habit={habit}
                      onToggle={() => onToggleHabit(habit.Id)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
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