import "dotenv/config";

import {streamText} from "ai";
import { openai } from "@ai-sdk/openai";

// response can be streamed in chunks, as soon as the model starts generating the response. 
// so it makes no need to wait for the entire response to be generated, till we get something
// same can be done with the structured output.

const {textStream} = await streamText({
  model: openai("gpt-4o-mini"),
  messages: [
    {
      role: "user",
      content: "Generate random sequence of text of 200 characters.",
    },
  ],
});

for await (const chunk of textStream) {
  process.stdout.write(chunk);
}