import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { LibSQLStore } from "@mastra/libsql";
import { lsTool, readFileTool } from "../tools/fs-tools";

export const fsAgent = new Agent({
  name: "fs agent",
  instructions: `
    You are a helpful file system assistant that helps users list files and directories at a given path.

    Your primary function is to help users perform file system operations. You have available the fsTool to perform file system operations, but you can only use tools that are available to you.
    
    You make independent decisions about when to use the tool.

    You respond in the natural language and, clearly distinguishing the tool call results if they needed to be returned as response to the user.
`,
  model: openai("gpt-4o-mini"),
  tools: { lsTool, readFileTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: "file:../mastra.db", // path is relative to the .mastra/output directory
    }),
  }),
});
