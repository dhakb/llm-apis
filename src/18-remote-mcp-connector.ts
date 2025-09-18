import "dotenv/config";


import {openai} from "@ai-sdk/openai";
import {
  experimental_createMCPClient as createMCPClient,  
  generateText,
  stepCountIs,
} from "ai";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";


// same approach different transport
// instead of stdio reads from the network over http

const url = new URL("http://localhost:3000/mcp");

const mcpClient = await createMCPClient({
  transport: new StreamableHTTPClientTransport(url),
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