class PointsService {
  constructor() {
    this.POINTS_KEY = 'userPoints';
    this.POINTS_HISTORY_KEY = 'pointsHistory';
    this.loadPoints();
  }

  loadPoints() {
    try {
      const saved = localStorage.getItem(this.POINTS_KEY);
      this.totalPoints = saved ? parseInt(saved, 10) : 0;
    } catch (error) {
      this.totalPoints = 0;
    }
  }

  savePoints() {
    try {
      localStorage.setItem(this.POINTS_KEY, this.totalPoints.toString());
    } catch (error) {
      console.warn('Could not save points to localStorage');
    }
  }

  addPointsHistory(action, points, details = {}) {
    try {
      const history = this.getPointsHistory();
      const entry = {
        id: Date.now(),
        action,
        points,
        details,
        timestamp: new Date().toISOString(),
        totalAfter: this.totalPoints
      };
      
      history.unshift(entry);
      // Keep only last 100 entries
      const trimmed = history.slice(0, 100);
      localStorage.setItem(this.POINTS_HISTORY_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Could not save points history');
    }
  }

  getPointsHistory() {
    try {
      const saved = localStorage.getItem(this.POINTS_HISTORY_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  }

  getTotalPoints() {
    return this.totalPoints;
  }

  awardHabitCompletion(habitName = 'Habit') {
    const points = 10;
    this.totalPoints += points;
    this.savePoints();
    this.addPointsHistory('habit_complete', points, { habitName });
    return points;
  }

  awardDailyMoment(momentType = 'Daily Moment') {
    const points = 5;
    this.totalPoints += points;
    this.savePoints();
    this.addPointsHistory('daily_moment', points, { momentType });
    return points;
  }

  awardStreakBonus(streakDays) {
    if (streakDays < 3) return 0;
    
    const points = streakDays * 5;
    this.totalPoints += points;
    this.savePoints();
    this.addPointsHistory('streak_bonus', points, { streakDays });
    return points;
  }

  awardPerfectDay(habitsCompleted, totalHabits) {
    if (habitsCompleted !== totalHabits || totalHabits === 0) return 0;
    
    const points = 20;
    this.totalPoints += points;
    this.savePoints();
    this.addPointsHistory('perfect_day', points, { habitsCompleted, totalHabits });
    return points;
  }

  awardChallengeProgress(day) {
    const points = Math.min(day * 2, 15); // Escalating rewards, cap at 15
    this.totalPoints += points;
    this.savePoints();
    this.addPointsHistory('challenge_progress', points, { day });
    return points;
  }
}

export const pointsService = new PointsService();