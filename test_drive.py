import os
import requests
from dotenv import load_dotenv

load_dotenv()
API_KEY = os.getenv("GOOGLE_API_KEY")
FOLDER_ID = "1aQLI-1WEoDBZEg5g7mxBDS8YUZ6kVDtY"

url = f"https://www.googleapis.com/drive/v3/files?q='{FOLDER_ID}'+in+parents&key={API_KEY}"
response = requests.get(url)
print(response.status_code)
print(response.json())
