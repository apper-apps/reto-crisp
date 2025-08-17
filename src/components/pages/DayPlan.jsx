import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
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
    { type: 'habit', title: 'Meditación matutina', completed: true },
    { type: 'activity', title: 'Ejercicio cardiovascular', completed: false },
    { type: 'note', title: 'Planificar el día', completed: true }
  ],
  midday: [
    { type: 'habit', title: 'Almuerzo saludable', completed: true },
    { type: 'activity', title: 'Revisar metas del día', completed: false },
    { type: 'reflection', title: 'Momento de gratitud', completed: false }
  ],
  evening: [
    { type: 'habit', title: 'Leer 30 minutos', completed: false },
    { type: 'activity', title: 'Tiempo en familia', completed: true },
    { type: 'note', title: 'Preparar la cena', completed: true }
  ],
  night: [
    { type: 'habit', title: 'Reflexión del día', completed: false },
    { type: 'activity', title: 'Relajación y descanso', completed: false },
    { type: 'note', title: 'Preparar ropa para mañana', completed: true }
  ]
};

function DayPlan({ day, challenge, onBack }) {
  const [expandedMoments, setExpandedMoments] = useState({});

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
                  {sampleContent[moment.id]?.map((item, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/60 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <ApperIcon 
                          name={getContentIcon(item.type)} 
                          size={16} 
                          className={getContentColor(item.type, item.completed)}
                        />
                        <div>
                          <p className={cn(
                            "text-sm font-medium",
                            item.completed ? "text-gray-500 line-through" : "text-gray-900"
                          )}>
                            {item.title}
                          </p>
                          <p className="text-xs text-gray-600 capitalize">{item.type}</p>
                        </div>
                      </div>
                      
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        item.completed 
                          ? "bg-success border-success" 
                          : "border-gray-300"
                      )}>
                        {item.completed && (
                          <ApperIcon name="Check" size={12} className="text-white" />
                        )}
                      </div>
                    </div>
                  )) || (
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