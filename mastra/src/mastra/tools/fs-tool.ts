import * as fs from "node:fs/promises";
import { createTool } from "@mastra/core/tools";
import { z } from "zod";


export const fsTool = createTool({
  id: "list-files",
  description: "List files and directories at a given path",
  inputSchema: z.object({
    path: z.string().describe("Path to list files and directories"),
  }),
  outputSchema: z.array(z.object({
    name: z.string(),
    isDirectory: z.boolean(),
    isFile: z.boolean(),
    isSymbolicLink: z.boolean(),
  })),
  execute: async ({ context }) => {
    return await listFiles(context.path);
  },
});


const listFiles = async (location: string) => {
  const content = await fs.readdir(location || "./", { withFileTypes: true });
  const contentList = content.map((c) => ({
    name: c.name,
    isDirectory: c.isDirectory(),
    isFile: c.isFile(),
    isSymbolicLink: c.isSymbolicLink(),
  }));
  return contentList;
};
