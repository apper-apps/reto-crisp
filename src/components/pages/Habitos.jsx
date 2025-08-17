import React, { useState, useEffect } from "react";
import HabitsList from "@/components/organisms/HabitsList";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { habitService } from "@/services/api/habitService";

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

  useEffect(() => {
    loadHabits();
  }, []);

  const handleToggleHabit = async (habitId) => {
    try {
      const habit = habits.find(h => h.Id === habitId);
      if (!habit) return;

      const updatedHabit = {
        ...habit,
        isCompletedToday: !habit.isCompletedToday,
        completionDates: habit.isCompletedToday 
          ? habit.completionDates.filter(date => date !== new Date().toISOString().split('T')[0])
          : [...habit.completionDates, new Date().toISOString().split('T')[0]]
      };

      await habitService.update(habitId, updatedHabit);
      
      setHabits(prev => 
        prev.map(h => h.Id === habitId ? updatedHabit : h)
      );

      toast.success(
        updatedHabit.isCompletedToday 
          ? `¡Hábito "${habit.name}" completado!` 
          : `Hábito "${habit.name}" marcado como pendiente`
      );
    } catch (err) {
      toast.error("Error al actualizar el hábito");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadHabits} />;
  }

  if (habits.length === 0) {
    return (
      <Empty
        title="No tienes hábitos configurados"
        description="Agrega hábitos diarios para comenzar tu transformación de 21 días."
        icon="ListTodo"
        action={{
          label: "Agregar Hábito",
          icon: "Plus",
          onClick: () => toast.info("Función de agregar hábito próximamente")
        }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <HabitsList 
        habits={habits} 
        onToggleHabit={handleToggleHabit}
      />
    </div>
  );
};

export default Habitos;