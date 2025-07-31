import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from './components/Header';
import { SoundGrid } from './components/SoundGrid';
import { soundStorage } from './utils/storage';
import { audioPlayer, audioRecorder } from './utils/audio';
import { confettiEffects } from './utils/confetti';
import type { Sound } from './types';
import * as Toast from '@radix-ui/react-toast';

function App() {
  const [sounds, setSounds] = useState<Sound[]>([]);
  const [currentlyPlayingSound, setCurrentlyPlayingSound] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSlotId, setRecordingSlotId] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [storageUsed, setStorageUsed] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState(false);

  // Create a fixed grid of 12 slots (3x4 grid)
  const GRID_SIZE = 12;
  const soundSlots = Array.from({ length: GRID_SIZE }, (_, index) => {
    const existingSound = sounds.find(sound => sound.id === `slot-${index}`);
    return existingSound || null;
  });

  // Load sounds on app start
  useEffect(() => {
    loadSounds();
    updateStorageInfo();
  }, []);

  // Recording timer
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const loadSounds = async () => {
    try {
      setIsLoading(true);
      const loadedSounds = await soundStorage.loadAllSounds();
      
      // Filter to only include slot-based sounds (new system)
      // and legacy sounds (old system) that we can migrate
      const slotSounds = loadedSounds.filter(sound => sound.id.startsWith('slot-'));
      const legacySounds = loadedSounds.filter(sound => !sound.id.startsWith('slot-'));
      
      // Migrate legacy sounds to available slots
      const migratedSounds = [...slotSounds];
      let nextSlot = 0;
      
      for (const legacySound of legacySounds.slice(0, GRID_SIZE - slotSounds.length)) {
        // Find next available slot
        while (migratedSounds.find(s => s.id === `slot-${nextSlot}`) && nextSlot < GRID_SIZE) {
          nextSlot++;
        }
        
        if (nextSlot < GRID_SIZE) {
          // Migrate the sound to a slot
          const migratedSound = {
            ...legacySound,
            id: `slot-${nextSlot}`
          };
          
          // Save the migrated sound and delete the old one
          await soundStorage.saveSound(migratedSound);
          await soundStorage.deleteSound(legacySound.id);
          
          migratedSounds.push(migratedSound);
          nextSlot++;
        }
      }
      
      setSounds(migratedSounds);
    } catch (error) {
      console.error('Error loading sounds:', error);
      showToastMessage('Failed to load sounds');
    } finally {
      setIsLoading(false);
    }
  };

  const updateStorageInfo = async () => {
    const estimate = await soundStorage.getStorageEstimate();
    if (estimate) {
      const usedMB = (estimate.used / (1024 * 1024)).toFixed(1);
      setStorageUsed(`${usedMB} MB`);
    }
  };

  const showToastMessage = (message: string) => {
    setToastMessage(message);
    setShowToast(true);
  };

  const handleStartRecording = async (slotIndex: number) => {
    try {
      setIsRecording(true);
      setRecordingSlotId(`slot-${slotIndex}`);
      setRecordingTime(0);
      await audioRecorder.startRecording();
      showToastMessage('Recording started...');
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setRecordingSlotId(null);
      showToastMessage(error instanceof Error ? error.message : 'Failed to start recording');
    }
  };

  const handleStopRecording = async () => {
    if (!recordingSlotId) return;
    
    try {
      const audioBlob = await audioRecorder.stopRecording();
      await handleSaveSound(`Sound ${recordingSlotId.split('-')[1]}`, audioBlob, recordingSlotId);
      setIsRecording(false);
      setRecordingSlotId(null);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setIsRecording(false);
      setRecordingSlotId(null);
      showToastMessage('Failed to stop recording');
    }
  };

  const handleCancelRecording = () => {
    audioRecorder.cancelRecording();
    setIsRecording(false);
    setRecordingSlotId(null);
    setRecordingTime(0);
    showToastMessage('Recording cancelled');
  };

  const handleSaveSound = async (name: string, audioBlob: Blob, slotId: string) => {
    try {
      const duration = await audioPlayer.getAudioDuration(audioBlob);
      const newSound: Sound = {
        id: slotId,
        name,
        audioBlob,
        createdAt: new Date(),
        duration,
      };

      await soundStorage.saveSound(newSound);
      setSounds(prev => {
        const filtered = prev.filter(sound => sound.id !== slotId);
        return [...filtered, newSound];
      });
      updateStorageInfo();
      confettiEffects.newSound();
      showToastMessage(`Sound "${name}" saved successfully!`);
    } catch (error) {
      console.error('Error saving sound:', error);
      showToastMessage('Failed to save sound');
    }
  };

  const handlePlaySound = async (sound: Sound) => {
    try {
      // Stop any currently playing sound
      if (currentlyPlayingSound) {
        audioPlayer.stopSound();
        setCurrentlyPlayingSound(null);
      }

      // If clicking the same sound that was playing, just stop
      if (currentlyPlayingSound === sound.id) {
        return;
      }

      setCurrentlyPlayingSound(sound.id);
      await audioPlayer.playSound(sound.audioBlob, sound.id);

      // Auto-clear the playing state when sound ends
      // This is handled in the audio player's onended callback
      setTimeout(() => {
        if (audioPlayer.getCurrentlyPlayingSound() === null) {
          setCurrentlyPlayingSound(null);
        }
      }, (sound.duration || 5) * 1000);
    } catch (error) {
      console.error('Error playing sound:', error);
      setCurrentlyPlayingSound(null);
      showToastMessage('Failed to play sound');
    }
  };

  const handleRenameSound = async (id: string, newName: string) => {
    try {
      await soundStorage.updateSoundName(id, newName);
      setSounds(prev => prev.map(sound => 
        sound.id === id ? { ...sound, name: newName } : sound
      ));
      showToastMessage('Sound renamed successfully!');
    } catch (error) {
      console.error('Error renaming sound:', error);
      showToastMessage('Failed to rename sound');
    }
  };

  const handleDeleteSound = async (id: string) => {
    try {
      // Stop playing if this sound is currently playing
      if (currentlyPlayingSound === id) {
        audioPlayer.stopSound();
        setCurrentlyPlayingSound(null);
      }

      await soundStorage.deleteSound(id);
      setSounds(prev => prev.filter(sound => sound.id !== id));
      updateStorageInfo();
      showToastMessage('Sound cleared from slot');
    } catch (error) {
      console.error('Error deleting sound:', error);
      showToastMessage('Failed to clear slot');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-darker-bg flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          🎵
        </motion.div>
      </div>
    );
  }

  return (
    <Toast.Provider swipeDirection="right">
      <div className="min-h-screen bg-gradient-to-br from-dark-bg to-darker-bg">
        <Header 
          soundCount={sounds.length} 
          storageUsed={storageUsed}
        />

        <main className="min-h-[calc(100vh-80px)]">
          <SoundGrid
            soundSlots={soundSlots}
            currentlyPlayingSound={currentlyPlayingSound}
            isRecording={isRecording}
            recordingSlotId={recordingSlotId}
            recordingTime={recordingTime}
            onPlaySound={handlePlaySound}
            onRenameSound={handleRenameSound}
            onDeleteSound={handleDeleteSound}
            onStartRecording={handleStartRecording}
            onStopRecording={handleStopRecording}
            onCancelRecording={handleCancelRecording}
          />
        </main>

        {/* Toast notifications */}
        <Toast.Root
          className="bg-darker-bg/90 backdrop-blur-md border border-neon-blue/50 rounded-lg p-4 shadow-xl shadow-neon-blue/20"
          open={showToast}
          onOpenChange={setShowToast}
        >
          <Toast.Title className="text-white font-comic font-bold">
            {toastMessage}
          </Toast.Title>
        </Toast.Root>

        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
      </div>
    </Toast.Provider>
  );
}

export default App;
