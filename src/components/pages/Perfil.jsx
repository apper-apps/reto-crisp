import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Perfil = () => {
  const [formData, setFormData] = useState({
    name: '',
    birthDate: '',
    phone: '+52',
    weight: '',
    height: '',
    healthInfo: '',
    transformationGoals: ''
  });
  const [age, setAge] = useState(0);

  const calculateAge = (birthDate) => {
    if (!birthDate) return 0;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (formData.birthDate) {
      setAge(calculateAge(formData.birthDate));
    }
  }, [formData.birthDate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone') {
      // Ensure phone always starts with +52
      if (!value.startsWith('+52')) {
        setFormData(prev => ({ ...prev, [name]: '+52' + value.replace('+52', '') }));
        return;
      }
      // Limit phone number length (10 digits after +52)
      if (value.length > 13) return;
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = () => {
    // Basic validation
    if (!formData.name.trim()) {
      toast.error("Por favor ingresa tu nombre");
      return;
    }
    if (!formData.birthDate) {
      toast.error("Por favor selecciona tu fecha de nacimiento");
      return;
    }
    if (formData.phone.length < 13) {
      toast.error("Por favor ingresa un número de teléfono válido");
      return;
    }
    
// Here you would typically save to a service
    toast.success("Perfil guardado correctamente");
  };

  const handleSaveSettings = () => {
    // Save settings functionality
    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="space-y-6">
    <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">Mi Perfil
                    </h1>
        <p className="text-gray-600 mt-2">Configura tu experiencia y preferencias del reto.
                    </p>
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
            <div className="text-center">
                <div
                    className="w-20 h-20 bg-gradient-purple-blue rounded-full flex items-center justify-center mx-auto mb-4">
                    <ApperIcon name="User" size={32} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tu Transformación
                                </h3>
                <p className="text-gray-600 text-sm mt-1">Participante del Reto 21D
                                </p>
                <Button className="mt-4" size="sm">Editar Perfil
                                </Button>
            </div>
        </Card>
        <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ApperIcon name="Settings" size={20} />Configuración General
                                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Notificaciones Diarias</h4>
                            <p className="text-sm text-gray-600">Recibe recordatorios para completar tus hábitos</p>
                        </div>
                        <div className="w-12 h-6 bg-primary rounded-full relative">
                            <div
                                className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                        </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Recordatorio Matutino</h4>
                            <p className="text-sm text-gray-600">Recibe una motivación al comenzar el día</p>
                        </div>
                        <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                            <div
                                className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                        </div>
                    </div>
                </div></Card>
            {/* Personal Information Form */}
            <Card className="p-6">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ApperIcon name="User" size={20} />Información Personal
                                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo
                                            </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Ingresa tu nombre completo" />
                    </div>
                    {/* Birth Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Nacimiento
                                            </label>
                        <div className="relative">
                            <input
                                type="date"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" />
                            {age > 0 && <div className="absolute right-3 top-2 text-sm text-gray-500">
                                {age}años
                                                    </div>}
                        </div>
                    </div>
                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Número de Teléfono
                                            </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="+52 55 1234 5678" />
                    </div>
                </div>
            </Card>
            {/* Physical Metrics */}
            <Card className="p-6">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ApperIcon name="Activity" size={20} />Métricas Físicas
                                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Weight */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Peso Actual (kg)
                                            </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="70.5"
                                min="30"
                                max="300"
                                step="0.1" />
                            <div className="absolute right-3 top-2 text-sm text-gray-500">kg</div>
                        </div>
                    </div>
                    {/* Height */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Altura (cm)
                                            </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="175"
                                min="100"
                                max="250" />
                            <div className="absolute right-3 top-2 text-sm text-gray-500">cm</div>
                        </div>
                    </div>
                </div>
                {/* BMI Calculation */}
                {formData.weight && formData.height && <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Índice de Masa Corporal (IMC):</span>
                        <span className="text-lg font-bold text-primary">
                            {(formData.weight / Math.pow(formData.height / 100, 2)).toFixed(1)}
                        </span>
                    </div>
                </div>}
            </Card>
            {/* Health Information */}
            <Card className="p-6">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ApperIcon name="Heart" size={20} />Información de Salud
                                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones de Salud o Medicamentos
                                      </label>
                    <textarea
                        name="healthInfo"
                        value={formData.healthInfo}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Describe cualquier condición médica, medicamentos que tomes, lesiones previas o consideraciones especiales que debamos tener en cuenta..." />
                </div>
            </Card>
            {/* Transformation Goals */}
            <Card className="p-6">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <ApperIcon name="Target" size={20} />Objetivos de Transformación
                                </h3>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Describe tus Metas y Objetivos
                                      </label>
                    <textarea
                        name="transformationGoals"
                        value={formData.transformationGoals}
                        onChange={handleInputChange}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                        placeholder="Comparte tus objetivos específicos: ¿Quieres perder peso, ganar músculo, mejorar tu condición física, desarrollar hábitos saludables? ¿Hay alguna fecha objetivo o evento especial? ¿Qué te motiva a hacer este cambio?" />
                </div>
            </Card>
            {/* Save Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleSaveProfile}
                    className="px-8 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                    <ApperIcon name="Save" size={16} className="mr-2" />Guardar Perfil
                                </Button>
            </div>
            <Card className="p-6">
                <h3
                    className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ApperIcon name="Trophy" size={20} />Logros Desbloqueados
                                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                        className="flex items-center gap-3 p-3 bg-gradient-light rounded-lg text-white">
                        <ApperIcon name="Flame" size={24} />
                        <div>
                            <div className="font-semibold">Primera Semana</div>
                            <div className="text-xs text-white/80">7 días consecutivos</div>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-3 p-3 bg-gradient-purple-blue rounded-lg text-white">
                        <ApperIcon name="Target" size={24} />
                        <div>
                            <div className="font-semibold">Constancia</div>
                            <div className="text-xs text-white/80">80% de hábitos diarios</div>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg text-gray-500">
                        <ApperIcon name="Star" size={24} />
                        <div>
                            <div className="font-semibold">Perfeccionista</div>
                            <div className="text-xs">100% en un día</div>
                        </div>
                    </div>
                    <div
                        className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg text-gray-500">
                        <ApperIcon name="Crown" size={24} />
                        <div>
                            <div className="font-semibold">Maestro 21D</div>
                            <div className="text-xs">Completa el reto</div>
                        </div>
                    </div>
                </div>
            </Card>
            <div className="flex gap-3">
                <Button onClick={handleSaveSettings}>
                    <ApperIcon name="Save" size={16} className="mr-2" />Guardar Cambios
                                </Button>
                <Button variant="secondary">
                    <ApperIcon name="Download" size={16} className="mr-2" />Exportar Datos
                                </Button>
            </div>
        </div>
    </div>
</div>
  );
};

export default Perfil;