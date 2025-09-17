import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";


// mcp-client is the program that implements the mcp-client interface to communicate with the mcp-server.
// each mcp-client only hanldes communication with only one mcp-server.

// but why would I use mcp, and build mcp servers and clients? how that helps?
// I want to build a program (mcp-server) that will allow me and others to use the tools that are exposed by the mcp-server.
// And want to do it once and use it in multiple places.
// so, after others can have their own mcp-client to be connect to my mcp-server, see what avaialble and use them as needed.


// in this example mcp-client connect to local mcp-server
// mcp-clients are manages by mcp-hosts/ai-applications, through which specific tool ared called.

// for wider example. apple-note app comes with local mcp-server.
// other local applications that support mcp-client can connect to it and use the tools exposed by apple-note's mcp-server.
// such claude desktop, which is a mcp-host, that manages mcp-client to communicat with apple-note's mcp-server.

async function main() {
  const transport = new StdioClientTransport({
    command: "node",
    args: ["build/13-mcp-server.cjs"],
  });
  const client = new Client({name: "local-fs-client", version: "1.0.0"});

  await client.connect(transport);

  console.log("Connected to local-fs MCP server");

  const response = await client.listTools();
  console.log("Tools:", response);

  console.log("================================================")

  const toolCallResult = await client.callTool({ name: "list_files", arguments: { path: "./" } });
  console.log("Tool call:", toolCallResult);

  await client.close();
}

main().catch((err) => console.error("Error in client:", err));
