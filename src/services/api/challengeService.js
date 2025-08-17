import challengesData from "@/services/mockData/challenges.json";

class ChallengeService {
constructor() {
    this.challenges = [...challengesData];
    this.miniChallenges = [];
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
}

// Create and export service instance
const challengeService = new ChallengeService();
export { challengeService };
export default challengeService;