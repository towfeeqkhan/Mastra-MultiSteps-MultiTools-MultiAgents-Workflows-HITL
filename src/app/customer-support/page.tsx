"use client";

import { useState } from "react";

export default function CustomerSupportPage() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage || loading) return;

    setLoading(true);
    setResponse("");
    setError("");

    try {
      const res = await fetch("/api/customer-support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmedMessage }),
      });

      const data: { answer?: string; error?: string } = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get a response.");
      }

      setResponse(data.answer ?? "No response was returned.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-12 text-white">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <p className="text-sm font-semibold text-blue-400">
            MASTRA · MULTI-AGENT ORCHESTRATION
          </p>

          <h1 className="mt-2 text-3xl font-bold">AI Customer Support</h1>

          <p className="mt-2 text-slate-400">
            Ask a billing or technical support question.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Describe your issue..."
            disabled={loading}
            required
            className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500 disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={loading || !message.trim()}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </form>

        <section
          aria-live="polite"
          className="min-h-40 rounded-2xl border border-slate-800 bg-slate-900 p-5"
        >
          <h2 className="mb-3 text-sm font-semibold text-slate-300">
            Response
          </h2>

          {loading && (
            <p className="text-sm text-slate-400">
              The supervisor is reviewing your request and consulting the
              appropriate specialist...
            </p>
          )}

          {!loading && !response && !error && (
            <p className="text-sm text-slate-500">
              Your response will appear here.
            </p>
          )}

          {response && (
            <p className="whitespace-pre-wrap text-sm leading-7 text-slate-200">
              {response}
            </p>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-400">
              {error}
            </p>
          )}
        </section>
      </div>
    </main>
  );
}
