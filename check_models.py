import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
genai.configure(api_key=API_KEY)

print("--- Available Embedding Models ---")
try:
    models = genai.list_models()
    for m in models:
        # Check if 'embedContent' or 'batchEmbedContents' is supported
        if 'embedContent' in m.supported_generation_methods:
            print(f"Model Name: {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
