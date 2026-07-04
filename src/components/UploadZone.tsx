"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";

interface UploadZoneProps {
  onFilesSelected: (files: File[]) => void;
  accept: string;
  acceptLabel: string;
  maxSize?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export function UploadZone({
  onFilesSelected,
  accept,
  acceptLabel,
  maxSize,
  multiple = true,
  disabled,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFilesSelected(files);
    },
    [disabled, onFilesSelected]
  );

  const handleClick = () => {
    if (disabled) return;
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const files = Array.from(e.target.files || []);
    if (files.length > 0) onFilesSelected(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
      className={`
        relative flex cursor-pointer flex-col items-center justify-center
        rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-200
        ${
          isDragging
            ? "border-indigo-500 bg-indigo-50 shadow-lg scale-[1.02]"
            : "border-zinc-300 bg-white hover:border-zinc-400 hover:bg-zinc-50"
        }
        ${disabled ? "pointer-events-none opacity-60" : ""}
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Upload icon */}
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
        <svg
          className="h-7 w-7 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      <p className="mb-1 text-lg font-semibold text-zinc-900">
        Drop your files here
      </p>
      <p className="mb-3 text-sm text-zinc-500">or click to browse</p>
      <p className="text-xs text-zinc-400">
        Supports {acceptLabel}
        {maxSize && <> &bull; Up to {maxSize}</>}
      </p>
    </div>
  );
}
