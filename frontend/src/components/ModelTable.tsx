"use client";

import type { ModelInfo } from "@/types/api";

interface ModelTableProps {
  models: ModelInfo[];
  onEdit: (model: ModelInfo) => void;
  onDelete: (modelId: string) => void;
}

export default function ModelTable({ models, onEdit, onDelete }: ModelTableProps) {
  if (models.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted">No models configured.</p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-card-border">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-card-border bg-card text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Model</th>
            <th className="px-4 py-3 font-medium">Provider</th>
            <th className="px-4 py-3 font-medium text-right">Input $/1k</th>
            <th className="px-4 py-3 font-medium text-right">Output $/1k</th>
            <th className="px-4 py-3 font-medium text-center">Speed</th>
            <th className="px-4 py-3 font-medium text-center">Enabled</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {models.map((m) => (
            <tr
              key={m.id}
              className="border-b border-card-border last:border-0 hover:bg-card/50"
            >
              <td className="px-4 py-3 font-medium">{m.name}</td>
              <td className="px-4 py-3 text-muted">{m.provider}</td>
              <td className="px-4 py-3 text-right font-mono">
                ${m.input_price_per_1k.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-right font-mono">
                ${m.output_price_per_1k.toFixed(2)}
              </td>
              <td className="px-4 py-3 text-center">
                <span
                  className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                    m.speed_tier === "fast"
                      ? "bg-success/10 text-success"
                      : m.speed_tier === "medium"
                        ? "bg-accent/10 text-accent"
                        : "bg-danger/10 text-danger"
                  }`}
                >
                  {m.speed_tier}
                </span>
              </td>
              <td className="px-4 py-3 text-center">
                {m.enabled ? "✓" : "—"}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onEdit(m)}
                  className="mr-2 text-xs font-medium text-accent hover:text-accent-hover"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(m.id)}
                  className="text-xs font-medium text-danger hover:text-danger-hover"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
