export type TaskType =
  | "simple_qa"
  | "summarization"
  | "code_generation"
  | "creative_writing"
  | "analysis"
  | "math_reasoning"
  | "translation"
  | "conversation"
  | "extraction";

export interface Preferences {
  cost: number;
  quality: number;
  speed: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  input_price_per_1k: number;
  output_price_per_1k: number;
  max_context_tokens: number;
  speed_tier: "fast" | "medium" | "slow";
  enabled: boolean;
  capability: Record<string, number>;
}

export interface AnalyzeRequest {
  prompt: string;
  preferences: Preferences;
  models?: ModelInfo[];
}

export interface Recommendation {
  model: ModelInfo;
  score: number;
  estimated_input_tokens: number;
  estimated_output_tokens: number;
  estimated_cost_usd: number;
  reasons: string[];
}

export interface AnalyzeResponse {
  task_type: TaskType;
  task_confidence: number;
  complexity: number;
  features: Record<string, unknown>;
  recommendations: Recommendation[];
}

export interface ModelsResponse {
  models: ModelInfo[];
}
