"use client";

import type { Preferences } from "@/types/api";

interface PreferenceSlidersProps {
  preferences: Preferences;
  onChange: (preferences: Preferences) => void;
}

const DIMENSIONS: { key: keyof Preferences; label: string; color: string }[] = [
  { key: "cost", label: "Cost efficiency", color: "accent-emerald-500" },
  { key: "quality", label: "Quality", color: "accent-violet-500" },
  { key: "speed", label: "Speed", color: "accent-amber-500" },
];

export default function PreferenceSliders({
  preferences,
  onChange,
}: PreferenceSlidersProps) {
  const handleChange = (key: keyof Preferences, raw: number) => {
    onChange({ ...preferences, [key]: raw / 100 });
  };

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <h3 className="mb-3 text-sm font-medium">Preferences</h3>
      <div className="flex flex-col gap-4">
        {DIMENSIONS.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-xs text-muted">{label}</span>
            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(preferences[key] * 100)}
              onChange={(e) => handleChange(key, Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-card-border accent-accent"
            />
            <span className="w-10 text-right font-mono text-xs text-muted">
              {Math.round(preferences[key] * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
