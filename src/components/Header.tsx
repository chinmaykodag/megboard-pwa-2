import { motion } from 'framer-motion';

interface HeaderProps {
  soundCount: number;
  storageUsed?: string;
}

export function Header({ soundCount, storageUsed }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-darker-bg/80 backdrop-blur-md border-b border-neon-pink/20"
    >
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and title */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3"
          >
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
              className="text-3xl"
            >
              📢
            </motion.div>
            <div>
              <h1 className="text-2xl font-lucky bg-gradient-to-r from-neon-pink via-neon-purple to-neon-blue bg-clip-text text-transparent">
                MegBoard
              </h1>
              <p className="text-sm text-white/60 font-comic">
                Fun Soundboard PWA
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-dark-bg/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-neon-blue/30"
            >
              <span className="text-white/80 font-comic">
                <span className="text-neon-blue font-bold">{soundCount}</span> sounds
              </span>
            </motion.div>
            
            {storageUsed && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-dark-bg/60 backdrop-blur-sm px-3 py-2 rounded-lg border border-neon-green/30"
              >
                <span className="text-white/80 font-comic">
                  <span className="text-neon-green font-bold">{storageUsed}</span> used
                </span>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Animated underline */}
      <motion.div
        className="h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scaleX: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.header>
  );
}
