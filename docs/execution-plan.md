# Chop — Execution Plan

## Phases & Status

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Project skeleton, Next.js init, Tailwind v4, types, CI/CD | ✅ Done |
| 1 | Format conversion (FFmpeg.wasm loader + convertAudio) | ✅ Done |
| 2 | Audio trimming (waveform + trimAudio + playback) | ✅ Done |
| 3 | Audio merging (concat demuxer + MergeList) | ✅ Done |
| 4 | Video-to-audio extraction (extractAudio) | ✅ Done |
| 5 | Monetization (Paywall + LicenseInput + usage counter) | ✅ Done |
| 6 | Polish + SEO + error/empty states | ✅ Done |
| 7 | P1 features (normalize, speed, fades) | ✅ Done |

## File Manifest

### Config (7 files)
- [x] `CLAUDE.md` — AI behavior guidelines
- [x] `README.md` — Public project readme
- [x] `package.json` — Dependencies
- [x] `tsconfig.json` — TypeScript config
- [x] `next.config.ts` — Dual deploy + COOP/COEP
- [x] `postcss.config.mjs` — PostCSS for Tailwind
- [x] `eslint.config.mjs` — ESLint config

### CI/CD (1 file)
- [x] `.github/workflows/deploy.yml` — GitHub Pages auto-deploy

### Public (7 files)
- [x] `robots.txt` — Crawler rules
- [x] `sitemap.xml` — SEO sitemap
- [x] `favicon.ico` — Favicon
- [x] `ffmpeg-core/ffmpeg-core.js` — FFmpeg WASM JS glue
- [x] `ffmpeg-core/ffmpeg-core.wasm` — FFmpeg WASM binary (~31MB)
- [ ] `file.svg`, `globe.svg`, etc. — Next.js default icons (can remove later)

### Types (1 file)
- [x] `src/types/index.ts` — All TypeScript interfaces

### Lib (10 files)
- [x] `src/lib/ffmpeg.ts` — Lazy singleton FFmpeg loader
- [x] `src/lib/convert.ts` — Format conversion
- [x] `src/lib/trim.ts` — Audio trimming
- [x] `src/lib/merge.ts` — Audio merging (concat)
- [x] `src/lib/extract.ts` — Video-to-audio extraction
- [x] `src/lib/waveform.ts` — Waveform decoding (Web Audio API)
- [x] `src/lib/format.ts` — Utilities (formatFileSize, formatDuration, etc.)
- [x] `src/lib/storage.ts` — localStorage usage + license
- [x] `src/lib/license.ts` — License key validation + generation
- [x] `src/lib/analytics.tsx` — GA4 component

### Components (15 files)
- [x] `src/components/Header.tsx`
- [x] `src/components/UploadZone.tsx`
- [x] `src/components/AudioFileList.tsx`
- [x] `src/components/FormatSelector.tsx`
- [x] `src/components/ConversionControls.tsx`
- [x] `src/components/DownloadButton.tsx`
- [x] `src/components/ToolTabs.tsx`
- [x] `src/components/WaveformCanvas.tsx`
- [x] `src/components/PlaybackControls.tsx`
- [x] `src/components/TrimControls.tsx`
- [x] `src/components/MergeList.tsx`
- [x] `src/components/Paywall.tsx`
- [x] `src/components/LicenseInput.tsx`
- [x] `src/components/FfmpegLoader.tsx`

### App Router (4 files)
- [x] `src/app/layout.tsx` — Root layout + SEO metadata
- [x] `src/app/page.tsx` — Main orchestrator (~900 lines)
- [x] `src/app/globals.css` — Tailwind + theme
- [x] `src/app/privacy/page.tsx` — Privacy policy

### Docs (4 files)
- [x] `docs/requirements.md`
- [x] `docs/tech-spec.md`
- [x] `docs/design-spec.md`
- [x] `docs/execution-plan.md`

## Verification Checklist

- [x] `npm run build` passes with zero errors
- [ ] Deploy to Vercel — user action
- [ ] GitHub Pages auto-deploy verified — user action
- [ ] Real audio file conversion tested
- [ ] Real audio file trimming tested
- [ ] Real audio file merging tested
- [ ] Real video-to-audio extraction tested
- [ ] Free limit enforcement tested (11th operation blocks)
- [ ] License key unlock tested
- [ ] Mobile responsive (375px width)
- [ ] Cross-browser: Chrome, Firefox, Safari
- [ ] GA4 events firing — after GA4 ID configured
