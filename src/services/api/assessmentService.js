class AssessmentService {
  constructor() {
    // Initialize with empty assessment data
    this.assessmentData = null;
  }

  async getAssessment() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Return existing assessment or default structure
    if (this.assessmentData) {
      return { ...this.assessmentData };
    }

    // Default assessment structure
    return {
      Id: 1,
      completed: false,
      completedAt: null,
      personalInfo: {
        age: '',
        height: '',
        targetWeight: ''
      },
      physicalMeasurements: {
        currentWeight: '',
        chest: '',
        waist: '',
        hips: '',
        arms: '',
        thighs: ''
      },
      energyLevels: {
        overallEnergy: 5,
        sleepQuality: 5,
        stressLevel: 5,
        motivation: 5
      },
      photos: {
        front: null,
        side: null,
        back: null
      },
      goals: {
        primary: '',
        secondary: '',
        timeline: '21'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  async createAssessment(assessmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newAssessment = {
      Id: 1,
      ...assessmentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.assessmentData = newAssessment;
    return { ...newAssessment };
  }

  async updateAssessment(assessmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    if (!this.assessmentData) {
      throw new Error('No hay evaluación inicial para actualizar');
    }
    
    this.assessmentData = {
      ...this.assessmentData,
      ...assessmentData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.assessmentData };
  }

  async completeAssessment() {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!this.assessmentData) {
      throw new Error('No hay evaluación inicial para completar');
    }
    
    this.assessmentData = {
      ...this.assessmentData,
      completed: true,
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.assessmentData };
  }
}

export const assessmentService = new AssessmentService();