import React, { createContext, useContext, useState, useEffect } from 'react';
import { pointsService } from '@/services/api/pointsService';

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

  const refreshPoints = () => {
    setTotalPoints(pointsService.getTotalPoints());
  };

  const triggerCelebration = () => {
    setCelebrating(true);
    setTimeout(() => setCelebrating(false), 1000);
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
    challengeProgress: (day) => {
      const points = pointsService.awardChallengeProgress(day);
      refreshPoints();
      triggerCelebration();
      return points;
    }
  };

  return (
    <PointsContext.Provider value={{
      totalPoints,
      celebrating,
      refreshPoints,
      awardPoints,
      pointsHistory: pointsService.getPointsHistory()
    }}>
      {children}
    </PointsContext.Provider>
  );
};