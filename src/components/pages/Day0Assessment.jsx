import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { cn } from '@/utils/cn';
import { assessmentService } from '@/services/api/assessmentService';

export default function Day0Assessment() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    { id: 'personal', title: 'Información Personal', icon: 'User' },
    { id: 'measurements', title: 'Medidas Corporales', icon: 'Ruler' },
    { id: 'energy', title: 'Niveles de Energía', icon: 'Zap' },
    { id: 'photos', title: 'Fotos de Referencia', icon: 'Camera' },
    { id: 'goals', title: 'Objetivos', icon: 'Target' }
  ];

  useEffect(() => {
    loadAssessment();
  }, []);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assessmentService.getAssessment();
      setAssessment(data);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar la evaluación inicial');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setAssessment(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let updatedAssessment;
      if (assessment.Id && assessment.createdAt !== assessment.updatedAt) {
        updatedAssessment = await assessmentService.updateAssessment(assessment);
      } else {
        updatedAssessment = await assessmentService.createAssessment(assessment);
      }
      
      setAssessment(updatedAssessment);
      toast.success('Evaluación guardada exitosamente');
    } catch (err) {
      toast.error('Error al guardar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  const handleComplete = async () => {
    try {
      setSaving(true);
      
      // First save current data
      await handleSave();
      
      // Then mark as completed
      const completedAssessment = await assessmentService.completeAssessment();
      setAssessment(completedAssessment);
      
      toast.success('¡Evaluación inicial completada! Ya puedes comenzar tu reto de 21 días.');
    } catch (err) {
      toast.error('Error al completar la evaluación');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = (photoType, event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleInputChange('photos', photoType, e.target.result);
        toast.success('Foto cargada exitosamente');
      };
      reader.readAsDataURL(file);
    }
  };

  const calculateProgress = () => {
    if (!assessment) return 0;
    
    let completed = 0;
    let total = 0;
    
    // Personal info (3 fields)
    const personalFields = ['age', 'height', 'targetWeight'];
    personalFields.forEach(field => {
      total++;
      if (assessment.personalInfo[field]) completed++;
    });
    
    // Measurements (6 fields)
    const measurementFields = ['currentWeight', 'chest', 'waist', 'hips', 'arms', 'thighs'];
    measurementFields.forEach(field => {
      total++;
      if (assessment.physicalMeasurements[field]) completed++;
    });
    
    // Energy levels (4 fields - always have default values)
    total += 4;
    completed += 4;
    
    // Photos (3 photos)
    const photoFields = ['front', 'side', 'back'];
    photoFields.forEach(field => {
      total++;
      if (assessment.photos[field]) completed++;
    });
    
    // Goals (2 fields)
    const goalFields = ['primary', 'secondary'];
    goalFields.forEach(field => {
      total++;
      if (assessment.goals[field]) completed++;
    });
    
    return Math.round((completed / total) * 100);
  };

  if (loading) {
    return <Loading className="flex justify-center items-center min-h-96" />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAssessment} />;
  }

  if (assessment?.completed) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={40} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">
            ¡Evaluación Inicial Completada!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Ya has completado tu evaluación inicial del Día 0. Todos tus datos de referencia han sido guardados para comparar tu progreso.
          </p>
          <div className="text-sm text-gray-500">
            Completada el {new Date(assessment.completedAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </Card>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
          Día 0 - Evaluación Inicial
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Completa tu evaluación inicial para establecer tu punto de partida
        </p>
        
        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 mb-4">
          <div 
            className="calendar-progress-bar h-3 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600">{progress}% completado</p>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(index)}
            className={cn(
              "p-3 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center gap-2",
              currentSection === index
                ? "bg-primary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            <ApperIcon name={section.icon} size={20} />
            <span className="hidden md:block">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
      <Card className="p-6 mb-8">
        {currentSection === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="User" size={24} />
              Información Personal
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad (años)
                </label>
                <input
                  type="number"
                  min="18"
                  max="100"
                  value={assessment?.personalInfo?.age || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'age', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 25"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Altura (cm)
                </label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={assessment?.personalInfo?.height || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'height', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 170"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso objetivo (kg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  step="0.1"
                  value={assessment?.personalInfo?.targetWeight || ''}
                  onChange={(e) => handleInputChange('personalInfo', 'targetWeight', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 65.5"
                />
              </div>
            </div>
          </div>
        )}

        {currentSection === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="Ruler" size={24} />
              Medidas Corporales
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso actual (kg)
                </label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  step="0.1"
                  value={assessment?.physicalMeasurements?.currentWeight || ''}
                  onChange={(e) => handleInputChange('physicalMeasurements', 'currentWeight', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 70.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pecho (cm)
                </label>
                <input
                  type="number"
                  min="60"
                  max="150"
                  step="0.1"
                  value={assessment?.physicalMeasurements?.chest || ''}
                  onChange={(e) => handleInputChange('physicalMeasurements', 'chest', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 85.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura (cm)
                </label>
                <input
                  type="number"
                  min="50"
                  max="130"
                  step="0.1"
                  value={assessment?.physicalMeasurements?.waist || ''}
                  onChange={(e) => handleInputChange('physicalMeasurements', 'waist', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 75.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Caderas (cm)
                </label>
                <input
                  type="number"
                  min="60"
                  max="140"
                  step="0.1"
                  value={assessment?.physicalMeasurements?.hips || ''}
                  onChange={(e) => handleInputChange('physicalMeasurements', 'hips', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 90.0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Brazos (cm)
                </label>
                <input
                  type="number"
                  min="20"
                  max="50"
                  step="0.1"
                  value={assessment?.physicalMeasurements?.arms || ''}
                  onChange={(e) => handleInputChange('physicalMeasurements', 'arms', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 28.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Muslos (cm)
                </label>
                <input
                  type="number"
                  min="40"
                  max="80"
                  step="0.1"
                  value={assessment?.physicalMeasurements?.thighs || ''}
                  onChange={(e) => handleInputChange('physicalMeasurements', 'thighs', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: 55.0"
                />
              </div>
            </div>
          </div>
        )}

        {currentSection === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="Zap" size={24} />
              Niveles de Energía y Bienestar
            </h2>
            
            <div className="space-y-6">
              {[
                { key: 'overallEnergy', label: 'Nivel de energía general', icon: 'Battery' },
                { key: 'sleepQuality', label: 'Calidad del sueño', icon: 'Moon' },
                { key: 'stressLevel', label: 'Nivel de estrés', icon: 'Brain' },
                { key: 'motivation', label: 'Nivel de motivación', icon: 'Heart' }
              ].map(({ key, label, icon }) => (
                <div key={key}>
                  <div className="flex items-center gap-2 mb-3">
                    <ApperIcon name={icon} size={20} />
                    <label className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <span className="ml-auto text-lg font-semibold text-primary">
                      {assessment?.energyLevels?.[key] || 5}/10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={assessment?.energyLevels?.[key] || 5}
                    onChange={(e) => handleInputChange('energyLevels', key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-primary"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Muy bajo</span>
                    <span>Excelente</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="Camera" size={24} />
              Fotos de Referencia
            </h2>
            
            <p className="text-gray-600">
              Sube fotos de referencia para hacer seguimiento visual de tu progreso. Recomendamos usar ropa ajustada y buena iluminación.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { key: 'front', label: 'Vista frontal', icon: 'User' },
                { key: 'side', label: 'Vista lateral', icon: 'RotateCcw' },
                { key: 'back', label: 'Vista trasera', icon: 'UserCheck' }
              ].map(({ key, label, icon }) => (
                <div key={key} className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary transition-colors">
                    {assessment?.photos?.[key] ? (
                      <div className="relative">
                        <img
                          src={assessment.photos[key]}
                          alt={label}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleInputChange('photos', key, null)}
                          className="absolute -top-2 -right-2 bg-error text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                        >
                          <ApperIcon name="X" size={12} />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <ApperIcon name={icon} size={32} className="mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-600 mb-3">{label}</p>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(key, e)}
                            className="hidden"
                          />
                          <span className="inline-flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-purple-700 text-sm">
                            <ApperIcon name="Upload" size={16} />
                            Subir foto
                          </span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentSection === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="Target" size={24} />
              Objetivos del Reto
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo principal
                </label>
                <textarea
                  rows="3"
                  value={assessment?.goals?.primary || ''}
                  onChange={(e) => handleInputChange('goals', 'primary', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Perder 5kg y sentirme más en forma y saludable"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Objetivo secundario
                </label>
                <textarea
                  rows="3"
                  value={assessment?.goals?.secondary || ''}
                  onChange={(e) => handleInputChange('goals', 'secondary', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Ej: Mejorar mi energía diaria y calidad del sueño"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración del reto
                </label>
                <select
                  value={assessment?.goals?.timeline || '21'}
                  onChange={(e) => handleInputChange('goals', 'timeline', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="21">21 días</option>
                  <option value="30">30 días</option>
                  <option value="60">60 días</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          {currentSection > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentSection(currentSection - 1)}
              className="flex items-center gap-2"
            >
              <ApperIcon name="ChevronLeft" size={16} />
              Anterior
            </Button>
          )}
          
          {currentSection < sections.length - 1 && (
            <Button
              onClick={() => setCurrentSection(currentSection + 1)}
              className="flex items-center gap-2"
            >
              Siguiente
              <ApperIcon name="ChevronRight" size={16} />
            </Button>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="Save" size={16} />
            )}
            Guardar
          </Button>
          
          {progress >= 80 && (
            <Button
              onClick={handleComplete}
              disabled={saving}
              className="flex items-center gap-2 bg-success hover:bg-green-600"
            >
              {saving ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="CheckCircle" size={16} />
              )}
              Completar evaluación
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}