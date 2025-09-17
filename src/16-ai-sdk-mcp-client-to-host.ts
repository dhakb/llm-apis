import "dotenv/config";

import {
  experimental_createMCPClient as createMcpClient,
  generateText,
  stepCountIs,
} from "ai";
import { openai } from "@ai-sdk/openai";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


// this is cool way of doing what's done in the 15-mcp-host.ts
// ai-sdk comes with it's interface for mcp-client instantiation,
// and instance of mcp-client to be compatible with own api (tool format/definitions)
// combination with generateText() api to iterate over the tool calls and tool call outputs and provide the final text response.


const mcpClient = await createMcpClient({
  transport: new StdioClientTransport({
    command: "node",
    args: ["build/13-mcp-server.cjs"],
  }),
});

const tools = await mcpClient.tools();

const { text } = await generateText({
  model: openai("gpt-4o-mini"),
  stopWhen: stepCountIs(10),
  tools: tools,
  messages: [
    {
      role: "user",
      content: "List all files in the current directory",
    },
  ],
});

await mcpClient.close();

console.log(text);
