import type {
  AnalyzeRequest,
  AnalyzeResponse,
  ModelInfo,
  ModelsResponse,
} from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

async function request<T>(
  path: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ── Analyze ──────────────────────────────────────────────

export function analyzePrompt(
  data: AnalyzeRequest,
): Promise<AnalyzeResponse> {
  return request<AnalyzeResponse>("/api/analyze", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ── Models CRUD ──────────────────────────────────────────

export function listModels(): Promise<ModelsResponse> {
  return request<ModelsResponse>("/api/models");
}

export function addModel(model: ModelInfo): Promise<ModelsResponse> {
  return request<ModelsResponse>("/api/models", {
    method: "POST",
    body: JSON.stringify(model),
  });
}

export function updateModel(model: ModelInfo): Promise<ModelsResponse> {
  return request<ModelsResponse>(`/api/models/${model.id}`, {
    method: "PUT",
    body: JSON.stringify(model),
  });
}

export function deleteModel(modelId: string): Promise<ModelsResponse> {
  return request<ModelsResponse>(`/api/models/${modelId}`, {
    method: "DELETE",
  });
}

export function resetModelsToDefaults(): Promise<ModelsResponse> {
  return request<ModelsResponse>("/api/models/defaults");
}
