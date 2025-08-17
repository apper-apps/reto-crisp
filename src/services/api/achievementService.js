import { habitService } from '@/services/api/habitService';
import { challengeService } from '@/services/api/challengeService';

class AchievementService {
  constructor() {
    this.achievements = this.initializeAchievements();
    this.userAchievements = this.loadUserAchievements();
  }

  initializeAchievements() {
    return {
      primera_semana: {
        Id: 1,
        key: 'primera_semana',
        name: 'Primera Semana Completa',
        description: '7 días consecutivos completados',
        icon: 'Flame',
        color: '#EF4444',
        gradient: 'from-red-500 to-orange-500',
        points: 50,
        category: 'streak',
        requirement: {
          type: 'consecutive_days',
          value: 7
        }
      },
      habito_perfecto: {
        Id: 2,
        key: 'habito_perfecto',
        name: 'Hábito Perfecto',
        description: '100% de hábitos completados en un día',
        icon: 'Star',
        color: '#F59E0B',
        gradient: 'from-yellow-500 to-orange-500',
        points: 25,
        category: 'daily',
        requirement: {
          type: 'perfect_day',
          value: 1
        }
      },
      constancia: {
        Id: 3,
        key: 'constancia',
        name: 'Constancia',
        description: '80% de hábitos diarios completados por 7 días',
        icon: 'Target',
        color: '#8B5CF6',
        gradient: 'from-purple-500 to-blue-500',
        points: 75,
        category: 'consistency',
        requirement: {
          type: 'consistency_rate',
          value: 80,
          days: 7
        }
      },
      transformacion_total: {
        Id: 4,
        key: 'transformacion_total',
        name: 'Transformación Total',
        description: 'Completa el reto de 21 días',
        icon: 'Crown',
        color: '#10B981',
        gradient: 'from-green-500 to-teal-500',
        points: 200,
        category: 'completion',
        requirement: {
          type: 'challenge_complete',
          value: 21
        }
      },
      racha_fuego_3: {
        Id: 5,
        key: 'racha_fuego_3',
        name: 'Racha de Fuego',
        description: '3 días consecutivos',
        icon: 'Flame',
        color: '#F97316',
        gradient: 'from-orange-500 to-red-500',
        points: 15,
        category: 'streak',
        requirement: {
          type: 'consecutive_days',
          value: 3
        }
      },
      racha_fuego_14: {
        Id: 6,
        key: 'racha_fuego_14',
        name: 'Racha Imparable',
        description: '14 días consecutivos',
        icon: 'Zap',
        color: '#DC2626',
        gradient: 'from-red-600 to-pink-600',
        points: 100,
        category: 'streak',
        requirement: {
          type: 'consecutive_days',
          value: 14
        }
      },
      maestro_habitos: {
        Id: 7,
        key: 'maestro_habitos',
        name: 'Maestro de Hábitos',
        description: '5 días perfectos (100% completados)',
        icon: 'Award',
        color: '#6366F1',
        gradient: 'from-indigo-500 to-purple-500',
        points: 125,
        category: 'mastery',
        requirement: {
          type: 'perfect_days_count',
          value: 5
        }
      },
      explorador: {
        Id: 8,
        key: 'explorador',
        name: 'Explorador',
        description: 'Crear 5 hábitos personalizados',
        icon: 'Compass',
        color: '#059669',
        gradient: 'from-emerald-500 to-teal-500',
        points: 40,
        category: 'exploration',
        requirement: {
          type: 'custom_habits_created',
          value: 5
        }
      }
    };
  }

  loadUserAchievements() {
    const saved = localStorage.getItem('user_achievements');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading user achievements:', e);
      }
    }
    return {};
  }

  saveUserAchievements() {
    localStorage.setItem('user_achievements', JSON.stringify(this.userAchievements));
  }

  async checkAllAchievements(force = false) {
    const newUnlocks = [];
    
    for (const achievement of Object.values(this.achievements)) {
      if (!this.isUnlocked(achievement.key) || force) {
        const unlocked = await this.checkAchievementRequirement(achievement);
        if (unlocked && !this.isUnlocked(achievement.key)) {
          this.unlockAchievement(achievement.key);
          newUnlocks.push(achievement);
        }
      }
    }

    return newUnlocks;
  }

  async checkAchievementRequirement(achievement) {
    const { requirement } = achievement;

    try {
      switch (requirement.type) {
        case 'consecutive_days':
          return await this.checkConsecutiveDays(requirement.value);
        
        case 'perfect_day':
          return await this.checkPerfectDay();
        
        case 'consistency_rate':
          return await this.checkConsistencyRate(requirement.value, requirement.days);
        
        case 'challenge_complete':
          return await this.checkChallengeComplete();
        
        case 'perfect_days_count':
          return await this.checkPerfectDaysCount(requirement.value);
        
        case 'custom_habits_created':
          return await this.checkCustomHabitsCreated(requirement.value);
        
        default:
          return false;
      }
    } catch (error) {
      console.error('Error checking achievement requirement:', error);
      return false;
    }
  }

  async checkConsecutiveDays(requiredDays) {
    try {
      const challenge = await challengeService.getActive();
      const completedDays = challenge.completedDays || [];
      
      if (completedDays.length < requiredDays) return false;
      
      // Sort days in descending order
      const sortedDays = [...completedDays].sort((a, b) => b - a);
      let consecutiveCount = 1;
      
      for (let i = 1; i < sortedDays.length; i++) {
        if (sortedDays[i-1] - sortedDays[i] === 1) {
          consecutiveCount++;
          if (consecutiveCount >= requiredDays) {
            return true;
          }
        } else {
          consecutiveCount = 1;
        }
      }
      
      return consecutiveCount >= requiredDays;
    } catch (error) {
      return false;
    }
  }

  async checkPerfectDay() {
    try {
      const habits = await habitService.getAll();
      if (habits.length === 0) return false;
      
      const completedToday = habits.filter(h => h.isCompletedToday).length;
      return completedToday === habits.length;
    } catch (error) {
      return false;
    }
  }

  async checkConsistencyRate(requiredRate, days) {
    try {
      const habits = await habitService.getAll();
      if (habits.length === 0) return false;
      
      // Simulate checking consistency over the last N days
      // In a real implementation, you'd track daily completion rates
      const totalPossibleCompletions = habits.length * days;
      let totalCompletions = 0;
      
      habits.forEach(habit => {
        // Estimate completions based on current streak and completion dates
        const completionDates = habit.completionDates || [];
        const recentCompletions = completionDates.length;
        totalCompletions += Math.min(recentCompletions, days);
      });
      
      const actualRate = (totalCompletions / totalPossibleCompletions) * 100;
      return actualRate >= requiredRate;
    } catch (error) {
      return false;
    }
  }

  async checkChallengeComplete() {
    try {
      const challenge = await challengeService.getActive();
      return challenge.isCompleted || (challenge.completedDays && challenge.completedDays.length >= 21);
    } catch (error) {
      return false;
    }
  }

  async checkPerfectDaysCount(requiredCount) {
    // This would need to be tracked over time in a real implementation
    // For now, simulate based on current progress
    try {
      const challenge = await challengeService.getActive();
      const completedDays = challenge.completedDays || [];
      // Assume some percentage of completed days were perfect
      const estimatedPerfectDays = Math.floor(completedDays.length * 0.3); // 30% were perfect
      return estimatedPerfectDays >= requiredCount;
    } catch (error) {
      return false;
    }
  }

  async checkCustomHabitsCreated(requiredCount) {
    try {
      const habits = await habitService.getAll();
      // Assume habits beyond the default ones are custom
      // In a real implementation, you'd track this explicitly
      return habits.length >= requiredCount;
    } catch (error) {
      return false;
    }
  }

  unlockAchievement(achievementKey) {
    this.userAchievements[achievementKey] = {
      unlockedAt: new Date().toISOString(),
      progress: 100
    };
    this.saveUserAchievements();
  }

  isUnlocked(achievementKey) {
    return !!this.userAchievements[achievementKey];
  }

  getUnlockedAchievements() {
    return Object.keys(this.userAchievements)
      .map(key => this.achievements[key])
      .filter(Boolean);
  }

  getAllAchievements() {
    return Object.values(this.achievements);
  }

  getAchievementProgress(achievementKey) {
    return this.userAchievements[achievementKey]?.progress || 0;
  }

  getTotalPoints() {
    return this.getUnlockedAchievements()
      .reduce((total, achievement) => total + achievement.points, 0);
  }

  getAchievementsByCategory(category) {
    return Object.values(this.achievements)
      .filter(achievement => achievement.category === category);
  }

  async getProgressTowardsAchievement(achievementKey) {
    const achievement = this.achievements[achievementKey];
    if (!achievement) return 0;

    if (this.isUnlocked(achievementKey)) return 100;

    // Calculate current progress towards the achievement
    const { requirement } = achievement;
    
    try {
      switch (requirement.type) {
        case 'consecutive_days': {
          const challenge = await challengeService.getActive();
          const completedDays = challenge.completedDays || [];
          const sortedDays = [...completedDays].sort((a, b) => b - a);
          let currentStreak = 0;
          
          for (let i = 1; i < sortedDays.length; i++) {
            if (sortedDays[i-1] - sortedDays[i] === 1) {
              currentStreak++;
            } else {
              break;
            }
          }
          if (sortedDays.length > 0) currentStreak++;
          
          return Math.min(100, (currentStreak / requirement.value) * 100);
        }
        
        case 'perfect_day': {
          const habits = await habitService.getAll();
          if (habits.length === 0) return 0;
          const completedToday = habits.filter(h => h.isCompletedToday).length;
          return (completedToday / habits.length) * 100;
        }
        
        case 'challenge_complete': {
          const challenge = await challengeService.getActive();
          const completedDays = challenge.completedDays || [];
          return Math.min(100, (completedDays.length / 21) * 100);
        }
        
        default:
          return 0;
      }
    } catch (error) {
      console.error('Error calculating achievement progress:', error);
      return 0;
    }
  }
}

export const achievementService = new AchievementService();