import React from "react";
import { cn } from "@/utils/cn";
import Card from "@/components/atoms/Card";
import Progress from "@/components/atoms/Progress";
import ApperIcon from "@/components/ApperIcon";

const ChallengeProgress = ({ challenge, dayProgress, className }) => {
  const completionPercentage = (challenge.currentDay / 21) * 100;
  const todayHabitsCompletion = dayProgress ? (dayProgress.habitsCompleted / dayProgress.totalHabits) * 100 : 0;

  return (
    <Card variant="gradient" className={cn("p-6", className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h2 className="text-xl font-bold font-display text-white mb-1">
            {challenge.name}
          </h2>
          <p className="text-white/80 text-sm">
            Día {challenge.currentDay} de 21
          </p>
        </div>
        <div className="bg-white/20 p-3 rounded-lg">
          <ApperIcon name="Target" size={24} className="text-white" />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-white/80 text-sm">Progreso del Reto</span>
            <span className="text-white font-semibold">
              {Math.round(completionPercentage)}%
            </span>
          </div>
          <Progress 
            value={challenge.currentDay} 
            max={21} 
            variant="primary"
            className="bg-white/20"
          />
        </div>

        {dayProgress && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/80 text-sm">Hábitos de Hoy</span>
              <span className="text-white font-semibold">
                {dayProgress.habitsCompleted}/{dayProgress.totalHabits}
              </span>
            </div>
            <Progress 
              value={dayProgress.habitsCompleted} 
              max={dayProgress.totalHabits} 
              variant="success"
              className="bg-white/20"
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {challenge.completedDays.length}
            </div>
            <div className="text-white/70 text-xs">Días Completos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {21 - challenge.currentDay}
            </div>
            <div className="text-white/70 text-xs">Días Restantes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {Math.round((challenge.completedDays.length / 21) * 100)}%
            </div>
            <div className="text-white/70 text-xs">Completado</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChallengeProgress;