import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const AchievementBadge = ({ 
  achievement, 
  isUnlocked = false, 
  progress = 0, 
  size = 'default',
  showProgress = false,
  onClick,
  className 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const sizeClasses = {
    small: 'w-16 h-16',
    default: 'w-20 h-20', 
    large: 'w-24 h-24'
  };

  const iconSizes = {
    small: 20,
    default: 24,
    large: 28
  };

  return (
    <motion.div
      className={cn(
        "relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 cursor-pointer group",
        isUnlocked 
          ? "bg-white shadow-md hover:shadow-lg" 
          : "bg-gray-50 hover:bg-gray-100",
        className
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Badge Icon */}
      <div className="relative">
        <div
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-300",
            sizeClasses[size],
            isUnlocked
              ? `bg-gradient-to-r ${achievement.gradient} shadow-lg`
              : "bg-gray-200"
          )}
        >
          {isUnlocked ? (
            <ApperIcon 
              name={achievement.icon} 
              size={iconSizes[size]} 
              className="text-white" 
            />
          ) : (
            <ApperIcon 
              name="Lock" 
              size={iconSizes[size]} 
              className="text-gray-400" 
            />
          )}
        </div>

        {/* Progress Ring for Locked Achievements */}
        {!isUnlocked && showProgress && progress > 0 && (
          <div className="absolute inset-0">
            <svg 
              className="w-full h-full transform -rotate-90" 
              viewBox="0 0 100 100"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                className="text-gray-300"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="3"
                fill="transparent"
                strokeDasharray={`${progress * 2.827} 282.7`}
                className="text-primary transition-all duration-500"
              />
            </svg>
          </div>
        )}

        {/* Unlock Animation Sparkles */}
        {isUnlocked && isHovered && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-yellow-400 rounded-full"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                animate={{
                  x: [0, Math.cos(i * 60 * Math.PI / 180) * 30],
                  y: [0, Math.sin(i * 60 * Math.PI / 180) * 30],
                  opacity: [1, 0],
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Badge Info */}
      <div className="text-center space-y-1">
        <h4 className={cn(
          "font-semibold text-sm leading-tight",
          isUnlocked ? "text-gray-900" : "text-gray-500"
        )}>
          {achievement.name}
        </h4>
        <p className={cn(
          "text-xs leading-tight",
          isUnlocked ? "text-gray-600" : "text-gray-400"
        )}>
          {achievement.description}
        </p>
        
        {/* Points */}
        {isUnlocked && (
          <div className="flex items-center justify-center gap-1 text-yellow-600">
            <ApperIcon name="Star" size={12} />
            <span className="text-xs font-medium">{achievement.points}pts</span>
          </div>
        )}

        {/* Progress Percentage */}
        {!isUnlocked && showProgress && progress > 0 && (
          <div className="text-xs text-primary font-medium">
            {Math.round(progress)}%
          </div>
        )}
      </div>

      {/* Tooltip */}
      {isHovered && (
        <motion.div
          className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap z-10"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
        >
          {isUnlocked 
            ? `Desbloqueado • +${achievement.points} puntos`
            : showProgress && progress > 0 
              ? `Progreso: ${Math.round(progress)}%`
              : "Logro bloqueado"
          }
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default AchievementBadge;