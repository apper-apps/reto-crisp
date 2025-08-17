import React, { useState, useEffect } from "react";
import ChallengeCalendar from "@/components/organisms/ChallengeCalendar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { toast } from "react-toastify";
import { challengeService } from "@/services/api/challengeService";

const MiReto = () => {
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    
    if (day === challenge.currentDay) {
      toast.info("¡Este es tu día actual! Completa tus hábitos para marcarlo como terminado.");
    } else if (day < challenge.currentDay) {
      const isCompleted = challenge.completedDays.includes(day);
      toast.success(
        isCompleted 
          ? `Día ${day} - ¡Completado exitosamente!` 
          : `Día ${day} - Día sin completar`
      );
    } else {
      toast.info(`Día ${day} - Aún no has llegado a este día`);
    }
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

  return (
    <div className="space-y-6">
      <ChallengeCalendar 
        challenge={challenge} 
        onDayClick={handleDayClick}
      />
    </div>
  );
};

export default MiReto;