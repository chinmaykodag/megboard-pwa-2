import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrashIcon, 
  Pencil1Icon, 
  SpeakerLoudIcon, 
  VideoIcon,
  StopIcon,
  Cross1Icon
} from '@radix-ui/react-icons';
import type { SoundButtonProps } from '../types';

export function SoundButton({ 
  sound, 
  slotIndex,
  onPlay, 
  onRename, 
  onDelete, 
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  isPlaying,
  isRecording,
  recordingTime
}: SoundButtonProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(sound?.name || '');
  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const [isLongPressing, setIsLongPressing] = useState(false);
  const longPressTimerRef = useRef<number | null>(null);
  const longPressActiveRef = useRef(false);

  const handlePlay = () => {
    if (sound) {
      onPlay(sound);
    }
  };

  const startLongPress = useCallback(() => {
    if (!sound || longPressActiveRef.current) return;
    
    longPressActiveRef.current = true;
    setIsLongPressing(true);
    longPressTimerRef.current = window.setTimeout(() => {
      if (longPressActiveRef.current) {
        setShowLongPressMenu(true);
        setIsLongPressing(false);
      }
    }, 600); // Increased to 600ms for more stability
  }, [sound]);

  const cancelLongPress = useCallback(() => {
    longPressActiveRef.current = false;
    setIsLongPressing(false);
    if (longPressTimerRef.current) {
      window.clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }, []);

  // Handle pointer events for better cross-platform support
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault(); // Prevent text selection and other default behaviors
    startLongPress();
  }, [startLongPress]);

  const handlePointerUp = useCallback(() => {
    const wasLongPress = longPressActiveRef.current && longPressTimerRef.current === null;
    cancelLongPress();
    
    // If it wasn't a long press, trigger the click
    if (!wasLongPress && !showLongPressMenu) {
      handlePlay();
    }
  }, [cancelLongPress, showLongPressMenu, handlePlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelLongPress();
    };
  }, [cancelLongPress]);

  const handleRename = () => {
    if (sound && editName.trim() && editName !== sound.name) {
      onRename(sound.id, editName.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(sound?.name || '');
      setIsEditing(false);
    }
  };

  const formatDuration = (duration?: number) => {
    if (!duration) return '';
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const formatRecordingTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Empty slot - show record button
  if (!sound) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative group"
      >
        <motion.button
          onClick={() => {
            if (isRecording) {
              onStopRecording();
            } else {
              onStartRecording(slotIndex);
            }
          }}
          className={`
            w-full h-24 rounded-2xl border-2 overflow-hidden relative
            transition-all duration-200 font-comic text-sm font-bold
            ${isRecording 
              ? 'bg-gradient-to-br from-red-500 via-red-600 to-red-700 border-red-400 animate-pulse' 
              : 'bg-gradient-to-br from-dark-bg to-darker-bg border-neon-purple/50 hover:border-neon-purple border-dashed'
            }
            shadow-lg hover:shadow-xl hover:shadow-neon-purple/20
          `}
          whileHover={{ 
            boxShadow: isRecording 
              ? '0 0 20px rgba(239, 68, 68, 0.4)' 
              : '0 0 20px rgba(168, 85, 247, 0.4)' 
          }}
          animate={isRecording ? { 
            scale: [1, 1.02, 1],
          } : {}}
          transition={{ 
            duration: 0.5, 
            repeat: isRecording ? Infinity : 0,
            repeatType: 'reverse'
          }}
        >
          {/* Background gradient overlay */}
          <div className={`absolute inset-0 ${
            isRecording 
              ? 'bg-gradient-to-br from-red-400/20 via-red-500/10 to-red-600/20' 
              : 'bg-gradient-to-br from-transparent via-neon-purple/10 to-neon-blue/10'
          }`} />
          
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 text-white">
            {isRecording ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mb-2"
                >
                  <StopIcon className="w-8 h-8 text-red-200" />
                </motion.div>
                <p className="text-red-200 text-xs font-bold">
                  {formatRecordingTime(recordingTime || 0)}
                </p>
                <p className="text-red-300 text-xs">
                  Tap to stop
                </p>
              </>
            ) : (
              <>
                <VideoIcon className="w-8 h-8 text-neon-purple mb-2" />
                <p className="text-neon-purple text-xs font-bold">
                  Slot {slotIndex + 1}
                </p>
                <p className="text-neon-purple/80 text-xs">
                  Tap to record
                </p>
              </>
            )}
          </div>

          {/* Recording pulse effect */}
          {isRecording && (
            <motion.div
              className="absolute inset-0 border-2 border-red-400 rounded-2xl"
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </motion.button>

        {/* Cancel recording button */}
        {isRecording && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onCancelRecording();
            }}
            className="absolute top-2 right-2 p-1 rounded-full bg-red-500/80 backdrop-blur-sm border border-red-400/50 z-20"
          >
            <Cross1Icon className="w-4 h-4 text-white" />
          </motion.button>
        )}
      </motion.div>
    );
  }

  // Slot with sound - show playback button
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="relative group"
    >
      <motion.button
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={cancelLongPress}
        className={`
          w-full h-24 rounded-2xl border-2 overflow-hidden relative
          transition-all duration-200 font-comic text-sm font-bold cursor-pointer
          ${isLongPressing 
            ? 'bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 border-purple-400 scale-95' 
            : isPlaying 
              ? 'bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue border-neon-yellow animate-pulse' 
              : 'bg-gradient-to-br from-dark-bg to-darker-bg border-neon-pink hover:border-neon-blue'
          }
          shadow-lg hover:shadow-xl hover:shadow-neon-pink/20
          select-none touch-manipulation
        `}
        whileHover={{ 
          boxShadow: '0 0 20px rgba(255, 0, 128, 0.4)' 
        }}
        animate={isPlaying ? { 
          scale: [1, 1.01, 1],
        } : {}}
        transition={{ 
          duration: 1, 
          repeat: isPlaying ? Infinity : 0,
          repeatType: 'reverse'
        }}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-pink/10 to-neon-blue/10" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 text-white">
          {isLongPressing && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-purple-900/20 backdrop-blur-sm rounded-2xl"
            >
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-white text-xs font-bold">Hold to edit...</p>
              </div>
            </motion.div>
          )}
          
          {isPlaying && !isLongPressing && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2"
              >
                <SpeakerLoudIcon className="w-4 h-4 text-neon-yellow" />
              </motion.div>
            </>
          )}
          
          <div className="text-center">
            {isEditing ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={handleKeyPress}
                onClick={(e) => e.stopPropagation()}
                className="bg-transparent border-b-2 border-neon-blue text-center text-white placeholder-white/50 outline-none w-full max-w-[120px]"
                autoFocus
                maxLength={30}
              />
            ) : (
              <h3 className="text-white font-bold text-base leading-tight line-clamp-2 mb-1">
                {sound.name}
              </h3>
            )}
            
            {sound.duration && (
              <p className="text-neon-blue text-xs opacity-80">
                {formatDuration(sound.duration)}
              </p>
            )}
            
            {isPlaying && (
              <p className="text-neon-yellow text-xs opacity-60 mt-1">
                Tap to stop
              </p>
            )}
            
            {!isPlaying && (
              <p className="text-neon-pink/60 text-xs opacity-60 mt-1">
                Hold to edit
              </p>
            )}
          </div>
        </div>

        {/* Floating sparkles when playing */}
        {isPlaying && (
          <>
            {Array.from({ length: 3 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-neon-yellow rounded-full"
                initial={{ 
                  x: Math.random() * 100 + '%', 
                  y: '100%',
                  opacity: 0 
                }}
                animate={{ 
                  y: '-10%',
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: 'easeOut'
                }}
              />
            ))}
          </>
        )}
      </motion.button>

      {/* Long press options menu */}
      {showLongPressMenu && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowLongPressMenu(false)}
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="bg-darker-bg/95 backdrop-blur-md rounded-2xl border border-neon-pink/50 p-6 mx-4 min-w-[280px] shadow-xl shadow-neon-pink/20"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-bold text-lg mb-4 text-center font-comic">
              {sound.name}
            </h3>
            
            <div className="space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-white rounded-xl bg-neon-blue/20 hover:bg-neon-blue/30 border border-neon-blue/50 transition-all"
                onClick={() => {
                  setIsEditing(true);
                  setShowLongPressMenu(false);
                }}
              >
                <Pencil1Icon className="w-5 h-5 text-neon-blue" />
                <span className="font-comic font-bold">Rename</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-white rounded-xl bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 transition-all"
                onClick={() => {
                  onStartRecording(slotIndex);
                  setShowLongPressMenu(false);
                }}
              >
                <VideoIcon className="w-5 h-5 text-neon-purple" />
                <span className="font-comic font-bold">Re-record</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-300 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 transition-all"
                onClick={() => {
                  onDelete(sound.id);
                  setShowLongPressMenu(false);
                }}
              >
                <TrashIcon className="w-5 h-5 text-red-400" />
                <span className="font-comic font-bold">Clear slot</span>
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full mt-4 px-4 py-2 text-sm text-white/70 rounded-xl bg-dark-bg/50 hover:bg-dark-bg/70 border border-white/20 transition-all font-comic"
              onClick={() => setShowLongPressMenu(false)}
            >
              Cancel
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Old dropdown menu - remove this entire section */}
    </motion.div>
  );
}
