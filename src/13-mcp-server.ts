import * as fs from "node:fs/promises";
import {z} from "zod";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";


// mcp-server is the program that provides standardized interface to expose tools to ai applications.
// this ai applications called mcp-hosts and they implement mcp-client to interact with the mcp-server.
// mcp-hosts/ai-applications initialise the mcp-client to communicate with the mcp-server.
// each mcp-host/ai-application can have multiple mcp-clients. and each client only handles one mcp-server.


const server = new McpServer({
  name: "local-fs",
  version: "1.0.0",
  description: "Local file system MCP server",
});

server.registerTool(
  "list_files",
  {
    title: "List Files",
    description: "List files and directories at a given path",
    inputSchema: {
      path: z
        .string()
        .describe(
          "Path to directory to list content of it (defaults to current directory)"
        ),
    },
  },
  async ({ path }) => {
    try {
      const content = await fs.readdir(path || "./", { withFileTypes: true });
      const contentList = content.map((c) => ({
        name: c.name,
        isDirectory: c.isDirectory(),
        isFile: c.isFile(),
        isSymbolicLink: c.isSymbolicLink(),
      }));
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(contentList, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error listing files: ${
              error instanceof Error ? error.message : String(error)
            }`,
          },
        ],
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("fs MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});