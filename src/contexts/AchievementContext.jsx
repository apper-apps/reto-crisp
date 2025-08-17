import React, { createContext, useContext, useEffect, useState } from "react";
import { achievementService } from "@/services/api/achievementService";
import { toast } from "react-toastify";

const AchievementContext = createContext();

export const useAchievements = () => {
  const context = useContext(AchievementContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementProvider');
  }
  return context;
};

export const AchievementProvider = ({ children }) => {
  const [achievements, setAchievements] = useState(achievementService.getAllAchievements());
  const [unlockedAchievements, setUnlockedAchievements] = useState(achievementService.getUnlockedAchievements());
  const [pendingUnlock, setPendingUnlock] = useState(null);
  const [totalAchievementPoints, setTotalAchievementPoints] = useState(achievementService.getTotalPoints());

  const checkAchievements = async (force = false) => {
    try {
      const newUnlocks = await achievementService.checkAllAchievements(force);
      
      if (newUnlocks.length > 0) {
        // Update state
        setUnlockedAchievements(achievementService.getUnlockedAchievements());
        setTotalAchievementPoints(achievementService.getTotalPoints());
        
        // Show unlock animations/notifications for each new achievement
        newUnlocks.forEach((achievement, index) => {
          setTimeout(() => {
            showAchievementUnlock(achievement);
          }, index * 1000); // Stagger animations
        });
      }
      
      return newUnlocks;
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  };

  const showAchievementUnlock = (achievement) => {
    setPendingUnlock(achievement);
    
    // Show toast notification
    toast.success(
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${achievement.gradient} flex items-center justify-center text-white shadow-lg`}>
            🏆
          </div>
        </div>
        <div>
          <div className="font-semibold text-gray-900">¡Logro Desbloqueado!</div>
          <div className="text-sm text-gray-600">{achievement.name}</div>
          <div className="text-xs text-yellow-600 font-medium">+{achievement.points} puntos</div>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        className: "achievement-toast"
      }
    );
    
    // Clear pending unlock after animation
    setTimeout(() => {
      setPendingUnlock(null);
    }, 5000);
  };

  const getAchievementProgress = async (achievementKey) => {
    return await achievementService.getProgressTowardsAchievement(achievementKey);
  };

  const isAchievementUnlocked = (achievementKey) => {
    return achievementService.isUnlocked(achievementKey);
  };

  const getAchievementsByCategory = (category) => {
    return achievementService.getAchievementsByCategory(category);
  };

  // Check achievements when component mounts
  useEffect(() => {
    checkAchievements();
  }, []);

  const value = {
    achievements,
    unlockedAchievements,
    pendingUnlock,
    totalAchievementPoints,
    checkAchievements,
    getAchievementProgress,
    isAchievementUnlocked,
    getAchievementsByCategory,
    showAchievementUnlock
  };

  return (
    <AchievementContext.Provider value={value}>
      {children}
    </AchievementContext.Provider>
  );
};