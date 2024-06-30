/** @format */

//! THIS ROUTE IS NOT WORKING AS OPENAI API REQUIRES A PAID PLAN TO ACCESS THE GPT-3.5-TURBO-INSTRUCT MODEL. THIS PAGE IS MADE ONLY FOR LEARNING PURPOSES AND TO SHOW HOW TO USE OPENAI API IN A CLOUDFLARE WORKER.ONCE WE GET THE API KEY FROM PAID PLAN, WE CAN USE THIS ROUTE TO GET THE SUGGESTED MESSAGES.

//! UPDATE - THIS ROUTE IS WORKING NOW AS I HAVE GOT THE API KEY.REFERENCE - https://github.com/PawanOsman/ChatGPT

// Import necessary libraries
import OpenAI from "openai";
import { NextResponse } from "next/server";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.pawan.krd/pai-001/v1/",
});

// Specify runtime environment
export const runtime = "edge";

// Handle POST requests
export async function POST(req: Request) {
  try {
    // Define the prompt
    const prompt = `Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.`;

    // Create a completion request
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    // Log the response for debugging
    console.log(chatCompletion);

    // Return the response as JSON
    return NextResponse.json(chatCompletion);

  } catch (error) {
    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json({ name, status, headers, message }, { status });
    } else {
      // Log and rethrow other errors
      console.error("An unexpected error occurred:", error);
      throw error;
    }
  }
}
