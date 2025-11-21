import { GoogleGenAI, Content, Part } from "@google/genai";
import { TutorMode } from '../types';

// Initialize API
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
Act as a Professional Study & Homework AI Tutor designed by Adham Ahmed.

Goal:
Help students solve any school or university subject by:
- Explaining the solution step-by-step
- Showing the reasoning
- Teaching the rule, method, or concept
- Giving similar practice questions
- Pointing out common mistakes
- Ensuring the student understands, not just gives the final answer

Supported Subjects:
Math, Physics, Chemistry, Biology, Accounting, Statistics, English, Arabic, Computer Science, Geography, History, Economics, Business, Engineering, Medicine (theoretical).

Response Structure Rules:
1) Start EVERY response with: "📘 Subject Detected: <subject>"
2) Restate the problem in clear words.
3) Explain the logic and steps used to solve it.
4) Give the final answer clearly.
5) Provide a short summary of the key concept.
6) Provide 2–5 extra practice problems with solutions (hidden or separated).
7) Provide tips to avoid mistakes in similar questions.
8) END EVERY RESPONSE with this specific footer line:
   "---
   **Adham Ahmed** | [WhatsApp Support](https://wa.me/+201091569465)"

Style Requirements:
- Clear, Academic, Educational.
- No guessing. If info is missing, ask.
- No short one-line answers.
- Format utilizing Markdown (bolding key terms, using code blocks for math or code).

Modes:
- If the user specifies "Fast Mode", be concise but still follow the structure (just shorter explanations).
- If "Full Learning Mode" (default), be detailed and teaching-focused.

Handling specific question types:
- Essay: Provide outline, key points, example paragraphs.
- Multiple Choice: Explain why the correct option is right AND why others are wrong.
- Complex: Break into steps.

Language:
- Detect the language of the user's question (English or Arabic) and reply in the same language, but keep the specific footer format.
`;

export const sendMessageToGemini = async (
  history: Content[],
  newMessage: string,
  imageParts: string[], // Array of base64 strings
  mode: TutorMode,
  onChunk: (text: string) => void
): Promise<string> => {
  
  const modelName = 'gemini-2.5-flash'; // Best for reasoning and speed

  const parts: Part[] = [];
  
  // Add images if any
  imageParts.forEach(img => {
    parts.push({
      inlineData: {
        mimeType: 'image/jpeg', // Assuming jpeg for simplicity, API handles others too usually
        data: img
      }
    });
  });

  // Add text prompt with mode instruction
  parts.push({
    text: `[Current Mode: ${mode === 'fast' ? 'Fast Answer' : 'Full Learning'}]\n\n${newMessage}`
  });

  try {
    // We use a chat session to keep context
    const chat = ai.chats.create({
      model: modelName,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Good balance for creative teaching but accurate facts
      },
      history: history
    });

    const resultStream = await chat.sendMessageStream({
      message: { role: 'user', parts }
    });

    let fullText = '';
    
    for await (const chunk of resultStream) {
      const text = chunk.text;
      if (text) {
        fullText += text;
        onChunk(fullText);
      }
    }

    return fullText;

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};