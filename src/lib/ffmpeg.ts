import type { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpegInstance: FFmpeg | null = null;
let isLoading = false;
let loadPromise: Promise<FFmpeg> | null = null;

export type ProgressCallback = (percent: number) => void;

/**
 * Lazily load the FFmpeg.wasm singleton.
 * The ~25MB WASM binary is only downloaded on first call.
 * Returns the existing instance on subsequent calls.
 */
export async function getFFmpeg(onProgress?: ProgressCallback): Promise<FFmpeg> {
  if (ffmpegInstance) return ffmpegInstance;

  if (isLoading && loadPromise) return loadPromise;

  isLoading = true;
  loadPromise = (async () => {
    const { FFmpeg: FFmpegClass } = await import("@ffmpeg/ffmpeg");
    const { toBlobURL } = await import("@ffmpeg/util");

    const ffmpeg = new FFmpegClass();

    ffmpeg.on("log", ({ message }) => {
      console.log("[FFmpeg]", message);
    });

    ffmpeg.on("progress", ({ progress }) => {
      const percent = Math.round(progress * 100);
      onProgress?.(percent);
    });

    const baseURL = "/ffmpeg-core";

    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
    });

    ffmpegInstance = ffmpeg;
    isLoading = false;
    return ffmpeg;
  })();

  return loadPromise;
}

/**
 * Release the FFmpeg instance and free memory.
 */
export function terminateFFmpeg(): void {
  if (ffmpegInstance) {
    ffmpegInstance.terminate();
    ffmpegInstance = null;
    loadPromise = null;
    isLoading = false;
  }
}
