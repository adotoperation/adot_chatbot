import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBZ8TjxZT7DMWRHBeSxDoB8WKChaGA-qAI";
const genAI = new GoogleGenerativeAI(API_KEY);

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(model => {
            if (model.supportedGenerationMethods.includes('embedContent')) {
                console.log(`- ${model.name} (Embed Content)`);
            }
        });
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
