import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Schema interfaces to validate the model response
interface AIPlan {
  name: string;
  actions: string[];
  waitTime: number;
  crowdDensity: number;
  riskReduction: number;
  staffRequired: string;
}

interface AIResponse {
  summary: string;
  riskLevel: string;
  prediction: string;
  confidence: number;
  recommendedPlan: string;
  plans: AIPlan[];
}

interface POSTRequestBody {
  scenarioKey?: string;
  scenarioName?: string;
  metrics?: {
    stadiumHealth: number;
    crowdDensity: number;
    activeAlerts: number;
    avgWaitTime: number;
  };
  sections?: Record<string, string>;
  weather?: string;
  activeAlerts?: number;
}

export async function POST(request: Request) {
  let body: POSTRequestBody | null = null;
  try {
    body = await request.json() as POSTRequestBody;
  } catch (parseError) {
    console.error("Internal Server Error parsing JSON request:", parseError);
    return NextResponse.json({ success: false, error: "API_BAD_REQUEST" });
  }

  try {
    const { scenarioKey, scenarioName, metrics, sections, weather, activeAlerts } = body || {};

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: "API_KEY_MISSING" });
    }

    // Initialize the official Google GenAI SDK
    const ai = new GoogleGenAI({ apiKey });

    // Build the high-fidelity prompt for stadium operations support
    const prompt = `You are EventPilot AI, an expert GenAI Stadium Operations Copilot assisting FIFA World Cup stadium operators.
    
    CURRENT REAL-TIME TELEMETRY DATA:
    - Active Scenario: ${scenarioName} (Key: ${scenarioKey})
    - Stadium Health Score: ${metrics?.stadiumHealth || 97}%
    - Active Alerts Count: ${activeAlerts || 0}
    - Average Wait Time: ${metrics?.avgWaitTime || 12} minutes
    - Average Crowd Density: ${metrics?.crowdDensity || 45}%
    - Current Weather Status: ${weather || "21°C | Clear"}
    
    STADIUM SECTOR STATUS MAP (telemetry status indicator values):
    - North Gate: ${sections?.northGate || "green"}
    - South Gate: ${sections?.southGate || "green"}
    - East Gate: ${sections?.eastGate || "green"}
    - West Gate: ${sections?.westGate || "green"}
    - VIP Entrance: ${sections?.vipEntrance || "green"}
    - Food Concourse B: ${sections?.foodCourt || "green"}
    - Parking Lot: ${sections?.parking || "green"}

    TASK:
    Based on the above telemetry and active threat parameters, perform an operational risk prediction analysis and formulate exactly 2 or 3 alternative Coordinated Response Plans. Each plan must coordinate operations (e.g. security dispatch, traffic rerouting, medical team standbys, biometric scanner resets) to optimize flow, reduce risk index, and restore health parameters.

    Respond ONLY as a valid JSON object matching this exact TypeScript structure:
    {
      "summary": "Situation summary explaining the predictive risk warning details (e.g. 'Subway passenger arrival surge is putting high pressure on South Gate entry turnstiles.')",
      "riskLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
      "prediction": "A detailed predictive alert (e.g. 'Spectator surge at South Gate will exceed processing capacity in 8 minutes if turnstile rates remain un-optimized.')",
      "confidence": 94, // Dynamic confidence rating as an integer percentage between 80 and 99
      "recommendedPlan": "Name of the recommended plan (e.g. 'Plan Alpha: Dynamic Gate Rerouting & Subway Shuttle Dispatch')",
      "plans": [
        {
          "name": "Plan Name (e.g. 'Plan Alpha: Dynamic Gate Rerouting')",
          "actions": ["Action item 1", "Action item 2", "Action item 3"], // List of 3-4 specific operations dispatches
          "waitTime": 4.5, // Float/integer predicted wait time (must be lower/better than the current avgWaitTime)
          "crowdDensity": 42, // Integer percentage predicted crowd density (must be better than current crowdDensity)
          "riskReduction": 35, // Integer percentage representing risk reduction index (e.g. 35 for 35% reduction)
          "staffRequired": "Description of personnel (e.g. '12 Operations Guides, 4 Security Officers')"
        }
      ]
    }

    Constraints:
    1. Do not use markdown tags, triple backticks, or comments.
    2. Provide ONLY valid, parseable JSON.
    3. Ensure waitTime is a number, crowdDensity is a number, and riskReduction is an integer.`;

    // 10-Second Request Timeout using Promise.race
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), 10000)
    );

    try {
      const response = await Promise.race([
        ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
          },
        }),
        timeoutPromise,
      ]);

      const text = response.text?.trim();
      if (!text) {
        return NextResponse.json({ success: false, error: "API_EMPTY_RESPONSE" });
      }

      // JSON parsing & Schema Validation
      const parsedData: AIResponse = JSON.parse(text);

      const isValid = 
        typeof parsedData.summary === "string" &&
        ["CRITICAL", "HIGH", "MEDIUM", "LOW"].includes(parsedData.riskLevel) &&
        typeof parsedData.prediction === "string" &&
        typeof parsedData.confidence === "number" &&
        typeof parsedData.recommendedPlan === "string" &&
        Array.isArray(parsedData.plans) &&
        parsedData.plans.length > 0;

      if (!isValid) {
        console.error("AI Response Schema Validation Failed:", parsedData);
        return NextResponse.json({ success: false, error: "API_VALIDATION_ERROR" });
      }

      // Ensure each plan in plans array is validated
      for (const plan of parsedData.plans) {
        const planValid =
          typeof plan.name === "string" &&
          Array.isArray(plan.actions) &&
          plan.actions.length > 0 &&
          typeof plan.waitTime === "number" &&
          typeof plan.crowdDensity === "number" &&
          typeof plan.riskReduction === "number" &&
          typeof plan.staffRequired === "string";

        if (!planValid) {
          console.error("Plan Schema Validation Failed:", plan);
          return NextResponse.json({ success: false, error: "API_VALIDATION_ERROR" });
        }
      }

      return NextResponse.json({ success: true, data: parsedData });
    } catch (apiError: unknown) {
      const error = apiError as Error;
      if (error.message === "Timeout") {
        console.warn("Gemini API request timed out after 10s");
        return NextResponse.json({ success: false, error: "API_TIMEOUT" });
      }
      console.error("Gemini API execution error:", apiError);
      return NextResponse.json({ success: false, error: "API_ERROR", details: error.message });
    }
  } catch (err: unknown) {
    const error = err as Error;
    console.error("Internal Server Error in copilot endpoint:", err);
    return NextResponse.json({ success: false, error: "SERVER_ERROR", details: error.message });
  }
}
