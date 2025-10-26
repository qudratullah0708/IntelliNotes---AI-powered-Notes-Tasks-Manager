from google import genai
import os

# Initialize the client with the API key from environment variable
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def summarize_note(content: str):
    prompt = f"Summarize the following note in a few words: {content}"
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=prompt
    )
    return response.text.strip()