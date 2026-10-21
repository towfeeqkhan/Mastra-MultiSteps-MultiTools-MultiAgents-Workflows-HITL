import { createStep, createWorkflow } from "@mastra/core/workflows";
import { researchAgent } from "../agents/research-agent";
import { reportWriterAgent } from "../agents/report-writer-agent";
import { z } from "zod";

// Step 1: Research the requested topic.
const researchStep = createStep({
  id: "research-topic",

  inputSchema: z.object({
    topic: z.string(),
  }),

  outputSchema: z.object({
    topic: z.string(),
    researchNotes: z.string(),
  }),

  execute: async ({ inputData }) => {
    console.log("Step 1 Research Agent Started");

    const result = await researchAgent.generate(
      `Research the following topic and return organized research notes:\n\n${inputData.topic}`,
    );

    console.log("Step 1: Research Agent completed");

    return {
      topic: inputData.topic,
      researchNotes: result.text,
    };
  },
});

// Step 2: Use the research notes to write the report.
const reportWritingStep = createStep({
  id: "write-report",

  inputSchema: z.object({
    topic: z.string(),
    researchNotes: z.string(),
  }),

  outputSchema: z.object({
    topic: z.string(),
    researchNotes: z.string(),
    finalReport: z.string(),
  }),

  execute: async ({ inputData }) => {
    console.log("Step 2: Report Writer Agent started");

    const result = await reportWriterAgent.generate(`
Write a report about this topic:

${inputData.topic}

Use the following research notes from the Research Agent:

${inputData.researchNotes}
`);

    console.log("Step 2: Report Writer Agent completed");

    return {
      topic: inputData.topic,
      researchNotes: inputData.researchNotes,
      finalReport: result.text,
    };
  },
});

// The workflow is our orchestrator.
export const researchReportWorkflow = createWorkflow({
  id: "research-report-workflow",

  inputSchema: z.object({
    topic: z.string(),
  }),

  outputSchema: z.object({
    topic: z.string(),
    researchNotes: z.string(),
    finalReport: z.string(),
  }),
})
  .then(researchStep)
  .then(reportWritingStep)
  .commit();
