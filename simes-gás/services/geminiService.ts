
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceState } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSafetyAdvice = async (state: DeviceState): Promise<string> => {
  try {
    const prompt = `
      Act as a home safety expert for LPG (Liquid Petroleum Gas) systems. 
      Analyze the current sensor state of an ESP32-monitored gas cylinder:
      - Current Gas Level: ${state.percentage.toFixed(1)}%
      - Weight: ${state.gasWeight.toFixed(2)}kg
      - Leak Sensors: Internal MQ2: ${state.leakInternal ? 'LEAK DETECTED' : 'Normal'}, External MQ2: ${state.leakExternal ? 'LEAK DETECTED' : 'Normal'}
      - Relay Status: ${state.relayActive ? 'Open (Normal)' : 'Closed (Safety Cut-off active)'}
      - Mute Status: ${state.isMuted ? 'Buzzer Silenced' : 'Alerts Active'}

      Provide a short, punchy safety insight (max 2 sentences) in Portuguese (pt-BR).
      Include an emoji for visual status.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Sistema operando normalmente. Continue monitorando.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Falha ao obter insights de IA. Verifique sua conexão.";
  }
};
