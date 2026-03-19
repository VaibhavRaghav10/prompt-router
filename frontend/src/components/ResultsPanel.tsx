import type { AnalyzeResponse, TaskType } from "@/types/api";
import RecommendationCard from "./RecommendationCard";

interface ResultsPanelProps {
  result: AnalyzeResponse;
}

const TASK_LABELS: Record<TaskType, string> = {
  simple_qa: "Simple Q&A",
  summarization: "Summarization",
  code_generation: "Code Generation",
  creative_writing: "Creative Writing",
  analysis: "Analysis",
  math_reasoning: "Math Reasoning",
  translation: "Translation",
  conversation: "Conversation",
  extraction: "Extraction",
};

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const { task_type, task_confidence, complexity, recommendations } = result;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary bar */}
      <div className="flex flex-wrap items-center gap-3">
        <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-semibold text-accent">
          {TASK_LABELS[task_type]}
        </span>
        <span className="text-xs text-muted">
          Confidence: {(task_confidence * 100).toFixed(0)}%
        </span>
        <span className="text-xs text-muted">•</span>
        <span className="text-xs text-muted">
          Complexity: {(complexity * 100).toFixed(0)}%
        </span>
      </div>

      {/* Complexity bar */}
      <div>
        <div className="mb-1 flex justify-between text-xs text-muted">
          <span>Low</span>
          <span>High</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-card-border">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${complexity * 100}%` }}
          />
        </div>
      </div>

      {/* Recommendations */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Top Recommendations</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((rec, i) => (
            <RecommendationCard key={rec.model.id} rec={rec} rank={i + 1} />
          ))}
        </div>
      </div>
    </div>
  );
}
