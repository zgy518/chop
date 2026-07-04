"use client";

interface FfmpegLoaderProps {
  progress: number;
}

export function FfmpegLoader({ progress }: FfmpegLoaderProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/30 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        <div className="mb-4 flex justify-center">
          <svg
            className="h-10 w-10 animate-spin text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-zinc-900">Loading audio engine...</h3>
        <p className="mt-1 text-sm text-zinc-500">
          First-time setup (~25 MB download)
        </p>

        {/* Progress bar */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
          <div
            className="h-full rounded-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-zinc-400">{progress}%</p>
      </div>
    </div>
  );
}
