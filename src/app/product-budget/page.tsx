"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const examples = [
  "Can I afford an iPhone 17 in India?",
  "Search for the price of a laptop under ₹25,000. Can I afford it?",
  "Find the price of a Sony PlayStation 5 in India and check my budget.",
];

export default function ProductBudgetPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage(message: string) {
    const trimmed = message.trim();

    if (!trimmed || loading) return;

    setInput("");
    setError("");
    setMessages((previous) => [
      ...previous,
      { role: "user", content: trimmed },
    ]);
    setLoading(true);

    try {
      const response = await fetch("/api/product-budget", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      const data: { answer?: string; error?: string } = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Something went wrong.");
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: data.answer ?? "No answer was returned.",
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <header>
          <p className="text-sm font-medium text-blue-400">
            MASTRA · AGENTIC AI
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            Product Price & Budget Checker
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Search product prices and check whether they fit your budget of
            ₹25,000.
          </p>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <span className="text-sm text-slate-300">Wallet balance</span>
            <span className="font-semibold text-emerald-400">₹25,000</span>
          </div>

          <div className="flex min-h-64 flex-col gap-4">
            {messages.length === 0 && (
              <div className="my-auto py-8 text-center">
                <p className="text-lg font-medium">What do you want to buy?</p>
                <p className="mt-2 text-sm text-slate-400">
                  Ask me to find a product price and check your budget.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={`${index}-${message.role}`}
                className={`max-w-[90%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-6 ${
                  message.role === "user"
                    ? "self-end bg-blue-600"
                    : "self-start border border-slate-700 bg-slate-800"
                }`}
              >
                <p className="mb-1 text-xs font-semibold opacity-70">
                  {message.role === "user" ? "YOU" : "AGENT"}
                </p>
                {message.content}
              </div>
            ))}

            {loading && (
              <div className="self-start rounded-xl bg-slate-800 px-4 py-3 text-sm text-slate-300">
                Searching and checking your budget…
              </div>
            )}
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-400">
              {error}
            </p>
          )}

          <form
            className="mt-6 flex flex-col gap-3 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
          >
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="e.g. Can I afford a MacBook?"
              disabled={loading}
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm outline-none focus:border-blue-500 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking…" : "Check budget"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-3 text-sm font-semibold text-slate-300">
            Try an example
          </h2>
          <div className="flex flex-col gap-2">
            {examples.map((example) => (
              <button
                key={example}
                type="button"
                disabled={loading}
                onClick={() => void sendMessage(example)}
                className="rounded-xl border border-slate-800 px-4 py-3 text-left text-sm text-slate-300 transition hover:border-slate-600 hover:bg-slate-900 disabled:opacity-50"
              >
                {example}
              </button>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
