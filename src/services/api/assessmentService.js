class AssessmentService {
  constructor() {
    // Initialize with empty assessment data
this.assessmentData = null;
    this.finalMetrics = null;
    this.photos = { initial: null, final: null };
    this.satisfactionSurvey = null;
    this.testimonial = null;
  }

async getAssessment() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    // Return existing assessment or default structure
    if (this.assessmentData) {
      return { ...this.assessmentData };
    }

// Default assessment structure for HealthMetrics
    return {
      Id: 1,
      completed: false,
      completed_at: null,
      user_id: 1, // Would be dynamic in real app
      cohort_id: 1, // Would be dynamic in real app
      phase: 'inicio',
      personalData: {
        fechaNacimiento: '',
        sexo: ''
      },
      measurements: {
        peso_kg: '',
        estatura_cm: '',
        cintura_cm: '',
        cadera_cm: '',
        imc: '' // calculated field
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  }

async createAssessment(assessmentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Calculate BMI if peso_kg and estatura_cm are provided
    let imc = '';
    if (assessmentData.measurements?.peso_kg && assessmentData.measurements?.estatura_cm) {
      const peso = parseFloat(assessmentData.measurements.peso_kg);
      const estaturaM = parseFloat(assessmentData.measurements.estatura_cm) / 100;
      if (peso > 0 && estaturaM > 0) {
        imc = (peso / (estaturaM * estaturaM)).toFixed(1);
      }
    }
    
    const newAssessment = {
      Id: 1,
      ...assessmentData,
      measurements: {
        ...assessmentData.measurements,
        imc: imc
      },
      phase: 'inicio',
      user_id: 1,
      cohort_id: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    this.assessmentData = newAssessment;
    
    return { ...newAssessment };
  }

async updateAssessment(assessmentData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    if (!this.assessmentData) {
      throw new Error('No hay evaluación inicial para actualizar');
    }
    
    // Calculate BMI if peso_kg and estatura_cm are provided
    let updatedMeasurements = { ...assessmentData.measurements };
    if (assessmentData.measurements?.peso_kg && assessmentData.measurements?.estatura_cm) {
      const peso = parseFloat(assessmentData.measurements.peso_kg);
      const estaturaM = parseFloat(assessmentData.measurements.estatura_cm) / 100;
      if (peso > 0 && estaturaM > 0) {
        updatedMeasurements.imc = (peso / (estaturaM * estaturaM)).toFixed(1);
      }
    }
    
    this.assessmentData = {
      ...this.assessmentData,
      ...assessmentData,
      measurements: updatedMeasurements,
      updated_at: new Date().toISOString()
    };
    
    return { ...this.assessmentData };
  }

  async getFinalAssessment() {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    return {
      initialAssessment: this.assessmentData ? { ...this.assessmentData } : null,
      finalMetrics: this.finalMetrics ? { ...this.finalMetrics } : null,
      photos: { ...this.photos },
      satisfactionSurvey: this.satisfactionSurvey ? { ...this.satisfactionSurvey } : null,
      testimonial: this.testimonial || '',
      comparisonReport: this.finalMetrics && this.assessmentData 
        ? this.generateComparisonReport(this.assessmentData, this.finalMetrics) 
        : null
    };
  }

  async saveFinalMetrics(metricsData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    this.finalMetrics = {
      ...metricsData,
      completedAt: new Date().toISOString()
    };
    
    return { ...this.finalMetrics };
  }

  async savePhotos(photosData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    
    this.photos.final = { ...photosData };
    
    return { ...this.photos };
  }

  async generateComparisonReport(initialAssessment, finalMetrics) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (!initialAssessment || !finalMetrics) {
      throw new Error('Datos insuficientes para generar el reporte');
    }

    const weightChange = finalMetrics.weight && initialAssessment.weight 
      ? parseFloat(finalMetrics.weight) - parseFloat(initialAssessment.weight)
      : 0;

    const energyImprovement = (finalMetrics.energyLevel || 5) - (initialAssessment.energyLevel || 5);
    const sleepImprovement = (finalMetrics.sleepQuality || 5) - (initialAssessment.sleepQuality || 5);
    const wellnessImprovement = (finalMetrics.overallWellness || 5) - (initialAssessment.overallWellness || 5);

    // Calculate measurement changes
    const measurementChanges = {};
    if (initialAssessment.measurements && finalMetrics.measurements) {
      Object.keys(initialAssessment.measurements).forEach(key => {
        const initial = parseFloat(initialAssessment.measurements[key]) || 0;
        const final = parseFloat(finalMetrics.measurements[key]) || 0;
        measurementChanges[key] = final - initial;
      });
    }

    return {
      weightChange: Math.round(weightChange * 100) / 100,
      energyImprovement,
      sleepImprovement,
      wellnessImprovement,
      measurementChanges,
      overallImprovement: Math.round(((energyImprovement + sleepImprovement + wellnessImprovement) / 3) * 100) / 100,
      generatedAt: new Date().toISOString()
    };
  }

  async saveSatisfactionSurvey(surveyData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.satisfactionSurvey = {
      ...surveyData,
      submittedAt: new Date().toISOString()
    };
    
    return { ...this.satisfactionSurvey };
  }

  async saveTestimonial(testimonialText) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    this.testimonial = {
      text: testimonialText,
      submittedAt: new Date().toISOString(),
      approved: false // For moderation
    };
    
    return { ...this.testimonial };
  }

async completeAssessment(assessmentData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // First update with latest data if provided
    if (assessmentData) {
      await this.updateAssessment(assessmentData);
    }
    
    if (!this.assessmentData) {
      throw new Error('No hay evaluación inicial para completar');
    }
    
    // Mark as completed
    this.assessmentData = {
      ...this.assessmentData,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    return { ...this.assessmentData };
  }

  async completeFinalAssessment() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    if (!this.finalMetrics) {
      throw new Error('No se han guardado las métricas finales');
    }

    // Mark the entire assessment flow as complete
    const finalAssessment = {
      initialAssessment: this.assessmentData,
      finalMetrics: this.finalMetrics,
      photos: this.photos,
      satisfactionSurvey: this.satisfactionSurvey,
      testimonial: this.testimonial,
      comparisonReport: await this.generateComparisonReport(this.assessmentData, this.finalMetrics),
      completedAt: new Date().toISOString(),
      challengeCompleted: true
    };

    return finalAssessment;
  }
}

export const assessmentService = new AssessmentService();