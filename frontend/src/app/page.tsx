"use client";

import { useState } from "react";
import type { AnalyzeResponse, Preferences } from "@/types/api";
import { analyzePrompt } from "@/lib/api";
import PromptInput from "@/components/PromptInput";
import PreferenceSliders from "@/components/PreferenceSliders";
import ResultsPanel from "@/components/ResultsPanel";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [preferences, setPreferences] = useState<Preferences>({
    cost: 0.33,
    quality: 0.34,
    speed: 0.33,
  });
  const [result, setResult] = useState<AnalyzeResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzePrompt({ prompt, preferences });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Prompt Analyzer</h1>
        <p className="mt-1 text-sm text-muted">
          Paste a prompt to find the most cost-effective model for the job.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <PromptInput
          value={prompt}
          onChange={setPrompt}
          onSubmit={handleAnalyze}
          loading={loading}
        />
        <PreferenceSliders
          preferences={preferences}
          onChange={setPreferences}
        />
      </div>

      {error && (
        <div className="rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {result && <ResultsPanel result={result} />}
    </div>
  );
}
