import { Type } from "@google/genai";
import fetch from "node-fetch";

const schema = { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { trigger: { type: Type.STRING }, action: { type: Type.STRING } } } };
const prompt = "Gere regras automação: Reservas";

console.log("Fetching...");
fetch('http://localhost:3000/api/gemini/generateText', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, schema })
})
.then(res => res.text())
.then(text => console.log('Response:', text))
.catch(err => console.error('Error:', err));
