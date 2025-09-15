import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let response = await openai.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
      role: "system",
      content:
        "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo.",
    },
    {
      role: "user",
      content: "Hey! I'm a Giga! What's your name?",
    },
  ],
});

response = await openai.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
        role: "assistant",
        content: response.output_text,
    },
    {
      role: "user",
      content: "Hey! What's my name? What's your name?",
    },
  ],
});

console.log(response.output_text);
