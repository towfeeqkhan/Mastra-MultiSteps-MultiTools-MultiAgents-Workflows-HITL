import { NextResponse } from "next/server";
import { researchReportWorkflow } from "@/mastra/workflows/research-report-workflow";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("topic" in body) ||
      typeof body.topic !== "string" ||
      body.topic.trim().length < 3
    ) {
      return NextResponse.json(
        { error: "Enter a topic with at least 3 characters." },
        { status: 400 },
      );
    }

    const run = await researchReportWorkflow.createRun();

    const result = await run.start({
      inputData: {
        topic: body.topic.trim(),
      },
    });

    if (result.status !== "success") {
      console.error("Workflow did not succeed:", result);

      return NextResponse.json(
        { error: "The research workflow did not complete successfully." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      topic: result.result.topic,
      researchNotes: result.result.researchNotes,
      finalReport: result.result.finalReport,
    });
  } catch (error) {
    console.error("Research report API error:", error);

    return NextResponse.json(
      { error: "Could not generate the report. Check the server logs." },
      { status: 500 },
    );
  }
}
