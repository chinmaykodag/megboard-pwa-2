import { get, set, del } from 'idb-keyval';
import type { Sound } from '../types';

const SOUNDS_KEY_PREFIX = 'megboard-sound-';
const SOUNDS_LIST_KEY = 'megboard-sounds-list';

export const soundStorage = {
  // Save a sound to IndexedDB
  async saveSound(sound: Sound): Promise<void> {
    try {
      // Save the sound data
      await set(`${SOUNDS_KEY_PREFIX}${sound.id}`, {
        id: sound.id,
        name: sound.name,
        createdAt: sound.createdAt,
        duration: sound.duration,
      });
      
      // Save the audio blob separately
      await set(`${SOUNDS_KEY_PREFIX}${sound.id}-blob`, sound.audioBlob);
      
      // Update the sounds list
      const soundsList = await this.getSoundsList();
      const updatedList = soundsList.filter(s => s.id !== sound.id);
      updatedList.push({
        id: sound.id,
        name: sound.name,
        createdAt: sound.createdAt,
        duration: sound.duration,
      });
      await set(SOUNDS_LIST_KEY, updatedList);
    } catch (error) {
      console.error('Error saving sound:', error);
      throw new Error('Failed to save sound');
    }
  },

  // Load a specific sound from IndexedDB
  async loadSound(id: string): Promise<Sound | null> {
    try {
      const soundData = await get(`${SOUNDS_KEY_PREFIX}${id}`);
      const audioBlob = await get(`${SOUNDS_KEY_PREFIX}${id}-blob`);
      
      if (!soundData || !audioBlob) {
        return null;
      }

      return {
        id: soundData.id,
        name: soundData.name,
        audioBlob: audioBlob,
        createdAt: new Date(soundData.createdAt),
        duration: soundData.duration,
      };
    } catch (error) {
      console.error('Error loading sound:', error);
      return null;
    }
  },

  // Get list of all sounds metadata (without blobs)
  async getSoundsList(): Promise<Array<Omit<Sound, 'audioBlob'>>> {
    try {
      const soundsList = await get(SOUNDS_LIST_KEY);
      return soundsList || [];
    } catch (error) {
      console.error('Error getting sounds list:', error);
      return [];
    }
  },

  // Load all sounds from IndexedDB
  async loadAllSounds(): Promise<Sound[]> {
    try {
      const soundsList = await this.getSoundsList();
      const sounds: Sound[] = [];
      
      for (const soundMeta of soundsList) {
        const sound = await this.loadSound(soundMeta.id);
        if (sound) {
          sounds.push(sound);
        }
      }
      
      return sounds.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error loading all sounds:', error);
      return [];
    }
  },

  // Delete a sound from IndexedDB
  async deleteSound(id: string): Promise<void> {
    try {
      await del(`${SOUNDS_KEY_PREFIX}${id}`);
      await del(`${SOUNDS_KEY_PREFIX}${id}-blob`);
      
      // Update the sounds list
      const soundsList = await this.getSoundsList();
      const updatedList = soundsList.filter(s => s.id !== id);
      await set(SOUNDS_LIST_KEY, updatedList);
    } catch (error) {
      console.error('Error deleting sound:', error);
      throw new Error('Failed to delete sound');
    }
  },

  // Update sound name
  async updateSoundName(id: string, newName: string): Promise<void> {
    try {
      const soundData = await get(`${SOUNDS_KEY_PREFIX}${id}`);
      if (!soundData) {
        throw new Error('Sound not found');
      }

      // Update the sound data
      await set(`${SOUNDS_KEY_PREFIX}${id}`, {
        ...soundData,
        name: newName,
      });

      // Update the sounds list
      const soundsList = await this.getSoundsList();
      const updatedList = soundsList.map(s => 
        s.id === id ? { ...s, name: newName } : s
      );
      await set(SOUNDS_LIST_KEY, updatedList);
    } catch (error) {
      console.error('Error updating sound name:', error);
      throw new Error('Failed to update sound name');
    }
  },

  // Clear all sounds
  async clearAllSounds(): Promise<void> {
    try {
      const soundsList = await this.getSoundsList();
      
      for (const sound of soundsList) {
        await del(`${SOUNDS_KEY_PREFIX}${sound.id}`);
        await del(`${SOUNDS_KEY_PREFIX}${sound.id}-blob`);
      }
      
      await del(SOUNDS_LIST_KEY);
    } catch (error) {
      console.error('Error clearing all sounds:', error);
      throw new Error('Failed to clear sounds');
    }
  },

  // Get storage usage estimate
  async getStorageEstimate(): Promise<{ used: number; quota: number } | null> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        return {
          used: estimate.usage || 0,
          quota: estimate.quota || 0,
        };
      }
      return null;
    } catch (error) {
      console.error('Error getting storage estimate:', error);
      return null;
    }
  },
};
