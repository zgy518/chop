"use client";

import { useState } from "react";
import { LicenseInput } from "./LicenseInput";

interface PaywallProps {
  isOpen: boolean;
  onClose: () => void;
  remaining: number;
}

export function Paywall({ isOpen, onClose, remaining }: PaywallProps) {
  const [showLicenseInput, setShowLicenseInput] = useState(false);

  if (!isOpen) return null;

  if (showLicenseInput) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <LicenseInput
          onSuccess={() => {
            setShowLicenseInput(false);
            onClose();
          }}
          onCancel={() => setShowLicenseInput(false)}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
        {/* Icon */}
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
          <svg className="h-7 w-7 text-indigo-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
          </svg>
        </div>

        <h2 className="text-center text-xl font-bold text-zinc-900">
          {remaining <= 0 ? "You've hit the free limit" : "Almost there!"}
        </h2>

        <p className="mt-2 text-center text-sm text-zinc-600">
          {remaining <= 0
            ? "You've used all 10 free operations for today. Upgrade to unlock unlimited access."
            : `${remaining} free operation${remaining === 1 ? "" : "s"} left today.`}
        </p>

        {/* Pricing card */}
        <div className="mt-6 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 p-5 text-center">
          <p className="text-sm font-medium text-zinc-600">Lifetime Access</p>
          <p className="mt-1 text-4xl font-bold text-zinc-900">
            $14<span className="text-lg text-zinc-500">.99</span>
          </p>
          <p className="mt-1 text-xs text-zinc-500">One-time payment. No subscription.</p>

          <ul className="mt-4 space-y-2 text-left text-sm text-zinc-600">
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Unlimited operations
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Files up to 500MB
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> Convert, trim, merge, extract
            </li>
            <li className="flex items-center gap-2">
              <span className="text-emerald-500">✓</span> All output formats supported
            </li>
          </ul>

          {/* Purchase via email */}
          <div className="mt-5 rounded-lg bg-white border border-zinc-200 p-4 text-left">
            <p className="text-sm font-medium text-zinc-700 mb-2">
              To purchase, send an email to:
            </p>
            <a
              href="mailto:18800492787@163.com?subject=Chop%20License%20Purchase"
              className="block text-sm font-mono text-indigo-600 hover:text-indigo-700 break-all"
            >
              18800492787@163.com
            </a>
            <p className="mt-2 text-xs text-zinc-500">
              You&apos;ll receive a license key within 24 hours after payment via PayPal.
            </p>
          </div>
        </div>

        {/* Already have a key */}
        <button
          onClick={() => setShowLicenseInput(true)}
          className="mt-4 w-full text-center text-sm text-zinc-500 hover:text-indigo-600 transition-colors"
        >
          Already have a license key? Enter it here
        </button>

        {/* Close */}
        <button
          onClick={onClose}
          className="mt-3 w-full text-center text-xs text-zinc-400 hover:text-zinc-600 transition-colors"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
}
