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

export async function convertAudio(
  ffmpeg: FFmpeg,
  file: File,
  format: OutputFormat,
  bitrate: string = "192k",
  normalize: boolean = false,
  speed: number = 1.0
): Promise<Blob> {
  const target = FORMAT_MAP[format];
  if (!target) throw new Error(`Unsupported format: ${format}`);

  const inputExt = file.name.split(".").pop() || "tmp";
  const inputName = `input.${inputExt}`;
  const outputName = `output.${target.ext}`;

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  const filters: string[] = [];

  if (speed !== 1.0) {
    // atempo only handles 0.5-2.0 per instance; chain two for >2x
    filters.push(`atempo=${speed}`);
  }

  if (normalize) {
    filters.push("loudnorm=I=-16:TP=-1.5:LRA=11:linear=true");
  }

  const args = ["-i", inputName];

  if (filters.length > 0) {
    args.push("-af", filters.join(","));
  }

  args.push("-c:a", target.codec, "-b:a", bitrate, outputName);
  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);

  // Cleanup virtual FS
  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data as unknown as BlobPart], { type: target.mime });
}
