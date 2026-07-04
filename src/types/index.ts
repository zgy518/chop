// Audio toolkit types

export type ToolTab = "convert" | "trim" | "merge" | "extract";

export type OutputFormat = "mp3" | "wav" | "flac" | "aac" | "ogg" | "m4a";

export interface AudioResult {
  blob: Blob;
  size: number;
  format: string; // MIME type, e.g., "audio/mpeg"
  downloadName: string;
}

export interface AudioFile {
  id: string;
  file: File;
  originalName: string;
  originalSize: number;
  duration: number; // seconds, 0 until decoded
  status: "idle" | "loading" | "processing" | "done" | "error";
  result?: AudioResult;
  error?: string;
}

export interface ConvertOptions {
  format: OutputFormat;
  bitrate?: string; // e.g., "128k", "192k", "320k"
}

export interface TrimState {
  duration: number;
  startTime: number;
  endTime: number;
  isPlaying: boolean;
  currentTime: number;
  zoomLevel: number; // 1, 2, 4, 8
}

export interface MergeItem {
  id: string;
  file: File;
  name: string;
  order: number;
}

export interface WaveformData {
  samples: Float32Array;
  sampleRate: number;
  duration: number;
  channels: number;
}

export interface FfmpegLoadState {
  loaded: boolean;
  progress: number; // 0-100
  loading: boolean;
}
