import habitsData from "@/services/mockData/habits.json";
import React from "react";
import Error from "@/components/ui/Error";

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

async getCompletionTrends(timeRange = '7days') {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const days = timeRange === '7days' ? 7 : timeRange === '14days' ? 14 : 21;
      const dates = [];
      const today = new Date();
      
      // Generate dates for the range
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('es-ES', { 
          month: 'short', 
          day: 'numeric' 
        }));
      }

      // Generate sample trend data with realistic patterns
      const categories = this.getCategories() || [];
const series = Array.isArray(categories) ? categories.map((category, index) => {
        const baseRate = 70 + (index * 5); // Different starting points
        const data = dates.map((_, dayIndex) => {
          // Create realistic trends with some randomness
          const trendFactor = Math.sin(dayIndex * 0.3) * 10;
          const randomFactor = (Math.random() - 0.5) * 15;
          const value = Math.max(40, Math.min(100, baseRate + trendFactor + randomFactor));
          return Math.round(value);
        });
        
        return {
          name: category?.name || 'Sin categoría',
          data: Array.isArray(data) ? data : []
        };
      }) : [];

      return {
        dates: Array.isArray(dates) ? dates : [],
        series: Array.isArray(series) ? series : []
      };
    } catch (error) {
      console.error('Error getting completion trends:', error);
      // Return safe default structure
      return {
        dates: [],
        series: []
      };
    }
  }

async getWeeklyStats() {
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Ensure habits array exists and is valid
      const habitsArray = Array.isArray(this.habits) ? this.habits : [];
      const completedHabits = habitsArray.filter(h => h?.isCompletedToday).length;
      const totalHabits = habitsArray.length;
      const completionRate = totalHabits > 0 ? (completedHabits / totalHabits) : 0;
      
      // Generate realistic weekly completion data
      const completedDays = Math.floor(Math.random() * 3) + 5; // 5-7 days
      const averageCompletion = Math.round(completionRate * 100);
      
      // Find best performing habit (simulate streaks) with null check
const bestHabit = habitsArray.length > 0 ? habitsArray.reduce((best, current) => {
        const currentStreak = current?.streak || Math.floor(Math.random() * 10);
        const bestStreak = best?.streak || 0;
        return currentStreak > bestStreak ? current : best;
      }, habitsArray[0]) : null;
      
      return {
        completedDays,
        averageCompletion,
        bestHabit: bestHabit?.name || "Ejercicio",
        consistencyLevel: averageCompletion >= 80 ? "Excelente" : 
                         averageCompletion >= 60 ? "Bueno" : "Regular"
      };
    } catch (error) {
      console.error('Error getting weekly stats:', error);
      return {
        completedDays: 0,
        averageCompletion: 0,
        bestHabit: "Ejercicio",
        consistencyLevel: "Regular"
      };
    }
  }
}

export const habitService = new HabitService();