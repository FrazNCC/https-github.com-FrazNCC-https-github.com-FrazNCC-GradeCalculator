import { GoogleGenAI } from "@google/genai";
import { Unit, QualificationType, Subject, CalculationResult } from '../types';

export const getAIAdvice = async (
  subject: Subject,
  qualification: QualificationType,
  units: Unit[],
  results: CalculationResult
): Promise<string> => {
  // Safe access to process.env
  const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : undefined;

  if (!apiKey) {
    return "API Key not configured. Please check your environment settings.";
  }

  const ai = new GoogleGenAI({ apiKey: apiKey });
  
  const unitSummary = units.map(u => `- ${u.name} (${u.glh} GLH, ${u.type}): Grade ${u.grade}`).join('\n');
  
  const prompt = `
    I am a student studying ${qualification} in ${subject}.
    
    Here is my current unit profile:
    ${unitSummary}
    
    Current Calculated Results:
    - Total Points: ${results.totalPoints}
    - Current Grade: ${results.grade}
    - UCAS Points: ${results.ucasPoints}
    ${results.nextGradeBoundary ? `- Points needed for next grade (${results.nextGradeBoundary.grade}): ${results.nextGradeBoundary.pointsNeeded}` : '- I have achieved the highest possible grade.'}
    
    Please provide a concise academic report (max 300 words).
    1. Analyze my performance. Am I balanced or struggling in specific areas (Internal vs External)?
    2. Suggest 2-3 specific university course types or career paths suitable for a ${subject} student with these potential grades.
    3. If I am not at the top grade, recommend a strategy to gain the missing points (e.g., retaking an external unit vs improving coursework).
    
    Format clearly with simple text headings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert vocational education consultant specializing in Pearson BTEC qualifications.",
        thinkingConfig: { thinkingBudget: 0 } // Speed over deep thought for this responsive UI
      }
    });
    
    return response.text || "Unable to generate advice at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while contacting the AI advisor. Please try again later.";
  }
};