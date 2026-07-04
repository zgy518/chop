"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

function generateKey(): string {
  const prefixes = [
    "c8a1", "d3f7", "e5b9", "f2c4",
    "a6e2", "b1d8", "f9c3", "e4a7",
  ];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const seg = (): string =>
    Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CHOP-${(prefix + seg() + seg() + seg()).slice(0, 4).toUpperCase()}-${seg()}-${seg()}`;
}

export default function ThankYouPage() {
  const [key, setKey] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setKey(generateKey());
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50">
      <header className="h-14 border-b border-zinc-200 bg-white flex items-center px-4 sm:px-6">
        <Link href="/" className="text-sm text-indigo-500 hover:text-indigo-600">
          ← Back to Chop
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          {/* Success icon */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-500" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <h1 className="mt-6 text-2xl font-bold text-zinc-900">Thank you for your purchase!</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your license key is ready. Copy it and paste it into the license activation dialog.
          </p>

          {/* License key */}
          <div className="mt-6 rounded-lg border-2 border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-medium text-emerald-700 mb-2">YOUR LICENSE KEY</p>
            {key ? (
              <p className="text-xl font-mono font-bold text-zinc-900 tracking-wide break-all">
                {key}
              </p>
            ) : (
              <div className="h-8 w-48 mx-auto bg-zinc-200 rounded animate-pulse" />
            )}
            <button
              onClick={handleCopy}
              disabled={!key || copied}
              className={`mt-3 inline-flex items-center gap-1.5 rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                copied
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200"
              }`}
            >
              {copied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" />
                  </svg>
                  Copy Key
                </>
              )}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 rounded-lg bg-white border border-zinc-200 p-4 text-left">
            <h2 className="text-sm font-semibold text-zinc-900">How to activate:</h2>
            <ol className="mt-2 space-y-1.5 text-sm text-zinc-600 list-decimal list-inside">
              <li>Copy the license key above</li>
              <li>Go back to Chop and click &quot;Already have a license key?&quot;</li>
              <li>Paste your key and click Activate</li>
            </ol>
          </div>

          <Link
            href="/"
            className="mt-4 inline-block text-sm text-indigo-500 hover:text-indigo-600"
          >
            ← Open Chop
          </Link>
        </div>
      </main>
    </div>
  );
}
