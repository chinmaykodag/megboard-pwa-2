import { motion, AnimatePresence } from 'framer-motion';
import { SoundButton } from './SoundButton';
import type { Sound } from '../types';

interface SoundGridProps {
  soundSlots: (Sound | null)[];
  currentlyPlayingSound: string[];
  isRecording: boolean;
  recordingSlotId: string | null;
  recordingTime: number;
  onPlaySound: (sound: Sound) => void;
  onRenameSound: (id: string, newName: string) => void;
  onDeleteSound: (id: string) => void;
  onStartRecording: (slotIndex: number) => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
}

export function SoundGrid({ 
  soundSlots,
  currentlyPlayingSound, 
  isRecording,
  recordingSlotId,
  recordingTime,
  onPlaySound, 
  onRenameSound, 
  onDeleteSound,
  onStartRecording,
  onStopRecording,
  onCancelRecording
}: SoundGridProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <motion.div
        layout
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-4 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {soundSlots.map((sound, index) => (
            <motion.div
              key={`slot-${index}`}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, rotateX: 90 }}
              transition={{ duration: 0.3 }}
            >
              <SoundButton
                sound={sound}
                slotIndex={index}
                onPlay={onPlaySound}
                onRename={onRenameSound}
                onDelete={onDeleteSound}
                onStartRecording={onStartRecording}
                onStopRecording={onStopRecording}
                onCancelRecording={onCancelRecording}
                isPlaying={sound ? currentlyPlayingSound.includes(sound.id) : false}
                isRecording={isRecording && recordingSlotId === `slot-${index}`}
                recordingTime={recordingTime}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Add some breathing room at the bottom */}
      <div className="h-8" />
    </div>
  );
}
