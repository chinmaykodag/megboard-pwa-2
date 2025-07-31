import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, StopIcon, Cross1Icon } from '@radix-ui/react-icons';

interface FloatingActionButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  isRecording: boolean;
  recordingTime: number;
}

export function FloatingActionButton({ 
  onStartRecording, 
  onStopRecording, 
  onCancelRecording,
  isRecording,
  recordingTime 
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Recording indicator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-end gap-3"
        >
          {/* Recording time display */}
          <motion.div
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="bg-red-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full font-mono text-sm font-bold shadow-lg"
          >
            🔴 {formatTime(recordingTime)}
          </motion.div>

          {/* Control buttons */}
          <div className="flex gap-3">
            {/* Cancel button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onCancelRecording}
              className="w-12 h-12 bg-gray-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-gray-500/90 transition-colors"
            >
              <Cross1Icon className="w-5 h-5 text-white" />
            </motion.button>

            {/* Stop recording button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onStopRecording}
              className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30"
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(239, 68, 68, 0.3)',
                  '0 0 30px rgba(239, 68, 68, 0.5)',
                  '0 0 20px rgba(239, 68, 68, 0.3)'
                ]
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <StopIcon className="w-6 h-6 text-white" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 mb-2"
          >
            <motion.button
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                onStartRecording();
                setIsExpanded(false);
              }}
              className="flex items-center gap-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl hover:shadow-neon-pink/30 transition-shadow font-comic font-bold text-sm"
            >
              <span className="text-lg">🎤</span>
              Record Sound
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          w-16 h-16 rounded-full flex items-center justify-center shadow-xl
          bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue
          hover:shadow-2xl hover:shadow-neon-pink/40 transition-all duration-300
          ${isExpanded ? 'rotate-45' : 'rotate-0'}
        `}
        animate={{ 
          rotate: isExpanded ? 45 : 0,
          background: isExpanded 
            ? 'linear-gradient(135deg, #00ffff 0%, #ff0080 100%)'
            : 'linear-gradient(135deg, #ff0080 0%, #8000ff 50%, #00ffff 100%)'
        }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? -45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <PlusIcon className="w-8 h-8 text-white" />
        </motion.div>
      </motion.button>

      {/* Floating sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-yellow rounded-full"
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeInOut',
            }}
            style={{
              left: '50%',
              top: '50%',
            }}
          />
        ))}
      </div>
    </div>
  );
}
