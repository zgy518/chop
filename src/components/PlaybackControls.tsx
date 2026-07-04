"use client";

import { useRef, useCallback } from "react";

interface PlaybackControlsProps {
  file: File | null;
  startTime: number;
  endTime: number;
  isPlaying: boolean;
  currentTime: number;
  onPlayStateChange: (playing: boolean) => void;
  onTimeUpdate: (time: number) => void;
  disabled?: boolean;
}

export function PlaybackControls({
  file,
  startTime,
  endTime,
  isPlaying,
  currentTime,
  onPlayStateChange,
  onTimeUpdate,
  disabled,
}: PlaybackControlsProps) {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | null>(null);
  const startRef = useRef<number>(0);
  const offsetRef = useRef<number>(0);
  const rafRef = useRef<number>(0);

  const stopPlayback = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* already stopped */ }
      sourceRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }
    onPlayStateChange(false);
  }, [onPlayStateChange]);

  const updateTime = useCallback(() => {
    if (!audioCtxRef.current) return;
    const elapsed = audioCtxRef.current.currentTime - startRef.current;
    const time = offsetRef.current + elapsed;
    onTimeUpdate(time);

    if (time >= endTime) {
      stopPlayback();
      onTimeUpdate(startTime);
    } else {
      rafRef.current = requestAnimationFrame(updateTime);
    }
  }, [endTime, startTime, onTimeUpdate, stopPlayback]);

  const handlePlayPause = useCallback(async () => {
    if (!file) return;

    if (isPlaying) {
      stopPlayback();
      return;
    }

    // Stop existing playback
    if (sourceRef.current) {
      try { sourceRef.current.stop(); } catch { /* ok */ }
    }

    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext();
    }

    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") await ctx.resume();

    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const offset = currentTime > startTime ? currentTime : startTime;
    source.start(0, offset, endTime - offset);

    startRef.current = ctx.currentTime;
    offsetRef.current = offset;
    sourceRef.current = source;

    source.onended = () => {
      stopPlayback();
      onTimeUpdate(startTime);
    };

    onPlayStateChange(true);
    rafRef.current = requestAnimationFrame(updateTime);
  }, [file, isPlaying, startTime, endTime, currentTime, onPlayStateChange, onTimeUpdate, stopPlayback, updateTime]);

  const handleZoomIn = () => {
    // Handled by parent via zoomLevel
  };

  const handleZoomOut = () => {
    // Handled by parent via zoomLevel
  };

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handlePlayPause}
        disabled={disabled || !file}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500 text-white
          hover:bg-indigo-600 active:scale-[0.95] transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPlaying ? (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>

      <button
        onClick={handleZoomOut}
        disabled={disabled}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-600
          hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Zoom -
      </button>
      <button
        onClick={handleZoomIn}
        disabled={disabled}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm text-zinc-600
          hover:bg-zinc-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        Zoom +
      </button>
    </div>
  );
}
