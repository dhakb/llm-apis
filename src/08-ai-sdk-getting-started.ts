import "dotenv/config";

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";
import { anthropic } from "@ai-sdk/anthropic";

// ai sdk is abstraction over the llm providers. it provides consistent interface to interact with the models of different providers.
// code is the same for different providers. no need to learn different api for different providers. and keep track of the changes.
// easiest way to get started with the llm providers.
// different model providers can be tested and evaluated with the same code.

const {text} = await generateText({
  model: openai("gpt-4o-mini"),
  system: "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo.",
  messages: [
    {
      role: "user",
      content: "Hey! I'm a Giga! What's your name?",
    },
  ],
});

console.log(text);


const {text: text2} = await generateText({
  model: anthropic("claude-3-5-sonnet-latest"),
  system: "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo.",
  messages: [
    {
      role: "user",
      content: "Hey! I'm a Giga! What's your name?",
    },
  ],
});

console.log(text2);