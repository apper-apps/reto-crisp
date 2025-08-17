import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAchievements } from "@/contexts/AchievementContext";
import ApperIcon from "@/components/ApperIcon";
import BadgeUnlockAnimation from "@/components/molecules/BadgeUnlockAnimation";
import AchievementBadge from "@/components/atoms/AchievementBadge";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";

const Perfil = () => {
  const { settings, updateSettings, requestPermission, sendTestNotification, getPermissionStatus, isLoading } = useNotifications();
  const { 
    achievements, 
    unlockedAchievements, 
    pendingUnlock, 
    totalAchievementPoints,
    checkAchievements,
    getAchievementProgress,
    isAchievementUnlocked 
  } = useAchievements();
  
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
  const [notificationSettings, setNotificationSettings] = useState(settings);
  const [achievementProgress, setAchievementProgress] = useState({});
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(false);

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

  // Load achievement progress
  const loadAchievementProgress = async () => {
    const progressData = {};
    for (const achievement of achievements) {
      if (!isAchievementUnlocked(achievement.key)) {
        progressData[achievement.key] = await getAchievementProgress(achievement.key);
      }
    }
    setAchievementProgress(progressData);
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

  const handleSaveSettings = async () => {
    // Save notification settings functionality
    try {
      await updateSettings(notificationSettings);
      toast.success("Configuración de notificaciones guardada correctamente");
    } catch (error) {
      toast.error("Error al guardar la configuración");
    }
  };

  const handleNotificationToggle = (path, value) => {
    const newSettings = { ...notificationSettings };
    const keys = path.split('.');
    let current = newSettings;
    
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    setNotificationSettings(newSettings);
  };

  const handleTimeChange = (moment, time) => {
    setNotificationSettings(prev => ({
      ...prev,
      dailyReminders: {
        ...prev.dailyReminders,
        [moment]: {
          ...prev.dailyReminders[moment],
          time: time
        }
      }
    }));
  };

  const handleRequestPermissions = async () => {
    await requestPermission();
  };

  const handleTestNotification = (type = 'general') => {
    sendTestNotification(type);
  };

  const permissionStatus = getPermissionStatus();

  // Check for new achievements when component mounts
  useEffect(() => {
    checkAchievements();
    loadAchievementProgress();
  }, []);

  // Show unlock animation when pendingUnlock changes
  useEffect(() => {
    if (pendingUnlock) {
      setShowUnlockAnimation(true);
    }
  }, [pendingUnlock]);

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
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <ApperIcon name="Bell" size={20} />
                    Sistema de Notificaciones
                </h3>

                {/* Permission Status */}
                {!permissionStatus.supported && (
                    <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                            <ApperIcon name="AlertTriangle" size={16} className="inline mr-2" />
                            Tu navegador no soporta notificaciones
                        </p>
                    </div>
                )}

                {permissionStatus.supported && permissionStatus.needsPermission && (
                    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-800 font-medium text-sm">Habilitar Notificaciones</p>
                                <p className="text-blue-600 text-sm">Permite recibir recordatorios y alertas</p>
                            </div>
                            <Button
                                onClick={handleRequestPermissions}
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2"
                            >
                                {isLoading ? 'Habilitando...' : 'Habilitar'}
                            </Button>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* Master Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                            <h4 className="font-medium text-gray-900">Notificaciones Principales</h4>
                            <p className="text-sm text-gray-600">Activar/desactivar todas las notificaciones</p>
                        </div>
                        <button
                            onClick={() => handleNotificationToggle('enabled', !notificationSettings.enabled)}
                            className={`w-12 h-6 ${notificationSettings.enabled ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                        >
                            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.enabled ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                        </button>
                    </div>

                    {notificationSettings.enabled && (
                        <>
                            {/* Daily Reminders */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <ApperIcon name="Clock" size={16} />
                                    Recordatorios Diarios
                                </h4>
                                
                                <div className="space-y-4">
                                    {Object.entries(notificationSettings.dailyReminders).map(([moment, config]) => {
                                        const momentLabels = {
                                            morning: { label: 'Mañana', icon: 'Sunrise', desc: 'Comienza tu día con energía' },
                                            noon: { label: 'Mediodía', icon: 'Sun', desc: 'Revisa tu progreso' },
                                            evening: { label: 'Tarde', icon: 'Sunset', desc: 'Completa tus hábitos' },
                                            night: { label: 'Noche', icon: 'Moon', desc: 'Reflexiona sobre tu día' }
                                        };
                                        
                                        return (
                                            <div key={moment} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                                <div className="flex items-center gap-3">
                                                    <ApperIcon name={momentLabels[moment].icon} size={16} className="text-gray-500" />
                                                    <div>
                                                        <p className="font-medium text-gray-900">{momentLabels[moment].label}</p>
                                                        <p className="text-sm text-gray-600">{momentLabels[moment].desc}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="time"
                                                        value={config.time}
                                                        onChange={(e) => handleTimeChange(moment, e.target.value)}
                                                        disabled={!config.enabled}
                                                        className="px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary focus:border-primary disabled:bg-gray-100"
                                                    />
                                                    <button
                                                        onClick={() => handleNotificationToggle(`dailyReminders.${moment}.enabled`, !config.enabled)}
                                                        className={`w-10 h-5 ${config.enabled ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                                                    >
                                                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${config.enabled ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Habit Notifications */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                    <ApperIcon name="CheckCircle" size={16} />
                                    Notificaciones de Hábitos
                                </h4>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Hábito Completado</p>
                                            <p className="text-sm text-gray-600">Notificación al completar un hábito</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.habitCompletion.sound}
                                                    onChange={(e) => handleNotificationToggle('habitCompletion.sound', e.target.checked)}
                                                    disabled={!notificationSettings.habitCompletion.enabled}
                                                    className="rounded"
                                                />
                                                Sonido
                                            </label>
                                            <button
                                                onClick={() => handleNotificationToggle('habitCompletion.enabled', !notificationSettings.habitCompletion.enabled)}
                                                className={`w-10 h-5 ${notificationSettings.habitCompletion.enabled ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.habitCompletion.enabled ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                                        <div>
                                            <p className="font-medium text-gray-900">Rachas Especiales</p>
                                            <p className="text-sm text-gray-600">Celebra tus rachas de 3, 7, 14 y 21 días</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <label className="flex items-center gap-2 text-sm text-gray-600">
                                                <input
                                                    type="checkbox"
                                                    checked={notificationSettings.streakMilestones.sound}
                                                    onChange={(e) => handleNotificationToggle('streakMilestones.sound', e.target.checked)}
                                                    disabled={!notificationSettings.streakMilestones.enabled}
                                                    className="rounded"
                                                />
                                                Sonido
                                            </label>
                                            <button
                                                onClick={() => handleNotificationToggle('streakMilestones.enabled', !notificationSettings.streakMilestones.enabled)}
                                                className={`w-10 h-5 ${notificationSettings.streakMilestones.enabled ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                                            >
                                                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${notificationSettings.streakMilestones.enabled ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Test Notifications */}
                            {permissionStatus.canSend && (
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <ApperIcon name="TestTube" size={16} />
                                        Probar Notificaciones
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            onClick={() => handleTestNotification('general')}
                                            variant="outline"
                                            className="text-sm"
                                        >
                                            General
                                        </Button>
                                        <Button
                                            onClick={() => handleTestNotification('habit')}
                                            variant="outline" 
                                            className="text-sm"
                                        >
                                            Hábito
                                        </Button>
                                        <Button
                                            onClick={() => handleTestNotification('reminder')}
                                            variant="outline"
                                            className="text-sm"
                                        >
                                            Recordatorio
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </Card>
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
<div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <ApperIcon name="Trophy" size={20} />
                    Logros y Insignias
                  </h3>
                  <div className="flex items-center gap-2 text-sm">
                    <div className="flex items-center gap-1 text-yellow-600">
                      <ApperIcon name="Star" size={16} />
                      <span className="font-medium">{totalAchievementPoints} puntos</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">
                      {unlockedAchievements.length} de {achievements.length} desbloqueados
                    </span>
                  </div>
                </div>

                {/* Achievement Categories */}
                <div className="space-y-6">
                  {/* Streak Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <ApperIcon name="Flame" size={16} className="text-orange-500" />
                      Rachas y Constancia
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {achievements
                        .filter(a => a.category === 'streak')
                        .map(achievement => (
                          <AchievementBadge
                            key={achievement.key}
                            achievement={achievement}
                            isUnlocked={isAchievementUnlocked(achievement.key)}
                            progress={achievementProgress[achievement.key] || 0}
                            showProgress={true}
                            onClick={() => {
                              if (isAchievementUnlocked(achievement.key)) {
                                toast.success(`${achievement.name}: ${achievement.description}`);
                              } else {
                                toast.info(`Progreso: ${Math.round(achievementProgress[achievement.key] || 0)}%`);
                              }
                            }}
                          />
                        ))
                      }
                    </div>
                  </div>

                  {/* Daily & Completion Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <ApperIcon name="Target" size={16} className="text-blue-500" />
                      Perfección y Finalización
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {achievements
                        .filter(a => ['daily', 'completion', 'mastery'].includes(a.category))
                        .map(achievement => (
                          <AchievementBadge
                            key={achievement.key}
                            achievement={achievement}
                            isUnlocked={isAchievementUnlocked(achievement.key)}
                            progress={achievementProgress[achievement.key] || 0}
                            showProgress={true}
                            onClick={() => {
                              if (isAchievementUnlocked(achievement.key)) {
                                toast.success(`${achievement.name}: ${achievement.description}`);
                              } else {
                                toast.info(`Progreso: ${Math.round(achievementProgress[achievement.key] || 0)}%`);
                              }
                            }}
                          />
                        ))
                      }
                    </div>
                  </div>

                  {/* Special & Exploration Achievements */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <ApperIcon name="Compass" size={16} className="text-purple-500" />
                      Exploración y Especiales
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {achievements
                        .filter(a => ['consistency', 'exploration'].includes(a.category))
                        .map(achievement => (
                          <AchievementBadge
                            key={achievement.key}
                            achievement={achievement}
                            isUnlocked={isAchievementUnlocked(achievement.key)}
                            progress={achievementProgress[achievement.key] || 0}
                            showProgress={true}
                            onClick={() => {
                              if (isAchievementUnlocked(achievement.key)) {
                                toast.success(`${achievement.name}: ${achievement.description}`);
                              } else {
                                toast.info(`Progreso: ${Math.round(achievementProgress[achievement.key] || 0)}%`);
                              }
                            }}
                          />
                        ))
                      }
                    </div>
                  </div>
                </div>

                {/* Achievement Stats Summary */}
                <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Trophy" size={20} className="text-yellow-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{unlockedAchievements.length}</div>
                        <div className="text-sm text-gray-600">Logros desbloqueados</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="Star" size={20} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">{totalAchievementPoints}</div>
                        <div className="text-sm text-gray-600">Puntos de logros</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <ApperIcon name="TrendingUp" size={20} className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                        </div>
                        <div className="text-sm text-gray-600">Progreso total</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className="mt-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <ApperIcon name="Sparkles" size={16} className="text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-1">¡Sigue así!</h5>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {unlockedAchievements.length === 0 
                          ? "¡Tu primer logro te espera! Completa tus hábitos diarios para comenzar a desbloquear insignias."
                          : unlockedAchievements.length < 3
                          ? "¡Excelente comienzo! Mantén tu constancia para desbloquear más logros especiales."
                          : unlockedAchievements.length < 6
                          ? "¡Increíble progreso! Estás construyendo hábitos sólidos y coleccionando logros valiosos."
                          : "¡Eres un maestro de los hábitos! Tu dedicación es inspiradora y tus logros lo demuestran."
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
</div>
          </div>
        </div>

        {/* Badge Unlock Animation */}
        <BadgeUnlockAnimation
          achievement={pendingUnlock}
          isVisible={showUnlockAnimation}
          onComplete={() => setShowUnlockAnimation(false)}
        />
      </div>
    </div>
  );
};

export default Perfil;