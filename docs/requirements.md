# Chop — Product Requirements

## Problem

Content creators (podcasters, YouTubers, TikTokers) need quick audio processing — format conversion, trimming, merging, video audio extraction. Existing online tools either:
- Upload files to untrusted servers (privacy risk)
- Cost $9-49/month subscriptions
- Are slow pure-JS implementations

## Solution

Chop — privacy-first browser audio toolkit. All processing happens client-side via FFmpeg.wasm + Web Audio API. Files never leave the user's device.

## Target Users

English-speaking content creators who:
- Value privacy (don't want files uploaded)
- Need quick, simple audio processing
- Won't pay monthly subscriptions

## Core Features

### 1. Format Conversion
- Input: any audio format FFmpeg supports
- Output: MP3, WAV, FLAC, AAC (M4A), OGG
- Options: quality (128/192/320 kbps), speed change (0.5x-2x), volume normalization

### 2. Audio Trimming
- Upload → see waveform → drag handles → trim → download
- Waveform visualization via Canvas + Web Audio API
- Playback preview with play/pause
- Fade in/out options (0-5 seconds)
- Zoom: 1x, 2x, 4x, 8x

### 3. Audio Merging
- Multiple audio files → reorder → merge into one
- Supports mixed formats
- Output: MP3, WAV, FLAC, AAC, OGG

### 4. Video-to-Audio Extraction
- Input: MP4, MKV, MOV, WebM
- Output: MP3, WAV, FLAC, AAC, OGG
- Optional volume normalization

## Monetization

| Tier | Price | Daily Ops | Max File Size |
|------|-------|-----------|---------------|
| Free | $0 | 10/day | 100MB |
| Pro | $14.99 lifetime | Unlimited | 500MB |

Payment flow (MVP): User emails → PayPal link → manual key delivery

## Constraints

1. **Zero budget**: All services must use free tiers
2. **Client-side only**: Core processing in browser, no backend
3. **English UI**: Target overseas English-speaking market
4. **No user accounts**: License stored in localStorage
