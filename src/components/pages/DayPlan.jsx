import React, { useState } from "react";
import { toast } from "react-toastify";
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

const sampleContent = {
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

function DayPlan({ day, challenge, onBack }) {
  const { awardPoints } = usePoints();
const [expandedMoments, setExpandedMoments] = useState({});
  const [completedItems, setCompletedItems] = useState(new Set());
  const [surveyResponses, setSurveyResponses] = useState({});
  const [reflectionResponses, setReflectionResponses] = useState({});
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
      default: return 'bg-white/60 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="p-2"
          >
            <ApperIcon name="ArrowLeft" size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900">
              Día {day}
            </h1>
            <p className="text-sm text-gray-600">
              Plan detallado del día
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {challenge && (
            <div className="text-right">
              <div className="text-sm text-gray-600">Estado</div>
              <div className={cn(
                "text-sm font-semibold",
                day === challenge.currentDay ? "text-secondary" :
                challenge.completedDays.includes(day) ? "text-success" :
                day < challenge.currentDay ? "text-error" : "text-gray-400"
              )}>
                {day === challenge.currentDay ? "Día actual" :
                 challenge.completedDays.includes(day) ? "Completado" :
                 day < challenge.currentDay ? "Sin completar" : "Próximo"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Moments Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {moments.map((moment) => (
          <Card key={moment.id} className={cn("transition-all duration-200", moment.color)}>
            <div className="p-4">
              {/* Moment Header */}
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleMoment(moment.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={cn("p-2 rounded-lg bg-white/80", moment.iconColor)}>
                    <ApperIcon name={moment.icon} size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{moment.title}</h3>
                    <p className="text-sm text-gray-600">{moment.time}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="text-xs bg-white/80 px-2 py-1 rounded-full">
                    {sampleContent[moment.id]?.filter(item => item.completed).length || 0} / {sampleContent[moment.id]?.length || 0}
                  </div>
                  <ApperIcon 
                    name={expandedMoments[moment.id] ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-gray-600"
                  />
                </div>
              </div>

{/* Expandable Content */}
              {expandedMoments[moment.id] && (
                <div className="mt-4 space-y-4 animate-in slide-in-from-top-2 duration-200">
                  {sampleContent[moment.id]?.map((item, index) => {
                    const isCompleted = item.completed || completedItems.has(item.id);
                    
                    const handleCompletion = (responseData = null) => {
                      if (!isCompleted) {
                        setCompletedItems(prev => new Set([...prev, item.id]));
                        
                        if (responseData) {
                          if (item.type === 'survey') {
                            setSurveyResponses(prev => ({...prev, [item.id]: responseData}));
                          } else if (item.type === 'reflection') {
                            setReflectionResponses(prev => ({...prev, [item.id]: responseData}));
                          }
                        }
                        
                        const points = awardPoints.dailyMoment(item.type);
                        toast.success(`¡Completado! +${points} puntos ✨`, {
                          position: "top-right",
                          autoClose: 2500,
                        });
                      }
                    };

                    // Survey Content Type
                    if (item.type === 'survey') {
                      return (
                        <Card key={item.id} className={cn(
                          "p-4 border transition-all duration-300",
                          getContentBackground(item.type, isCompleted)
                        )}>
                          <div className="flex items-start space-x-3 mb-3">
                            <ApperIcon 
                              name={getContentIcon(item.type)} 
                              size={18} 
                              className={getContentColor(item.type, isCompleted)}
                            />
                            <div className="flex-1">
                              <h4 className={cn(
                                "font-medium mb-1",
                                isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                              )}>
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">{item.question}</p>
                              
                              {!isCompleted ? (
                                <div className="space-y-3">
                                  <div className="flex justify-between items-center space-x-2">
                                    {Array.from({ length: item.scale.max }, (_, i) => {
                                      const value = i + 1;
                                      const isSelected = surveyResponses[item.id] === value;
                                      return (
                                        <button
                                          key={value}
                                          onClick={() => setSurveyResponses(prev => ({...prev, [item.id]: value}))}
                                          className={cn(
                                            "flex-1 p-2 rounded-lg text-sm font-medium transition-all",
                                            isSelected 
                                              ? "bg-blue-600 text-white shadow-md" 
                                              : "bg-white border border-gray-300 text-gray-700 hover:border-blue-400"
                                          )}
                                        >
                                          {value}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span>{item.scale.labels[0]}</span>
                                    <span>{item.scale.labels[item.scale.labels.length - 1]}</span>
                                  </div>
                                  {surveyResponses[item.id] && (
                                    <Button
                                      onClick={() => handleCompletion(surveyResponses[item.id])}
                                      className="w-full mt-3"
                                      size="sm"
                                    >
                                      Confirmar Respuesta
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="flex items-center justify-between p-3 bg-white/80 rounded-lg">
                                  <span className="text-sm text-gray-600">Respuesta:</span>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-bold text-blue-600">{item.response || surveyResponses[item.id]}/5</span>
                                    <ApperIcon name="Check" size={16} className="text-success" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    }

                    // Reflection Content Type
                    if (item.type === 'reflection') {
                      return (
                        <Card key={item.id} className={cn(
                          "p-4 border transition-all duration-300",
                          getContentBackground(item.type, isCompleted)
                        )}>
                          <div className="flex items-start space-x-3 mb-3">
                            <ApperIcon 
                              name={getContentIcon(item.type)} 
                              size={18} 
                              className={getContentColor(item.type, isCompleted)}
                            />
                            <div className="flex-1">
                              <h4 className={cn(
                                "font-medium mb-1",
                                isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                              )}>
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-3">{item.prompt}</p>
                              
                              {!isCompleted ? (
                                <div className="space-y-3">
                                  <textarea
                                    placeholder="Escribe tu reflexión aquí..."
                                    value={reflectionResponses[item.id] || ''}
                                    onChange={(e) => setReflectionResponses(prev => ({...prev, [item.id]: e.target.value}))}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                                    rows={3}
                                  />
                                  {reflectionResponses[item.id]?.trim() && (
                                    <Button
                                      onClick={() => handleCompletion(reflectionResponses[item.id])}
                                      className="w-full"
                                      size="sm"
                                    >
                                      Guardar Reflexión
                                    </Button>
                                  )}
                                </div>
                              ) : (
                                <div className="p-3 bg-white/80 rounded-lg">
                                  <p className="text-sm text-gray-700 italic">
                                    "{item.response || reflectionResponses[item.id]}"
                                  </p>
                                  <div className="flex items-center justify-end mt-2">
                                    <ApperIcon name="Check" size={16} className="text-success" />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      );
                    }

                    // Education Content Type
                    if (item.type === 'education') {
                      return (
                        <Card key={item.id} className={cn(
                          "overflow-hidden border transition-all duration-300",
                          getContentBackground(item.type, isCompleted)
                        )}>
                          {item.image && (
                            <div className="relative h-32 bg-gray-200">
                              <img 
                                src={item.image} 
                                alt={item.title}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                              <div className="absolute inset-0 bg-amber-100 flex items-center justify-center" style={{display: 'none'}}>
                                <ApperIcon name="BookOpen" size={32} className="text-amber-600" />
                              </div>
                            </div>
                          )}
                          <div className="p-4">
                            <div className="flex items-start space-x-3">
                              <ApperIcon 
                                name={getContentIcon(item.type)} 
                                size={18} 
                                className={getContentColor(item.type, isCompleted)}
                              />
                              <div className="flex-1">
                                <h4 className={cn(
                                  "font-medium mb-2",
                                  isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                                )}>
                                  {item.title}
                                </h4>
                                <p className="text-sm text-gray-700 mb-4">{item.content}</p>
                                
                                {!isCompleted ? (
                                  <Button
                                    onClick={() => handleCompletion()}
                                    className="w-full"
                                    size="sm"
                                    variant="outline"
                                  >
                                    Marcar como Leído
                                  </Button>
                                ) : (
                                  <div className="flex items-center justify-center p-2 bg-white/80 rounded-lg">
                                    <span className="text-sm text-gray-600 mr-2">Completado</span>
                                    <ApperIcon name="Check" size={16} className="text-success" />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    }

                    // Activity Content Type
                    return (
                      <Card key={item.id} className={cn(
                        "p-4 border transition-all duration-300",
                        getContentBackground(item.type, isCompleted)
                      )}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            <ApperIcon 
                              name={getContentIcon(item.type)} 
                              size={18} 
                              className={getContentColor(item.type, isCompleted)}
                            />
                            <div className="flex-1">
                              <h4 className={cn(
                                "font-medium mb-1",
                                isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                              )}>
                                {item.title}
                              </h4>
                              <p className="text-sm text-gray-600">{item.description}</p>
                            </div>
                          </div>
                          
                          {!isCompleted ? (
                            <Button
                              onClick={() => handleCompletion()}
                              size="sm"
                              className="ml-4"
                            >
                              Completar
                            </Button>
                          ) : (
                            <div className="flex items-center space-x-2 ml-4">
                              <span className="text-sm text-gray-600">Completado</span>
                              <ApperIcon name="Check" size={16} className="text-success" />
                            </div>
                          )}
                        </div>
                      </Card>
                    );
                  }) || (
                    <div className="text-center py-6 text-gray-500">
                      <ApperIcon name="Calendar" size={24} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay contenido programado para este momento</p>
                    </div>
                  )}
                  
                  {/* Add Content Button */}
                  <Button 
                    variant="outline" 
                    className="w-full mt-3 bg-white/80 hover:bg-white"
                  >
                    <ApperIcon name="Plus" size={16} className="mr-2" />
                    Agregar contenido
                  </Button>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Day Summary */}
      <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
            <ApperIcon name="BarChart3" size={20} className="mr-2 text-primary" />
            Resumen del Día
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {moments.map((moment) => {
              const total = sampleContent[moment.id]?.length || 0;
              const completed = sampleContent[moment.id]?.filter(item => item.completed).length || 0;
              const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
              
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
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DayPlan;