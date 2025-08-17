class NotificationService {
  constructor() {
    this.settings = this.loadSettings();
    this.scheduledNotifications = new Map();
    this.init();
  }

  init() {
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }

  loadSettings() {
    const defaultSettings = {
      enabled: true,
      dailyReminders: {
        morning: { enabled: true, time: '08:00' },
        noon: { enabled: true, time: '12:00' },
        evening: { enabled: true, time: '18:00' },
        night: { enabled: true, time: '21:00' }
      },
      habitCompletion: {
        enabled: true,
        sound: true
      },
      streakMilestones: {
        enabled: true,
        sound: true
      }
    };

    try {
      const saved = localStorage.getItem('notificationSettings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  }

  saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    localStorage.setItem('notificationSettings', JSON.stringify(this.settings));
    this.rescheduleAllNotifications();
    return this.settings;
  }

  getSettings() {
    return { ...this.settings };
  }

  canSendNotifications() {
    return 'Notification' in window && Notification.permission === 'granted';
  }

  async requestPermission() {
    if (!('Notification' in window)) {
      throw new Error('Este navegador no soporta notificaciones');
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  sendNotification(title, options = {}) {
    if (!this.settings.enabled || !this.canSendNotifications()) {
      return null;
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'habit-tracker',
      requireInteraction: false,
      silent: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);

    return notification;
  }

  scheduleHabitCompletionNotification(habitName) {
    if (!this.settings.habitCompletion.enabled) return;

    const messages = [
      `¡Excelente! Has completado "${habitName}" 🎉`,
      `¡Bien hecho! "${habitName}" marcado como completado ✅`,
      `¡Fantástico! Has cumplido con "${habitName}" hoy 🌟`,
      `¡Increíble disciplina! "${habitName}" completado 💪`
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    this.sendNotification(randomMessage, {
      body: 'Sigue así y alcanzarás todas tus metas',
      tag: 'habit-completion',
      silent: !this.settings.habitCompletion.sound
    });
  }

  scheduleStreakMilestoneNotification(streakDays, habitName) {
    if (!this.settings.streakMilestones.enabled) return;

    const milestoneMessages = {
      3: `🔥 ¡3 días consecutivos de "${habitName}"! Estás creando un hábito`,
      7: `🌟 ¡Una semana completa de "${habitName}"! Tu disciplina es admirable`,
      14: `💪 ¡Dos semanas seguidas de "${habitName}"! Eres imparable`,
      21: `🏆 ¡21 días de "${habitName}"! Has transformado este hábito en parte de tu vida`,
      30: `👑 ¡UN MES COMPLETO de "${habitName}"! Eres una LEYENDA`
    };

    const message = milestoneMessages[streakDays] || `🔥 ¡${streakDays} días consecutivos de "${habitName}"!`;
    
    this.sendNotification(message, {
      body: 'Tu constancia está dando frutos increíbles',
      tag: 'streak-milestone',
      silent: !this.settings.streakMilestones.sound,
      requireInteraction: true
    });
  }

  scheduleDailyReminder(moment) {
    if (!this.settings.dailyReminders[moment]?.enabled) return;

    const messages = {
      morning: {
        title: '🌅 ¡Buenos días! Es hora de comenzar tu día',
        body: 'Revisa tus hábitos y empieza con energía positiva'
      },
      noon: {
        title: '☀️ ¡Medio día! Momento de revisar tu progreso',
        body: '¿Cómo van tus hábitos hoy? ¡Sigue adelante!'
      },
      evening: {
        title: '🌆 ¡Buenas tardes! Hora de completar tus hábitos',
        body: 'Termina el día cumpliendo tus objetivos'
      },
      night: {
        title: '🌙 ¡Buenas noches! Reflexiona sobre tu día',
        body: 'Revisa qué hábitos completaste y prepárate para mañana'
      }
    };

    const { title, body } = messages[moment] || messages.morning;
    
    this.sendNotification(title, {
      body,
      tag: `daily-reminder-${moment}`,
      requireInteraction: true
    });
  }

  scheduleAllDailyReminders() {
    // Clear existing scheduled reminders
    this.clearScheduledNotifications();

    Object.entries(this.settings.dailyReminders).forEach(([moment, config]) => {
      if (config.enabled) {
        this.scheduleNotificationForTime(moment, config.time);
      }
    });
  }

  scheduleNotificationForTime(moment, time) {
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If the time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const delay = scheduledTime.getTime() - now.getTime();
    
    const timeoutId = setTimeout(() => {
      this.scheduleDailyReminder(moment);
      // Reschedule for next day
      this.scheduleNotificationForTime(moment, time);
    }, delay);

    this.scheduledNotifications.set(`${moment}-${time}`, timeoutId);
  }

  clearScheduledNotifications() {
    this.scheduledNotifications.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.scheduledNotifications.clear();
  }

  rescheduleAllNotifications() {
    this.scheduleAllDailyReminders();
  }

  // Test notifications for user verification
  sendTestNotification(type = 'general') {
    const testMessages = {
      general: {
        title: '🧪 Notificación de prueba',
        body: 'Las notificaciones están funcionando correctamente'
      },
      habit: {
        title: '✅ Hábito completado (Prueba)',
        body: 'Así se verán las notificaciones cuando completes un hábito'
      },
      reminder: {
        title: '⏰ Recordatorio diario (Prueba)',
        body: 'Así se verán tus recordatorios programados'
      }
    };

    const { title, body } = testMessages[type] || testMessages.general;
    return this.sendNotification(title, { body, tag: 'test-notification' });
  }
}

// Create and export singleton instance
const notificationService = new NotificationService();
export { notificationService };
export default notificationService;