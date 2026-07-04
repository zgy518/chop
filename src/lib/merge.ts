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

export async function mergeAudio(
  ffmpeg: FFmpeg,
  files: File[],
  outputFormat: OutputFormat
): Promise<Blob> {
  const target = FORMAT_MAP[outputFormat];

  // Write all files and build concat list
  const inputNames: string[] = [];
  const concatLines: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const ext = files[i].name.split(".").pop() || "tmp";
    const name = `input_${i}.${ext}`;
    await ffmpeg.writeFile(name, await fetchFile(files[i]));
    inputNames.push(name);
    concatLines.push(`file '${name}'`);
  }

  const concatContent = concatLines.join("\n");
  await ffmpeg.writeFile("concat.txt", concatContent);

  const outputName = `merged.${target.ext}`;
  const args = [
    "-f", "concat",
    "-safe", "0",
    "-i", "concat.txt",
    "-c:a", target.codec,
    "-b:a", "192k",
    outputName,
  ];

  await ffmpeg.exec(args);

  const data = await ffmpeg.readFile(outputName);

  // Cleanup
  for (const name of inputNames) {
    await ffmpeg.deleteFile(name);
  }
  await ffmpeg.deleteFile("concat.txt");
  await ffmpeg.deleteFile(outputName);

  return new Blob([data as unknown as BlobPart], { type: target.mime });
}
