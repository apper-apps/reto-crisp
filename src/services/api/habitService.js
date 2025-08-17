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
      isCompletedToday: false,
      completionDates: []
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

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.habits.findIndex(h => h.Id === id);
    if (index === -1) {
      throw new Error(`Hábito con ID ${id} no encontrado`);
    }
    
    this.habits.splice(index, 1);
    return true;
  }
}

export const habitService = new HabitService();