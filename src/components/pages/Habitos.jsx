import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { habitService } from "@/services/api/habitService";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import HabitsList from "@/components/organisms/HabitsList";

const Habitos = () => {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
      />
    </div>
  );
};

export default Habitos;