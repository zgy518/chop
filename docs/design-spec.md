# Chop — Design Specification

## Brand Identity

- **Name**: Chop — short, action-oriented, memorable
- **Tagline**: "Your audio never leaves your device"
- **Tone**: Professional but friendly, privacy-forward

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| Background | `#fafafa` (zinc-50) | Page background |
| Foreground | `#18181b` (zinc-900) | Primary text |
| Primary | `indigo-500` (#6366f1) | Buttons, tabs, accents |
| Success | `emerald-500` (#10b981) | Done status |
| Error | `red-500` (#ef4444) | Errors |
| Border | `zinc-200` (#e4e4e7) | Cards, inputs |
| Muted text | `zinc-400/500` | Secondary text, labels |

## Typography

- System font stack (no custom font)
- Body: 14px (text-sm), Headings: 16-20px (text-base/text-lg)
- Tabular numbers for durations/sizes: `tabular-nums`

## Component Style

### Buttons
```
rounded-xl bg-indigo-500 px-6 py-2.5 text-sm font-semibold text-white
hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
disabled:opacity-50 disabled:cursor-not-allowed
```

### Cards
```
rounded-2xl border border-zinc-200 bg-white p-6
```

### Inputs/Selects
```
rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900
focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500
disabled:opacity-50 disabled:cursor-not-allowed
```

### Tabs
- Active: `border-b-2 border-indigo-500 text-indigo-600`
- Inactive: `text-zinc-500 hover:text-zinc-700`

## Layout

### Desktop (>=768px)
- Max width: `max-w-4xl`, centered
- Cards: full width in single column

### Mobile (<768px)
- Same layout, responsive flex-wrap
- Buttons full-width on very small screens

## Pages

### Main Page (/)
- Header with logo + privacy link + upgrade button
- Usage counter (free ops left / pro badge)
- 4 tool tabs
- Feature cards (when no files loaded)
- Processing overlay during heavy operations

### Privacy Policy (/privacy)
- Simple static page
- Explains: no uploads, no tracking (beyond GA4), no accounts

## Empty States

Each tool tab shows tailored empty state:
- Convert: "Drop audio files to convert"
- Trim: "Upload an audio file to trim"
- Merge: "Upload files to merge"
- Extract: "Drop a video to extract audio"

## Error States

- Invalid file type: inline warning in upload zone
- FFmpeg load failure: full-page error with retry button
- Processing failure: per-file error in AudioFileList
