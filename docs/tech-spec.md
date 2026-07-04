# Chop — Technical Specification

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 (`@theme inline`) |
| Audio Engine | FFmpeg.wasm 0.12.x + Web Audio API |
| Batch Download | JSZip 3.x |
| Storage | localStorage (usage + license) |
| Analytics | Google Analytics 4 (gtag) |
| SEO | Metadata API + JSON-LD + sitemap.xml |

## Architecture

```
Browser (Client-side, 100%)
├── React App (Next.js)
├── FFmpeg.wasm (~25MB, lazy-loaded singleton)
├── Web Audio API (waveform decodeAudioData)
└── localStorage (daily counter + license key)
```

**No backend. No API calls. No file uploads.**

## Key Technical Decisions

### FFmpeg.wasm Singleton Pattern
- Lazy-loaded only on first audio operation
- Progress callback updates loading UI
- One instance shared across all 4 tools
- Explicit `deleteFile()` after each operation to prevent memory leaks
- `terminateFFmpeg()` to free the ~25MB WASM memory

### COOP/COEP Headers
- Required for `SharedArrayBuffer` (FFmpeg.wasm multithreading)
- Set in `next.config.ts`: `Cross-Origin-Opener-Policy: same-origin`, `Cross-Origin-Embedder-Policy: require-corp`
- GitHub Pages doesn't support custom headers → single-thread fallback (slower but works)

### Dual Deployment
- `DEPLOY_TARGET=github-pages` triggers `output: "export"` + `basePath: "/chop"`
- Vercel is default (no env var needed)
- COOP/COEP headers only work on Vercel

### Canvas Waveform (not SVG)
- 3-min audio at 44.1kHz = ~8M samples
- Canvas renders pixels directly, SVG would create thousands of DOM nodes
- `AudioContext.decodeAudioData()` → downmix to mono → draw on `<canvas>`

### State Management Pattern
- All state in `page.tsx` via `useState`
- Child components are pure presentational (props + callbacks)
- No Redux, Context, or state libraries

## Component Tree

```
RootLayout (server, layout.tsx)
├── GoogleAnalytics (ga4)
├── Header (logo, privacy link, upgrade button)
└── Home (client, page.tsx)
    ├── Usage counter bar
    ├── ToolTabs (Convert | Trim | Merge | Extract)
    ├── [Tab content — conditionally rendered]
    │   ├── Convert: UploadZone + ConversionControls + AudioFileList + DownloadButton
    │   ├── Trim: UploadZone + WaveformCanvas + PlaybackControls + TrimControls + DownloadButton
    │   ├── Merge: UploadZone + MergeList + DownloadButton
    │   └── Extract: UploadZone + FormatSelector + DownloadButton
    ├── FfmpegLoader (overlay during first ~25MB load)
    ├── Paywall (modal when limit reached)
    │   └── LicenseInput
    └── Footer
```

## File Size Limits

| Tier | Max File Size |
|------|---------------|
| Free | 100MB |
| Pro | 500MB |

## Audio Filters

| Feature | FFmpeg Filter |
|---------|--------------|
| Volume normalization | `loudnorm=I=-16:TP=-1.5:LRA=11:linear=true` |
| Speed change | `atempo={value}` |
| Fade in | `afade=t=in:d={seconds}` |
| Fade out | `afade=t=out:st={start}:d={seconds}` |

## License Key System

- Format: `CHOP-XXXX-XXXX-XXXX`
- Validation: prefix-based check against 8 predefined prefixes
- Storage: `chop_license` key in localStorage
- 5 pre-made keys for manual delivery
- `generateLicenseKey()` for future automated delivery
