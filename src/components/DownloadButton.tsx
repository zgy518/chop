"use client";

import type { AudioFile } from "@/types";
import JSZip from "jszip";
import { formatFileSize } from "@/lib/format";

interface DownloadButtonProps {
  files: AudioFile[];
  disabled?: boolean;
}

export function DownloadButton({ files, disabled }: DownloadButtonProps) {
  const completed = files.filter((f) => f.status === "done" && f.result);
  const totalOriginal = completed.reduce((sum, f) => sum + f.originalSize, 0);
  const totalResult = completed.reduce((sum, f) => sum + f.result!.size, 0);
  const saved = totalOriginal - totalResult;
  const percentage = totalOriginal > 0 ? Math.round((saved / totalOriginal) * 100) : 0;

  const handleDownloadSingle = (audioFile: AudioFile) => {
    if (!audioFile.result) return;
    const { blob, downloadName } = audioFile.result;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadAll = async () => {
    const zip = new JSZip();
    for (const audioFile of completed) {
      if (!audioFile.result) continue;
      zip.file(audioFile.result.downloadName, audioFile.result.blob);
    }
    const zipBlob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "chop-audio.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (completed.length === 0) return null;

  return (
    <div className="w-full space-y-3">
      {saved > 0 && (
        <div className="rounded-xl bg-emerald-50 p-4 text-center">
          <p className="text-sm text-emerald-700">
            <span className="font-semibold">{formatFileSize(saved)}</span> saved
            {percentage > 0 && <> ({percentage}% smaller)</>}
          </p>
        </div>
      )}

      <div className="flex gap-3">
        {completed.length === 1 && (
          <button
            onClick={() => handleDownloadSingle(completed[0])}
            disabled={disabled}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white
              hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download {completed[0].result?.downloadName}
          </button>
        )}

        {completed.length > 1 && (
          <button
            onClick={handleDownloadAll}
            disabled={disabled}
            className="flex-1 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white
              hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Download All ({completed.length} files) &middot; ZIP
          </button>
        )}
      </div>
    </div>
  );
}
