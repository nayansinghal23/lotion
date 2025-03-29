import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    if (request.method !== "POST") {
      return NextResponse.json(
        { error: "Method Not Allowed" },
        { status: 405 }
      );
    }
    const { content } = await request.json();
    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-pro-exp-02-05:free",
          messages: [{ role: "user", content }],
        }),
      }
    );
    const result = await response.json();
    return NextResponse.json(
      { result },
      {
        status: 201,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Internal Server Error : ${error}` },
      {
        status: 500,
      }
    );
  }
};
