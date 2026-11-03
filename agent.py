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
    "gemini-3.1-flash-lite",
    "gemini-flash-lite-latest",
    "gemini-3.5-flash-lite",
    "gemini-3.5-flash",
    "gemini-3.6-flash",
    "gemini-3-flash-preview",
    "gemini-3.1-flash-lite-preview",
    "gemini-3.8-flash",
    "gemini-flash-latest",
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

    modes = {
        "1": {
            "name": "Pentest & DevSecOps",
            "icon": "🛡️",
            "instruction": (
                "Bạn là Khakhapkhun AI - Chuyên Gia về Kiểm Thử Thâm Nhập (Penetration Testing) và Tự Động Hóa Bảo Mật CI/CD (DevSecOps). "
                "MỤC TIÊU: Giảng dạy, phân tích và hướng dẫn người dùng bằng TIẾNG VIỆT rõ ràng, dễ hiểu. "
                "Với mọi chủ đề, hãy phân tích dưới cả hai góc nhìn: Pentester và DevSecOps."
            )
        },
        "2": {
            "name": "Trading Gold and Coin (Blockchain)",
            "icon": "📈",
            "instruction": (
                "Bạn là Khakhapkhun AI - Chuyên Gia Phân Tích & Cố Vấn Trading Vàng (XAU/USD) và Thị Trường Crypto / Hệ Sinh Thái Blockchain. "
                "MỤC TIÊU: Cung cấp góc nhìn phân tích thị trường sắc bén, hành động giá (Price Action/SMC), quản trị rủi ro kỷ luật 1-2%, và phân tích công nghệ Blockchain bằng TIẾNG VIỆT."
            )
        },
        "3": {
            "name": "Learning Dev",
            "icon": "💻",
            "instruction": (
                "Bạn là Khakhapkhun AI - Cố Vấn & Hướng Dẫn Kỹ Thuật Lập Trình Phát Triển Phần Mềm (Software Development Mentor). "
                "MỤC TIÊU: Đào tạo Fullstack Developer, cấu trúc dữ liệu, giải thuật, Clean Code, SOLID, Design Patterns và kiến trúc phần mềm chuẩn bằng TIẾNG VIỆT."
            )
        }
    }

    selected_mode = "1"
    for arg in sys.argv[1:]:
        if arg in ["--mode=1", "--mode=pentest", "-m=1"]:
            selected_mode = "1"
        elif arg in ["--mode=2", "--mode=trading", "-m=2"]:
            selected_mode = "2"
        elif arg in ["--mode=3", "--mode=dev", "-m=3"]:
            selected_mode = "3"

    mode_info = modes[selected_mode]
    system_instruction = mode_info["instruction"]

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

    print(f"\n{mode_info['icon']} Khakhapkhun AI [{mode_info['name']}] đã sẵn sàng! (Mô hình: {current_model})")
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
                    print(f"\nKhakhapkhun AI: {response.text}")
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

