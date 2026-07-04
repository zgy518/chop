"use client";

import { useRef, useEffect, useCallback } from "react";

interface WaveformCanvasProps {
  samples: Float32Array;
  sampleRate: number;
  duration: number;
  startTime: number;
  endTime: number;
  currentTime: number;
  zoomLevel: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
  disabled?: boolean;
}

const HANDLE_WIDTH = 8;
const WAVEFORM_COLOR = "#6366F1";
const WAVEFORM_COLOR_DIM = "#A5B4FC";
const SELECTION_COLOR = "rgba(99, 102, 241, 0.15)";
const HANDLE_COLOR = "#4F46E5";
const PLAYHEAD_COLOR = "#EF4444";

export function WaveformCanvas({
  samples,
  sampleRate,
  duration,
  startTime,
  endTime,
  currentTime,
  zoomLevel,
  onStartTimeChange,
  onEndTimeChange,
  disabled,
}: WaveformCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<"start" | "end" | null>(null);

  const canvasWidth = 800; // We'll scale this with CSS
  const canvasHeight = 160;
  const padding = HANDLE_WIDTH;

  const timeToX = useCallback(
    (time: number) => {
      const visibleDuration = duration / zoomLevel;
      const startOffset = Math.max(0, (startTime + endTime) / 2 - visibleDuration / 2);
      return padding + ((time - startOffset) / visibleDuration) * (canvasWidth - padding * 2);
    },
    [duration, zoomLevel, startTime, endTime]
  );

  const xToTime = useCallback(
    (x: number) => {
      const visibleDuration = duration / zoomLevel;
      const startOffset = Math.max(0, (startTime + endTime) / 2 - visibleDuration / 2);
      return startOffset + ((x - padding) / (canvasWidth - padding * 2)) * visibleDuration;
    },
    [duration, zoomLevel, startTime, endTime]
  );

  // Draw waveform
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvasWidth * dpr;
    canvas.height = canvasHeight * dpr;
    ctx.scale(dpr, dpr);

    const w = canvasWidth;
    const h = canvasHeight;

    ctx.clearRect(0, 0, w, h);

    // Background
    ctx.fillStyle = "#FAFAFA";
    ctx.fillRect(0, 0, w, h);

    const visibleDuration = duration / zoomLevel;
    const viewStart = Math.max(0, (startTime + endTime) / 2 - visibleDuration / 2);
    const viewEnd = viewStart + visibleDuration;

    // Selection highlight
    const selX1 = timeToX(startTime);
    const selX2 = timeToX(endTime);
    ctx.fillStyle = SELECTION_COLOR;
    ctx.fillRect(selX1, 0, selX2 - selX1, h);

    // Draw waveform
    const samplesPerPixel = Math.ceil(
      ((viewEnd - viewStart) * sampleRate) / (w - padding * 2)
    );

    for (let x = padding; x < w - padding; x++) {
      const sampleStart = Math.floor((viewStart + ((x - padding) / (w - padding * 2)) * visibleDuration) * sampleRate);
      const sampleEnd = Math.min(sampleStart + samplesPerPixel, samples.length);

      // Find peak
      let max = 0;
      for (let i = sampleStart; i < sampleEnd; i++) {
        const abs = Math.abs(samples[i] || 0);
        if (abs > max) max = abs;
      }

      const isInSelection = x >= selX1 && x <= selX2;
      ctx.strokeStyle = isInSelection ? WAVEFORM_COLOR : WAVEFORM_COLOR_DIM;
      ctx.lineWidth = 1;

      const y = (h / 2) * (1 - max);
      const lineHeight = Math.max(1, h * max);

      ctx.beginPath();
      ctx.moveTo(x + 0.5, y);
      ctx.lineTo(x + 0.5, y + lineHeight);
      ctx.stroke();
    }

    // Center line
    ctx.strokeStyle = "#E4E4E7";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(padding, h / 2);
    ctx.lineTo(w - padding, h / 2);
    ctx.stroke();

    // Playhead
    if (currentTime >= startTime && currentTime <= endTime) {
      const px = timeToX(currentTime);
      ctx.strokeStyle = PLAYHEAD_COLOR;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, h);
      ctx.stroke();
    }

    // Start handle
    const startX = timeToX(startTime);
    ctx.fillStyle = HANDLE_COLOR;
    ctx.fillRect(startX - HANDLE_WIDTH / 2, 0, HANDLE_WIDTH, h);
    // Handle grip dots
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(startX, h / 2 - 8, 2, 0, Math.PI * 2);
    ctx.arc(startX, h / 2, 2, 0, Math.PI * 2);
    ctx.arc(startX, h / 2 + 8, 2, 0, Math.PI * 2);
    ctx.fill();

    // End handle
    const endX = timeToX(endTime);
    ctx.fillStyle = HANDLE_COLOR;
    ctx.fillRect(endX - HANDLE_WIDTH / 2, 0, HANDLE_WIDTH, h);
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(endX, h / 2 - 8, 2, 0, Math.PI * 2);
    ctx.arc(endX, h / 2, 2, 0, Math.PI * 2);
    ctx.arc(endX, h / 2 + 8, 2, 0, Math.PI * 2);
    ctx.fill();
  }, [samples, sampleRate, duration, startTime, endTime, currentTime, zoomLevel, timeToX]);

  // Redraw on state change
  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse events
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * canvasWidth;

      const startX = timeToX(startTime);
      const endX = timeToX(endTime);

      // Check if clicking on start handle
      if (Math.abs(x - startX) <= HANDLE_WIDTH + 4) {
        draggingRef.current = "start";
        return;
      }

      // Check if clicking on end handle
      if (Math.abs(x - endX) <= HANDLE_WIDTH + 4) {
        draggingRef.current = "end";
        return;
      }
    },
    [disabled, timeToX, startTime, endTime]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!draggingRef.current || disabled) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / rect.width) * canvasWidth;
      const time = Math.max(0, Math.min(duration, xToTime(x)));

      if (draggingRef.current === "start") {
        onStartTimeChange(Math.min(time, endTime - 0.1));
      } else {
        onEndTimeChange(Math.max(time, startTime + 0.1));
      }
    },
    [disabled, duration, xToTime, startTime, endTime, onStartTimeChange, onEndTimeChange]
  );

  const handleMouseUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  return (
    <div ref={containerRef} className="w-full select-none">
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg border border-zinc-200"
        style={{ height: canvasHeight / 2, width: "100%" }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
    </div>
  );
}
