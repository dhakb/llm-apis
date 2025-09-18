import "dotenv/config";

import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const { object } = await generateObject({
  model: openai("gpt-4o-mini"),
  messages: [
    {
      role: "system",
      content:
        "Given the user input the text, return the structured output in the given format.",
    },
    {
      role: "user",
      content:
        "I talked to Giga today, and we decided to arrange the meeting on Friday. He said Gaara is also coming.",
    },
  ],
  schema: z.object({
    date: z.string(),
    title: z.string(),
    attendees: z.array(z.string()),
  }),
});

console.log(object);