import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Chop",
  description: "Chop privacy policy — all audio processing is done locally in your browser.",
};

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center px-4 sm:px-6">
        <Link href="/" className="text-sm text-indigo-500 hover:text-indigo-600">
          ← Back to Chop
        </Link>
      </header>

      <main className="flex-1 mx-auto max-w-2xl px-4 py-16 w-full">
        <h1 className="text-3xl font-bold text-zinc-900">Privacy Policy</h1>
        <p className="mt-2 text-sm text-zinc-500">Last updated: July 2026</p>

        <section className="mt-8 space-y-6 text-sm text-zinc-600 leading-relaxed">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Local Processing</h2>
            <p className="mt-2">
              All audio processing in Chop happens entirely in your browser using
              WebAssembly (FFmpeg.wasm) and the Web Audio API. Your files are
              <strong> never uploaded to any server</strong>. Chop does not collect,
              store, or transmit your audio files.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Data Storage</h2>
            <p className="mt-2">
              Chop stores usage counts and license information locally in your
              browser&apos;s localStorage. This data never leaves your device. You can
              clear it at any time by clearing your browser data.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Analytics</h2>
            <p className="mt-2">
              Chop may use Google Analytics (GA4) for anonymous usage measurement.
              GA4 uses cookies for basic analytics. No personally identifiable
              information is collected. You can opt out using your browser&apos;s
              privacy settings.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Cookies</h2>
            <p className="mt-2">
              Chop does not use its own cookies. Third-party services (GA4) may set
              cookies for anonymous analytics purposes only.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-900">Contact</h2>
            <p className="mt-2">
              For questions about this privacy policy, contact us via{" "}
              <a
                href="https://github.com/zgy518/chop/issues"
                className="text-indigo-500 hover:text-indigo-600"
              >
                GitHub Issues
              </a>
              .
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
