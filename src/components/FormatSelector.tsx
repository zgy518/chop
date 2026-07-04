"use client";

import type { OutputFormat } from "@/types";

interface FormatSelectorProps {
  value: OutputFormat;
  onChange: (format: OutputFormat) => void;
  disabled?: boolean;
}

const FORMATS: { value: OutputFormat; label: string }[] = [
  { value: "mp3", label: "MP3" },
  { value: "wav", label: "WAV" },
  { value: "flac", label: "FLAC" },
  { value: "aac", label: "AAC (M4A)" },
  { value: "ogg", label: "OGG" },
  { value: "m4a", label: "M4A" },
];

export function FormatSelector({ value, onChange, disabled }: FormatSelectorProps) {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-zinc-700">Output format</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OutputFormat)}
        disabled={disabled}
        className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
          focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {FORMATS.map((f) => (
          <option key={f.value} value={f.value}>
            {f.label}
          </option>
        ))}
      </select>
    </div>
  );
}
