"use client";

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function PromptInput({
  value,
  onChange,
  onSubmit,
  loading,
}: PromptInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor="prompt" className="text-sm font-medium">
        Enter your prompt
      </label>
      <textarea
        id="prompt"
        rows={5}
        placeholder="Paste or type a prompt to analyze..."
        className="w-full resize-y rounded-lg border border-card-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit();
        }}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        className="self-start rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Analyzing…" : "Analyze"}
      </button>
    </div>
  );
}
