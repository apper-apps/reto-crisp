import React, { createContext, useContext, useEffect, useState } from "react";
import { pointsService } from "@/services/api/pointsService";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const [totalPoints, setTotalPoints] = useState(pointsService.getTotalPoints());
const [celebrating, setCelebrating] = useState(false);
  const [streakCelebration, setStreakCelebration] = useState(null);

  const refreshPoints = () => {
    setTotalPoints(pointsService.getTotalPoints());
  };

  const triggerCelebration = () => {
    setCelebrating(true);
setTimeout(() => setCelebrating(false), 1000);
  };

  const triggerStreakCelebration = (streakDays, habitName) => {
    setStreakCelebration({ streakDays, habitName });
    setTimeout(() => setStreakCelebration(null), 3000);
  };

  const awardPoints = {
    habitCompletion: (habitName) => {
      const points = pointsService.awardHabitCompletion(habitName);
      refreshPoints();
      triggerCelebration();
      return points;
    },
    dailyMoment: (momentType) => {
      const points = pointsService.awardDailyMoment(momentType);
      refreshPoints();
      triggerCelebration();
      return points;
    },
    streakBonus: (streakDays) => {
      const points = pointsService.awardStreakBonus(streakDays);
      if (points > 0) {
        refreshPoints();
        triggerCelebration();
      }
      return points;
},
    perfectDay: (habitsCompleted, totalHabits) => {
      const points = pointsService.awardPerfectDay(habitsCompleted, totalHabits);
      if (points > 0) {
        refreshPoints();
        triggerCelebration();
      }
      return points;
    },
    streakMilestone: (streakDays, habitName) => {
      const points = pointsService.awardStreakBonus(streakDays);
      if (points > 0) {
        refreshPoints();
        triggerCelebration();
        triggerStreakCelebration(streakDays, habitName);
        
        // Show Spanish motivational message
        const messages = {
          3: "¡Increíble! 🔥 3 días consecutivos. ¡Estás creando un hábito!",
          7: "¡Fantástico! 🌟 Una semana completa. ¡Tu disciplina es admirable!",
          14: "¡Extraordinario! 💪 Dos semanas seguidas. ¡Eres imparable!",
          21: "¡LEYENDARIO! 🏆 ¡21 días! Has transformado este hábito en parte de tu vida."
        };
        
        const message = messages[streakDays] || `¡Increíble racha de ${streakDays} días! 🔥`;
        toast.success(message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
        });
      }
      return points;
    },
    challengeProgress: (day) => {
      const points = pointsService.awardChallengeProgress(day);
      refreshPoints();
      triggerCelebration();
      return points;
    }
};

const value = {
    totalPoints,
    celebrating,
    streakCelebration,
    awardMiniChallenge: (challengeName, challengePoints) => {
      return pointsService.awardMiniChallengeCompletion(challengeName, challengePoints);
    },
    refreshPoints,
    awardPoints
  };
  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};