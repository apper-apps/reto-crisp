import challengesData from "@/services/mockData/challenges.json";

class ChallengeService {
  constructor() {
    // Access the challenges array from the JSON object structure
    this.challenges = Array.isArray(challengesData?.challenges) 
      ? [...challengesData.challenges] 
      : [];
    this.miniChallenges = Array.isArray(challengesData?.miniChallenges) 
      ? [...challengesData.miniChallenges] 
      : [];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.challenges];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const challenge = this.challenges.find(c => c.Id === id);
    if (!challenge) {
      throw new Error(`Reto con ID ${id} no encontrado`);
    }
    return { ...challenge };
  }

  async getActive() {
    await new Promise(resolve => setTimeout(resolve, 250));
    const activeChallenge = this.challenges.find(c => c.isActive);
    if (!activeChallenge) {
      throw new Error("No hay reto activo");
    }
    return { ...activeChallenge };
  }

  async create(challengeData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...this.challenges.map(c => c.Id), 0);
    const newChallenge = {
      Id: maxId + 1,
      ...challengeData,
      isActive: true
    };
    
    // Deactivate other challenges
    this.challenges = this.challenges.map(c => ({ ...c, isActive: false }));
    this.challenges.push(newChallenge);
    
    return { ...newChallenge };
  }

async update(id, challengeData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.challenges.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Reto con ID ${id} no encontrado`);
    }
    
    this.challenges[index] = { ...this.challenges[index], ...challengeData };
    return { ...this.challenges[index] };
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.challenges.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Reto con ID ${id} no encontrado`);
    }
    
    this.challenges.splice(index, 1);
    return true;
  }

  /**
   * Get progress history data for charts
   */
  async getProgressHistory() {
    try {
      // Generate mock progress history data for the last 21 days
      const progressHistory = Array.from({ length: 21 }, (_, index) => ({
        day: index + 1,
        completion: Math.min(95, Math.max(10, 20 + index * 3 + Math.random() * 15)),
        date: new Date(Date.now() - (20 - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }));

      return progressHistory;
    } catch (error) {
      console.error('Error getting progress history:', error);
      throw error;
    }
  }

  /**
   * Get progress trends data for analytics
   */
  async getProgressTrends() {
    try {
      // Generate mock progress trends data
      const trends = Array.from({ length: 21 }, (_, index) => ({
        day: index + 1,
        completion: Math.min(95, Math.max(10, 20 + index * 3 + Math.random() * 15))
      }));
      
      return trends;
    } catch (error) {
      console.error('Error getting progress trends:', error);
      throw error;
    }
  }

  // Mini-challenge methods
  async getAllMiniChallenges() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.miniChallenges];
  }

  async getActiveMiniChallenges() {
    await new Promise(resolve => setTimeout(resolve, 250));
    return this.miniChallenges.filter(mc => mc.isActive && !mc.isCompleted);
  }

  async getMiniChallengeById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const miniChallenge = this.miniChallenges.find(mc => mc.Id === id);
    if (!miniChallenge) {
      throw new Error(`Mini-reto con ID ${id} no encontrado`);
    }
    return { ...miniChallenge };
  }

  async completeMiniChallenge(id, dayCompleted) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = this.miniChallenges.findIndex(mc => mc.Id === id);
    if (index === -1) {
      throw new Error(`Mini-reto con ID ${id} no encontrado`);
    }

    const miniChallenge = this.miniChallenges[index];
    if (!miniChallenge.progress.completedDays.includes(dayCompleted)) {
      miniChallenge.progress.completedDays.push(dayCompleted);
      miniChallenge.progress.current = miniChallenge.progress.completedDays.length;
      
      // Check if completed
      if (miniChallenge.progress.current >= miniChallenge.progress.total) {
        miniChallenge.isCompleted = true;
      }
    }

    return { ...miniChallenge };
  }

  async updateMiniChallenge(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const index = this.miniChallenges.findIndex(mc => mc.Id === id);
    if (index === -1) {
      throw new Error(`Mini-reto con ID ${id} no encontrado`);
    }
    
this.miniChallenges[index] = { ...this.miniChallenges[index], ...updateData };
    return { ...this.miniChallenges[index] };
  }

  async markChallengeComplete(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = this.challenges.findIndex(c => c.Id === id);
    if (index === -1) {
      throw new Error(`Reto con ID ${id} no encontrado`);
    }
    
    this.challenges[index] = {
      ...this.challenges[index],
      isCompleted: true,
      completedAt: new Date().toISOString(),
      finalDay: 21
    };
    
    return { ...this.challenges[index] };
  }
}
// Create and export service instance
const challengeService = new ChallengeService();
export { challengeService };
export default challengeService;