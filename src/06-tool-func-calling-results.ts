import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type ResponseInput = OpenAI.Responses.ResponseInput;
type Tool = OpenAI.Responses.Tool;

const tools: Tool[] = [
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
];

const input: ResponseInput = [
  {
    role: "system",
    content:
      "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo.",
  },
  {
    role: "user",
    content:
      "Who is the artis beyond the song 'Sunny day'. Add it to my playlist.",
  },
];


// tool calls can be chained up if one tool call is dependent on the result of the previous tool call.
// this way another tool call can be initiated, following the results of the previoys one. 
// ongoing input context must be maintained to allow the model keep track of the context and the result mapping to the tool calls.
// as long as there are tool calls in the llm response, input builds up and application keeps getting new responses.

while (true) {
  let response = await openai.responses.create({
    model: "gpt-4o-mini",
    tools: tools,
    input: input,
  });

  input.push(...response.output);

  const toolCall = response.output.filter(
    (output) => output.type === "function_call"
  );

  if (toolCall.length) {
    toolCall.forEach((tool) => {
      switch (tool.name) {
        case "search_music":
          console.log("executing tool call ....searching music for::", tool.arguments);

          input.push({
            type: "function_call_output",
            call_id: tool.call_id,
            output: "The song is 'Sunny day' by artist 'Giga'",
          });
          break;
        case "add_to_playlist":
          console.log("executing tool call ....adding to playlist for::", tool.arguments);

          input.push({
            type: "function_call_output",
            call_id: tool.call_id,
            output: "Added to playlist",
          });
          break;
      }
    });
  } else {
    console.log("no more tool call:: loop ends", response.output_text);
    break;
  }
}
