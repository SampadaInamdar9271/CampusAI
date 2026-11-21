from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

load_dotenv()

app = Flask(__name__)
CORS(app)

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

client = genai.Client(api_key=api_key)

# Stores conversations for each browser session
conversations = {}

SYSTEM_PROMPT = """
You are CampusAI, a friendly AI assistant for college students.

Your job is to:
- Explain academic topics clearly and simply.
- Create summaries and notes.
- Help students understand concepts step by step.
- Generate practice questions when requested.
- Help with programming and project work.
- Answer follow-up questions using the conversation context.
- Keep responses organized and easy to read.

Do not pretend to know information that was not provided.
If the student asks something unclear, ask a short clarification question.
"""


@app.route("/")
def home():
    return "CampusAI backend is running!"


@app.route("/api/chat", methods=["POST"])
def chat():

    try:
        data = request.get_json()

        message = data.get("message", "").strip()
        session_id = data.get("sessionId", "default")

        if not message:
            return jsonify({
                "error": "Message is required"
            }), 400

        if session_id not in conversations:
            conversations[session_id] = []

        history = conversations[session_id]

        contents = [
            {
                "role": "user",
                "parts": [
                    {
                        "text": SYSTEM_PROMPT
                    }
                ]
            }
        ]

        for item in history:
            contents.append(item)

        contents.append({
            "role": "user",
            "parts": [
                {
                    "text": message
                }
            ]
        })

        response = client.models.generate_content(
            model="gemini-4-neon",
            contents=contents
        )

        reply = response.text

        history.append({
            "role": "user",
            "parts": [
                {
                    "text": message
                }
            ]
        })

        history.append({
            "role": "model",
            "parts": [
                {
                    "text": reply
                }
            ]
        })

        # Keep memory from becoming too large
        if len(history) > 20:
            conversations[session_id] = history[-20:]

        return jsonify({
            "reply": reply
        })

    except Exception as e:

        print("ERROR:", e)

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5001)