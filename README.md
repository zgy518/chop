# Chop — Privacy-First Audio Toolkit

**Your audio never leaves your device.**

Chop is a browser-based audio toolkit for content creators. Format conversion, trimming, merging, and video-to-audio extraction — all processed locally with FFmpeg.wasm. No uploads, no servers, no subscriptions.

## Features

- **Convert** — MP3, WAV, FLAC, AAC, OGG with quality control, speed adjustment, and volume normalization
- **Trim** — Visual waveform editor with fade in/out and playback preview
- **Merge** — Combine multiple audio files with drag-and-drop reordering
- **Extract** — Pull audio from video files (MP4, MKV, MOV, WebM)

## Pricing

| Tier | Price | Daily Ops | Max File |
|------|-------|-----------|----------|
| Free | $0 | 10/day | 100MB |
| Pro | $14.99 lifetime | Unlimited | 500MB |

## Tech Stack

- Next.js 16 + TypeScript + Tailwind CSS v4
- FFmpeg.wasm 0.12 (client-side audio engine)
- Web Audio API (waveform visualization)
- Zero backend — everything runs in your browser

## Development

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Deployment

**Vercel (primary):**
```bash
npm install -g vercel
vercel --prod
```

**GitHub Pages (backup):**
Push to `master` branch — auto-deploys via GitHub Actions.

## Privacy

All audio processing is local. Files are never uploaded. Read our [privacy policy](https://chop-omega.vercel.app/privacy).

## License

Source code available for reference. Chop is a commercial product — see pricing above.
