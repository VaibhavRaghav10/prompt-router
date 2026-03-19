"use client";

import { useState, useEffect } from "react";
import type { ModelInfo, TaskType } from "@/types/api";

interface ModelFormModalProps {
  initial?: ModelInfo | null;
  onSave: (model: ModelInfo) => void;
  onClose: () => void;
}

const TASK_TYPES: TaskType[] = [
  "simple_qa",
  "summarization",
  "code_generation",
  "creative_writing",
  "analysis",
  "math_reasoning",
  "translation",
  "conversation",
  "extraction",
];

const EMPTY_MODEL: ModelInfo = {
  id: "",
  name: "",
  provider: "",
  input_price_per_1k: 0,
  output_price_per_1k: 0,
  max_context_tokens: 4096,
  speed_tier: "medium",
  enabled: true,
  capability: Object.fromEntries(TASK_TYPES.map((t) => [t, 0.5])),
};

export default function ModelFormModal({
  initial,
  onSave,
  onClose,
}: ModelFormModalProps) {
  const [form, setForm] = useState<ModelInfo>(initial ?? EMPTY_MODEL);

  useEffect(() => {
    setForm(initial ?? EMPTY_MODEL);
  }, [initial]);

  const set = <K extends keyof ModelInfo>(key: K, value: ModelInfo[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const setCap = (task: string, value: number) =>
    setForm((prev) => ({
      ...prev,
      capability: { ...prev.capability, [task]: value },
    }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-xl border border-card-border bg-card p-6 shadow-xl"
      >
        <h2 className="text-lg font-semibold">
          {initial ? "Edit Model" : "Add Model"}
        </h2>

        {/* Basic fields */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="ID" value={form.id} onChange={(v) => set("id", v)} disabled={!!initial} />
          <Field label="Name" value={form.name} onChange={(v) => set("name", v)} />
          <Field label="Provider" value={form.provider} onChange={(v) => set("provider", v)} />
          <div>
            <label className="mb-1 block text-xs text-muted">Speed tier</label>
            <select
              value={form.speed_tier}
              onChange={(e) => set("speed_tier", e.target.value as ModelInfo["speed_tier"])}
              className="w-full rounded-md border border-card-border bg-background px-3 py-1.5 text-sm"
            >
              <option value="fast">fast</option>
              <option value="medium">medium</option>
              <option value="slow">slow</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <NumField label="Input $/1k" value={form.input_price_per_1k} onChange={(v) => set("input_price_per_1k", v)} />
          <NumField label="Output $/1k" value={form.output_price_per_1k} onChange={(v) => set("output_price_per_1k", v)} />
          <NumField label="Max tokens" value={form.max_context_tokens} onChange={(v) => set("max_context_tokens", Math.round(v))} step={1} />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.enabled}
            onChange={(e) => set("enabled", e.target.checked)}
            className="accent-accent"
          />
          Enabled
        </label>

        {/* Capability scores */}
        <div>
          <h3 className="mb-2 text-xs font-medium text-muted">
            Capability scores (0–1)
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {TASK_TYPES.map((t) => (
              <div key={t} className="flex items-center gap-2">
                <span className="w-28 shrink-0 truncate text-xs text-muted">
                  {t.replace(/_/g, " ")}
                </span>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={form.capability[t] ?? 0}
                  onChange={(e) => setCap(t, Number(e.target.value))}
                  className="w-16 rounded-md border border-card-border bg-background px-2 py-1 text-xs"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-4 py-1.5 text-sm text-muted hover:text-foreground"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-1.5 text-sm font-medium text-white hover:bg-accent-hover"
          >
            {initial ? "Update" : "Add"}
          </button>
        </div>
      </form>
    </div>
  );
}

/* ── tiny field helpers ─────────────────────────────────── */

function Field({
  label,
  value,
  onChange,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted">{label}</label>
      <input
        required
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-card-border bg-background px-3 py-1.5 text-sm disabled:opacity-50"
      />
    </div>
  );
}

function NumField({
  label,
  value,
  onChange,
  step = 0.01,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted">{label}</label>
      <input
        required
        type="number"
        min={0}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full rounded-md border border-card-border bg-background px-3 py-1.5 text-sm"
      />
    </div>
  );
}
