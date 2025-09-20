import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


// based on the input model can decide to call multiple tools in the a single response.
// it can return the list of tool calls in the response to indicate what requested tool needs to be invoked.
// tool_call is the detection to call the tool, which is followed by execution of the tool on the application side.
// application just gets instructions what given tool needs to be invoked.

let response = await openai.responses.create({
  model: "gpt-4o-mini",
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
    {
      type: "function",
      name: "add_to_playlist",
      description: "Add a song to the user's playlist.",
      parameters: {
        type: "object",
        properties: {
          song_title: {
            type: "string",
            description: "The title of the song",
          },
          artist_name: {
            type: "string",
            description: "The name of the artist",
          },
        },
        required: ["song_title", "artist_name"],
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
      content:
        "Add song 'Sunny day' by artist 'Giga' to my playlist. And tell me the artist name and song title.",
    },
  ],
});

// console.log(response.output_text);

response.output.forEach((output) => {
  console.log("output::", output);
  if (output.type === "function_call") {
    console.log("function call::", output.name);

    let callArguments;
    try {
      callArguments = JSON.parse(output.arguments);
    } catch (error) {
      console.log("error parsing function call arguments:", error);
    }
    console.log(
      "searching musing for::",
      callArguments.artist_name,
      callArguments.song_title
    );
  }
});
