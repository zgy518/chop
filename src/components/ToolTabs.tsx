"use client";

import type { ToolTab } from "@/types";

interface ToolTabsProps {
  active: ToolTab;
  onChange: (tab: ToolTab) => void;
}

const TABS: { id: ToolTab; label: string; icon: string }[] = [
  { id: "convert", label: "Convert", icon: "🔄" },
  { id: "trim", label: "Trim", icon: "✂️" },
  { id: "merge", label: "Merge", icon: "🔗" },
  { id: "extract", label: "Extract Audio", icon: "📹" },
];

export function ToolTabs({ active, onChange }: ToolTabsProps) {
  return (
    <div className="flex border-b border-zinc-200 bg-white rounded-t-2xl">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`
            flex-1 flex items-center justify-center gap-1.5 px-3 py-3 text-sm font-medium
            transition-all duration-200 border-b-2
            ${
              active === tab.id
                ? "border-indigo-500 text-indigo-600 bg-indigo-50/50"
                : "border-transparent text-zinc-500 hover:text-zinc-700 hover:bg-zinc-50"
            }
          `}
        >
          <span className="text-base">{tab.icon}</span>
          <span className="hidden sm:inline">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}
