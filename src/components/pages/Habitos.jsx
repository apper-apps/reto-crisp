import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { habitService } from "@/services/api/habitService";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import HabitsList from "@/components/organisms/HabitsList";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Habitos = () => {
const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newHabit, setNewHabit] = useState({
    name: "",
    description: "",
    category: "Salud",
    icon: "Circle",
    color: "#10B981",
    goal: { current: 0, target: 1, unit: "vez" }
  });

  const loadHabits = async () => {
    try {
      setLoading(true);
      setError("");
      
      const habitsData = await habitService.getAll();
      setHabits(habitsData);
    } catch (err) {
      setError(err.message || "Error al cargar los hábitos");
    } finally {
      setLoading(false);
    }
};

  const handleAddHabit = () => {
    setShowCreateModal(true);
  };

  const handleCreateHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.name.trim()) {
      toast.error("El nombre del hábito es obligatorio");
      return;
    }

    try {
      const createdHabit = await habitService.create(newHabit);
      setHabits([...habits, createdHabit]);
      setShowCreateModal(false);
      setNewHabit({
        name: "",
        description: "",
        category: "Salud",
        icon: "Circle",
        color: "#10B981",
        goal: { current: 0, target: 1, unit: "vez" }
      });
      toast.success("Hábito creado exitosamente");
    } catch (err) {
      toast.error("Error al crear el hábito");
    }
  };

  const handleCategoryChange = (category) => {
    const categoryConfig = getCategoryConfig(category);
    setNewHabit({
      ...newHabit,
      category,
      icon: categoryConfig.icon,
      color: categoryConfig.color
    });
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
const handleToggleHabit = async (habitId) => {
    try {
      const habit = habits.find(h => h.Id === habitId);
      if (!habit) return;

      const updatedHabit = {
        ...habit,
        isCompletedToday: !habit.isCompletedToday,
        completionDates: habit.isCompletedToday 
          ? habit.completionDates?.filter(date => date !== new Date().toISOString().split('T')[0]) || []
          : [...(habit.completionDates || []), new Date().toISOString().split('T')[0]]
      };

      // Update local state immediately for better UX
      setHabits(prev => 
        prev.map(h => h.Id === habitId ? updatedHabit : h)
      );

      // Update through service
      await habitService.update(habitId, updatedHabit);
      
      // Show feedback toast
      toast.success(
        updatedHabit.isCompletedToday 
          ? `¡Hábito "${habit.name}" completado!` 
          : `Hábito "${habit.name}" marcado como pendiente`
      );
    } catch (err) {
      toast.error("Error al actualizar el hábito");
      // Revert local state on error
      loadHabits();
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);
if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadHabits} />;
  }

return (
    <div className="max-w-4xl mx-auto p-6">
      <HabitsList 
        habits={habits} 
        onToggleHabit={handleToggleHabit}
        onAddHabit={handleAddHabit}
      />

      {/* Create Habit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display">Crear Nuevo Hábito</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ApperIcon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateHabit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del hábito *
                  </label>
                  <input
                    type="text"
                    value={newHabit.name}
                    onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Ej: Beber agua, Hacer ejercicio..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    rows="2"
                    placeholder="Describe brevemente tu hábito..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoría
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {["Salud", "Ejercicio", "Alimentación", "Mental", "Productividad"].map((category) => {
                      const config = getCategoryConfig(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() => handleCategoryChange(category)}
                          className={`flex items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                            newHabit.category === category
                              ? 'border-primary bg-primary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: `${config.color}20` }}
                          >
                            <ApperIcon 
                              name={config.icon} 
                              size={14} 
                              style={{ color: config.color }}
                            />
                          </div>
                          <span className="text-sm font-medium">{category}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta objetivo
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={newHabit.goal.target}
                      onChange={(e) => setNewHabit({
                        ...newHabit,
                        goal: { ...newHabit.goal, target: parseInt(e.target.value) || 1 }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidad
                    </label>
                    <input
                      type="text"
                      value={newHabit.goal.unit}
                      onChange={(e) => setNewHabit({
                        ...newHabit,
                        goal: { ...newHabit.goal, unit: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                      placeholder="vez, minuto, vaso..."
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Crear Hábito
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Habitos;