import { GoogleGenAI } from "@google/genai";

export const generateJobDescription = async (title: string, keywords: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using the recommended model for text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a professional and attractive job description for the position of "${title}". 
      Include the following keywords or requirements: ${keywords}. 
      Keep it structured with Responsibilities and Requirements. Return only the text body, no markdown code blocks.`,
    });

    return response.text || "No description generated.";
  } catch (error) {
    console.error("Error generating content:", error);
    return "Failed to generate job description. Please try again.";
  }
};