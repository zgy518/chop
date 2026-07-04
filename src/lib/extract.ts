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

export async function extractAudio(
  ffmpeg: FFmpeg,
  videoFile: File,
  outputFormat: OutputFormat,
  normalize: boolean = false
): Promise<Blob> {
  const target = FORMAT_MAP[outputFormat];

  const inputExt = videoFile.name.split(".").pop() || "mp4";
  const inputName = `video.${inputExt}`;
  const outputName = `audio.${target.ext}`;

  await ffmpeg.writeFile(inputName, await fetchFile(videoFile));

  // -vn: disable video output
  const args = [
    "-i", inputName,
    "-vn",
  ];

  if (normalize) {
    args.push("-af", "loudnorm=I=-16:TP=-1.5:LRA=11:linear=true");
  }

  args.push("-c:a", target.codec, "-b:a", "192k", outputName);

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  return new Blob([data as unknown as BlobPart], { type: target.mime });
}
