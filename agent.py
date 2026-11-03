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

# Free Models fallback list on Google AI Studio
FREE_MODELS = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
]

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
        "Bạn là Gia Sư Chuyên Gia về Kiểm Thử Thâm Nhập (Penetration Testing) và Tự Động Hóa Bảo Mật CI/CD (DevSecOps). "
        "MỤC TIÊU: Giảng dạy, phân tích và hướng dẫn người dùng bằng TIẾNG VIỆT rõ ràng, dễ hiểu. "
        "Với mọi chủ đề, hãy phân tích dưới cả hai góc nhìn: "
        "1) Góc nhìn Pentester (Kẻ tấn công tìm và khai thác lỗ hổng thế nào trong môi trường lab an toàn) "
        "2) Góc nhìn DevSecOps (Kỹ sư cấu hình quét tự động SAST/SCA/DAST và viết code vá lỗi ra sao)."
    )

    tools = [search_web, calculate, write_file, read_file, list_files]

    chat = None
    current_model = None
    for model_name in FREE_MODELS:
        try:
            chat = client.chats.create(
                model=model_name,
                config=types.GenerateContentConfig(
                    system_instruction=system_instruction,
                    tools=tools,
                    temperature=0.2,
                ),
            )
            current_model = model_name
            break
        except Exception as e:
            print(f"⚠️ Model {model_name} không khả dụng: {e}. Đang thử model tiếp theo...")

    if not chat:
        print("❌ Không thể khởi tạo với bất kỳ Free Model nào.")
        sys.exit(1)

    print(f"\n🛡️ Gia sư AI Pentest & DevSecOps đã sẵn sàng! (Mô hình: {current_model})")
    print("Gõ 'exit' hoặc 'thoat' để thoát.\n" + "-" * 55)
    while True:
        try:
            user_input = input("\nBạn: ").strip()
            if user_input.lower() in ["exit", "quit", "q", "thoat"]:
                print("Tạm biệt bạn! Hẹn gặp lại!")
                break
            if not user_input:
                continue

            # Tự động chuyển model nếu gặp lỗi rate limit / model bận
            sent = False
            for model_name in FREE_MODELS:
                try:
                    response = chat.send_message(user_input)
                    print(f"\nGia sư AI: {response.text}")
                    sent = True
                    break
                except Exception as e:
                    print(f"⚠️ Model {current_model} gặp lỗi ({e}). Đang tự chuyển sang model: {model_name}...")
                    current_model = model_name
                    chat = client.chats.create(
                        model=model_name,
                        config=types.GenerateContentConfig(
                            system_instruction=system_instruction,
                            tools=tools,
                            temperature=0.2,
                        ),
                    )

            if not sent:
                print("\n❌ Không thể nhận phản hồi từ các free models. Vui lòng thử lại sau.")
        except Exception as e:
            print(f"\nLỗi: {e}")

if __name__ == "__main__":
    main()

