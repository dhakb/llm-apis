import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// memory can be given to the model as part of the input. which the structurel and roled additional context to the model.
// it all chains up in the new response, the data that it's trained one and the data given as part of the input.
// one response can be appended to the input of the next response.

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

// console.log(response.output_text);

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
