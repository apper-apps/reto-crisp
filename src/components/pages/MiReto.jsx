import React, { useState, useEffect } from "react";
import ChallengeCalendar from "@/components/organisms/ChallengeCalendar";
import DayPlan from "@/components/pages/DayPlan";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { challengeService } from "@/services/api/challengeService";

const MiReto = () => {
const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentView, setCurrentView] = useState('calendar'); // 'calendar' or 'dayplan'
  const [selectedDay, setSelectedDay] = useState(null);
  const loadChallenge = async () => {
    try {
      setLoading(true);
      setError("");
      
      const challengeData = await challengeService.getActive();
      setChallenge(challengeData);
    } catch (err) {
      setError(err.message || "Error al cargar el reto");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenge();
  }, []);

const handleDayClick = (day) => {
    if (!challenge) return;
    
    setSelectedDay(day);
    setCurrentView('dayplan');
    toast.info(`Viendo plan detallado del Día ${day}`);
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadChallenge} />;
  }

  if (!challenge) {
    return (
      <Empty
        title="No hay reto activo"
        description="Comienza un nuevo reto de 21 días para ver tu calendario de progreso."
        icon="Calendar"
        action={{
          label: "Comenzar Reto",
          icon: "Plus",
          onClick: () => toast.info("Función de crear reto próximamente")
        }}
      />
    );
  }

const handleBackToCalendar = () => {
    setCurrentView('calendar');
    setSelectedDay(null);
  };

  return (
    <div className="space-y-6">
      {currentView === 'calendar' ? (
        <ChallengeCalendar 
          challenge={challenge} 
          onDayClick={handleDayClick}
        />
      ) : (
        <DayPlan 
          day={selectedDay}
          challenge={challenge}
          onBack={handleBackToCalendar}
        />
      )}
    </div>
  );
};

export default MiReto;