import React from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Perfil = () => {
  const handleSaveSettings = () => {
    toast.success("Configuración guardada correctamente");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-gray-900">
          Mi Perfil
        </h1>
        <p className="text-gray-600 mt-2">
          Configura tu experiencia y preferencias del reto.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-purple-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <ApperIcon name="User" size={32} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              Tu Transformación
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              Participante del Reto 21D
            </p>
            <Button className="mt-4" size="sm">
              Editar Perfil
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Settings" size={20} />
              Configuración General
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Notificaciones Diarias</h4>
                  <p className="text-sm text-gray-600">Recibe recordatorios para completar tus hábitos</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Recordatorio Matutino</h4>
                  <p className="text-sm text-gray-600">Recibe una motivación al comenzar el día</p>
                </div>
                <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Resumen Semanal</h4>
                  <p className="text-sm text-gray-600">Recibe tu progreso semanal por email</p>
                </div>
                <div className="w-12 h-6 bg-primary rounded-full relative">
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="BarChart3" size={20} />
              Estadísticas Personales
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-success/10 rounded-lg">
                <div className="text-2xl font-bold text-success">18</div>
                <div className="text-sm text-gray-600">Días Completados</div>
              </div>
              <div className="text-center p-4 bg-primary/10 rounded-lg">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-sm text-gray-600">Tasa de Éxito</div>
              </div>
              <div className="text-center p-4 bg-warning/10 rounded-lg">
                <div className="text-2xl font-bold text-warning">7</div>
                <div className="text-sm text-gray-600">Racha Actual</div>
              </div>
              <div className="text-center p-4 bg-info/10 rounded-lg">
                <div className="text-2xl font-bold text-info">12</div>
                <div className="text-sm text-gray-600">Hábitos Activos</div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <ApperIcon name="Trophy" size={20} />
              Logros Desbloqueados
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gradient-light rounded-lg text-white">
                <ApperIcon name="Flame" size={24} />
                <div>
                  <div className="font-semibold">Primera Semana</div>
                  <div className="text-xs text-white/80">7 días consecutivos</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gradient-purple-blue rounded-lg text-white">
                <ApperIcon name="Target" size={24} />
                <div>
                  <div className="font-semibold">Constancia</div>
                  <div className="text-xs text-white/80">80% de hábitos diarios</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg text-gray-500">
                <ApperIcon name="Star" size={24} />
                <div>
                  <div className="font-semibold">Perfeccionista</div>
                  <div className="text-xs">100% en un día</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-gray-200 rounded-lg text-gray-500">
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
              <ApperIcon name="Save" size={16} className="mr-2" />
              Guardar Cambios
            </Button>
            <Button variant="secondary">
              <ApperIcon name="Download" size={16} className="mr-2" />
              Exportar Datos
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Perfil;