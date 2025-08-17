import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { assessmentService } from "@/services/api/assessmentService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { cn } from "@/utils/cn";

export default function Day0Assessment() {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [currentSection, setCurrentSection] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const sections = [
    { id: 'personal', title: 'Datos personales', icon: 'User' },
    { id: 'measurements', title: 'Medidas corporales', icon: 'Ruler' }
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
    
    // Clear validation error when user starts typing
    if (validationErrors[`${section}.${field}`]) {
      setValidationErrors(prev => ({
        ...prev,
        [`${section}.${field}`]: null
      }));
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return '';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (peso, estatura) => {
    if (!peso || !estatura) return '';
    const pesoNum = parseFloat(peso);
    const estaturaM = parseFloat(estatura) / 100; // Convert cm to meters
    if (pesoNum > 0 && estaturaM > 0) {
      return (pesoNum / (estaturaM * estaturaM)).toFixed(1);
    }
    return '';
  };

  const validateFields = () => {
    const errors = {};
    
    // Personal data validations
    if (!assessment?.personalData?.fechaNacimiento) {
      errors['personalData.fechaNacimiento'] = 'La fecha de nacimiento es requerida';
    }
    if (!assessment?.personalData?.sexo) {
      errors['personalData.sexo'] = 'Selecciona tu sexo';
    }

    // Body measurements validations
    const peso = parseFloat(assessment?.measurements?.peso_kg);
    if (!peso || peso < 30.0 || peso > 300.0) {
      errors['measurements.peso_kg'] = 'Introduce un valor válido entre 30.0 y 300.0 kg';
    }

    const estatura = parseInt(assessment?.measurements?.estatura_cm);
    if (!estatura || estatura < 120 || estatura > 220) {
      errors['measurements.estatura_cm'] = 'Introduce un valor válido entre 120 y 220 cm';
    }

    const cintura = parseInt(assessment?.measurements?.cintura_cm);
    if (!cintura || cintura < 40 || cintura > 200) {
      errors['measurements.cintura_cm'] = 'Introduce un valor válido entre 40 y 200 cm';
    }

    const cadera = parseInt(assessment?.measurements?.cadera_cm);
    if (!cadera || cadera < 40 || cadera > 200) {
      errors['measurements.cadera_cm'] = 'Introduce un valor válido entre 40 y 200 cm';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

const handleSave = async () => {
    if (!validateFields()) {
      toast.error('Revisa los campos en rojo y vuelve a intentar');
      return;
    }

    try {
      setSaving(true);
      
      let updatedAssessment;
      if (assessment.Id && assessment.created_at !== assessment.updated_at) {
        updatedAssessment = await assessmentService.updateAssessment(assessment);
      } else {
        updatedAssessment = await assessmentService.createAssessment(assessment);
      }
      
      setAssessment(updatedAssessment);
      toast.success('Datos guardados exitosamente');
    } catch (err) {
      toast.error('Error al guardar los datos');
    } finally {
      setSaving(false);
    }
  };

const handleSaveAndContinue = async () => {
    if (!validateFields()) {
      toast.error('Revisa los campos en rojo y vuelve a intentar');
      return;
    }

    try {
      setSaving(true);
      
      // Save and mark as completed
      const completedAssessment = await assessmentService.completeAssessment(assessment);
      setAssessment(completedAssessment);
      
      toast.success('¡Evaluación inicial completada! Ya puedes comenzar tu reto de 21 días.');
    } catch (err) {
      toast.error('Error al completar la evaluación inicial');
    } finally {
      setSaving(false);
    }
  };

const calculateProgress = () => {
    if (!assessment) return 0;
    
    let completed = 0;
    let total = 6; // Total required fields
    
    // Personal data (2 required fields)
    if (assessment.personalData?.fechaNacimiento) completed++;
    if (assessment.personalData?.sexo) completed++;
    
    // Measurements (4 required fields)
    if (assessment.measurements?.peso_kg && 
        parseFloat(assessment.measurements.peso_kg) >= 30.0 && 
        parseFloat(assessment.measurements.peso_kg) <= 300.0) completed++;
    if (assessment.measurements?.estatura_cm && 
        parseInt(assessment.measurements.estatura_cm) >= 120 && 
        parseInt(assessment.measurements.estatura_cm) <= 220) completed++;
    if (assessment.measurements?.cintura_cm && 
        parseInt(assessment.measurements.cintura_cm) >= 40 && 
        parseInt(assessment.measurements.cintura_cm) <= 200) completed++;
    if (assessment.measurements?.cadera_cm && 
        parseInt(assessment.measurements.cadera_cm) >= 40 && 
        parseInt(assessment.measurements.cadera_cm) <= 200) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const getStatusChip = () => {
    const progress = calculateProgress();
    if (assessment?.completed) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-success text-white text-sm rounded-full">
          <ApperIcon name="CheckCircle" size={16} />
          Completado
        </div>
      );
    } else if (progress > 0) {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-warning text-white text-sm rounded-full">
          <ApperIcon name="Clock" size={16} />
          Incompleto ({progress}%)
        </div>
      );
    } else {
      return (
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-400 text-white text-sm rounded-full">
          <ApperIcon name="Circle" size={16} />
          Pendiente
        </div>
      );
    }
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
            ¡Evaluación inicial completada!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Ya has completado tu evaluación inicial del Día 0. Todos tus datos de referencia han sido guardados para medir tu transformación durante el reto de 21 días.
          </p>
          <div className="text-sm text-gray-500">
            Completada el {new Date(assessment.completed_at).toLocaleDateString('es-MX', {
              timeZone: 'America/Mexico_City',
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
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">
              Día 0 – ¡Establece tu punto de partida!
            </h1>
            <p className="text-lg text-gray-600">
              Estos datos nos ayudarán a medir tu transformación.
            </p>
          </div>
          {getStatusChip()}
        </div>
        
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
      <div className="grid grid-cols-2 gap-4 mb-8">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => setCurrentSection(index)}
            className={cn(
              "p-4 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3",
              currentSection === index
                ? "bg-gradient-purple-blue text-white shadow-lg transform scale-[1.02]"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            )}
          >
            <ApperIcon name={section.icon} size={24} />
            <span className="font-semibold">{section.title}</span>
          </button>
        ))}
      </div>

      {/* Section Content */}
<Card className="p-6 mb-8">
        {currentSection === 0 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="User" size={24} />
              Datos personales mínimos
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de nacimiento <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={assessment?.personalData?.fechaNacimiento || ''}
                  onChange={(e) => handleInputChange('personalData', 'fechaNacimiento', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                    validationErrors['personalData.fechaNacimiento'] 
                      ? "border-red-500" 
                      : "border-gray-300"
                  )}
                />
                {validationErrors['personalData.fechaNacimiento'] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors['personalData.fechaNacimiento']}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad real (calculada automáticamente)
                </label>
                <input
                  type="text"
                  value={calculateAge(assessment?.personalData?.fechaNacimiento) ? 
                    `${calculateAge(assessment?.personalData?.fechaNacimiento)} años` : ''}
                  readOnly
                  className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="Se calcula automáticamente"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sexo <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'femenino', label: 'Femenino' },
                    { value: 'masculino', label: 'Masculino' },
                    { value: 'prefiero_no_decir', label: 'Prefiero no decir' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => handleInputChange('personalData', 'sexo', option.value)}
                      className={cn(
                        "p-3 rounded-lg border text-sm font-medium transition-all duration-200",
                        assessment?.personalData?.sexo === option.value
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:border-primary hover:bg-primary hover:bg-opacity-10"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
                {validationErrors['personalData.sexo'] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors['personalData.sexo']}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

{currentSection === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <ApperIcon name="Ruler" size={24} />
              Medidas corporales
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Peso (kg) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="30.0"
                  max="300.0"
                  step="0.1"
                  value={assessment?.measurements?.peso_kg || ''}
                  onChange={(e) => handleInputChange('measurements', 'peso_kg', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                    validationErrors['measurements.peso_kg'] 
                      ? "border-red-500" 
                      : "border-gray-300"
                  )}
                  placeholder="Ej: 70.5"
                />
                {validationErrors['measurements.peso_kg'] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors['measurements.peso_kg']}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estatura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="120"
                  max="220"
                  value={assessment?.measurements?.estatura_cm || ''}
                  onChange={(e) => handleInputChange('measurements', 'estatura_cm', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                    validationErrors['measurements.estatura_cm'] 
                      ? "border-red-500" 
                      : "border-gray-300"
                  )}
                  placeholder="Ej: 170"
                />
                {validationErrors['measurements.estatura_cm'] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors['measurements.estatura_cm']}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cintura (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={assessment?.measurements?.cintura_cm || ''}
                  onChange={(e) => handleInputChange('measurements', 'cintura_cm', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                    validationErrors['measurements.cintura_cm'] 
                      ? "border-red-500" 
                      : "border-gray-300"
                  )}
                  placeholder="Ej: 85"
                />
                {validationErrors['measurements.cintura_cm'] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors['measurements.cintura_cm']}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cadera (cm) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={assessment?.measurements?.cadera_cm || ''}
                  onChange={(e) => handleInputChange('measurements', 'cadera_cm', e.target.value)}
                  className={cn(
                    "w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent",
                    validationErrors['measurements.cadera_cm'] 
                      ? "border-red-500" 
                      : "border-gray-300"
                  )}
                  placeholder="Ej: 95"
                />
                {validationErrors['measurements.cadera_cm'] && (
                  <p className="text-red-500 text-xs mt-1">
                    {validationErrors['measurements.cadera_cm']}
                  </p>
                )}
              </div>
              
              {/* BMI Calculation Display */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  IMC (calculado automáticamente)
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    value={calculateBMI(assessment?.measurements?.peso_kg, assessment?.measurements?.estatura_cm) ? 
                      `${calculateBMI(assessment?.measurements?.peso_kg, assessment?.measurements?.estatura_cm)} kg/m²` : ''}
                    readOnly
                    className="flex-1 p-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    placeholder="Se calcula automáticamente"
                  />
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                    <p className="font-medium mb-1">Información:</p>
                    <p>El IMC es solo un indicador. No constituye un diagnóstico médico.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
</Card>

      {/* Warning about data accuracy */}
      <Card className="p-4 mb-8 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Información importante:</p>
            <p>Asegúrate de introducir tus medidas con precisión. Estos datos serán tu punto de referencia para medir tu progreso durante el reto de 21 días.</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
{/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
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
        
        <div className="flex gap-3">
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
          
          {progress === 100 && (
            <Button
              onClick={handleSaveAndContinue}
              disabled={saving}
              className="flex items-center gap-2 bg-gradient-purple-blue hover:opacity-90 text-white px-6"
            >
              {saving ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="CheckCircle" size={16} />
              )}
              Guardar y continuar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}