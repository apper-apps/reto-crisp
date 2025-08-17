import habitsData from "@/services/mockData/habits.json";

class HabitService {
  constructor() {
    this.habits = [...habitsData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.habits];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const habit = this.habits.find(h => h.Id === id);
    if (!habit) {
      throw new Error(`Hábito con ID ${id} no encontrado`);
    }
    return { ...habit };
  }

async create(habitData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.habits.map(h => h.Id), 0);
    const newHabit = {
      Id: maxId + 1,
      ...habitData,
      goal: habitData.goal || { current: 0, target: 1, unit: "vez" },
      isCompletedToday: false,
      completionDates: [],
      currentStreak: 0,
      bestStreak: 0
    };
    
    this.habits.push(newHabit);
    return { ...newHabit };
  }

async update(id, habitData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.habits.findIndex(h => h.Id === id);
    if (index === -1) {
      throw new Error(`Hábito con ID ${id} no encontrado`);
    }
    
    this.habits[index] = { ...this.habits[index], ...habitData };
    return { ...this.habits[index] };
  }

  getCategories() {
    return [
      { name: "Salud", icon: "Heart", color: "#10B981" },
      { name: "Ejercicio", icon: "Activity", color: "#EF4444" },
      { name: "Alimentación", icon: "Apple", color: "#F59E0B" },
      { name: "Mental", icon: "Brain", color: "#8B5CF6" },
      { name: "Productividad", icon: "Target", color: "#3B82F6" }
    ];
  }
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.habits.findIndex(h => h.Id === id);
    if (index === -1) {
      throw new Error(`Hábito con ID ${id} no encontrado`);
    }
    
this.habits.splice(index, 1);
    return true;
  }

  calculateStreaks(habit) {
    if (!habit.completionDates || habit.completionDates.length === 0) {
      return { currentStreak: 0, bestStreak: 0 };
    }

    const sortedDates = [...habit.completionDates].sort((a, b) => new Date(b) - new Date(a));
    const today = new Date().toISOString().split('T')[0];
    
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 0;
    
    // Calculate current streak
    let checkDate = new Date(today);
    for (let i = 0; i < sortedDates.length; i++) {
      const dateStr = checkDate.toISOString().split('T')[0];
      if (sortedDates.includes(dateStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    
    // Calculate best streak
    const allDates = sortedDates.map(d => new Date(d)).sort((a, b) => a - b);
    for (let i = 0; i < allDates.length; i++) {
      tempStreak = 1;
      for (let j = i + 1; j < allDates.length; j++) {
        const dayDiff = (allDates[j] - allDates[j-1]) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          break;
        }
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    }
    
    return { currentStreak, bestStreak: Math.max(bestStreak, currentStreak) };
  }

  async updateStreaks() {
    await new Promise(resolve => setTimeout(resolve, 200));
    this.habits.forEach(habit => {
      const streaks = this.calculateStreaks(habit);
      habit.currentStreak = streaks.currentStreak;
      habit.bestStreak = streaks.bestStreak;
    });
    return this.habits;
  }

  getStreakMilestones(streakDays) {
    const milestones = [3, 7, 14, 21];
    return milestones.includes(streakDays);
  }
}

export const habitService = new HabitService();