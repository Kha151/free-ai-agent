"""
Free AI Agent (Python Version)
Using Google GenAI Free Tier + DuckDuckGo Search + Local Tools.

Prerequisites:
  pip install google-genai duckduckgo-search python-dotenv
"""

import os
import sys
from dotenv import load_dotenv
from google import genai
from google.genai import types
from duckduckgo_search import DDGS

load_dotenv()

# --- Tools ---

def search_web(query: str) -> str:
    """Searches the internet for real-time information, documentation, and news using DuckDuckGo."""
    try:
        results = DDGS().text(query, max_results=3)
        if not results:
            return "No results found."
        return "\n\n".join([f"[{r.get('title', '')}]: {r.get('body', '')}" for r in results])
    except Exception as e:
        return f"Search error: {str(e)}"

def calculate(expression: str) -> str:
    """Safely calculates arithmetic expressions (e.g. '150 * 12 + 45')."""
    try:
        allowed = set("0123456789+-*/(). %")
        if not all(c in allowed for c in expression):
            return "Error: Unsupported characters in math expression."
        return str(eval(expression, {"__builtins__": None}, {}))
    except Exception as e:
        return f"Calculation error: {str(e)}"

def write_file(filename: str, content: str) -> str:
    """Saves text content to a local file in the workspace."""
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully saved to {filename}"
    except Exception as e:
        return f"File error: {str(e)}"

def read_file(filename: str) -> str:
    """Reads content from a local file."""
    try:
        with open(filename, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

def list_files(directory: str = ".") -> str:
    """Lists files in the workspace directory."""
    try:
        return ", ".join(os.listdir(directory))
    except Exception as e:
        return f"Directory error: {str(e)}"

# --- Main Agent Loop ---

def main():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("No GEMINI_API_KEY found in .env or environment.")
        print("Get your 100% free key at: https://aistudio.google.com")
        api_key = input("Enter your Gemini API Key: ").strip()
        if not api_key:
            print("API key is required.")
            sys.exit(1)

    client = genai.Client(api_key=api_key)

    system_instruction = (
        "You are an autonomous AI coworker assistant. "
        "Use your tools whenever you need live info, math, or file actions. "
        "Always be concise and helpful."
    )

    tools = [search_web, calculate, write_file, read_file, list_files]

    chat = client.chats.create(
        model="gemini-2.0-flash",
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            tools=tools,
            temperature=0.2,
        ),
    )

    print("\n🤖 AI Agent is ready! Type 'exit' to quit.\n" + "-" * 50)
    while True:
        try:
            user_input = input("\nYou: ").strip()
            if user_input.lower() in ["exit", "quit", "q"]:
                print("Goodbye!")
                break
            if not user_input:
                continue

            response = chat.send_message(user_input)
            print(f"\nAgent: {response.text}")
        except Exception as e:
            print(f"\nError: {e}")

if __name__ == "__main__":
    main()

