"use client";

interface ConversionControlsProps {
  bitrate: string;
  onBitrateChange: (bitrate: string) => void;
  normalize: boolean;
  onNormalizeChange: (normalize: boolean) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onConvert: () => void;
  disabled?: boolean;
  isProcessing?: boolean;
  hasFiles: boolean;
}

const BITRATE_PRESETS = [
  { value: "128k", label: "Standard (128 kbps)" },
  { value: "192k", label: "High (192 kbps)" },
  { value: "320k", label: "Best (320 kbps)" },
];

const SPEED_PRESETS = [
  { value: 0.5, label: "0.5x" },
  { value: 0.75, label: "0.75x" },
  { value: 1.0, label: "1x" },
  { value: 1.25, label: "1.25x" },
  { value: 1.5, label: "1.5x" },
  { value: 2.0, label: "2x" },
];

export function ConversionControls({
  bitrate,
  onBitrateChange,
  normalize,
  onNormalizeChange,
  speed,
  onSpeedChange,
  onConvert,
  disabled,
  isProcessing,
  hasFiles,
}: ConversionControlsProps) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">Quality</label>
        <select
          value={bitrate}
          onChange={(e) => onBitrateChange(e.target.value)}
          disabled={disabled || isProcessing}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
            focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {BITRATE_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-zinc-700">Speed</label>
        <select
          value={speed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          disabled={disabled || isProcessing}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
            focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
            disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {SPEED_PRESETS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <label className="flex items-center gap-2 pb-2 text-sm text-zinc-600 cursor-pointer select-none">
        <input
          type="checkbox"
          checked={normalize}
          onChange={(e) => onNormalizeChange(e.target.checked)}
          disabled={disabled || isProcessing}
          className="h-4 w-4 rounded border-zinc-300 text-indigo-500 focus:ring-indigo-500
            disabled:opacity-50"
        />
        Normalize volume
      </label>

      <button
        onClick={onConvert}
        disabled={disabled || isProcessing || !hasFiles}
        className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white
          hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? "Converting..." : "Convert"}
      </button>
    </div>
  );
}
