import type { AudioRecorderState } from '../types';

export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private playingSources: Map<string, AudioBufferSourceNode> = new Map();

  constructor() {
    // Initialize AudioContext lazily to avoid autoplay policy issues
  }

  private async getAudioContext(): Promise<AudioContext> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
    
    return this.audioContext;
  }

  async playSound(audioBlob: Blob, soundId: string): Promise<void> {
    try {
      // Stop any currently playing instance of this specific sound
      this.stopSound(soundId);
      
      const audioContext = await this.getAudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      
      // Track this playing source
      this.playingSources.set(soundId, source);
      
      // Play the sound
      source.start(0);
      
      // Clean up when finished
      source.onended = () => {
        this.playingSources.delete(soundId);
      };
    } catch (error) {
      console.error('Error playing sound:', error);
      throw new Error('Failed to play sound');
    }
  }

  stopSound(soundId?: string): void {
    if (soundId) {
      // Stop a specific sound
      const source = this.playingSources.get(soundId);
      if (source) {
        try {
          source.stop();
        } catch (error) {
          // Ignore errors when stopping (might already be stopped)
        }
        this.playingSources.delete(soundId);
      }
    } else {
      // Stop all sounds
      for (const [, source] of this.playingSources) {
        try {
          source.stop();
        } catch (error) {
          // Ignore errors when stopping (might already be stopped)
        }
      }
      this.playingSources.clear();
    }
  }

  isPlaying(soundId?: string): boolean {
    if (soundId) {
      return this.playingSources.has(soundId);
    }
    return this.playingSources.size > 0;
  }

  getCurrentlyPlayingSound(): string | null {
    // For backward compatibility, return the first playing sound or null
    const playingSounds = Array.from(this.playingSources.keys());
    return playingSounds.length > 0 ? playingSounds[0] : null;
  }

  getCurrentlyPlayingSounds(): string[] {
    return Array.from(this.playingSources.keys());
  }

  async getAudioDuration(audioBlob: Blob): Promise<number> {
    try {
      const audioContext = await this.getAudioContext();
      const arrayBuffer = await audioBlob.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer.duration;
    } catch (error) {
      console.error('Error getting audio duration:', error);
      return 0;
    }
  }
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;

  async startRecording(): Promise<AudioRecorderState> {
    try {
      // Request microphone permission
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      });

      // Create MediaRecorder
      const options: MediaRecorderOptions = {};
      
      // Try to use a high-quality codec
      if (MediaRecorder.isTypeSupported('audio/webm; codecs=opus')) {
        options.mimeType = 'audio/webm; codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        options.mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        options.mimeType = 'audio/webm';
      }

      this.mediaRecorder = new MediaRecorder(this.stream, options);
      this.audioChunks = [];

      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start recording
      this.mediaRecorder.start(100); // Collect data every 100ms

      return {
        isRecording: true,
        isPaused: false,
        recordingTime: 0,
        mediaRecorder: this.mediaRecorder,
        audioChunks: this.audioChunks,
      };
    } catch (error) {
      console.error('Error starting recording:', error);
      if (error instanceof Error && error.name === 'NotAllowedError') {
        throw new Error('Microphone permission denied');
      }
      throw new Error('Failed to start recording');
    }
  }

  pauseRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.pause();
    }
  }

  resumeRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
      this.mediaRecorder.resume();
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        try {
          // Create the final audio blob
          const audioBlob = new Blob(this.audioChunks, { 
            type: this.mediaRecorder?.mimeType || 'audio/webm' 
          });
          
          // Clean up
          this.cleanup();
          
          resolve(audioBlob);
        } catch (error) {
          reject(new Error('Failed to create audio blob'));
        }
      };

      this.mediaRecorder.stop();
    });
  }

  cancelRecording(): void {
    this.cleanup();
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  getRecordingState(): AudioRecorderState | null {
    if (!this.mediaRecorder) {
      return null;
    }

    return {
      isRecording: this.mediaRecorder.state === 'recording',
      isPaused: this.mediaRecorder.state === 'paused',
      recordingTime: 0, // This would need to be tracked separately with a timer
      mediaRecorder: this.mediaRecorder,
      audioChunks: this.audioChunks,
    };
  }

  static async checkMicrophonePermission(): Promise<'granted' | 'denied' | 'prompt'> {
    try {
      if (!navigator.permissions) {
        // Fallback for browsers that don't support permissions API
        return 'prompt';
      }
      
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      return result.state;
    } catch (error) {
      console.error('Error checking microphone permission:', error);
      return 'prompt';
    }
  }
}

// Export singleton instances
export const audioPlayer = new AudioPlayer();
export const audioRecorder = new AudioRecorder();
