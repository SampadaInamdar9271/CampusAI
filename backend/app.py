from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)

# Get Gemini API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY is not set in .env")

# Create Gemini client
client = genai.Client(api_key=api_key)

# Use a current lightweight model
MODEL_NAME = "gemini-2.5-flash-lite"


@app.route("/")
def home():
    return "CampusAI backend is running!"


@app.route("/api/chat", methods=["POST"])
def chat():

    try:

        data = request.get_json()

        message = data.get("message", "").strip()

        if not message:
            return jsonify({
                "error": "Message is required"
            }), 400


        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=message
        )


        reply = response.text

        return jsonify({
            "reply": reply
        })


    except Exception as e:

        print("================================")
        print("GEMINI ERROR:")
        print(str(e))
        print("================================")

        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=True
    )