import dayProgressData from "@/services/mockData/dayProgress.json";

class DayProgressService {
constructor() {
    this.dayProgress = [...dayProgressData];
  }

async getHistoricalData(days = 7) {
    try {
      await new Promise(resolve => setTimeout(resolve, 250));
      
      // Ensure dayProgress is an array before using slice
      const progressArray = Array.isArray(this.dayProgress) ? this.dayProgress : [];
      
      return progressArray
        .slice(-days)
        .map(progress => ({
          date: progress?.date || new Date().toISOString().split('T')[0],
          completion: progress?.habitsCompleted && progress?.totalHabits 
            ? Math.round((progress.habitsCompleted / progress.totalHabits) * 100)
            : 0
        }));
    } catch (error) {
      console.error('Error getting historical data:', error);
      // Return safe default array
      return [];
    }
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
    try {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Generate realistic weekly comparison data
      const generateWeekData = (baseRate = 5) => {
        return Array.from({ length: 7 }, (_, i) => {
          // Weekend patterns (Sat=5, Sun=6)
          const isWeekend = i >= 5;
          const weekendBonus = isWeekend ? Math.floor(Math.random() * 2) : 0;
          const dailyVariation = Math.floor(Math.random() * 3) - 1; // -1 to 1
          
          return Math.max(2, Math.min(8, baseRate + weekendBonus + dailyVariation));
        });
      };
      
      const currentWeek = generateWeekData(5);
const previousWeek = generateWeekData(4.5);
      
      // Ensure arrays are valid before calculations
      const safeCurrentWeek = Array.isArray(currentWeek) ? currentWeek : [];
      const safePreviousWeek = Array.isArray(previousWeek) ? previousWeek : [];
      
      const currentAvg = safeCurrentWeek.length > 0 ? safeCurrentWeek.reduce((a, b) => a + b, 0) / safeCurrentWeek.length : 0;
      const previousAvg = safePreviousWeek.length > 0 ? safePreviousWeek.reduce((a, b) => a + b, 0) / safePreviousWeek.length : 0;
      
      const improvement = previousAvg > 0 ? Math.round(((currentAvg / previousAvg) - 1) * 100) : 0;

      return {
        currentWeek: safeCurrentWeek,
        previousWeek: safePreviousWeek,
        improvement
      };
    } catch (error) {
      console.error('Error getting weekly comparison:', error);
      // Return safe default structure
      return {
        currentWeek: [],
        previousWeek: [],
        improvement: 0
      };
    }
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