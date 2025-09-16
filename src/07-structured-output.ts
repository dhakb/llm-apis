import "dotenv/config";
import { z } from "zod";
import { zodTextFormat } from "openai/helpers/zod";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const CalendarEvent = z.object({
  date: z.string(),
  title: z.string(),
  attendees: z.array(z.string()),
});

// models can parse the response into the structured output. 
// instead of replying with native text, their response can be parsed into the structured output like json.

let response = await openai.responses.parse({
  model: "gpt-4o-mini",
  input: [
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
  text: {
    format: zodTextFormat(CalendarEvent, "event"),
  },
});

console.log(response.output_parsed);