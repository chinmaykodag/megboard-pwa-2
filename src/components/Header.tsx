import { motion } from 'framer-motion';
import { HamburgerMenuIcon, SpeakerLoudIcon, ArchiveIcon } from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

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
            </div>
          </motion.div>

          {/* Menu Button */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-dark-bg/60 backdrop-blur-sm border border-neon-pink/30 hover:border-neon-pink/60 transition-colors"
              >
                <HamburgerMenuIcon className="w-5 h-5 text-neon-pink" />
              </motion.button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[200px] bg-darker-bg/95 backdrop-blur-md rounded-xl border border-neon-pink/50 p-3 shadow-xl shadow-neon-pink/20 z-50"
                sideOffset={5}
                align="end"
              >
                <DropdownMenu.Label className="px-2 py-1 text-xs font-comic text-white/60 uppercase tracking-wide">
                  Statistics
                </DropdownMenu.Label>
                
                <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg hover:bg-neon-blue/20 hover:text-neon-blue cursor-pointer outline-none">
                  <SpeakerLoudIcon className="w-4 h-4 text-neon-blue" />
                  <span className="font-comic">
                    <span className="text-neon-blue font-bold">{soundCount}</span> sounds
                  </span>
                </DropdownMenu.Item>
                
                {storageUsed && (
                  <DropdownMenu.Item className="flex items-center gap-3 px-3 py-2 text-sm text-white rounded-lg hover:bg-neon-green/20 hover:text-neon-green cursor-pointer outline-none">
                    <ArchiveIcon className="w-4 h-4 text-neon-green" />
                    <span className="font-comic">
                      <span className="text-neon-green font-bold">{storageUsed}</span> used
                    </span>
                  </DropdownMenu.Item>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
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
