"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  AudioFile,
  AudioResult,
  OutputFormat,
  ToolTab,
  FfmpegLoadState,
  WaveformData,
} from "@/types";
import { Header } from "@/components/Header";
import { ToolTabs } from "@/components/ToolTabs";
import { UploadZone } from "@/components/UploadZone";
import { FormatSelector } from "@/components/FormatSelector";
import { ConversionControls } from "@/components/ConversionControls";
import { AudioFileList } from "@/components/AudioFileList";
import { DownloadButton } from "@/components/DownloadButton";
import { WaveformCanvas } from "@/components/WaveformCanvas";
import { PlaybackControls } from "@/components/PlaybackControls";
import { TrimControls } from "@/components/TrimControls";
import { MergeList } from "@/components/MergeList";
import type { MergeFile } from "@/components/MergeList";
import { FfmpegLoader } from "@/components/FfmpegLoader";
import { Paywall } from "@/components/Paywall";
import { getFFmpeg } from "@/lib/ffmpeg";
import { convertAudio } from "@/lib/convert";
import { trimAudio } from "@/lib/trim";
import { mergeAudio } from "@/lib/merge";
import { extractAudio } from "@/lib/extract";
import { decodeWaveform } from "@/lib/waveform";
import {
  generateId,
  isValidAudioType,
  isValidVideoType,
  getOutputExtension,
} from "@/lib/format";
import {
  getRemainingFree,
  hasValidLicense,
  incrementUsage,
  DAILY_LIMIT_COUNT,
} from "@/lib/storage";

export default function Home() {
  // Tool state
  const [activeTab, setActiveTab] = useState<ToolTab>("convert");
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Convert state
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("mp3");
  const [bitrate, setBitrate] = useState("192k");
  const [normalize, setNormalize] = useState(false);
  const [speed, setSpeed] = useState(1.0);

  // Trim state
  const [trimFile, setTrimFile] = useState<File | null>(null);
  const [waveform, setWaveform] = useState<WaveformData | null>(null);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fadeIn, setFadeIn] = useState(0);
  const [fadeOut, setFadeOut] = useState(0);

  // Merge state
  const [mergeFiles, setMergeFiles] = useState<MergeFile[]>([]);

  // Extract state
  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractResult, setExtractResult] = useState<AudioResult | null>(null);
  const [extractNormalize, setExtractNormalize] = useState(false);

  // FFmpeg state
  const [ffmpeg, setFfmpeg] = useState<FfmpegLoadState>({
    loaded: false,
    progress: 0,
    loading: false,
  });

  // License / usage state
  const [remaining, setRemaining] = useState(DAILY_LIMIT_COUNT);
  const [hasLicense, setHasLicense] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);

  // Hydrate usage on mount
  useEffect(() => {
    setRemaining(getRemainingFree());
    setHasLicense(hasValidLicense());
  }, []);

  // Load FFmpeg on first file upload
  const ensureFFmpeg = useCallback(async () => {
    if (ffmpeg.loaded || ffmpeg.loading) return;
    setFfmpeg({ loaded: false, progress: 0, loading: true });

    try {
      await getFFmpeg((progress) => {
        setFfmpeg((prev) => ({ ...prev, progress }));
      });
      setFfmpeg({ loaded: true, progress: 100, loading: false });
    } catch (err) {
      console.error("Failed to load FFmpeg:", err);
      setFfmpeg({ loaded: false, progress: 0, loading: false });
    }
  }, [ffmpeg.loaded, ffmpeg.loading]);

  // Refresh usage/license after operations
  const refreshUsage = useCallback(() => {
    setRemaining(getRemainingFree());
    setHasLicense(hasValidLicense());
  }, []);

  // Track an operation (returns false if limit reached)
  const trackOperation = useCallback((): boolean => {
    if (!hasLicense && getRemainingFree() <= 0) {
      setShowPaywall(true);
      return false;
    }
    if (!hasLicense) incrementUsage();
    refreshUsage();
    return true;
  }, [hasLicense, refreshUsage]);

  // Clear state when switching tabs
  const handleTabChange = useCallback(
    (tab: ToolTab) => {
      setActiveTab(tab);
      setAudioFiles([]);
      setTrimFile(null);
      setWaveform(null);
      setMergeFiles([]);
      setExtractFile(null);
      setExtractResult(null);
    },
    []
  );

  // ── Convert: file selection ──
  const handleConvertFilesSelected = useCallback(
    (files: File[]) => {
      const validFiles = files.filter((f) => isValidAudioType(f));
      if (validFiles.length === 0) return;

      const newFiles: AudioFile[] = validFiles.map((file) => ({
        id: generateId(),
        file,
        originalName: file.name,
        originalSize: file.size,
        duration: 0,
        status: "idle" as const,
      }));

      setAudioFiles((prev) => [...prev, ...newFiles]);
      ensureFFmpeg();
    },
    [ensureFFmpeg]
  );

  // ── Convert: remove file ──
  const handleRemoveFile = useCallback((id: string) => {
    setAudioFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // ── Convert: convert all idle files ──
  const handleConvert = useCallback(async () => {
    if (!ffmpeg.loaded || isProcessing) return;

    const idleFiles = audioFiles.filter((f) => f.status === "idle");
    if (idleFiles.length === 0) return;

    const allowed = idleFiles.every(() => trackOperation());
    if (!allowed) return;

    setIsProcessing(true);

    const ffmpegInstance = await getFFmpeg();

    for (const audioFile of idleFiles) {
      setAudioFiles((prev) =>
        prev.map((f) =>
          f.id === audioFile.id ? { ...f, status: "processing" as const } : f
        )
      );

      try {
        const blob = await convertAudio(
          ffmpegInstance,
          audioFile.file,
          outputFormat,
          bitrate,
          normalize,
          speed
        );

        const baseName = audioFile.originalName.replace(/\.[^.]+$/, "");
        const newExt = getOutputExtension(outputFormat);

        setAudioFiles((prev) =>
          prev.map((f) =>
            f.id === audioFile.id
              ? {
                  ...f,
                  status: "done" as const,
                  result: {
                    blob,
                    size: blob.size,
                    format: outputFormat,
                    downloadName: `${baseName}.${newExt}`,
                  },
                }
              : f
          )
        );
      } catch (err) {
        setAudioFiles((prev) =>
          prev.map((f) =>
            f.id === audioFile.id
              ? {
                  ...f,
                  status: "error" as const,
                  error:
                    err instanceof Error ? err.message : "Conversion failed",
                }
              : f
          )
        );
      }
    }

    setIsProcessing(false);
    refreshUsage();
  }, [
    ffmpeg.loaded,
    isProcessing,
    audioFiles,
    outputFormat,
    bitrate,
    normalize,
    speed,
    trackOperation,
    refreshUsage,
  ]);

  // ── Trim: file selection ──
  const handleTrimFileSelected = useCallback(
    async (files: File[]) => {
      const valid = files.filter((f) => isValidAudioType(f));
      if (valid.length === 0) return;

      const file = valid[0]; // Trim only supports single file
      setTrimFile(file);
      ensureFFmpeg();

      try {
        const wf = await decodeWaveform(file);
        setWaveform(wf);
        setStartTime(0);
        setEndTime(wf.duration);
        setCurrentTime(0);
        setZoomLevel(1);
      } catch (err) {
        console.error("Failed to decode waveform:", err);
      }
    },
    [ensureFFmpeg]
  );

  // ── Trim: execute trim ──
  const handleTrim = useCallback(async () => {
    if (!ffmpeg.loaded || !trimFile || !waveform || isProcessing) return;
    if (!trackOperation()) return;

    setIsProcessing(true);

    try {
      const ffmpegInstance = await getFFmpeg();
      const blob = await trimAudio(
        ffmpegInstance,
        trimFile,
        startTime,
        endTime,
        outputFormat,
        fadeIn,
        fadeOut
      );

      const baseName = trimFile.name.replace(/\.[^.]+$/, "");
      const newExt = getOutputExtension(outputFormat);

      // Create result and trigger download
      const downloadName = `${baseName}-trimmed.${newExt}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Trim failed:", err);
    }

    setIsProcessing(false);
    refreshUsage();
  }, [
    ffmpeg.loaded,
    trimFile,
    waveform,
    isProcessing,
    startTime,
    endTime,
    outputFormat,
    fadeIn,
    fadeOut,
    trackOperation,
    refreshUsage,
  ]);

  // ── Merge: file selection ──
  const handleMergeFilesSelected = useCallback(
    (files: File[]) => {
      const valid = files.filter((f) => isValidAudioType(f));
      if (valid.length === 0) return;

      const newFiles: MergeFile[] = valid.map((file) => ({
        id: generateId(),
        file,
        name: file.name,
        duration: 0,
      }));

      setMergeFiles((prev) => [...prev, ...newFiles]);
      ensureFFmpeg();
    },
    [ensureFFmpeg]
  );

  // ── Merge: remove file ──
  const handleMergeRemove = useCallback((id: string) => {
    setMergeFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  // ── Merge: reorder ──
  const handleMergeMoveUp = useCallback((id: string) => {
    setMergeFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx <= 0) return prev;
      const next = [...prev];
      [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
      return next;
    });
  }, []);

  const handleMergeMoveDown = useCallback((id: string) => {
    setMergeFiles((prev) => {
      const idx = prev.findIndex((f) => f.id === id);
      if (idx < 0 || idx >= prev.length - 1) return prev;
      const next = [...prev];
      [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
      return next;
    });
  }, []);

  // ── Merge: execute merge ──
  const handleMerge = useCallback(async () => {
    if (!ffmpeg.loaded || isProcessing || mergeFiles.length < 2) return;
    if (!trackOperation()) return;

    setIsProcessing(true);

    try {
      const ffmpegInstance = await getFFmpeg();
      const files = mergeFiles.map((f) => f.file);
      const blob = await mergeAudio(ffmpegInstance, files, outputFormat);

      const newExt = getOutputExtension(outputFormat);
      const downloadName = `merged.${newExt}`;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Merge failed:", err);
    }

    setIsProcessing(false);
    refreshUsage();
  }, [
    ffmpeg.loaded,
    isProcessing,
    mergeFiles,
    outputFormat,
    trackOperation,
    refreshUsage,
  ]);

  // ── Extract: file selection ──
  const handleExtractFileSelected = useCallback(
    (files: File[]) => {
      const valid = files.filter((f) => isValidVideoType(f));
      if (valid.length === 0) return;

      setExtractFile(valid[0]);
      setExtractResult(null);
      ensureFFmpeg();
    },
    [ensureFFmpeg]
  );

  // ── Extract: execute extraction ──
  const handleExtract = useCallback(async () => {
    if (!ffmpeg.loaded || !extractFile || isProcessing) return;
    if (!trackOperation()) return;

    setIsProcessing(true);

    try {
      const ffmpegInstance = await getFFmpeg();
      const blob = await extractAudio(ffmpegInstance, extractFile, outputFormat, extractNormalize);

      const baseName = extractFile.name.replace(/\.[^.]+$/, "");
      const newExt = getOutputExtension(outputFormat);

      setExtractResult({
        blob,
        size: blob.size,
        format: outputFormat,
        downloadName: `${baseName}-audio.${newExt}`,
      });
    } catch (err) {
      console.error("Extraction failed:", err);
    }

    setIsProcessing(false);
    refreshUsage();
  }, [
    ffmpeg.loaded,
    extractFile,
    isProcessing,
    outputFormat,
    extractNormalize,
    trackOperation,
    refreshUsage,
  ]);

  // ── Derived state ──
  const hasIdleFiles = audioFiles.some((f) => f.status === "idle");
  const completedFiles = audioFiles.filter((f) => f.status === "done");
  const showFeatureCards =
    audioFiles.length === 0 && !trimFile && mergeFiles.length === 0 && !extractFile;

  return (
    <div className="flex flex-col flex-1 min-h-screen">
      <Header remaining={remaining} hasLicense={hasLicense} onUpgradeClick={() => setShowPaywall(true)} />

      <main className="flex-1 mx-auto max-w-2xl px-4 py-8 sm:py-16 w-full">
        {/* Hero (hidden when content present) */}
        {showFeatureCards && (
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-5xl">
              Audio tools that stay on your machine
            </h1>
            <p className="mt-4 text-lg text-zinc-500">
              Convert, trim, merge, and extract audio — 100% private.
              Your files never leave your device.
            </p>
          </div>
        )}

        {/* Tool Tabs + Content */}
        <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm overflow-hidden">
          <ToolTabs active={activeTab} onChange={handleTabChange} />

          <div className="p-4 sm:p-6 space-y-4">
            {/* ═══ CONVERT TAB ═══ */}
            {activeTab === "convert" && (
              <>
                <UploadZone
                  onFilesSelected={handleConvertFilesSelected}
                  accept="audio/*"
                  acceptLabel="MP3, WAV, FLAC, AAC, OGG, M4A"
                  maxSize="100 MB"
                  multiple
                  disabled={isProcessing}
                />

                {audioFiles.length > 0 && (
                  <div className="flex flex-wrap items-end gap-4 pt-2">
                    <FormatSelector
                      value={outputFormat}
                      onChange={setOutputFormat}
                      disabled={isProcessing}
                    />
                    <ConversionControls
                      bitrate={bitrate}
                      onBitrateChange={setBitrate}
                      normalize={normalize}
                      onNormalizeChange={setNormalize}
                      speed={speed}
                      onSpeedChange={setSpeed}
                      onConvert={handleConvert}
                      disabled={!ffmpeg.loaded}
                      isProcessing={isProcessing}
                      hasFiles={hasIdleFiles}
                    />
                  </div>
                )}

                {audioFiles.length > 0 && (
                  <AudioFileList
                    files={audioFiles}
                    onRemove={handleRemoveFile}
                  />
                )}

                {completedFiles.length > 0 && (
                  <DownloadButton
                    files={audioFiles}
                    disabled={isProcessing}
                  />
                )}
              </>
            )}

            {/* ═══ TRIM TAB ═══ */}
            {activeTab === "trim" && (
              <>
                <UploadZone
                  onFilesSelected={handleTrimFileSelected}
                  accept="audio/*"
                  acceptLabel="MP3, WAV, FLAC, AAC, OGG, M4A"
                  maxSize="100 MB"
                  multiple={false}
                  disabled={isProcessing}
                />

                {waveform && trimFile && (
                  <>
                    <WaveformCanvas
                      samples={waveform.samples}
                      sampleRate={waveform.sampleRate}
                      duration={waveform.duration}
                      startTime={startTime}
                      endTime={endTime}
                      currentTime={currentTime}
                      zoomLevel={zoomLevel}
                      onStartTimeChange={setStartTime}
                      onEndTimeChange={setEndTime}
                      disabled={isProcessing}
                    />

                    <div className="flex flex-wrap items-end gap-4">
                      <PlaybackControls
                        file={trimFile}
                        startTime={startTime}
                        endTime={endTime}
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        onPlayStateChange={setIsPlaying}
                        onTimeUpdate={setCurrentTime}
                        disabled={isProcessing}
                      />

                      <TrimControls
                        startTime={startTime}
                        endTime={endTime}
                        outputFormat={outputFormat}
                        onOutputFormatChange={setOutputFormat}
                        fadeIn={fadeIn}
                        onFadeInChange={setFadeIn}
                        fadeOut={fadeOut}
                        onFadeOutChange={setFadeOut}
                        onTrim={handleTrim}
                        isProcessing={isProcessing}
                        disabled={!ffmpeg.loaded}
                      />
                    </div>
                  </>
                )}
              </>
            )}

            {/* ═══ MERGE TAB ═══ */}
            {activeTab === "merge" && (
              <>
                <UploadZone
                  onFilesSelected={handleMergeFilesSelected}
                  accept="audio/*"
                  acceptLabel="MP3, WAV, FLAC, AAC, OGG, M4A"
                  maxSize="100 MB"
                  multiple
                  disabled={isProcessing}
                />

                <MergeList
                  files={mergeFiles}
                  onRemove={handleMergeRemove}
                  onMoveUp={handleMergeMoveUp}
                  onMoveDown={handleMergeMoveDown}
                  disabled={isProcessing}
                />

                {mergeFiles.length >= 2 && (
                  <div className="flex flex-wrap items-end gap-4 pt-2">
                    <FormatSelector
                      value={outputFormat}
                      onChange={setOutputFormat}
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleMerge}
                      disabled={!ffmpeg.loaded || isProcessing}
                      className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white
                        hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? "Merging..." : "Merge & Download"}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ═══ EXTRACT TAB ═══ */}
            {activeTab === "extract" && (
              <>
                <UploadZone
                  onFilesSelected={handleExtractFileSelected}
                  accept="video/*"
                  acceptLabel="MP4, MKV, MOV, WebM"
                  maxSize="200 MB"
                  multiple={false}
                  disabled={isProcessing}
                />

                {extractFile && (
                  <div className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2">
                    <span className="text-lg">🎬</span>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-zinc-900">
                        {extractFile.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {(extractFile.size / (1024 * 1024)).toFixed(1)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => { setExtractFile(null); setExtractResult(null); }}
                      disabled={isProcessing}
                      className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600
                        disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {extractFile && (
                  <div className="flex flex-wrap items-end gap-4 pt-2">
                    <FormatSelector
                      value={outputFormat}
                      onChange={setOutputFormat}
                      disabled={isProcessing}
                    />
                    <label className="flex items-center gap-2 pb-2 text-sm text-zinc-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={extractNormalize}
                        onChange={(e) => setExtractNormalize(e.target.checked)}
                        disabled={isProcessing}
                        className="h-4 w-4 rounded border-zinc-300 text-indigo-500 focus:ring-indigo-500
                          disabled:opacity-50"
                      />
                      Normalize volume
                    </label>
                    <button
                      onClick={handleExtract}
                      disabled={!ffmpeg.loaded || isProcessing}
                      className="rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white
                        hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? "Extracting..." : "Extract Audio"}
                    </button>
                  </div>
                )}

                {extractResult && (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        const url = URL.createObjectURL(extractResult.blob);
                        const link = document.createElement("a");
                        link.href = url;
                        link.download = extractResult.downloadName;
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        URL.revokeObjectURL(url);
                      }}
                      className="rounded-xl bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white
                        hover:bg-emerald-600 active:scale-[0.98] transition-all duration-200
                        inline-flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download {extractResult.downloadName}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Feature cards (only when no content) */}
        {showFeatureCards && (
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              {
                icon: "🔒",
                title: "100% Private",
                desc: "All processing happens in your browser. No uploads, no servers, no tracking.",
              },
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Powered by FFmpeg.wasm — professional-grade audio processing at native speed.",
              },
              {
                icon: "🎯",
                title: "No Limits",
                desc: "Convert between MP3, WAV, FLAC, AAC, OGG, M4A. All tools free to try.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-zinc-200 bg-white p-6 text-left"
              >
                <div className="text-2xl">{feature.icon}</div>
                <h3 className="mt-3 font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm text-zinc-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-400">
        &copy; 2026 Chop. All processing happens in your browser — your files are
        never uploaded.
      </footer>

      {/* FFmpeg loader overlay */}
      {ffmpeg.loading && <FfmpegLoader progress={ffmpeg.progress} />}

      {/* Paywall */}
      <Paywall
        isOpen={showPaywall}
        onClose={() => {
          setShowPaywall(false);
          refreshUsage();
        }}
        remaining={remaining}
      />
    </div>
  );
}
