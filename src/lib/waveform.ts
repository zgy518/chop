import type { WaveformData } from "@/types";

/**
 * Decode an audio file and extract waveform samples.
 * Downmixes multi-channel audio to mono.
 */
export async function decodeWaveform(file: File): Promise<WaveformData> {
  const arrayBuffer = await file.arrayBuffer();
  const audioCtx = new AudioContext();
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

  // Downmix to mono
  let samples: Float32Array;
  if (audioBuffer.numberOfChannels === 1) {
    samples = new Float32Array(audioBuffer.getChannelData(0));
  } else {
    samples = new Float32Array(audioBuffer.length);
    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      const chData = audioBuffer.getChannelData(ch);
      for (let i = 0; i < audioBuffer.length; i++) {
        samples[i] += chData[i] / audioBuffer.numberOfChannels;
      }
    }
  }

  await audioCtx.close();

  return {
    samples,
    sampleRate: audioBuffer.sampleRate,
    duration: audioBuffer.duration,
    channels: audioBuffer.numberOfChannels,
  };
}
