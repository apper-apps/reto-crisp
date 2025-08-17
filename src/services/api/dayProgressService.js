import dayProgressData from "@/services/mockData/dayProgress.json";

class DayProgressService {
constructor() {
    this.dayProgress = [...dayProgressData];
  }

  async getHistoricalData(days = 7) {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.dayProgress
      .slice(-days)
      .map(progress => ({
        date: progress.date,
        completion: Math.round((progress.habitsCompleted / progress.totalHabits) * 100)
      }));
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.dayProgress];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const progress = this.dayProgress.find(p => p.Id === id);
    if (!progress) {
      throw new Error(`Progreso con ID ${id} no encontrado`);
    }
    return { ...progress };
  }

async getByDay(day) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const progress = this.dayProgress.find(p => p.day === day);
    if (!progress) {
      // For Day 0, return a default structure if not found
      if (day === 0) {
        return {
          Id: 0,
          day: 0,
          completed: false,
          assessment: null
        };
      }
      throw new Error(`Progreso para el día ${day} no encontrado`);
    }
    return { ...progress };
  }
async getToday() {
    await new Promise(resolve => setTimeout(resolve, 200));
    const today = new Date().toISOString().split('T')[0];
    let progress = this.dayProgress.find(p => p.date === today);
    
    if (!progress) {
      // Return current day progress (day 5 for demo)
      progress = this.dayProgress.find(p => p.day === 5);
    }
    
    return progress ? { ...progress } : null;
  }

async create(progressData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.dayProgress.map(p => p.Id), 0);
    const newProgress = {
      Id: maxId + 1,
      ...progressData,
      createdAt: new Date().toISOString()
    };
    
    this.dayProgress.push(newProgress);
    return { ...newProgress };
  }

async update(id, progressData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.dayProgress.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Progreso con ID ${id} no encontrado`);
    }
    
    this.dayProgress[index] = { 
      ...this.dayProgress[index], 
      ...progressData,
      updatedAt: new Date().toISOString()
    };
    return { ...this.dayProgress[index] };
  }

  async getWeeklyComparison() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Generate sample weekly comparison data
    const currentWeek = [4, 5, 3, 6, 4, 5, 6]; // Habits completed each day
    const previousWeek = [3, 4, 5, 4, 6, 3, 5];
    
    const improvement = Math.round(
      ((currentWeek.reduce((a, b) => a + b, 0) / currentWeek.length) / 
       (previousWeek.reduce((a, b) => a + b, 0) / previousWeek.length) - 1) * 100
    );

    return {
      currentWeek,
      previousWeek,
      improvement
    };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.dayProgress.findIndex(p => p.Id === id);
    if (index === -1) {
      throw new Error(`Progreso con ID ${id} no encontrado`);
    }
    
    this.dayProgress.splice(index, 1);
    return true;
  }
}

export const dayProgressService = new DayProgressService();