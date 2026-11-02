# 🤖 Free Autonomous AI Agent

A 100% free autonomous AI agent that you can code, customize, and run locally.

- **Zero cost**: Uses Google Gemini 2.0 Flash's free tier (1,500 requests/day, no credit card needed).
- **Zero dependencies needed for Node.js**: Built with native Node.js 24 (`fetch`, `fs`, `readline`). Works right out of the box.
- **Built-in tools**:
  1. `searchWeb`: Free web searches via DuckDuckGo (no search API keys needed).
  2. `calculate`: Safe math evaluator.
  3. `writeFile`: Saves text and reports to files locally.
  4. `readFile`: Reads files in the workspace.
  5. `listFiles`: Lists workspace files.
  6. `getCurrentTime`: Formats date and time.
- **Python alternative included**: Also includes `agent.py` if you prefer Python.

---

## 🚀 Quick Start (Node.js - Ready immediately)

### 1. Get your free Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/).
2. Sign in with any regular Google account.
3. Click **Get API key** $\rightarrow$ **Create API key**.

### 2. Add your API Key
Open `.env` in this directory and paste your key:
```env
GEMINI_API_KEY=AIzaSy...your_key_here
```

### 3. Run the Agent
Run directly in your terminal:
```powershell
node --env-file=.env agent.mjs
```
*(Or simply `node agent.mjs` — if no `.env` key is found, it will politely prompt you to enter it in the console).*

---

## 🧪 Try Asking the Agent:
- *"Search the web for the latest release of Python and summarize the top features in 3 bullet points."*
- *"Calculate (345 * 12) / 4 and save the answer to calc_result.txt."*
- *"What time is it right now and what files are in this directory?"*

---

## 🐍 Python Version (Alternative)
If you prefer running the Python version:
```powershell
pip install google-genai duckduckgo-search python-dotenv
python agent.py
```

---

## 🛠️ Adding New Tools
To add a new tool to `tools.mjs`:
1. Write your async JavaScript function in [tools.mjs](tools.mjs).
2. Add its schema description in `TOOL_DECLARATIONS`.
3. Add the function to `TOOL_HANDLERS`.
The agent will automatically learn when and how to invoke it!

