import React, { createContext, useContext, useEffect, useState } from "react";
import { notificationService } from "@/services/api/notificationService";
import { toast } from "react-toastify";

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState(notificationService.getSettings());
  const [permission, setPermission] = useState(
    'Notification' in window ? Notification.permission : 'unsupported'
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Schedule initial notifications
    notificationService.scheduleAllDailyReminders();

    // Cleanup on unmount
    return () => {
      notificationService.clearScheduledNotifications();
    };
  }, []);

  const requestPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await notificationService.requestPermission();
      setPermission(granted ? 'granted' : 'denied');
      
      if (granted) {
        toast.success('¡Notificaciones habilitadas correctamente!');
        notificationService.scheduleAllDailyReminders();
      } else {
        toast.error('Permisos de notificación denegados. Puedes habilitarlos en la configuración del navegador.');
      }
      
      return granted;
    } catch (error) {
      toast.error(error.message);
      setPermission('unsupported');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = (newSettings) => {
    setIsLoading(true);
    try {
      const updatedSettings = notificationService.saveSettings(newSettings);
      setSettings(updatedSettings);
      toast.success('Configuración de notificaciones actualizada');
      return updatedSettings;
    } catch (error) {
      toast.error('Error al guardar la configuración');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = (type = 'general') => {
    if (permission !== 'granted') {
      toast.error('Las notificaciones no están habilitadas');
      return false;
    }

    try {
      const notification = notificationService.sendTestNotification(type);
      if (notification) {
        toast.success('Notificación de prueba enviada');
        return true;
      } else {
        toast.error('No se pudo enviar la notificación de prueba');
        return false;
      }
    } catch (error) {
      toast.error('Error al enviar notificación de prueba');
      return false;
    }
  };

  const scheduleHabitNotification = (habitName) => {
    if (settings.enabled && settings.habitCompletion.enabled) {
      notificationService.scheduleHabitCompletionNotification(habitName);
    }
  };

  const scheduleStreakNotification = (streakDays, habitName) => {
    if (settings.enabled && settings.streakMilestones.enabled) {
      notificationService.scheduleStreakMilestoneNotification(streakDays, habitName);
    }
  };

  const scheduleDailyReminder = (moment) => {
    if (settings.enabled && settings.dailyReminders[moment]?.enabled) {
      notificationService.scheduleDailyReminder(moment);
    }
  };

  const getPermissionStatus = () => {
    return {
      supported: 'Notification' in window,
      permission,
      canSend: notificationService.canSendNotifications(),
      needsPermission: permission === 'default' || permission === 'denied'
    };
  };

  const value = {
    settings,
    permission,
    isLoading,
    updateSettings,
    requestPermission,
    sendTestNotification,
    scheduleHabitNotification,
    scheduleStreakNotification,
    scheduleDailyReminder,
    getPermissionStatus
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};