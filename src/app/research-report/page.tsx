"use client";

import { useState } from "react";

type ReportResult = {
  topic: string;
  researchNotes: string;
  finalReport: string;
};

export default function ResearchReportPage() {
  const [topic, setTopic] = useState("AI agents in education");
  const [result, setResult] = useState<ReportResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateReport(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/research-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Failed to generate the report.");
      }

      setResult(data as ReportResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-blue-400">
            MASTRA · MULTI-AGENT ORCHESTRATION
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Research & Report Generator
          </h1>
          <p className="mt-3 text-slate-400">
            One agent researches the topic. Another turns its notes into a
            structured report.
          </p>
        </header>

        <form
          onSubmit={generateReport}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <label
            htmlFor="topic"
            className="block text-sm font-medium text-slate-200"
          >
            What topic should the agents work on?
          </label>

          <textarea
            id="topic"
            value={topic}
            onChange={(event) => setTopic(event.target.value)}
            minLength={3}
            required
            rows={3}
            disabled={loading}
            placeholder="e.g. Benefits and risks of AI in healthcare"
            className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading || topic.trim().length < 3}
            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? "Agents are working…" : "Generate report"}
          </button>

          {loading && (
            <p className="text-sm text-slate-400">
              Research Agent runs first, followed by Report Writer. Check your
              server terminal for workflow step logs.
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </form>

        {result && (
          <div className="space-y-5">
            <section className="rounded-2xl border border-blue-900 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold text-blue-300">
                Step 1 · Research Agent output
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                These are the notes passed to the second agent.
              </p>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-200">
                {result.researchNotes}
              </pre>
            </section>

            <section className="rounded-2xl border border-emerald-900 bg-slate-900 p-5">
              <h2 className="text-xl font-semibold text-emerald-300">
                Step 2 · Report Writer output
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                The final report generated from the research notes.
              </p>
              <pre className="mt-4 whitespace-pre-wrap font-sans text-sm leading-7 text-slate-200">
                {result.finalReport}
              </pre>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
