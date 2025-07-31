export interface Sound {
  id: string;
  name: string;
  audioBlob: Blob;
  createdAt: Date;
  duration?: number;
}

export interface SoundButtonProps {
  sound: Sound | null;
  slotIndex: number;
  onPlay: (sound: Sound) => void;
  onRename: (id: string, newName: string) => void;
  onDelete: (id: string) => void;
  onStartRecording: (slotIndex: number) => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  isPlaying?: boolean;
  isRecording?: boolean;
  recordingTime?: number;
}

export interface AudioRecorderState {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime: number;
  mediaRecorder: MediaRecorder | null;
  audioChunks: Blob[];
}
