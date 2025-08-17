import challengesData from "@/services/mockData/challenges.json";

class ChallengeService {
  constructor() {
    this.challenges = [...challengesData];
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
}

export const challengeService = new ChallengeService();