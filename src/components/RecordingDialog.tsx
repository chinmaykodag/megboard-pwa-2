import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross1Icon, CheckIcon } from '@radix-ui/react-icons';

interface RecordingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, audioBlob: Blob) => void;
  audioBlob: Blob | null;
  isRecording: boolean;
  recordingTime: number;
}

export function RecordingDialog({
  isOpen,
  onClose,
  onSave,
  audioBlob,
  isRecording,
  recordingTime
}: RecordingDialogProps) {
  const [soundName, setSoundName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Generate a default name when recording stops
  useEffect(() => {
    if (audioBlob && !soundName) {
      const timestamp = new Date().toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      setSoundName(`Sound ${timestamp}`);
    }
  }, [audioBlob, soundName]);

  // Create audio element for preview
  useEffect(() => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const audioElement = new Audio(audioUrl);
      
      audioElement.onended = () => setIsPlaying(false);
      setAudio(audioElement);

      return () => {
        URL.revokeObjectURL(audioUrl);
      };
    }
  }, [audioBlob]);

  const handlePlayPreview = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSave = () => {
    if (audioBlob && soundName.trim()) {
      onSave(soundName.trim(), audioBlob);
      setSoundName('');
      onClose();
    }
  };

  const handleClose = () => {
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    setSoundName('');
    onClose();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-darker-bg border border-neon-pink/50 rounded-2xl p-6 shadow-2xl shadow-neon-pink/20 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-lucky text-white">
                {isRecording ? '🎤 Recording...' : '🎵 Save Your Sound'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-full hover:bg-neon-pink/20 transition-colors"
                >
                  <Cross1Icon className="w-5 h-5 text-white" />
                </motion.button>
              </Dialog.Close>
            </div>

            <AnimatePresence mode="wait">
              {isRecording ? (
                /* Recording State */
                <motion.div
                  key="recording"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    🎤
                  </motion.div>
                  
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-2xl font-mono text-neon-pink font-bold mb-4"
                  >
                    {formatTime(recordingTime)}
                  </motion.div>
                  
                  <p className="text-white/70 font-comic">
                    Recording in progress...
                  </p>
                </motion.div>
              ) : audioBlob ? (
                /* Save State */
                <motion.div
                  key="save"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Preview section */}
                  <div className="text-center">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePlayPreview}
                      className={`
                        w-16 h-16 rounded-full flex items-center justify-center text-2xl
                        transition-all duration-200 mx-auto mb-4
                        ${isPlaying 
                          ? 'bg-red-500 animate-pulse' 
                          : 'bg-gradient-to-br from-neon-blue to-neon-purple hover:shadow-lg hover:shadow-neon-blue/30'
                        }
                      `}
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </motion.button>
                    <p className="text-white/70 font-comic text-sm">
                      Tap to preview your recording
                    </p>
                  </div>

                  {/* Name input */}
                  <div>
                    <label className="block text-white font-comic text-sm mb-2">
                      Sound Name
                    </label>
                    <input
                      type="text"
                      value={soundName}
                      onChange={(e) => setSoundName(e.target.value)}
                      placeholder="Enter a name for your sound..."
                      className="w-full px-4 py-3 bg-dark-bg border border-neon-blue/30 rounded-lg text-white placeholder-white/50 font-comic focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/20"
                      maxLength={30}
                      autoFocus
                    />
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 bg-gray-600/50 text-white font-comic font-bold rounded-lg hover:bg-gray-600/70 transition-colors"
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSave}
                      disabled={!soundName.trim()}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-comic font-bold rounded-lg hover:shadow-lg hover:shadow-neon-pink/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <CheckIcon className="w-5 h-5" />
                      Save Sound
                    </motion.button>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
