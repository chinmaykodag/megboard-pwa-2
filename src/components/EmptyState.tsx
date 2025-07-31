import { motion } from 'framer-motion';

interface EmptyStateProps {
  onStartRecording: () => void;
}

export function EmptyState({ onStartRecording }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[400px] text-center px-6"
    >
      {/* Animated illustration */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="text-8xl mb-8"
      >
        🎵
      </motion.div>

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-3xl font-lucky text-white mb-4"
      >
        Your soundboard is empty!
      </motion.h2>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="text-white/70 font-comic text-lg max-w-md mb-8 leading-relaxed"
      >
        Record your first sound using the microphone button to get started. 
        Create funny sound effects, voice memos, or whatever makes you happy! 🎤
      </motion.p>

      {/* Action button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: '0 0 30px rgba(255, 0, 128, 0.4)'
        }}
        whileTap={{ scale: 0.95 }}
        onClick={onStartRecording}
        className="bg-gradient-to-r from-neon-pink to-neon-purple text-white font-comic font-bold text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        🎤 Record Your First Sound
      </motion.button>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl opacity-20"
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              rotate: [0, 360],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 8 + Math.random() * 4,
              repeat: Infinity,
              delay: i * 1.2,
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          >
            {['🎵', '🎤', '🔊', '🎧', '🎶', '📢'][i]}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
