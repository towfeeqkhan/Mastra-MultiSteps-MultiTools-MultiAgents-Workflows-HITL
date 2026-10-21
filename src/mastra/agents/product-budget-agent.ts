import { Agent } from "@mastra/core/agent";
import { searchProductPrice } from "../tools/search-product-price";
import { checkBudget } from "../tools/check-budget";

import { tokenHarbor } from "../models";

export const productBudgetAgent = new Agent({
  id: "product-budget-agent",

  name: "Product Price & Budget Checker",

  instructions: `
You help users determine whether they can afford a product.

Follow these rules:

1. Ask for the product name if the user has not provided one.
2. Use searchProductPrice to find the product's price.
3. Prefer INR because the user's wallet balance is in INR.
4. Inspect the tool result before taking the next step.
5. If the price is a valid number and the currency is INR,
   call checkBudget using the exact price returned by
   searchProductPrice.
6. If the price is null or unknown, do not call checkBudget.
   Explain that you could not confidently find a price.
7. Never invent a price or a tool result.
8. In your final answer, explain the product price, whether
   it fits the budget, and the source URL when available.
9. The wallet balance is maintained by the checkBudget tool.
   Do not calculate or guess the wallet balance yourself.
`,

  model: tokenHarbor("gpt-6-luna"),

  tools: {
    searchProductPrice,
    checkBudget,
  },
});
