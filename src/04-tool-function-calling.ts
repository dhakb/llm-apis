import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let response = await openai.responses.create({
  model: "gpt-4o-mini", // gpt-5 is dissapointing here. flaky function calling.
  tools: [
    {
      type: "function",
      name: "search_music",
      description: "Search for music by artist name and song title.",
      parameters: {
        type: "object",
        properties: {
          artist_name: {
            type: "string",
            description: "The name of the artist",
          },
          song_title: {
            type: "string",
            description: "The title of the song",
          },
        },
        required: ["artist_name", "song_title"],
        additionalProperties: false,
      },
      strict: true,
    },
  ],
  input: [
    {
      role: "system",
      content:
        "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo.",
    },
    {
      role: "user",
      content: "Who is the artist of the song 'Rainy Day'?",
    },
  ],
});

console.log(response.output_text);

response.output.forEach((output) => {
  console.log("output::", output);
  if (output.type === "function_call") {
    console.log("function call:", output.name);

    let callArguments;
    try {
      callArguments = JSON.parse(output.arguments);
    } catch (error) {
      console.log("error parsing function call arguments:", error);
    }
    console.log(
      "searching musing for:",
      callArguments.artist_name,
      callArguments.song_title
    );
  }
});
