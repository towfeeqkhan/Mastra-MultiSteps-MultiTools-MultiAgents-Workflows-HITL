import { Mastra } from "@mastra/core";
import { researchAgent } from "./agents/research-agent";
import { reportWriterAgent } from "./agents/report-writer-agent";
import { researchReportWorkflow } from "./workflows/research-report-workflow";
// import { productBudgetAgent } from "./agents/product-budget-agent";

export const mastra = new Mastra({
  agents: {
    // productBudgetAgent,
    researchAgent,
    reportWriterAgent,
  },

  workflows: {
    researchReportWorkflow,
  },
});
