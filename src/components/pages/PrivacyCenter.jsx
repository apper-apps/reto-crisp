import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import privacyService from '@/services/api/privacyService';

const PrivacyCenter = () => {
  const navigate = useNavigate();
  const [privacySettings, setPrivacySettings] = useState({
    dataProcessingConsent: true,
    marketingConsent: false,
    imageUsageConsent: false,
    shareProgressConsent: false,
    analyticsConsent: true
  });
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    try {
      const settings = await privacyService.getPrivacySettings('user123');
      setPrivacySettings(settings);
    } catch (error) {
      toast.error('Error al cargar configuración de privacidad');
    } finally {
      setLoading(false);
    }
  };

  const handleConsentChange = async (consentType, value) => {
    const newSettings = {
      ...privacySettings,
      [consentType]: value
    };
    
    setPrivacySettings(newSettings);
    
    try {
      await privacyService.updatePrivacySettings('user123', newSettings);
      await privacyService.logPrivacyAction('user123', 'consent_updated', { 
        consentType, 
        newValue: value 
      });
      
      const consentLabels = {
        dataProcessingConsent: 'Procesamiento de datos',
        marketingConsent: 'Marketing y comunicaciones',
        imageUsageConsent: 'Uso de imágenes',
        shareProgressConsent: 'Compartir progreso',
        analyticsConsent: 'Analíticas y mejoras'
      };
      
      toast.success(`${consentLabels[consentType]} ${value ? 'activado' : 'desactivado'}`);
    } catch (error) {
      setPrivacySettings(prevSettings => ({
        ...prevSettings,
        [consentType]: !value
      }));
      toast.error('Error al actualizar configuración');
    }
  };

  const handleDataExport = async () => {
    setExporting(true);
    try {
      toast.info('Preparando exportación de datos...', { autoClose: false });
      
      const exportData = await privacyService.generateDataExport('user123');
      await privacyService.logPrivacyAction('user123', 'data_exported');
      
      // Create and download file
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `mis-datos-reto21d-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.dismiss();
      toast.success('¡Datos exportados exitosamente!');
    } catch (error) {
      toast.dismiss();
      toast.error('Error al exportar datos');
    } finally {
      setExporting(false);
    }
  };

  const handleDataDeletion = async () => {
    const confirmed = window.confirm(
      '⚠️ ADVERTENCIA: Esta acción es irreversible.\n\n' +
      '¿Estás seguro de que deseas eliminar permanentemente todos tus datos?\n\n' +
      'Esto incluye:\n' +
      '• Tu perfil y información personal\n' +
      '• Todas tus fotos de progreso\n' +
      '• Historial de hábitos y logros\n' +
      '• Métricas y estadísticas\n\n' +
      'El proceso tomará hasta 30 días en completarse.'
    );
    
    if (confirmed) {
      try {
        const result = await privacyService.requestDataDeletion('user123', 'Usuario solicitó eliminación');
        await privacyService.logPrivacyAction('user123', 'deletion_requested', { 
          requestId: result.requestId 
        });
        
        toast.success(result.message, { autoClose: 8000 });
        
        // Show detailed next steps
        setTimeout(() => {
          alert(
            'Próximos pasos:\n\n' +
            result.nextSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')
          );
        }, 2000);
      } catch (error) {
        toast.error('Error al solicitar eliminación de datos');
      }
    }
  };

  const handleSaveSettings = async () => {
    try {
      await privacyService.updatePrivacySettings('user123', privacySettings);
      toast.success('Configuración de privacidad guardada');
    } catch (error) {
      toast.error('Error al guardar configuración');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const retentionPolicy = privacyService.getDataRetentionPolicy();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-gray-900">Centro de Privacidad</h1>
          <p className="text-gray-600 mt-2">Controla tus datos personales y configuración de privacidad</p>
        </div>
        <Button 
          onClick={() => navigate('/perfil')} 
          variant="outline"
          className="flex items-center gap-2"
        >
          <ApperIcon name="ArrowLeft" size={16} />
          Volver al Perfil
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Privacy Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Data Rights */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ApperIcon name="Database" size={20} />
              Tus Derechos sobre los Datos
            </h3>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                      <ApperIcon name="Download" size={18} />
                      Exportar mis Datos
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Descarga una copia completa de todos tus datos personales en formato JSON. 
                      Incluye perfil, hábitos, progreso, fotos y métricas.
                    </p>
                    <div className="mt-2 text-xs text-gray-500">
                      • Información de perfil y contacto
                      • Historial completo de hábitos y progreso
                      • Logros desbloqueados y puntos
                      • Enlaces a fotos de progreso
                      • Configuraciones y preferencias
                    </div>
                  </div>
                  <Button
                    onClick={handleDataExport}
                    disabled={exporting}
                    className="ml-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {exporting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Preparando...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="Download" size={16} className="mr-2" />
                        Exportar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-red-900 flex items-center gap-2">
                      <ApperIcon name="Trash2" size={18} />
                      Eliminar mis Datos
                    </h4>
                    <p className="text-sm text-red-700 mt-1">
                      Solicita la eliminación completa y permanente de todos tus datos personales. 
                      Esta acción no se puede deshacer.
                    </p>
                    <div className="mt-2 text-xs text-red-600">
                      ⚠️ Proceso irreversible - Se completará en máximo 30 días
                    </div>
                  </div>
                  <Button
                    onClick={handleDataDeletion}
                    className="ml-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white"
                  >
                    <ApperIcon name="Trash2" size={16} className="mr-2" />
                    Eliminar Todo
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Consent Management */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <ApperIcon name="UserCheck" size={20} />
              Gestión de Consentimientos
            </h3>
            
            <div className="space-y-4">
              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Procesamiento de Datos Esenciales</h4>
                    <p className="text-sm text-gray-600">
                      Necesario para el funcionamiento básico del reto y seguimiento de progreso
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Incluye: perfil, hábitos, progreso, logros
                    </div>
                  </div>
                  <div className="ml-4 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Requerido</span>
                    <button
                      onClick={() => handleConsentChange('dataProcessingConsent', !privacySettings.dataProcessingConsent)}
                      className={`w-12 h-6 ${privacySettings.dataProcessingConsent ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                    >
                      <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${privacySettings.dataProcessingConsent ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Uso de Imágenes y Fotos</h4>
                    <p className="text-sm text-gray-600">
                      Permitir el uso de tus fotos de progreso para testimonios, marketing y redes sociales
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Siempre con tu consentimiento explícito para cada uso
                    </div>
                  </div>
                  <button
                    onClick={() => handleConsentChange('imageUsageConsent', !privacySettings.imageUsageConsent)}
                    className={`ml-4 w-12 h-6 ${privacySettings.imageUsageConsent ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${privacySettings.imageUsageConsent ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Compartir Progreso (Anónimo)</h4>
                    <p className="text-sm text-gray-600">
                      Incluir tu progreso de forma anónima en estadísticas generales y estudios de efectividad
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Sin información personal identificable
                    </div>
                  </div>
                  <button
                    onClick={() => handleConsentChange('shareProgressConsent', !privacySettings.shareProgressConsent)}
                    className={`ml-4 w-12 h-6 ${privacySettings.shareProgressConsent ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${privacySettings.shareProgressConsent ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Marketing y Comunicaciones</h4>
                    <p className="text-sm text-gray-600">
                      Recibir emails promocionales, ofertas especiales y noticias sobre nuevos retos
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Puedes cancelar suscripción en cualquier momento
                    </div>
                  </div>
                  <button
                    onClick={() => handleConsentChange('marketingConsent', !privacySettings.marketingConsent)}
                    className={`ml-4 w-12 h-6 ${privacySettings.marketingConsent ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${privacySettings.marketingConsent ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                  </button>
                </div>
              </div>

              <div className="border border-gray-100 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Analíticas y Mejoras</h4>
                    <p className="text-sm text-gray-600">
                      Ayudar a mejorar la aplicación mediante análisis anónimo de uso y rendimiento
                    </p>
                    <div className="text-xs text-gray-500 mt-1">
                      Datos agregados y anónimos para mejoras del producto
                    </div>
                  </div>
                  <button
                    onClick={() => handleConsentChange('analyticsConsent', !privacySettings.analyticsConsent)}
                    className={`ml-4 w-12 h-6 ${privacySettings.analyticsConsent ? 'bg-primary' : 'bg-gray-300'} rounded-full relative transition-colors`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${privacySettings.analyticsConsent ? 'right-0.5' : 'left-0.5'} shadow-sm`}></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleSaveSettings}
                className="px-6 py-2 bg-primary hover:bg-primary/90 text-white"
              >
                <ApperIcon name="Save" size={16} className="mr-2" />
                Guardar Configuración
              </Button>
            </div>
          </Card>
        </div>

        {/* Privacy Information Sidebar */}
        <div className="space-y-6">
          {/* Privacy Summary */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Shield" size={18} />
              Resumen de Privacidad
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Datos esenciales</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-600">Activo</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Uso de imágenes</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${privacySettings.imageUsageConsent ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                  <span className={`text-xs ${privacySettings.imageUsageConsent ? 'text-green-600' : 'text-gray-500'}`}>
                    {privacySettings.imageUsageConsent ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Marketing</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${privacySettings.marketingConsent ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                  <span className={`text-xs ${privacySettings.marketingConsent ? 'text-green-600' : 'text-gray-500'}`}>
                    {privacySettings.marketingConsent ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Analíticas</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 ${privacySettings.analyticsConsent ? 'bg-green-500' : 'bg-gray-400'} rounded-full`}></div>
                  <span className={`text-xs ${privacySettings.analyticsConsent ? 'text-green-600' : 'text-gray-500'}`}>
                    {privacySettings.analyticsConsent ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>
            </div>
          </Card>

          {/* Data Retention Policy */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Clock" size={18} />
              Retención de Datos
            </h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-gray-900">Datos personales</div>
                <div className="text-gray-600">{retentionPolicy.personalData}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Fotos de progreso</div>
                <div className="text-gray-600">{retentionPolicy.progressPhotos}</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">Historial de hábitos</div>
                <div className="text-gray-600">{retentionPolicy.habitData}</div>
              </div>
            </div>
          </Card>

          {/* Your Rights */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Scale" size={18} />
              Tus Derechos
            </h3>
            
            <div className="space-y-3 text-sm">
              {Object.entries(retentionPolicy.rightsInfo).map(([key, description]) => (
                <div key={key} className="flex items-start gap-2">
                  <ApperIcon name="Check" size={14} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600">{description}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Contact for Privacy */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Mail" size={18} />
              Contacto
            </h3>
            
            <div className="text-sm text-gray-600 space-y-2">
              <p>¿Tienes preguntas sobre privacidad?</p>
              <div className="flex items-center gap-2 text-primary">
                <ApperIcon name="Mail" size={14} />
                <span>privacidad@reto21d.com</span>
              </div>
              <p className="text-xs">Respuesta en 24-48 horas</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyCenter;