"use client";

import Link from "next/link";

interface HeaderProps {
  remaining: number;
  hasLicense: boolean;
  onUpgradeClick?: () => void;
}

export function Header({ remaining, hasLicense, onUpgradeClick }: HeaderProps) {
  return (
    <header className="w-full border-b border-zinc-200 bg-white">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-zinc-900"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500 text-xs font-bold text-white">
            C
          </span>
          Chop
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600">
          {hasLicense ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              Pro
            </span>
          ) : (
            <span className="text-xs text-zinc-400">
              {remaining} free left today
            </span>
          )}
          <Link href="/privacy" className="hover:text-zinc-900 transition-colors">
            Privacy
          </Link>
          {!hasLicense && (
            <button
              onClick={onUpgradeClick}
              className="rounded-lg bg-indigo-500 px-3 py-1.5 text-white hover:bg-indigo-600 transition-colors text-sm font-medium"
            >
              Upgrade
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
