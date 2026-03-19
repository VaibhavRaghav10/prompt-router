"use client";

import { useEffect, useState, useCallback } from "react";
import type { ModelInfo } from "@/types/api";
import {
  listModels,
  addModel,
  updateModel,
  deleteModel,
  resetModelsToDefaults,
} from "@/lib/api";
import ModelTable from "@/components/ModelTable";
import ModelFormModal from "@/components/ModelFormModal";

export default function ModelsPage() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // null = closed, undefined = new model, ModelInfo = editing
  const [editing, setEditing] = useState<ModelInfo | undefined | null>(null);

  const fetchModels = useCallback(async () => {
    try {
      const data = await listModels();
      setModels(data.models);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load models");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  const handleSave = async (model: ModelInfo) => {
    try {
      const data = editing
        ? await updateModel(model)
        : await addModel(model);
      setModels(data.models);
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const data = await deleteModel(id);
      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const handleReset = async () => {
    try {
      const data = await resetModelsToDefaults();
      setModels(data.models);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Reset failed");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Model Registry</h1>
          <p className="mt-1 text-sm text-muted">
            Manage the LLM models available for recommendation.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="rounded-md border border-card-border px-3 py-1.5 text-sm text-muted transition-colors hover:text-foreground"
          >
            Reset to Defaults
          </button>
          <button
            onClick={() => setEditing(undefined)}
            className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
          >
            Add Model
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {loading ? (
        <p className="py-8 text-center text-sm text-muted">Loading…</p>
      ) : (
        <ModelTable
          models={models}
          onEdit={(m) => setEditing(m)}
          onDelete={handleDelete}
        />
      )}

      {editing !== null && (
        <ModelFormModal
          initial={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </div>
  );
}
