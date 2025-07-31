import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  DotsHorizontalIcon, 
  TrashIcon, 
  Pencil1Icon, 
  SpeakerLoudIcon, 
  VideoIcon,
  StopIcon,
  Cross1Icon
} from '@radix-ui/react-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import type { SoundButtonProps } from '../types';
import { confettiEffects } from '../utils/confetti';

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

  const handlePlay = () => {
    if (sound) {
      onPlay(sound);
      confettiEffects.playSound();
    }
  };

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
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group"
    >
      <motion.button
        onClick={handlePlay}
        disabled={isPlaying}
        className={`
          w-full h-24 rounded-2xl border-2 overflow-hidden relative
          transition-all duration-200 font-comic text-sm font-bold
          ${isPlaying 
            ? 'bg-gradient-to-br from-neon-pink via-neon-purple to-neon-blue border-neon-yellow animate-pulse' 
            : 'bg-gradient-to-br from-dark-bg to-darker-bg border-neon-pink hover:border-neon-blue'
          }
          shadow-lg hover:shadow-xl hover:shadow-neon-pink/20
          disabled:cursor-not-allowed
        `}
        whileHover={{ 
          boxShadow: '0 0 20px rgba(255, 0, 128, 0.4)' 
        }}
        animate={isPlaying ? { 
          scale: [1, 1.02, 1],
          rotate: [0, 1, -1, 0],
        } : {}}
        transition={{ 
          duration: 0.5, 
          repeat: isPlaying ? Infinity : 0,
          repeatType: 'reverse'
        }}
      >
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-neon-pink/10 to-neon-blue/10" />
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center p-3 text-white">
          {isPlaying && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2"
            >
              <SpeakerLoudIcon className="w-4 h-4 text-neon-yellow" />
            </motion.div>
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

      {/* Options menu */}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2 left-2 p-1 rounded-full bg-dark-bg/80 backdrop-blur-sm border border-neon-pink/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <DotsHorizontalIcon className="w-4 h-4 text-neon-pink" />
          </motion.button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="min-w-[180px] bg-darker-bg/95 backdrop-blur-md rounded-xl border border-neon-pink/50 p-2 shadow-xl shadow-neon-pink/20 z-50"
            sideOffset={5}
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-white rounded-lg hover:bg-neon-blue/20 hover:text-neon-blue cursor-pointer outline-none"
              onSelect={() => setIsEditing(true)}
            >
              <Pencil1Icon className="w-4 h-4" />
              Rename
            </DropdownMenu.Item>
            
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-neon-purple rounded-lg hover:bg-neon-purple/20 hover:text-neon-purple cursor-pointer outline-none"
              onSelect={() => onStartRecording(slotIndex)}
            >
              <VideoIcon className="w-4 h-4" />
              Re-record
            </DropdownMenu.Item>
            
            <DropdownMenu.Separator className="h-px bg-neon-pink/20 my-1" />
            
            <DropdownMenu.Item
              className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 rounded-lg hover:bg-red-500/20 hover:text-red-300 cursor-pointer outline-none"
              onSelect={() => {
                onDelete(sound.id);
                confettiEffects.deleteSound();
              }}
            >
              <TrashIcon className="w-4 h-4" />
              Clear slot
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </motion.div>
  );
}
