"use client";

import { formatDuration } from "@/lib/format";
import type { OutputFormat } from "@/types";

interface TrimControlsProps {
  startTime: number;
  endTime: number;
  outputFormat: OutputFormat;
  onOutputFormatChange: (format: OutputFormat) => void;
  fadeIn: number;
  onFadeInChange: (seconds: number) => void;
  fadeOut: number;
  onFadeOutChange: (seconds: number) => void;
  onTrim: () => void;
  isProcessing: boolean;
  disabled?: boolean;
}

export function TrimControls({
  startTime,
  endTime,
  outputFormat,
  onOutputFormatChange,
  fadeIn,
  onFadeInChange,
  fadeOut,
  onFadeOutChange,
  onTrim,
  isProcessing,
  disabled,
}: TrimControlsProps) {
  const selectionDuration = endTime - startTime;

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-zinc-500">Selection</span>
          <span className="text-sm font-medium text-zinc-900 tabular-nums">
            {formatDuration(startTime)} — {formatDuration(endTime)}
          </span>
          <span className="text-xs text-zinc-400">
            Duration: {formatDuration(selectionDuration)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-zinc-700">Output</label>
          <select
            value={outputFormat}
            onChange={(e) => onOutputFormatChange(e.target.value as OutputFormat)}
            disabled={disabled || isProcessing}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
              focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="mp3">MP3</option>
            <option value="wav">WAV</option>
            <option value="flac">FLAC</option>
            <option value="aac">AAC (M4A)</option>
            <option value="ogg">OGG</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Fade in</label>
          <select
            value={fadeIn}
            onChange={(e) => onFadeInChange(Number(e.target.value))}
            disabled={disabled || isProcessing}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
              focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={0}>None</option>
            <option value={0.5}>0.5s</option>
            <option value={1}>1s</option>
            <option value={2}>2s</option>
            <option value={3}>3s</option>
            <option value={5}>5s</option>
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-zinc-500">Fade out</label>
          <select
            value={fadeOut}
            onChange={(e) => onFadeOutChange(Number(e.target.value))}
            disabled={disabled || isProcessing}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
              focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value={0}>None</option>
            <option value={0.5}>0.5s</option>
            <option value={1}>1s</option>
            <option value={2}>2s</option>
            <option value={3}>3s</option>
            <option value={5}>5s</option>
          </select>
        </div>

        <button
          onClick={onTrim}
          disabled={disabled || isProcessing || startTime >= endTime}
          className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white
            hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing ? "Trimming..." : "Trim & Download"}
        </button>
      </div>
    </div>
  );
}
