import type { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";
import type { OutputFormat } from "@/types";

const FORMAT_MAP: Record<OutputFormat, { ext: string; mime: string; codec: string }> = {
  mp3: { ext: "mp3", mime: "audio/mpeg", codec: "libmp3lame" },
  wav: { ext: "wav", mime: "audio/wav", codec: "pcm_s16le" },
  flac: { ext: "flac", mime: "audio/flac", codec: "flac" },
  aac: { ext: "m4a", mime: "audio/mp4", codec: "aac" },
  ogg: { ext: "ogg", mime: "audio/ogg", codec: "libvorbis" },
  m4a: { ext: "m4a", mime: "audio/mp4", codec: "aac" },
};

export async function trimAudio(
  ffmpeg: FFmpeg,
  file: File,
  startTime: number,
  endTime: number,
  outputFormat: OutputFormat,
  fadeIn: number = 0,
  fadeOut: number = 0
): Promise<Blob> {
  const target = FORMAT_MAP[outputFormat];
  const duration = endTime - startTime;

  const inputExt = file.name.split(".").pop() || "tmp";
  const inputName = `input.${inputExt}`;
  const outputName = `trimmed.${target.ext}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const filters: string[] = [];

  if (fadeIn > 0) {
    filters.push(`afade=t=in:d=${fadeIn}`);
  }
  if (fadeOut > 0) {
    filters.push(`afade=t=out:st=${duration - fadeOut}:d=${fadeOut}`);
  }

  const args = [
    "-i", inputName,
    "-ss", startTime.toString(),
    "-t", duration.toString(),
  ];

  if (filters.length > 0) {
    args.push("-af", filters.join(","));
  }

  args.push("-c:a", target.codec, "-b:a", "192k", outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data as unknown as BlobPart], { type: target.mime });
}
