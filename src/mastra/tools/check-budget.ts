import { createTool } from "@mastra/core/tools";
import { z } from "zod";

const WALLET_BALANCE = 25_000;

export const checkBudget = createTool({
  id: "check-budget",

  description:
    "Check whether a product is affordable using its price and currency. " +
    "Use this after searchProductPrice returns a valid numeric price. " +
    "Do not call this tool if the price is unknown or the currencies differ.",

  inputSchema: z.object({
    productPrice: z.number().positive().describe("The product price"),
    productCurrency: z.enum(["INR", "USD"]),
  }),

  outputSchema: z.object({
    productPrice: z.number(),
    productCurrency: z.enum(["INR", "USD"]),
    walletBalance: z.number(),
    walletCurrency: z.literal("INR"),
    affordable: z.boolean(),
    difference: z.number(),
    message: z.string(),
  }),

  execute: async ({ productPrice, productCurrency }) => {
    if (productCurrency !== "INR") {
      throw new Error(
        "Currency mismatch: the wallet balance is in INR. Search for the product in INR before checking affordability.",
      );
    }

    const affordable = productPrice <= WALLET_BALANCE;
    const difference = Math.abs(WALLET_BALANCE - productPrice);

    return {
      productPrice,
      productCurrency,
      walletBalance: WALLET_BALANCE,
      walletCurrency: "INR" as const,
      affordable,
      difference,
      message: affordable
        ? `You can afford it. ₹${difference.toLocaleString("en-IN")} will remain in your wallet.`
        : `You cannot afford it yet. You need ₹${difference.toLocaleString("en-IN")} more.`,
    };
  },
});
