import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// llm apis provide a way to make the model aware of the tools that it can use. 
// each llm provider or their apis have their own way to do this. namings migh not match but all convey the same concept. 
// tool is kind of conditional action to get more context or/and have impacts on external systems.
// this given way of making the model aware of the tools is easier and more effective to use then relying on the prompt.

// as we differentiate role based context, model also distinguishes the tool calls from the user input. 
// marks the call with uniqe id to map the call return back to the response.

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
