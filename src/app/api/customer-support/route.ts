import { NextResponse } from "next/server";
import { supportSupervisorAgent } from "@/mastra/agents/support-supervisor-agent";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("message" in body) ||
      typeof body.message !== "string" ||
      body.message.trim().length < 3
    ) {
      return NextResponse.json(
        { error: "Enter a customer message with at least 3 characters." },
        { status: 400 },
      );
    }

    const result = await supportSupervisorAgent.generate(body.message.trim(), {
      maxSteps: 10,
    });

    // Inspect the supervisor's execution and delegation steps.
    console.dir(result.steps, { depth: 6 });


    return NextResponse.json({
      answer: result.text,
      steps: result.steps.map((step) => ({
        text: step.text,
        toolCalls: step.toolCalls,
        toolResults: step.toolResults,
      })),
    });
  } catch (error) {
    console.error("Customer support error:", error);

    return NextResponse.json(
      { error: "Could not process the request. Check the server logs." },
      { status: 500 },
    );
  }
}
