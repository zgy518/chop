/**
 * Format bytes to human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Format seconds to mm:ss or hh:mm:ss
 */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  if (h > 0) {
    return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  }
  return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(3, "0").slice(0, 2)}`;
}

/**
 * Calculate size reduction percentage
 */
export function reductionPercent(original: number, compressed: number): number {
  if (original === 0) return 0;
  return Math.round(((original - compressed) / original) * 100);
}

/**
 * Validate if file is an acceptable audio type
 */
const VALID_AUDIO_TYPES = [
  "audio/mpeg",
  "audio/mp3",
  "audio/wav",
  "audio/x-wav",
  "audio/wave",
  "audio/flac",
  "audio/x-flac",
  "audio/aac",
  "audio/ogg",
  "audio/x-m4a",
  "audio/mp4",
  "audio/x-mp4",
];

export function isValidAudioType(file: File): boolean {
  // Also accept files with audio/ in the MIME type
  if (file.type.startsWith("audio/")) return true;
  // Check extension fallback for browsers that don't set MIME correctly
  const ext = file.name.split(".").pop()?.toLowerCase();
  const audioExtensions = ["mp3", "wav", "flac", "aac", "ogg", "m4a", "opus"];
  return audioExtensions.includes(ext || "");
}

/**
 * Validate if file is an acceptable video type (for audio extraction)
 */
const VALID_VIDEO_TYPES = [
  "video/mp4",
  "video/x-matroska", // MKV
  "video/quicktime", // MOV
  "video/webm",
];

export function isValidVideoType(file: File): boolean {
  if (file.type.startsWith("video/")) return true;
  // Check extension fallback
  const ext = file.name.split(".").pop()?.toLowerCase();
  const videoExtensions = ["mp4", "mkv", "mov", "webm"];
  return videoExtensions.includes(ext || "");
}

/**
 * Generate unique ID for audio queue items
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Get file extension from MIME type or filename
 */
export function getOutputExtension(format: string): string {
  const map: Record<string, string> = {
    mp3: "mp3",
    wav: "wav",
    flac: "flac",
    aac: "m4a",
    ogg: "ogg",
    m4a: "m4a",
  };
  return map[format] || format;
}
