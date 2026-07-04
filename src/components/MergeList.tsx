"use client";

import { formatFileSize, formatDuration } from "@/lib/format";

export interface MergeFile {
  id: string;
  file: File;
  name: string;
  duration: number;
}

interface MergeListProps {
  files: MergeFile[];
  onRemove: (id: string) => void;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  disabled?: boolean;
}

export function MergeList({
  files,
  onRemove,
  onMoveUp,
  onMoveDown,
  disabled,
}: MergeListProps) {
  if (files.length === 0) return null;

  const totalDuration = files.reduce((sum, f) => sum + f.duration, 0);

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-sm text-zinc-500">
        <span>{files.length} file{files.length !== 1 ? "s" : ""} to merge</span>
        <span>
          Total: {formatDuration(totalDuration)}
        </span>
      </div>

      <div className="space-y-1">
        {files.map((f, index) => (
          <div
            key={f.id}
            className="flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2"
          >
            {/* Order number */}
            <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-semibold text-indigo-600">
              {index + 1}
            </span>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-zinc-900">
                {f.name}
              </p>
              <p className="text-xs text-zinc-500">
                {formatFileSize(f.file.size)}
                {f.duration > 0 && <> &middot; {formatDuration(f.duration)}</>}
              </p>
            </div>

            {/* Move buttons */}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onMoveUp(f.id)}
                disabled={disabled || index === 0}
                className="rounded p-0.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 8l-6 6h12z" />
                </svg>
              </button>
              <button
                onClick={() => onMoveDown(f.id)}
                disabled={disabled || index === files.length - 1}
                className="rounded p-0.5 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100
                  disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 16l6-6H6z" />
                </svg>
              </button>
            </div>

            {/* Remove */}
            <button
              onClick={() => onRemove(f.id)}
              disabled={disabled}
              className="flex-shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600
                disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
