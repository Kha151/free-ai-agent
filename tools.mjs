import fs from "fs/promises";
import path from "path";

/**
 * Tool 1: Safe Math Calculator
 */
export async function calculate({ expression }) {
  try {
    const cleanExpr = expression.replace(/[^0-9+\-*/(). %]/g, "");
    if (!cleanExpr || cleanExpr.trim() !== expression.trim()) {
      return JSON.stringify({ error: "Invalid math characters detected." });
    }
    // Safe evaluation using Function with no globals
    const result = Function(`"use strict"; return (${cleanExpr})`)();
    return JSON.stringify({ expression: cleanExpr, result: String(result) });
  } catch (err) {
    return JSON.stringify({ error: `Math error: ${err.message}` });
  }
}

/**
 * Tool 2: Free Web & Knowledge Search (Wikipedia API + DuckDuckGo Instant Answers)
 */
export async function searchWeb({ query }) {
  const snippets = [];

  try {
    // 1. Wikipedia Search API (Free, fast, never blocked by captchas)
    const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      query
    )}&utf8=&format=json`;
    const wikiRes = await fetch(wikiUrl, {
      headers: { "User-Agent": "FreeAIAgent/1.0 (https://github.com/Kha151/free-ai-agent)" },
    });

    if (wikiRes.ok) {
      const data = await wikiRes.json();
      const items = data.query?.search || [];
      for (const item of items.slice(0, 3)) {
        const cleanSnippet = item.snippet.replace(/<[^>]+>/g, "").trim();
        snippets.push(`[${item.title}]: ${cleanSnippet}`);
      }
    }
  } catch (err) {
    // Continue to fallback
  }

  try {
    // 2. DuckDuckGo Instant Answer API
    const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
      query
    )}&format=json&no_html=1&skip_disambig=1`;
    const ddgRes = await fetch(ddgUrl, {
      headers: { "User-Agent": "FreeAIAgent/1.0" },
    });

    if (ddgRes.ok) {
      const ddgData = await ddgRes.json();
      if (ddgData.Heading && ddgData.AbstractText) {
        snippets.unshift(`[${ddgData.Heading}]: ${ddgData.AbstractText}`);
      }
    }
  } catch (err) {
    // Fallback handled
  }

  if (snippets.length > 0) {
    return JSON.stringify({ query, results: snippets.join("\n\n") });
  }

  return JSON.stringify({
    query,
    results: `No direct web search snippets found for "${query}". Try rephrasing the search term.`,
  });
}

/**
 * Tool 3: Write File
 */
export async function writeFile({ filename, content }) {
  try {
    const safePath = path.resolve(process.cwd(), filename);
    await fs.writeFile(safePath, content, "utf-8");
    return JSON.stringify({ success: true, message: `File saved to ${filename}` });
  } catch (err) {
    return JSON.stringify({ error: `Write failed: ${err.message}` });
  }
}

/**
 * Tool 4: Read File
 */
export async function readFile({ filename }) {
  try {
    const safePath = path.resolve(process.cwd(), filename);
    const data = await fs.readFile(safePath, "utf-8");
    return JSON.stringify({ filename, content: data });
  } catch (err) {
    return JSON.stringify({ error: `Could not read file: ${err.message}` });
  }
}

/**
 * Tool 5: List Files
 */
export async function listFiles({ directory = "." }) {
  try {
    const targetDir = path.resolve(process.cwd(), directory);
    const files = await fs.readdir(targetDir);
    return JSON.stringify({ directory, files });
  } catch (err) {
    return JSON.stringify({ error: `Could not list directory: ${err.message}` });
  }
}

/**
 * Tool 6: Get Current Time
 */
export async function getCurrentTime() {
  const now = new Date();
  return JSON.stringify({
    localTime: now.toLocaleString(),
    iso: now.toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}

// Tool declarations formatted for Gemini Function Calling
export const TOOL_DECLARATIONS = [
  {
    name: "calculate",
    description: "Evaluates basic arithmetic expressions like '150 * 12 + 45'.",
    parameters: {
      type: "OBJECT",
      properties: {
        expression: { type: "STRING", description: "The mathematical expression to evaluate" }
      },
      required: ["expression"]
    }
  },
  {
    name: "searchWeb",
    description: "Searches the web for live information, documentation, news, and facts using DuckDuckGo.",
    parameters: {
      type: "OBJECT",
      properties: {
        query: { type: "STRING", description: "Search query string" }
      },
      required: ["query"]
    }
  },
  {
    name: "writeFile",
    description: "Creates or overwrites a local file in the workspace with given content.",
    parameters: {
      type: "OBJECT",
      properties: {
        filename: { type: "STRING", description: "Relative file name, e.g. notes.txt or report.md" },
        content: { type: "STRING", description: "The text content to write" }
      },
      required: ["filename", "content"]
    }
  },
  {
    name: "readFile",
    description: "Reads the content of a local file in the workspace.",
    parameters: {
      type: "OBJECT",
      properties: {
        filename: { type: "STRING", description: "Relative file name to read" }
      },
      required: ["filename"]
    }
  },
  {
    name: "listFiles",
    description: "Lists all files and subdirectories in the current workspace.",
    parameters: {
      type: "OBJECT",
      properties: {
        directory: { type: "STRING", description: "Directory to list (defaults to .)" }
      }
    }
  },
  {
    name: "getCurrentTime",
    description: "Gets the current system date, time, and timezone.",
    parameters: {
      type: "OBJECT",
      properties: {}
    }
  }
];

// Mapping tool names to executable functions
export const TOOL_HANDLERS = {
  calculate,
  searchWeb,
  writeFile,
  readFile,
  listFiles,
  getCurrentTime
};

