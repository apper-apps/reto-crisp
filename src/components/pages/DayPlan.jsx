import React, { useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import { cn } from "@/utils/cn";
import { usePoints } from "@/contexts/PointsContext";

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
    { id: 1, type: 'habit', title: 'Desafío de Hidratación', completed: true },
    { id: 2, type: 'reflection', title: 'Reflexión: Mi compromiso personal con la hidratación', completed: false },
    { id: 3, type: 'activity', title: 'Preparar botella de agua para el día', completed: true }
  ],
  midday: [
    { id: 4, type: 'activity', title: 'Post educativo: Beneficios del agua en el cuerpo', completed: true },
    { id: 5, type: 'habit', title: 'Beber segundo vaso de agua', completed: false },
    { id: 6, type: 'note', title: 'Recordatorio: Agua antes del almuerzo', completed: false }
  ],
  evening: [
    { id: 7, type: 'activity', title: 'Encuesta: ¿Cómo te sientes? (Nivel de energía 1-5)', completed: false },
    { id: 8, type: 'habit', title: 'Evaluar mi hidratación del día', completed: true },
    { id: 9, type: 'reflection', title: 'Observar cambios en mi bienestar', completed: true }
  ],
  night: [
    { id: 10, type: 'reflection', title: 'Gratitud: Logros del día en hidratación', completed: false },
    { id: 11, type: 'activity', title: 'Confirmar cumplimiento del reto diario', completed: false },
    { id: 12, type: 'note', title: 'Preparar agua para mañana', completed: true }
  ]
};

function DayPlan({ day, challenge, onBack }) {
  const { awardPoints } = usePoints();
  const [expandedMoments, setExpandedMoments] = useState({});
  const [completedItems, setCompletedItems] = useState(new Set());
const toggleMoment = (momentId) => {
    setExpandedMoments(prev => ({
      ...prev,
      [momentId]: !prev[momentId]
    }));
  };

  const getContentIcon = (type) => {
    switch (type) {
      case 'habit': return 'CheckCircle2';
      case 'activity': return 'Calendar';
      case 'note': return 'StickyNote';
      case 'reflection': return 'Heart';
      default: return 'Circle';
    }
  };

  const getContentColor = (type, completed) => {
    if (completed) return 'text-success';
    switch (type) {
      case 'habit': return 'text-primary';
      case 'activity': return 'text-secondary';
      case 'note': return 'text-warning';
      case 'reflection': return 'text-accent';
      default: return 'text-gray-600';
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
                <div className="mt-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
                  {sampleContent[moment.id]?.map((item, index) => {
                    const isCompleted = item.completed || completedItems.has(item.id);
                    
                    const handleItemToggle = () => {
                      if (!isCompleted) {
                        setCompletedItems(prev => new Set([...prev, item.id]));
                        
                        const points = awardPoints.dailyMoment(item.type);
                        toast.success(`¡${item.title.substring(0, 30)}...! +${points} puntos ✨`, {
                          position: "top-right",
                          autoClose: 2500,
                        });
                      }
                    };
                    
                    return (
                      <div 
                        key={item.id}
                        className={cn(
                          "flex items-center justify-between p-3 bg-white/60 rounded-lg transition-all duration-300",
                          isCompleted && "bg-green-50/80 ring-1 ring-green-200"
                        )}
                      >
                        <div className="flex items-center space-x-3">
                          <ApperIcon 
                            name={getContentIcon(item.type)} 
                            size={16} 
                            className={getContentColor(item.type, isCompleted)}
                          />
                          <div>
                            <p className={cn(
                              "text-sm font-medium transition-all",
                              isCompleted ? "text-gray-500 line-through" : "text-gray-900"
                            )}>
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-600 capitalize">{item.type}</p>
                          </div>
                        </div>
                        
                        <button
                          onClick={handleItemToggle}
                          disabled={isCompleted}
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            isCompleted 
                              ? "bg-success border-success cursor-default" 
                              : "border-gray-300 hover:border-success hover:scale-110 cursor-pointer"
                          )}
                        >
                          {isCompleted && (
                            <ApperIcon name="Check" size={12} className="text-white" />
                          )}
                        </button>
                      </div>
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