import { Mastra } from "@mastra/core";
import { researchAgent } from "./agents/research-agent";
import { reportWriterAgent } from "./agents/report-writer-agent";
import { researchReportWorkflow } from "./workflows/research-report-workflow";
import { billingAgent } from "./agents/billing-agent";
import { technicalSupportAgent } from "./agents/technical-support-agent";
import { supportSupervisorAgent } from "./agents/support-supervisor-agent";
// import { productBudgetAgent } from "./agents/product-budget-agent";

export const mastra = new Mastra({
  agents: {
    // productBudgetAgent,
    // researchAgent,
    // reportWriterAgent,
    billingAgent,
    technicalSupportAgent,
    supportSupervisorAgent,
  },

  // workflows: {
  //   researchReportWorkflow,
  // },
});
