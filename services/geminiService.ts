import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to clean JSON string if markdown blocks are present
const cleanJson = (text: string): string => {
  let clean = text.trim();
  if (clean.startsWith('```json')) {
    clean = clean.replace(/^```json/, '').replace(/```$/, '');
  } else if (clean.startsWith('```')) {
    clean = clean.replace(/^```/, '').replace(/```$/, '');
  }
  return clean;
};

export const analyzeFoodImage = async (base64Image: string): Promise<{
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this image. Identify the main food item and estimate its nutritional content (calories, protein, carbs, fat). Be realistic."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Short descriptive name of the food" },
            calories: { type: Type.NUMBER, description: "Estimated calories" },
            protein: { type: Type.NUMBER, description: "Estimated protein in grams" },
            carbs: { type: Type.NUMBER, description: "Estimated carbohydrates in grams" },
            fat: { type: Type.NUMBER, description: "Estimated fat in grams" }
          },
          required: ["name", "calories", "protein", "carbs", "fat"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error("Food analysis failed:", error);
    throw new Error("Failed to analyze food image.");
  }
};

export const analyzeExerciseText = async (description: string, userWeight: number): Promise<{
  activity: string;
  durationMinutes: number;
  caloriesBurned: number;
}> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `User weight: ${userWeight}kg. User input: "${description}". Extract the activity, duration, and estimate calories burned.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            activity: { type: Type.STRING, description: "Standardized name of the activity" },
            durationMinutes: { type: Type.NUMBER, description: "Duration in minutes" },
            caloriesBurned: { type: Type.NUMBER, description: "Estimated calories burned based on weight and duration" }
          },
          required: ["activity", "durationMinutes", "caloriesBurned"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(cleanJson(text));
  } catch (error) {
    console.error("Exercise analysis failed:", error);
    throw new Error("Failed to log exercise.");
  }
};

export const getDailyInsight = async (
  stats: { caloriesConsumed: number; caloriesBurned: number; protein: number; carbs: number; fat: number },
  goal: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `Data: Consumed ${stats.caloriesConsumed}kcal, Burned ${stats.caloriesBurned}kcal. Macros: P:${stats.protein}g, C:${stats.carbs}g, F:${stats.fat}g. User Goal: ${goal}. 
      Give a 1-sentence motivational insight or tip based on today's performance. Keep it friendly and concise.`,
    });
    return response.text || "Keep pushing towards your goals!";
  } catch (e) {
    return "Stay consistent and healthy!";
  }
};