import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assessmentService } from "@/services/api/assessmentService";
import { usePoints } from "@/contexts/PointsContext";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

const moments = [
  {
    id: 'morning',
    title: 'Mañana',
    icon: 'Sunrise',
    time: '6:00 - 12:00',
    color: 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200',
    iconColor: 'text-yellow-600'
  },
  {
    id: 'midday',
    title: 'Mediodía',
    icon: 'Sun',
    time: '12:00 - 17:00',
    color: 'bg-gradient-to-br from-orange-50 to-red-50 border-orange-200',
    iconColor: 'text-orange-600'
  },
  {
    id: 'evening',
    title: 'Tarde',
    icon: 'Sunset',
    time: '17:00 - 21:00',
    color: 'bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200',
    iconColor: 'text-purple-600'
  },
  {
    id: 'night',
    title: 'Noche',
    icon: 'Moon',
    time: '21:00 - 6:00',
    color: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200',
    iconColor: 'text-blue-600'
  }
];

const getDayContent = (day) => {
  // Day 1: Hydration Focus
  if (day === 1) {
    return {
      morning: [
        { 
          id: 1, 
          type: 'activity', 
          title: 'Desafío de Hidratación', 
          description: 'Confirma que has preparado tu botella de agua',
          completed: true 
        },
        { 
          id: 2, 
          type: 'reflection', 
          title: 'Mi compromiso personal con la hidratación', 
          prompt: '¿Qué te motiva a mantenerte hidratado hoy?',
          completed: false 
        },
        { 
          id: 3, 
          type: 'survey', 
          title: '¿Cómo te sientes al despertar?', 
          question: 'Califica tu nivel de energía matutino',
          scale: { min: 1, max: 5, labels: ['Muy bajo', 'Bajo', 'Regular', 'Alto', 'Muy alto'] },
          completed: true,
          response: 4
        }
      ],
      midday: [
        { 
          id: 4, 
          type: 'education', 
          title: 'Beneficios del agua en el cuerpo', 
          content: 'El agua ayuda a transportar nutrientes, regular temperatura corporal y eliminar toxinas.',
          image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=240&fit=crop',
          completed: true 
        },
        { 
          id: 5, 
          type: 'activity', 
          title: 'Beber segundo vaso de agua', 
          description: 'Confirma que has bebido tu segundo vaso del día',
          completed: false 
        },
        { 
          id: 6, 
          type: 'survey', 
          title: 'Nivel de hidratación a medio día', 
          question: '¿Qué tan hidratado te sientes?',
          scale: { min: 1, max: 5, labels: ['Muy deshidratado', 'Deshidratado', 'Normal', 'Hidratado', 'Muy hidratado'] },
          completed: false 
        }
      ],
      evening: [
        { 
          id: 7, 
          type: 'survey', 
          title: '¿Cómo te sientes?', 
          question: 'Califica tu nivel de energía al final del día',
          scale: { min: 1, max: 5, labels: ['Muy cansado', 'Cansado', 'Regular', 'Energético', 'Muy energético'] },
          completed: false 
        },
        { 
          id: 8, 
          type: 'reflection', 
          title: 'Evaluar mi hidratación del día', 
          prompt: '¿Cómo ha sido tu experiencia con la hidratación hoy? ¿Qué cambios notaste?',
          completed: true,
          response: 'Me sentí más energético y concentrado durante el día.'
        },
        { 
          id: 9, 
          type: 'education', 
          title: 'Importancia de la hidratación nocturna', 
          content: 'Mantener un nivel adecuado de hidratación durante la noche ayuda a la recuperación muscular y la regeneración celular.',
          image: 'https://images.unsplash.com/photo-1571897349842-73856c6ead5a?w=400&h=240&fit=crop',
          completed: true 
        }
      ],
      night: [
        { 
          id: 10, 
          type: 'reflection', 
          title: 'Gratitud: Logros del día en hidratación', 
          prompt: '¿De qué logro relacionado con la hidratación te sientes más orgulloso hoy?',
          completed: false 
        },
        { 
          id: 11, 
          type: 'activity', 
          title: 'Confirmar cumplimiento del reto diario', 
          description: 'Has completado tu objetivo de hidratación diaria',
          completed: false 
        },
        { 
          id: 12, 
          type: 'education', 
          title: 'Preparación para mañana', 
          content: 'Preparar tu botella de agua la noche anterior te ayuda a establecer una rutina exitosa.',
          image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=240&fit=crop',
          completed: true 
        }
      ]
    };
  }
  
  // Day 2: Exercise & Movement Focus
  if (day === 2) {
    return {
      morning: [
        { 
          id: 21, 
          type: 'activity', 
          title: 'Rutina de Estiramientos Matutinos', 
          description: 'Completa 5 minutos de estiramientos para activar tu cuerpo',
          duration: 300, // 5 minutes in seconds
          completed: false 
        },
        { 
          id: 22, 
          type: 'photo', 
          title: 'Foto de Motivación Pre-Ejercicio', 
          description: 'Tómate una selfie antes de comenzar tu día activo',
          completed: true,
          image: null
        },
        { 
          id: 23, 
          type: 'survey', 
          title: 'Nivel de Energía Matutino', 
          question: '¿Qué tan preparado te sientes para moverte hoy?',
          scale: { min: 1, max: 5, labels: ['Nada preparado', 'Poco preparado', 'Moderado', 'Muy preparado', 'Súper motivado'] },
          completed: false
        }
      ],
      midday: [
        { 
          id: 24, 
          type: 'timer', 
          title: 'Sesión de Ejercicio Cardiovascular', 
          description: 'Realiza 20 minutos de actividad cardiovascular (caminar, correr, bailar)',
          duration: 1200, // 20 minutes
          completed: false 
        },
        { 
          id: 25, 
          type: 'education', 
          title: 'Beneficios del Ejercicio Cardiovascular', 
          content: 'El ejercicio cardiovascular fortalece el corazón, mejora la circulación, quema calorías y libera endorfinas que mejoran el estado de ánimo.',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=240&fit=crop',
          completed: false 
        },
        { 
          id: 26, 
          type: 'reflection', 
          title: 'Reflexión Post-Ejercicio', 
          prompt: '¿Cómo te sientes después de moverte? ¿Qué sensaciones notas en tu cuerpo?',
          completed: false
        }
      ],
      evening: [
        { 
          id: 27, 
          type: 'activity', 
          title: 'Caminata de Recuperación', 
          description: 'Realiza una caminata suave de 10 minutos para recuperarte',
          completed: false 
        },
        { 
          id: 28, 
          type: 'survey', 
          title: 'Evaluación de Fuerza Muscular', 
          question: '¿Cómo sientes tus músculos después del día de ejercicio?',
          scale: { min: 1, max: 5, labels: ['Muy doloridos', 'Doloridos', 'Normal', 'Fuertes', 'Muy fuertes'] },
          completed: false
        },
        { 
          id: 29, 
          type: 'education', 
          title: 'Importancia de la Recuperación Activa', 
          content: 'La recuperación activa con movimientos suaves ayuda a reducir la acumulación de ácido láctico y mejora la flexibilidad.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=240&fit=crop',
          completed: false 
        }
      ],
      night: [
        { 
          id: 30, 
          type: 'timer', 
          title: 'Sesión de Yoga Nocturno', 
          description: 'Practica yoga restaurativo para relajar músculos y mente',
          duration: 600, // 10 minutes
          completed: false 
        },
        { 
          id: 31, 
          type: 'reflection', 
          title: 'Gratitud por el Movimiento', 
          prompt: '¿Qué movimiento o ejercicio de hoy te hizo sentir más vivo y agradecido con tu cuerpo?',
          completed: false 
        },
        { 
          id: 32, 
          type: 'activity', 
          title: 'Registro de Logros del Día', 
          description: 'Confirma que completaste tus objetivos de movimiento diario',
          completed: false 
        }
      ]
    };
  }
  
  // Day 3: Nutrition & Mindfulness Focus
  if (day === 3) {
    return {
      morning: [
        { 
          id: 41, 
          type: 'photo', 
          title: 'Foto de Desayuno Saludable', 
          description: 'Captura tu desayuno balanceado y colorido',
          completed: false,
          image: null
        },
        { 
          id: 42, 
          type: 'mindfulness', 
          title: 'Meditación de Alimentación Consciente', 
          description: 'Practica 5 minutos de mindfulness antes de comer',
          duration: 300,
          guide: 'Respira profundo, observa los colores, texturas y aromas de tu comida. Come lentamente, saboreando cada bocado.',
          completed: false 
        },
        { 
          id: 43, 
          type: 'survey', 
          title: 'Nivel de Hambre Matutino', 
          question: '¿Qué tan hambriento te sientes al despertar?',
          scale: { min: 1, max: 5, labels: ['Nada hambriento', 'Poco hambre', 'Hambre moderada', 'Bastante hambre', 'Muy hambriento'] },
          completed: false
        }
      ],
      midday: [
        { 
          id: 44, 
          type: 'nutrition', 
          title: 'Planificación de Almuerzo Balanceado', 
          description: 'Planifica un almuerzo que incluya proteína, carbohidratos complejos y vegetales',
          categories: ['Proteína', 'Carbohidratos', 'Vegetales', 'Grasas saludables'],
          completed: false 
        },
        { 
          id: 45, 
          type: 'education', 
          title: 'Macronutrientes Esenciales', 
          content: 'Los macronutrientes (proteínas, carbohidratos y grasas) son fundamentales para el funcionamiento óptimo del cuerpo. Cada uno cumple funciones específicas en el metabolismo y la salud.',
          image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=240&fit=crop',
          completed: false 
        },
        { 
          id: 46, 
          type: 'hydration', 
          title: 'Control de Hidratación Consciente', 
          description: 'Registra cuántos vasos de agua has bebido hasta ahora',
          target: 4,
          completed: false,
          current: 0
        }
      ],
      evening: [
        { 
          id: 47, 
          type: 'photo', 
          title: 'Foto de Cena Nutritiva', 
          description: 'Documenta tu cena equilibrada del día',
          completed: false,
          image: null
        },
        { 
          id: 48, 
          type: 'reflection', 
          title: 'Reflexión sobre Hábitos Alimentarios', 
          prompt: '¿Cómo te sentiste al comer conscientemente hoy? ¿Notaste diferencias en tu digestión o saciedad?',
          completed: false
        },
        { 
          id: 49, 
          type: 'survey', 
          title: 'Nivel de Energía Post-Comidas', 
          question: '¿Cómo se mantuvo tu energía durante el día con tus elecciones alimentarias?',
          scale: { min: 1, max: 5, labels: ['Muy baja', 'Baja', 'Estable', 'Alta', 'Muy alta y constante'] },
          completed: false
        }
      ],
      night: [
        { 
          id: 50, 
          type: 'mindfulness', 
          title: 'Meditación de Gratitud por los Alimentos', 
          description: 'Reflexiona con gratitud sobre los alimentos que nutrieron tu cuerpo hoy',
          duration: 480, // 8 minutes
          guide: 'Respira profundo y recuerda cada comida del día. Siente gratitud hacia la tierra, los agricultores y todos los que hicieron posible tu nutrición.',
          completed: false 
        },
        { 
          id: 51, 
          type: 'nutrition', 
          title: 'Registro Nutricional del Día', 
          description: 'Evalúa qué tan balanceada fue tu alimentación hoy',
          categories: ['Frutas y vegetales', 'Proteínas', 'Granos integrales', 'Lácteos/Alternativas', 'Grasas saludables'],
          completed: false 
        },
        { 
          id: 52, 
          type: 'activity', 
          title: 'Preparación Consciente para Mañana', 
          description: 'Planifica mentalmente tu primera comida del día siguiente',
          completed: false 
        }
      ]
    };
  }
  
  // Default empty content for other days
  return {
    morning: [],
    midday: [],
    evening: [],
    night: []
  };
};

function DayPlan({ day, challenge, onBack }) {
  const { awardPoints, streakCelebration } = usePoints();
  const [expandedMoments, setExpandedMoments] = useState({});
  const [completedItems, setCompletedItems] = useState(new Set());
  const [surveyResponses, setSurveyResponses] = useState({});
  const [reflectionResponses, setReflectionResponses] = useState({});
  
  // Day 21 Completion Flow State
  const [showCompletionFlow, setShowCompletionFlow] = useState(false);
  const [completionStep, setCompletionStep] = useState(1);
  const [finalMetrics, setFinalMetrics] = useState({
    weight: '',
    measurements: {
      chest: '',
      waist: '',
      hips: '',
      arms: '',
      thighs: ''
    },
    energyLevel: 5,
    sleepQuality: 5,
    overallWellness: 5
  });
  const [photos, setPhotos] = useState({
    front: null,
    side: null
  });
  const [satisfaction, setSatisfaction] = useState({
    overall: 5,
    difficulty: 5,
    support: 5,
    results: 5
  });
  const [testimonial, setTestimonial] = useState('');
  const [initialAssessment, setInitialAssessment] = useState(null);
  const [comparisonReport, setComparisonReport] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if this is Day 21 and load initial assessment
  useEffect(() => {
    if (day === 21) {
      setShowCompletionFlow(true);
      loadInitialAssessment();
    }
  }, [day]);

  const loadInitialAssessment = async () => {
    try {
      const assessment = await assessmentService.getAssessment();
      setInitialAssessment(assessment);
    } catch (error) {
      console.error('Error loading initial assessment:', error);
      toast.error('Error al cargar la evaluación inicial');
    }
  };
// Trigger confetti for streak celebrations
  useEffect(() => {
    if (streakCelebration) {
      // Create confetti effect
      const createConfetti = () => {
        const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6'];
        for (let i = 0; i < 50; i++) {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.width = '6px';
          confetti.style.height = '6px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = '50%';
          confetti.style.pointerEvents = 'none';
          confetti.style.animation = `confetti-fall ${2 + Math.random() * 2}s linear infinite`;
          confetti.style.zIndex = '10000';
          document.body.appendChild(confetti);
          
          setTimeout(() => {
            confetti.remove();
          }, 4000);
        }
      };
      createConfetti();
    }
  }, [streakCelebration]);

  // Day 21 Completion Flow Functions
  const handleMetricsSubmit = async () => {
    try {
      setLoading(true);
      await assessmentService.saveFinalMetrics(finalMetrics);
      
      if (initialAssessment) {
        const report = await assessmentService.generateComparisonReport(initialAssessment, finalMetrics);
        setComparisonReport(report);
      }
      
      toast.success('Métricas finales guardadas exitosamente');
      setCompletionStep(2);
    } catch (error) {
      toast.error('Error al guardar las métricas finales');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => ({
          ...prev,
          [type]: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosSubmit = async () => {
    try {
      setLoading(true);
      await assessmentService.savePhotos(photos);
      toast.success('Fotos guardadas exitosamente');
      setCompletionStep(3);
    } catch (error) {
      toast.error('Error al guardar las fotos');
    } finally {
      setLoading(false);
    }
  };

  const handleSurveySubmit = async () => {
    try {
      setLoading(true);
      await assessmentService.saveSatisfactionSurvey(satisfaction);
      toast.success('Encuesta de satisfacción completada');
      setCompletionStep(4);
    } catch (error) {
      toast.error('Error al guardar la encuesta');
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = async () => {
    try {
      setLoading(true);
      
      if (testimonial.trim()) {
        await assessmentService.saveTestimonial(testimonial);
      }
      
      // Award final completion points
      awardPoints(500, '¡Reto de 21 días completado!', {
        type: 'challenge_completion',
        day: 21,
        challenge: challenge?.name || 'Reto 21 días'
      });
      
      // Create massive celebration
      const createMassiveConfetti = () => {
        const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f97316'];
        for (let i = 0; i < 150; i++) {
          const confetti = document.createElement('div');
          confetti.style.position = 'fixed';
          confetti.style.left = Math.random() * window.innerWidth + 'px';
          confetti.style.top = '-10px';
          confetti.style.width = '8px';
          confetti.style.height = '8px';
          confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
          confetti.style.borderRadius = '50%';
          confetti.style.pointerEvents = 'none';
          confetti.style.animation = `confetti-fall ${3 + Math.random() * 3}s linear infinite`;
          confetti.style.zIndex = '10000';
          document.body.appendChild(confetti);
          
          setTimeout(() => {
            confetti.remove();
          }, 6000);
        }
      };
      
      createMassiveConfetti();
      toast.success('¡Felicitaciones! Has completado el reto de 21 días');
      
      // Show completion summary
      setCompletionStep(5);
      
    } catch (error) {
      toast.error('Error al finalizar el reto');
    } finally {
      setLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5].map((step) => (
        <div key={step} className="flex items-center">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
            step <= completionStep 
              ? "bg-primary text-white" 
              : "bg-gray-200 text-gray-400"
          )}>
            {step < completionStep ? (
              <ApperIcon name="Check" size={16} />
            ) : (
              step
            )}
          </div>
          {step < 5 && (
            <div className={cn(
              "w-12 h-0.5 mx-2",
              step < completionStep ? "bg-primary" : "bg-gray-200"
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderMetricsStep = () => (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <ApperIcon name="Scale" size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Métricas Finales</h2>
          <p className="text-gray-600">Ingresa tus medidas finales para comparar tu progreso</p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Peso Actual (kg)
            </label>
            <input
              type="number"
              value={finalMetrics.weight}
              onChange={(e) => setFinalMetrics(prev => ({ ...prev, weight: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="70"
            />
          </div>

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Medidas Corporales (cm)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(finalMetrics.measurements).map(([key, value]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key === 'chest' ? 'Pecho' : 
                     key === 'waist' ? 'Cintura' :
                     key === 'hips' ? 'Caderas' :
                     key === 'arms' ? 'Brazos' : 'Muslos'}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setFinalMetrics(prev => ({
                      ...prev,
                      measurements: {
                        ...prev.measurements,
                        [key]: e.target.value
                      }
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { key: 'energyLevel', label: 'Nivel de Energía' },
              { key: 'sleepQuality', label: 'Calidad del Sueño' },
              { key: 'overallWellness', label: 'Bienestar General' }
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label} ({finalMetrics[key]}/10)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={finalMetrics[key]}
                  onChange={(e) => setFinalMetrics(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setShowCompletionFlow(false)}>
            Volver al Plan
          </Button>
          <Button onClick={handleMetricsSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderPhotosStep = () => (
    <Card className="max-w-4xl mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <ApperIcon name="Camera" size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Fotos de Progreso</h2>
          <p className="text-gray-600">Sube tus fotos finales para crear una comparación antes/después</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Before Photos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Fotos Iniciales</h3>
            <div className="space-y-4">
              {initialAssessment?.photos ? (
                <>
                  {initialAssessment.photos.front && (
                    <div className="relative">
                      <img 
                        src={initialAssessment.photos.front} 
                        alt="Foto inicial frontal"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        Frontal - Día 0
                      </span>
                    </div>
                  )}
                  {initialAssessment.photos.side && (
                    <div className="relative">
                      <img 
                        src={initialAssessment.photos.side} 
                        alt="Foto inicial lateral"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <span className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                        Lateral - Día 0
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay fotos iniciales disponibles
                </div>
              )}
            </div>
          </div>

          {/* After Photos */}
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Fotos Finales (Día 21)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Frontal
                </label>
                {photos.front ? (
                  <div className="relative">
                    <img 
                      src={photos.front} 
                      alt="Foto final frontal"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setPhotos(prev => ({ ...prev, front: null }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <ApperIcon name="Camera" size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 mb-2">Sube tu foto frontal final</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload('front', e)}
                      className="hidden"
                      id="front-photo"
                    />
                    <label htmlFor="front-photo" className="cursor-pointer">
                      <Button as="span" size="sm">Seleccionar Foto</Button>
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto Lateral
                </label>
                {photos.side ? (
                  <div className="relative">
                    <img 
                      src={photos.side} 
                      alt="Foto final lateral"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setPhotos(prev => ({ ...prev, side: null }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <ApperIcon name="X" size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary transition-colors">
                    <ApperIcon name="Camera" size={32} className="mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500 mb-2">Sube tu foto lateral final</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoUpload('side', e)}
                      className="hidden"
                      id="side-photo"
                    />
                    <label htmlFor="side-photo" className="cursor-pointer">
                      <Button as="span" size="sm">Seleccionar Foto</Button>
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Report */}
        {comparisonReport && (
          <div className="mt-8 p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
              <ApperIcon name="TrendingUp" size={20} className="mr-2 text-primary" />
              Reporte de Progreso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {comparisonReport.weightChange !== 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {comparisonReport.weightChange > 0 ? '+' : ''}{comparisonReport.weightChange} kg
                  </div>
                  <div className="text-sm text-gray-600">Cambio de Peso</div>
                </div>
              )}
              <div className="text-center">
                <div className="text-2xl font-bold text-success">
                  +{comparisonReport.energyImprovement}
                </div>
                <div className="text-sm text-gray-600">Mejora Energía</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">
                  +{comparisonReport.sleepImprovement}
                </div>
                <div className="text-sm text-gray-600">Mejora Sueño</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setCompletionStep(1)}>
            Atrás
          </Button>
          <Button onClick={handlePhotosSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderSurveyStep = () => (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <ApperIcon name="Star" size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Encuesta de Satisfacción</h2>
          <p className="text-gray-600">Ayúdanos a mejorar calificando tu experiencia</p>
        </div>

        <div className="space-y-6">
          {[
            { key: 'overall', label: 'Satisfacción General', icon: 'Heart' },
            { key: 'difficulty', label: 'Nivel de Dificultad', icon: 'Zap' },
            { key: 'support', label: 'Apoyo y Recursos', icon: 'Users' },
            { key: 'results', label: 'Resultados Obtenidos', icon: 'Target' }
          ].map(({ key, label, icon }) => (
            <div key={key} className="border rounded-lg p-4">
              <div className="flex items-center mb-3">
                <ApperIcon name={icon} size={20} className="mr-2 text-primary" />
                <label className="font-medium text-gray-900">{label}</label>
              </div>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setSatisfaction(prev => ({ ...prev, [key]: star }))}
                    className={cn(
                      "p-1 rounded transition-colors",
                      star <= satisfaction[key] 
                        ? "text-yellow-500" 
                        : "text-gray-300 hover:text-yellow-400"
                    )}
                  >
                    <ApperIcon name="Star" size={24} fill={star <= satisfaction[key] ? "currentColor" : "none"} />
                  </button>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  ({satisfaction[key]}/5)
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setCompletionStep(2)}>
            Atrás
          </Button>
          <Button onClick={handleSurveySubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Continuar'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderTestimonialStep = () => (
    <Card className="max-w-2xl mx-auto">
      <div className="p-6">
        <div className="text-center mb-6">
          <ApperIcon name="MessageCircle" size={48} className="mx-auto mb-4 text-primary" />
          <h2 className="text-2xl font-bold text-gray-900">Testimonial (Opcional)</h2>
          <p className="text-gray-600">Comparte tu experiencia para inspirar a otros</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuéntanos sobre tu experiencia
            </label>
            <textarea
              value={testimonial}
              onChange={(e) => setTestimonial(e.target.value)}
              placeholder="Comparte cómo te has sentido durante estos 21 días, qué has aprendido, y cómo ha impactado tu vida..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">
                {testimonial.length}/500 caracteres
              </span>
              {testimonial.length > 500 && (
                <span className="text-sm text-red-500">
                  Excede el límite por {testimonial.length - 500} caracteres
                </span>
              )}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <ApperIcon name="Info" size={20} className="mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-800">
                  Tu testimonial podría ser usado para inspirar a futuros participantes. 
                  Solo se publicará con tu consentimiento.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={() => setCompletionStep(3)}>
            Atrás
          </Button>
          <Button 
            onClick={handleFinalSubmit} 
            disabled={loading || testimonial.length > 500}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Finalizando...' : '¡Completar Reto!'}
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderCompletionSummary = () => (
    <Card className="max-w-2xl mx-auto">
      <div className="p-8 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Trophy" size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">¡Felicitaciones!</h2>
          <p className="text-lg text-gray-600">Has completado exitosamente el reto de 21 días</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-primary">21</div>
            <div className="text-sm text-gray-600">Días Completados</div>
          </div>
          <div className="bg-gradient-to-r from-green-500/10 to-green-400/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-600">500</div>
            <div className="text-sm text-gray-600">Puntos Ganados</div>
          </div>
          <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-400/5 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {satisfaction.overall}⭐
            </div>
            <div className="text-sm text-gray-600">Calificación</div>
          </div>
        </div>

        {comparisonReport && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-4">Tu Transformación</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {comparisonReport.weightChange !== 0 && (
                <div>Cambio de peso: <strong>{comparisonReport.weightChange > 0 ? '+' : ''}{comparisonReport.weightChange} kg</strong></div>
              )}
              <div>Mejora energía: <strong>+{comparisonReport.energyImprovement} puntos</strong></div>
              <div>Mejora sueño: <strong>+{comparisonReport.sleepImprovement} puntos</strong></div>
              <div>Bienestar general: <strong>+{comparisonReport.wellnessImprovement} puntos</strong></div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Button 
            onClick={() => {
              setShowCompletionFlow(false);
              setCompletionStep(1);
              onBack();
            }}
            className="w-full bg-primary hover:bg-primary/90"
          >
            Volver al Calendario
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => {
              // Share functionality could be added here
              toast.info('Función de compartir próximamente');
            }}
            className="w-full"
          >
            <ApperIcon name="Share2" size={16} className="mr-2" />
            Compartir Logro
          </Button>
        </div>
      </div>
    </Card>
  );

  // Show Day 21 completion flow if triggered
  if (showCompletionFlow) {
    return (
      <div
    className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-green-50 py-8">
    <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Día 21 - Final del Reto!
                            </h1>
            <p className="text-lg text-gray-600">Completa tu evaluación final para ver tu transformación
                            </p>
        </div>
        {renderStepIndicator()}
        {completionStep === 1 && renderMetricsStep()}
        {completionStep === 2 && renderPhotosStep()}
        {completionStep === 3 && renderSurveyStep()}
        {completionStep === 4 && renderTestimonialStep()}
        {completionStep === 5 && renderCompletionSummary()}
    </div>
</div>
    );
  }

  const toggleMoment = (momentId) => {
    setExpandedMoments(prev => ({
      ...prev,
      [momentId]: !prev[momentId]
    }));
  };

const getContentIcon = (type) => {
    switch (type) {
      case 'survey': return 'BarChart3';
      case 'reflection': return 'Heart';
      case 'education': return 'BookOpen';
      case 'activity': return 'CheckCircle2';
      case 'photo': return 'Camera';
      case 'timer': return 'Timer';
      case 'mindfulness': return 'Brain';
      case 'nutrition': return 'Apple';
      case 'hydration': return 'Droplets';
      default: return 'Circle';
    }
  };

  const getContentColor = (type, completed) => {
    if (completed) return 'text-success';
    switch (type) {
      case 'survey': return 'text-blue-600';
      case 'reflection': return 'text-purple-600';
      case 'education': return 'text-amber-600';
      case 'activity': return 'text-green-600';
      case 'photo': return 'text-pink-600';
      case 'timer': return 'text-orange-600';
      case 'mindfulness': return 'text-purple-600';
      case 'nutrition': return 'text-green-600';
      case 'hydration': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getContentBackground = (type, completed) => {
    if (completed) return 'bg-green-50/80 border-green-200';
    switch (type) {
      case 'survey': return 'bg-blue-50/80 border-blue-200';
      case 'reflection': return 'bg-purple-50/80 border-purple-200';
      case 'education': return 'bg-amber-50/80 border-amber-200';
      case 'activity': return 'bg-green-50/80 border-green-200';
      case 'photo': return 'bg-pink-50/80 border-pink-200';
      case 'timer': return 'bg-orange-50/80 border-orange-200';
      case 'mindfulness': return 'bg-purple-50/80 border-purple-200';
      case 'nutrition': return 'bg-green-50/80 border-green-200';
      case 'hydration': return 'bg-blue-50/80 border-blue-200';
      default: return 'bg-white/60 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
    {/* Header */}
    <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={onBack} className="p-2">
                <ApperIcon name="ArrowLeft" size={20} />
            </Button>
            <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">Día {day}
                </h1>
                <p className="text-sm text-gray-600">Plan detallado del día
                                </p>
            </div>
        </div>
        <div className="flex items-center space-x-2">
            {challenge && <div className="text-right">
                <div className="text-sm text-gray-600">Estado</div>
                <div
                    className={cn(
                        "text-sm font-semibold",
                        day === challenge.currentDay ? "text-secondary" : challenge.completedDays.includes(day) ? "text-success" : day < challenge.currentDay ? "text-error" : "text-gray-400"
                    )}>
                    {day === challenge.currentDay ? "Día actual" : challenge.completedDays.includes(day) ? "Completado" : day < challenge.currentDay ? "Sin completar" : "Próximo"}
                </div>
            </div>}
        </div>
    </div>
    {/* Moments Grid */}
    {/* Day Summary */}
    <Card
        className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <ApperIcon name="BarChart3" size={20} className="mr-2 text-primary" />Resumen del Día
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {moments.map(moment => {
                        const dayContent = getDayContent(day);
                        const total = dayContent[moment.id]?.length || 0;
                        const completed = dayContent[moment.id]?.filter(item => item.completed).length || 0;
                        const percentage = total > 0 ? Math.round(completed / total * 100) : 0;

                        return (
                            <div key={moment.id} className="text-center">
                                <div className={cn("p-3 rounded-lg bg-white/80 mb-2", moment.iconColor)}>
                                    <ApperIcon name={moment.icon} size={24} className="mx-auto" />
                                </div>
                                <h4 className="text-sm font-medium text-gray-900">{moment.title}</h4>
                                <p className="text-xs text-gray-600">{percentage}% completado</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div
                                        className="bg-primary h-1.5 rounded-full transition-all duration-300"
                                        style={{
                                            width: `${percentage}%`
                                        }}></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Day 21 Special Completion Button */}
                {day === 21 && <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="text-center">
                        <div
                            className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4 mb-4">
                            <ApperIcon name="Trophy" size={32} className="mx-auto mb-2 text-primary" />
                            <h4 className="font-semibold text-gray-900 mb-1">¡Último Día del Reto!</h4>
                            <p className="text-sm text-gray-600">Completa tu evaluación final y descubre tu transformación
                                                  </p>
                        </div>
                        <Button
                            onClick={() => setShowCompletionFlow(true)}
                            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold px-8 py-3"
                            size="lg">
                            <ApperIcon name="Star" size={20} className="mr-2" />Completar Reto de 21 Días
                                            </Button>
                    </div>
                </div>}
            </h3></div>
    </Card>
</div>
  );
}

export default DayPlan;