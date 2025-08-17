import React, { useState, useEffect } from "react";
import ChallengeProgress from "@/components/organisms/ChallengeProgress";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { challengeService } from "@/services/api/challengeService";
import { habitService } from "@/services/api/habitService";
import { dayProgressService } from "@/services/api/dayProgressService";

const Dashboard = () => {
  const [challenge, setChallenge] = useState(null);
  const [dayProgress, setDayProgress] = useState(null);
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [challengeData, habitsData, dayProgressData] = await Promise.all([
        challengeService.getActive(),
        habitService.getAll(),
        dayProgressService.getToday()
      ]);
      
      setChallenge(challengeData);
      setHabits(habitsData);
      setDayProgress(dayProgressData);
    } catch (err) {
      setError(err.message || "Error al cargar los datos del dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  if (!challenge) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No hay reto activo
        </h2>
        <p className="text-gray-600">
          Comienza un nuevo reto de 21 días para ver tu progreso aquí.
        </p>
      </div>
    );
  }

  const completedHabitsToday = habits.filter(h => h.isCompletedToday).length;
  const totalHabits = habits.length;
  const weekStreak = challenge.completedDays.length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">
          ¡Hola! Bienvenido a tu Reto
        </h1>
        <p className="text-gray-600 mt-2">
          Aquí puedes ver el progreso de tu transformación personal.
        </p>
      </div>

      <ChallengeProgress 
        challenge={challenge} 
        dayProgress={dayProgress}
        className="mb-6"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Día Actual"
          value={challenge.currentDay}
          subtitle="de 21 días"
          icon="Calendar"
          variant="primary"
        />
        
        <StatsCard
          title="Hábitos de Hoy"
          value={`${completedHabitsToday}/${totalHabits}`}
          subtitle="completados"
          icon="CheckSquare"
          variant="success"
        />
        
        <StatsCard
          title="Racha de Días"
          value={weekStreak}
          subtitle="días seguidos"
          icon="Flame"
          variant="gradient"
        />
        
        <StatsCard
          title="Progreso Total"
          value={`${Math.round((challenge.completedDays.length / 21) * 100)}%`}
          subtitle="del reto"
          icon="TrendingUp"
          variant="default"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Resumen Semanal
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Días completados esta semana</span>
              <span className="font-semibold text-primary">
                {Math.min(7, challenge.completedDays.length)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Hábitos más exitosos</span>
              <span className="font-semibold text-success">80%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Consistencia</span>
              <span className="font-semibold text-primary">Excelente</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Próximos Pasos
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
              <span className="text-gray-600 text-sm">
                Completa los hábitos restantes de hoy
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <span className="text-gray-600 text-sm">
                Mantén tu racha de días consecutivos
              </span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
              <span className="text-gray-600 text-sm">
                Revisa tu progreso al final del día
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;