import * as fs from "node:fs/promises";
import { z } from "zod";
import express from "express";

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

const app = express();
app.use(express.json());


// mcp server can be accessed remotely through http
// as this makes it easier to integrate with other applications instead of installing mcp server locally
// this is done by using the StreamableHTTPServerTransport



app.post("/mcp", async (req, res) => {
  try {
    const transport: StreamableHTTPServerTransport =
      new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
      });

    res.on("close", () => {
      transport.close();
      server.close();
    });

    const server = new McpServer({
      name: "remote-mcp-server",
      version: "1.0.0",
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
          const content = await fs.readdir(path || "./", {
            withFileTypes: true,
          });
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

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  } catch (error) {
    console.error("Error handling MCP request:", error);

    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: {
          code: -32603,
          message: "Internal server error",
        },
        id: null,
      });
    }
  }
});

app.listen(3000, () => {
  console.log("Remote MCP server is running on port 3000");
});
