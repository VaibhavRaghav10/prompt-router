import type { Recommendation } from "@/types/api";

interface RecommendationCardProps {
  rec: Recommendation;
  rank: number;
}

export default function RecommendationCard({
  rec,
  rank,
}: RecommendationCardProps) {
  const { model, score, estimated_cost_usd, estimated_input_tokens, estimated_output_tokens, reasons } = rec;

  return (
    <div className="rounded-lg border border-card-border bg-card p-4">
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
            {rank}
          </span>
          <div>
            <h4 className="text-sm font-semibold">{model.name}</h4>
            <span className="text-xs text-muted">{model.provider}</span>
          </div>
        </div>
        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
          {(score * 100).toFixed(1)}%
        </span>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-md bg-background px-2 py-1.5 text-center">
          <div className="text-muted">Cost</div>
          <div className="font-mono font-medium">
            ${estimated_cost_usd.toFixed(4)}
          </div>
        </div>
        <div className="rounded-md bg-background px-2 py-1.5 text-center">
          <div className="text-muted">In tokens</div>
          <div className="font-mono font-medium">{estimated_input_tokens.toLocaleString()}</div>
        </div>
        <div className="rounded-md bg-background px-2 py-1.5 text-center">
          <div className="text-muted">Out tokens</div>
          <div className="font-mono font-medium">{estimated_output_tokens.toLocaleString()}</div>
        </div>
      </div>

      <ul className="flex flex-col gap-1">
        {reasons.map((r, i) => (
          <li key={i} className="text-xs leading-relaxed text-muted">
            • {r}
          </li>
        ))}
      </ul>
    </div>
  );
}
