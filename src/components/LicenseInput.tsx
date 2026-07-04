"use client";

import { useState } from "react";
import { validateLicenseKey } from "@/lib/license";

interface LicenseInputProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function LicenseInput({ onSuccess, onCancel }: LicenseInputProps) {
  const [key, setKey] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const handleSubmit = async () => {
    setError("");
    setChecking(true);

    // Small delay for UX feedback
    await new Promise((r) => setTimeout(r, 500));

    const result = validateLicenseKey(key);
    if (result.valid) {
      onSuccess();
    } else {
      setError(result.error || "Invalid key");
    }
    setChecking(false);
  };

  return (
    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
      <button
        onClick={onCancel}
        className="mb-3 text-sm text-zinc-500 hover:text-zinc-700 transition-colors"
      >
        &larr; Back
      </button>

      <h3 className="text-lg font-bold text-zinc-900">Enter License Key</h3>
      <p className="mt-1 text-sm text-zinc-500">
        Enter the license key you received after purchase.
      </p>

      <div className="mt-4">
        <input
          type="text"
          value={key}
          onChange={(e) => {
            setKey(e.target.value.toUpperCase());
            setError("");
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="CHOP-XXXX-XXXX-XXXX"
          maxLength={24}
          disabled={checking}
          className="w-full rounded-xl border border-zinc-300 px-4 py-3 text-sm font-mono
            placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none
            focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
          autoFocus
        />

        {error && (
          <p className="mt-2 text-xs text-red-600">{error}</p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={checking || !key.trim()}
        className="mt-4 w-full rounded-xl bg-indigo-500 px-4 py-3 text-sm font-semibold text-white
          hover:bg-indigo-600 active:scale-[0.98] transition-all duration-200
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {checking ? "Validating..." : "Activate License"}
      </button>
    </div>
  );
}
