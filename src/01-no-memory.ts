import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// modelse have no memory. applications on top of them should manage their own state.
// every interation to the model for a response is independent. model is expected to have no knowledge of the previous interaction.
// all subsequent interactions after initial contact are again intials interactions. previous context is provided as part of the the new input.
// the dialog role-marks are indicator of distinct participants on which model is trained to act differently.  

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
      role: "user",
      content: "Hey! What's my name? What's your name?",
    },
  ],
});

console.log(response.output_text);
