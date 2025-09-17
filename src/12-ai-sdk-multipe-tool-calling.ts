import "dotenv/config";

import { z } from "zod";
import { generateText, stepCountIs } from "ai";
import { openai } from "@ai-sdk/openai";


// here the abstratcion of tool calling is seems different as generateText calls the given tool (func) to execute.
// not having the code for generated tool-calls filtering and theire conditional execution.
// all abstracted away from the user. single function call to generateText handles entire process with underlying llm api provider.

// instead of having the model generate tool call () as response and then mapping manually to the function invocation.
// this api eliminates: appending messages to the input, making subsequent requests for a llm response,filtering tool calls, mapping tool calls to the function invocation.
// all the complexity of the tool calling is abstracted away from the user. just by passing stopWhen condition

// we get the final text response if quieried as user wished or depending on the application needs.
// as in this exmaple we the models last response as the text copying the conversational style.

// loop that makes up the input context to the model is gone. handled internally by api. 


const { toolCalls, steps, text } = await generateText({
  model: openai("gpt-4o-mini"),
  stopWhen: stepCountIs(10),
  messages: [
    {
      role: "user",
      content: "Add song 'summer day' by artist 'breakpoint' to my playlist.",
    },
  ],
  tools: {
    add_to_playlist: {
      description: "Add a song to the user's playlist.",
      inputSchema: z.object({
        artist_name: z.string(),
        song_title: z.string(),
      }),
      execute: async ({ artist_name, song_title }) => {
        console.log(
          `Adding song '${song_title}' by artist '${artist_name}' to the playlist`
        );
        return "Added to playlist!";
      },
    },
  },
});

console.log("toolCalls::", toolCalls);
console.log("steps::", steps);

const allToolCalls = steps.flatMap((step) => step.toolCalls);

console.log("allToolCalls::", allToolCalls);
console.log("text::", text);