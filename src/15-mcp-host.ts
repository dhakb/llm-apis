import "dotenv/config";

import { OpenAI } from "openai";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


type Tool = OpenAI.Responses.Tool;
type ResponseInput = OpenAI.Responses.ResponseInput;


const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


const client = new Client({name: "local-fs-client", version: "1.0.0"});

const transport = new StdioClientTransport({
  command: "node",
  args: ["build/13-mcp-server.cjs"],
});

await client.connect(transport);

console.log("Connected to local-fs MCP server");


// here is the ai application/mcp-host that uses the mcp-client to communicate with the mcp-server.
// it first gets the tools available from the mcp-server. which is done by the mcp-client.
// and then calls the tools (functions) on the mcp-server, based on model's generated tool calls.

// what's happening here!?
// application initialises the mcp-client to communicate with the mcp-server.
// mcp-client establishes the connection to the mcp-server.
// application then lists the tools available from the mcp-server through the mcp-client.
// application provides available tools to the model.
// model then generates tool calls based on the user input.
// application then calls the tools on the mcp-server through the mcp-client.

const tools = await client.listTools();
const openaiTools: Tool[] = tools.tools.map((tool) => ({
  type: "function",
  name: tool.name,
  description: tool.description,
  inputSchema: tool.inputSchema,
  parameters: tool.inputSchema,
  strict: true,
}));

const messages: ResponseInput = [
  {
    role: "user",
    content: "List all files in the current directory",
  },
];

while (true) { 
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      tools: openaiTools,
      input: messages,
    });

    messages.push(...response.output);

    const toolCalls = response.output.filter((output) => output.type === "function_call");

    if (toolCalls.length) {
        await Promise.all(
          toolCalls.map(async (tool) => {
            const toolCallResult: any = await client.callTool({
              name: tool.name,
              arguments: JSON.parse(tool.arguments),
            });

            const textOutput = toolCallResult.content.map((c: any) => c.text).join("\n");

            messages.push({
              type: "function_call_output",
              call_id: tool.call_id,
              output: textOutput || "",
            });
          })
        );
    } else {
        console.log("no more tool call:: loop ends", response.output_text);
        break;
    }
}

await client.close();