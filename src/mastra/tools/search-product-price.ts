import { createTool } from "@mastra/core/tools";
import { tavily } from "@tavily/core";
import { z } from "zod";

type Currency = "INR" | "USD";

function extractPrice(text: string, currency: Currency): number | null {
  const numberPattern = String.raw`(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+(?:\.\d{1,2})?)`;

  const currencyPattern =
    currency === "INR"
      ? String.raw`(?:₹\s*|INR\s*|Rs\.?\s*)`
      : String.raw`(?:\$\s*|USD\s*)`;

  const amountPattern = new RegExp(currencyPattern + numberPattern, "gi");

  const amounts = [...text.matchAll(amountPattern)].map((match) => ({
    amount: Number(match[1].replace(/,/g, "")),
    index: match.index ?? 0,
  }));

  if (amounts.length === 0) return null;

  // Prefer an amount explicitly associated with a product's price.
  const priorityPatterns = [
    new RegExp(
      String.raw`(?:retail|selling|current|listed)\s+price\s+(?:is|of|at|to)?\s*${currencyPattern}${numberPattern}`,
      "i",
    ),
    new RegExp(
      String.raw`price\s+(?:starts?\s+from|is|of|at)\s*${currencyPattern}${numberPattern}`,
      "i",
    ),
  ];

  for (const pattern of priorityPatterns) {
    const match = text.match(pattern);

    if (match) {
      const amount = Number(match[1].replace(/,/g, ""));

      if (Number.isFinite(amount) && amount > 0) {
        return amount;
      }
    }
  }

  // Fallback: first explicitly marked amount.
  // This is a heuristic, not guaranteed price verification.
  const firstAmount = amounts[0].amount;

  return Number.isFinite(firstAmount) && firstAmount > 0 ? firstAmount : null;
}

export const searchProductPrice = createTool({
  id: "search-product-price",

  description:
    "Search the web for a product's price. Return a numeric price only " +
    "when an explicit currency marker is found in a search result. " +
    "Use this before checking the user's budget.",

  inputSchema: z.object({
    productName: z.string().describe("The product to search for"),
    currency: z.enum(["INR", "USD"]).default("INR"),
  }),

  outputSchema: z.object({
    productName: z.string(),
    price: z.number().nullable(),
    currency: z.enum(["INR", "USD"]),
    sourceUrl: z.string().nullable(),
    sourceTitle: z.string().nullable(),
    searchSummary: z.string(),
  }),

  execute: async ({ productName, currency }) => {
    const apiKey = process.env.TAVILY_API_KEY;

    if (!apiKey) {
      throw new Error("Missing TAVILY_API_KEY environment variable.");
    }

    const client = tavily({ apiKey });

    const response = await client.search(
      `${productName} price ${currency === "INR" ? "India rupees" : "US dollars"}`,
      {
        maxResults: 5,
        searchDepth: "advanced",
      },
    );

    const results = response.results ?? [];

    const summary = results
      .map(
        (result, index) =>
          `${index + 1}. ${result.title}\n` +
          `URL: ${result.url}\n` +
          `Content: ${result.content}`,
      )
      .join("\n\n");

    // Find the first result containing an explicitly marked price.
    const priceResult = results.find(
      (result) =>
        extractPrice(`${result.title}\n${result.content}`, currency) !== null,
    );

    const price = priceResult
      ? extractPrice(`${priceResult.title}\n${priceResult.content}`, currency)
      : null;

    return {
      productName,
      price,
      currency,
      sourceUrl: priceResult?.url ?? results[0]?.url ?? null,
      sourceTitle: priceResult?.title ?? results[0]?.title ?? null,
      searchSummary: summary || "No relevant search results were found.",
    };
  },
});
