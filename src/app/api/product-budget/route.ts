import { NextResponse } from "next/server";
import { productBudgetAgent } from "@/mastra/agents/product-budget-agent";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("message" in body) ||
      typeof body.message !== "string" ||
      !body.message.trim()
    ) {
      return NextResponse.json(
        { error: "Please enter a product or a question." },
        { status: 400 },
      );
    }

    const result = await productBudgetAgent.generate(body.message.trim());

    // Inspect the steps in your server terminal while learning.
    console.dir(result.steps, { depth: 5 });

    return NextResponse.json({
      answer: result.text,
    });
  } catch (error) {
    console.error("Product budget agent error:", error);

    return NextResponse.json(
      {
        error:
          "The agent could not process your request. Check the server logs.",
      },
      { status: 500 },
    );
  }
}
