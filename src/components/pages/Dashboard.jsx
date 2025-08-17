import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { challengeService } from "@/services/api/challengeService";
import { habitService } from "@/services/api/habitService";
import { dayProgressService } from "@/services/api/dayProgressService";
import { usePoints } from "@/contexts/PointsContext";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import StatsCard from "@/components/molecules/StatsCard";
import ChallengeProgress from "@/components/organisms/ChallengeProgress";

const Dashboard = () => {
  const { awardPoints } = usePoints();
  const [challenge, setChallenge] = useState(null);
  const [dayProgress, setDayProgress] = useState(null);
  const [habits, setHabits] = useState([]);
  const [miniChallenges, setMiniChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Utility functions for mini-challenges
  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Medio';
      case 'hard':
        return 'Difícil';
      default:
        return 'Normal';
    }
  };

  const handleMiniChallengeDay = async (miniChallengeId, day) => {
    try {
      const miniChallenge = miniChallenges.find(mc => mc.Id === miniChallengeId);
      if (!miniChallenge || miniChallenge.progress.completedDays.includes(day)) {
        return;
      }

      // Update mini-challenge progress
      const updatedMiniChallenges = miniChallenges.map(mc => {
        if (mc.Id === miniChallengeId) {
          const newCompletedDays = [...mc.progress.completedDays, day];
          const newCurrent = newCompletedDays.length;
          const isCompleted = newCurrent >= mc.progress.total;

          return {
            ...mc,
            progress: {
              ...mc.progress,
              current: newCurrent,
              completedDays: newCompletedDays
            },
            isCompleted
          };
        }
        return mc;
      });

      setMiniChallenges(updatedMiniChallenges);

      // Award points
      const points = awardPoints.habitCompletion(miniChallenge.name);
      toast.success(`¡Mini-reto completado! +${points} puntos ⭐`, {
        position: "top-right",
        autoClose: 3000,
      });

      // Check if mini-challenge is now complete
      const updatedChallenge = updatedMiniChallenges.find(mc => mc.Id === miniChallengeId);
      if (updatedChallenge?.isCompleted) {
        const bonusPoints = awardPoints.streakBonus(updatedChallenge.progress.total);
        toast.success(`¡Mini-reto completado! +${bonusPoints} puntos bonus! 🎉`, {
          position: "top-right",
          autoClose: 4000,
        });
      }

    } catch (error) {
      console.error('Error updating mini-challenge:', error);
      toast.error("Error al actualizar el mini-reto");
    }
  };
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

      // Award streak bonus if applicable
      if (challengeData && dayProgressData) {
        const currentDay = dayProgressData.day;
        const completedDays = challengeData.completedDays?.length || 0;
        
        if (completedDays >= 3) {
          const streakPoints = awardPoints.streakBonus(completedDays);
          if (streakPoints > 0) {
            toast.success(`¡Racha de ${completedDays} días! +${streakPoints} puntos 🔥`, {
              position: "top-right",
              autoClose: 4000,
            });
          }
        }
      }
      
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
  
  // Enhanced progress calculations
  const totalDays = 21;
  const completedDays = challenge.completedDays.length;
  const completionPercentage = Math.round((completedDays / totalDays) * 100);
  const currentDay = challenge.currentDay;
  
// Calculate current streak (consecutive completed days)
  const calculateCurrentStreak = () => {
    const sortedDays = [...challenge.completedDays].sort((a, b) => b - a);
    let streak = 0;
    for (let i = 0; i < sortedDays.length; i++) {
      if (i === 0) {
        if (sortedDays[i] === currentDay - 1 || sortedDays[i] === currentDay) {
          streak = 1;
        } else {
          break;
        }
      } else {
        if (sortedDays[i] === sortedDays[i-1] - 1) {
          streak++;
        } else {
          break;
        }
      }
    }
    return streak;
  };
  
  const currentStreak = calculateCurrentStreak();

  // Handle habit toggle with points
  const handleHabitToggle = async (habitId) => {
    try {
      const habit = habits.find(h => h.Id === habitId);
      if (!habit) return;

      const newCompletedState = !habit.isCompletedToday;
      await habitService.update(habitId, { isCompletedToday: newCompletedState });
      
      if (newCompletedState) {
        const points = awardPoints.habitCompletion(habit.name);
        toast.success(`¡${habit.name} completado! +${points} puntos ⭐`, {
          position: "top-right",
          autoClose: 3000,
        });

        // Check for perfect day bonus
        const updatedHabits = habits.map(h => 
          h.Id === habitId ? { ...h, isCompletedToday: true } : h
        );
        const completedCount = updatedHabits.filter(h => h.isCompletedToday).length;
        
        if (completedCount === habits.length) {
          const perfectDayPoints = awardPoints.perfectDay(completedCount, habits.length);
          toast.success(`¡Día perfecto! +${perfectDayPoints} puntos bonus! 🎉`, {
            position: "top-right",
            autoClose: 4000,
          });
        }
      }

      // Refresh data
      loadDashboardData();
    } catch (error) {
      toast.error("Error al actualizar el hábito");
    }
  };
  const habitCompletionRate = totalHabits > 0 ? Math.round((completedHabitsToday / totalHabits) * 100) : 0;
  
  // Motivational messages in Spanish based on progress
  const getMotivationalMessage = () => {
    if (completionPercentage >= 90) {
      return "¡Increíble! Estás a punto de completar tu reto. ¡Eres imparable! 🌟";
    } else if (completionPercentage >= 70) {
      return "¡Excelente progreso! Ya has recorrido más del 70% del camino. ¡Sigue así! 💪";
    } else if (completionPercentage >= 50) {
      return "¡Genial! Has superado la mitad del reto. Tu constancia está dando frutos 🚀";
    } else if (completionPercentage >= 30) {
      return "¡Muy bien! Cada día te acerca más a tu objetivo. ¡No te rindas! ✨";
    } else if (completionPercentage >= 10) {
      return "¡Buen comienzo! Has dado los primeros pasos importantes. ¡Continúa! 🌱";
    } else {
      return "¡Bienvenido a tu reto de 21 días! Cada gran logro comienza con el primer paso 💫";
    }
  };

  const getStreakMessage = () => {
    if (currentStreak >= 7) {
      return "¡Una semana completa! Tu disciplina es admirable 🔥";
    } else if (currentStreak >= 3) {
      return "¡Tres días seguidos! El hábito se está formando 💎";
    } else if (currentStreak >= 1) {
      return "¡Excelente! Mantén el impulso 🎯";
    } else {
      return "Hoy es perfecto para comenzar tu racha ⭐";
    }
  };

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

      {/* Motivational Section */}
      <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold font-display">{getMotivationalMessage()}</h2>
            <p className="text-purple-100 mt-1">{getStreakMessage()}</p>
          </div>
          <div className="bg-white/20 rounded-full p-3">
            <ApperIcon name="Sparkles" size={24} />
          </div>
        </div>
        
        {/* Overall Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Progreso del Reto</span>
            <span>{completionPercentage}% completado</span>
          </div>
          <div className="bg-white/20 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 to-yellow-100 rounded-full transition-all duration-700 ease-out progress-shimmer"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-purple-100">
            <span>Día {currentDay}</span>
            <span>{completedDays} de {totalDays} días</span>
          </div>
        </div>
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
          subtitle={`${habitCompletionRate}% completados`}
          icon="CheckSquare"
          variant="success"
        />
        
        <StatsCard
          title="Racha Actual"
          value={currentStreak}
          subtitle="días consecutivos"
          icon="Flame"
          variant="gradient"
        />
        
        <StatsCard
          title="Progreso Total"
          value={`${completionPercentage}%`}
          subtitle={`${completedDays} de ${totalDays} días`}
          icon="TrendingUp"
          variant="default"
        />
      </div>

      {/* Additional Progress Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Días Restantes</h3>
            <ApperIcon name="Target" size={20} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {totalDays - currentDay + 1}
          </div>
          <p className="text-sm text-gray-600">
            para completar el reto
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Efectividad</h3>
            <ApperIcon name="BarChart3" size={20} className="text-green-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Math.round((completedDays / Math.max(currentDay - 1, 1)) * 100)}%
          </div>
          <p className="text-sm text-gray-600">
            de días completados
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">Mejor Racha</h3>
            <ApperIcon name="Award" size={20} className="text-yellow-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {Math.max(currentStreak, challenge.completedDays.length > 0 ? 1 : 0)}
          </div>
          <p className="text-sm text-gray-600">
            días consecutivos
          </p>
        </div>
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

      {/* Mini-Challenges Section */}
      {miniChallenges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-display text-gray-900">
              Mini-Retos Semanales
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <ApperIcon name="Zap" size={16} />
              <span>Retos temáticos independientes</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {miniChallenges.map((miniChallenge) => {
              const progressPercentage = Math.round((miniChallenge.progress.current / miniChallenge.progress.total) * 100);
              
              return (
                <div key={miniChallenge.Id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 text-lg">
                          {miniChallenge.name}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(miniChallenge.difficulty)}`}>
                          {getDifficultyText(miniChallenge.difficulty)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-3">
                        {miniChallenge.description}
                      </p>
                    </div>
                    <div className="ml-3">
                      <div className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                        <ApperIcon name="Star" size={14} />
                        <span className="text-xs font-medium">{miniChallenge.points}pts</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progreso</span>
                      <span className="font-medium text-gray-900">
                        {miniChallenge.progress.current}/{miniChallenge.progress.total} días
                      </span>
                    </div>
                    <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500">
                      {progressPercentage}% completado
                    </div>
                  </div>

                  {/* Days Progress */}
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Días de la semana:</div>
                    <div className="flex gap-1">
                      {Array.from({ length: 7 }, (_, index) => {
                        const day = index + 1;
                        const isCompleted = miniChallenge.progress.completedDays.includes(day);
                        const isToday = day === 4; // Mock current day
                        
                        return (
                          <button
                            key={day}
                            onClick={() => !isCompleted && isToday && handleMiniChallengeDay(miniChallenge.Id, day)}
                            disabled={isCompleted || !isToday}
                            className={`
                              w-8 h-8 rounded-full text-xs font-medium transition-all duration-200
                              ${isCompleted 
                                ? 'bg-green-500 text-white shadow-md' 
                                : isToday
                                  ? 'bg-blue-100 text-blue-600 border-2 border-blue-300 hover:bg-blue-200 cursor-pointer'
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }
                            `}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {miniChallenge.isCompleted ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-green-600 font-medium">¡Completado!</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          <span className="text-sm text-blue-600 font-medium">En progreso</span>
                        </>
                      )}
                    </div>
                    {miniChallenge.isCompleted && (
                      <div className="flex items-center gap-1 text-yellow-600">
                        <ApperIcon name="Trophy" size={16} />
                        <span className="text-xs font-medium">+{miniChallenge.points}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 rounded-full p-2">
                <ApperIcon name="Info" size={20} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Sobre los Mini-Retos</h3>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              Los mini-retos son desafíos semanales temáticos que complementan tu reto principal de 21 días. 
              Cada uno tiene objetivos específicos, puntos de recompensa únicos y progreso independiente. 
              ¡Completa tantos como puedas para maximizar tus puntos y acelerar tu transformación!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;