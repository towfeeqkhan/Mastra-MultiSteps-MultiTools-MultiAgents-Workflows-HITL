import { Mastra } from "@mastra/core";
import { productBudgetAgent } from "./agents/product-budget-agent";

export const mastra = new Mastra({
  agents: {
    productBudgetAgent,
  },
});
