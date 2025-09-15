import "dotenv/config";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let response = await openai.responses.create({
  model: "gpt-4o-mini",
  input: [
    {
      role: "system",
      content:
        "You are a helpful assistant that can answer questions and help with tasks. Your name is Cudo.",
    },
    {
        role: "system",
        content: `
            You have a tool to search the music library by artist name and song title.

            Use the tool to search the music library when appropriate. You make independent decisions about when to use the tool.

            When you use the tool, you should return the results in a structured format. And only return the structured format.
            The format should be a JSON object with the following properties:

            tool_name: string
            tool_input: object

            The tool_input object should have the following properties:

            artist_name: string
            song_title: string

            *IMPORTANT*
            When you use the tool, you should return the results in a structured format. And only return the structured format Like in the example below.
            example: {
                tool_name: "search_music",
                tool_input: {
                    artist_name: "Giga",
                    song_title: "Rainy Day"
                }
            }
        `,
    },
    {
        role: "user",
        content: "Who is the artist of the song 'Rainy Day'?",
    }
  ],
});

// console.log(response.output_text);

try {
    const toolResponse = JSON.parse(response.output_text);

    console.log("tool was called:", toolResponse.tool_name);

    if(toolResponse.tool_name === "search_music") {
        console.log("searching music library for:", toolResponse.tool_input.artist_name, toolResponse.tool_input.song_title);
    }
} catch (error) {
    console.log("error parsing tool response:", error);
    console.error(error);
}
