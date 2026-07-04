import type { Metadata } from "next";
import { GoogleAnalytics } from "@/lib/analytics";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chop — Free Online Audio Toolkit | Convert, Trim, Merge, Extract",
  description:
    "Convert, trim, merge, and extract audio files right in your browser. 100% private — your files never leave your device. No uploads, no installs.",
  keywords: [
    "audio converter",
    "convert wav to mp3",
    "audio trimmer",
    "audio merger",
    "extract audio from video",
    "online audio editor",
    "free audio tools",
    "privacy first audio",
    "convert flac to mp3",
  ],
  openGraph: {
    title: "Chop — Free Online Audio Toolkit",
    description:
      "Convert, trim, merge, and extract audio files right in your browser. 100% private — your files never leave your device.",
    type: "website",
  },
  robots: "index, follow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Chop",
              description:
                "Free online audio toolkit. Convert, trim, merge, and extract audio — 100% private, all processing happens in your browser.",
              applicationCategory: "MultimediaApplication",
              operatingSystem: "Any",
              url: "https://zgy518.github.io/chop/",
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-zinc-50">
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
