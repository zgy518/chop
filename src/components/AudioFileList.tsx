"use client";

import type { AudioFile } from "@/types";
import { formatFileSize } from "@/lib/format";

interface AudioFileListProps {
  files: AudioFile[];
  onRemove: (id: string) => void;
}

export function AudioFileList({ files, onRemove }: AudioFileListProps) {
  return (
    <div className="w-full space-y-2">
      {files.map((file) => (
        <AudioFileItem key={file.id} file={file} onRemove={onRemove} />
      ))}
    </div>
  );
}

function AudioFileItem({
  file,
  onRemove,
}: {
  file: AudioFile;
  onRemove: (id: string) => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3">
      {/* Icon */}
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-indigo-50">
        {file.status === "processing" ? (
          <svg
            className="h-5 w-5 animate-spin text-indigo-500"
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
        ) : (
          <svg
            className="h-5 w-5 text-indigo-500"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
            />
          </svg>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium text-zinc-900">{file.originalName}</p>
        <p className="text-xs text-zinc-500">
          {formatFileSize(file.originalSize)}
          {file.status === "done" && file.result && (
            <>
              {" → "}
              <span className="text-emerald-600 font-medium">
                {formatFileSize(file.result.size)}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Status */}
      <div className="flex-shrink-0">
        {file.status === "processing" && (
          <span className="text-xs text-indigo-500 font-medium">Processing...</span>
        )}
        {file.status === "done" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            Done
          </span>
        )}
        {file.status === "error" && (
          <span className="text-xs text-red-500">{file.error || "Error"}</span>
        )}
      </div>

      {/* Remove */}
      {(file.status === "idle" || file.status === "done" || file.status === "error") && (
        <button
          onClick={() => onRemove(file.id)}
          className="flex-shrink-0 rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
