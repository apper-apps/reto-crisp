import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

const BadgeUnlockAnimation = ({ achievement, isVisible, onComplete }) => {
  const [stage, setStage] = useState('hidden'); // hidden, unlocking, celebrating, completed

  useEffect(() => {
    if (isVisible && achievement) {
      setStage('unlocking');
      
      // Stage progression
      const timer1 = setTimeout(() => setStage('celebrating'), 1000);
      const timer2 = setTimeout(() => setStage('completed'), 3000);
      const timer3 = setTimeout(() => {
        onComplete?.();
        setStage('hidden');
      }, 4000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isVisible, achievement, onComplete]);

  if (!achievement || stage === 'hidden') return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4"
          initial={{ scale: 0.5, y: 50 }}
          animate={{ 
            scale: 1, 
            y: 0,
            rotate: stage === 'celebrating' ? [0, -2, 2, -1, 1, 0] : 0
          }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ 
            type: "spring", 
            damping: 15, 
            stiffness: 300,
            rotate: { duration: 0.5, repeat: stage === 'celebrating' ? 2 : 0 }
          }}
        >
          {/* Confetti Effect */}
          {stage === 'celebrating' && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 rounded-full",
                    i % 4 === 0 ? "bg-yellow-400" :
                    i % 4 === 1 ? "bg-blue-400" :
                    i % 4 === 2 ? "bg-red-400" : "bg-green-400"
                  )}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -100, 100],
                    x: [0, Math.random() * 100 - 50],
                    rotate: [0, 360],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: Math.random() * 0.5,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>
          )}

          {/* Content */}
          <div className="text-center space-y-4">
            {/* Icon */}
            <motion.div
              className="mx-auto"
              animate={{
                scale: stage === 'celebrating' ? [1, 1.2, 1] : 1,
                rotate: stage === 'unlocking' ? [0, -10, 10, -5, 5, 0] : 0
              }}
              transition={{ 
                scale: { duration: 0.6, repeat: stage === 'celebrating' ? 3 : 0 },
                rotate: { duration: 0.8 }
              }}
            >
              <div
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center shadow-lg mx-auto",
                  `bg-gradient-to-r ${achievement.gradient}`
                )}
              >
                <ApperIcon 
                  name={achievement.icon} 
                  size={32} 
                  className="text-white" 
                />
              </div>
            </motion.div>

            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                ¡Logro Desbloqueado!
              </h2>
              <h3 className="text-lg font-semibold text-gray-800">
                {achievement.name}
              </h3>
            </motion.div>

            {/* Description */}
            <motion.p
              className="text-gray-600 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {achievement.description}
            </motion.p>

            {/* Points */}
            <motion.div
              className="flex items-center justify-center gap-2 px-4 py-2 bg-yellow-50 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring" }}
            >
              <ApperIcon name="Star" size={20} className="text-yellow-600" />
              <span className="text-yellow-800 font-semibold">
                +{achievement.points} puntos
              </span>
            </motion.div>

            {/* Celebration Message */}
            {stage === 'celebrating' && (
              <motion.div
                className="text-center"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-primary font-semibold">
                  ¡Increíble trabajo!
                </p>
              </motion.div>
            )}
          </div>

          {/* Close Button */}
          <motion.button
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            onClick={() => {
              onComplete?.();
              setStage('hidden');
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ApperIcon name="X" size={16} className="text-gray-500" />
          </motion.button>

          {/* Glow Effect */}
          <div 
            className={cn(
              "absolute inset-0 rounded-2xl blur-xl opacity-20 -z-10",
              `bg-gradient-to-r ${achievement.gradient}`
            )}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default BadgeUnlockAnimation;