import { POST } from "../app/api/copilot/route";
import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Google GenAI SDK
const mockGenerateContent = vi.fn();

vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: mockGenerateContent
      };
    }
  };
});

describe("AI Copilot API Endpoint", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.GEMINI_API_KEY = "test-api-key";
  });

  it("returns error if API key is missing", async () => {
    delete process.env.GEMINI_API_KEY;

    const request = new Request("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({ scenarioKey: "kickoff" })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.error).toBe("API_KEY_MISSING");
  });

  it("handles successful live LLM generation and schema validation", async () => {
    const mockPlan = {
      name: "Plan Test: Heavy rain gates shift",
      actions: ["Open auxiliary lanes", "Deploy umbrella stands"],
      waitTime: 5.5,
      crowdDensity: 42,
      riskReduction: 30,
      staffRequired: "8 guides"
    };

    const mockResponseText = JSON.stringify({
      summary: "Rain is causing gate queues to increase.",
      riskLevel: "MEDIUM",
      prediction: "Turnstile delays will build up.",
      confidence: 88,
      recommendedPlan: "Plan Test: Heavy rain gates shift",
      plans: [mockPlan]
    });

    mockGenerateContent.mockResolvedValue({
      text: mockResponseText
    });

    const request = new Request("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({
        scenarioKey: "rain",
        scenarioName: "Heavy Rain",
        metrics: { stadiumHealth: 80, crowdDensity: 70, activeAlerts: 1, avgWaitTime: 12 },
        sections: { parking: "yellow" },
        weather: "17C | Rain",
        activeAlerts: 1
      })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(true);
    expect(json.data.summary).toBe("Rain is causing gate queues to increase.");
    expect(json.data.riskLevel).toBe("MEDIUM");
    expect(json.data.plans[0].name).toBe("Plan Test: Heavy rain gates shift");
  });

  it("returns validation error if model response format is invalid", async () => {
    // Missing required plans field
    const invalidResponseText = JSON.stringify({
      summary: "Invalid payload mock",
      riskLevel: "MEDIUM",
      prediction: "Should fail validation",
      confidence: 88,
      recommendedPlan: "None"
    });

    mockGenerateContent.mockResolvedValue({
      text: invalidResponseText
    });

    const request = new Request("http://localhost/api/copilot", {
      method: "POST",
      body: JSON.stringify({ scenarioKey: "rain" })
    });

    const response = await POST(request);
    const json = await response.json();

    expect(json.success).toBe(false);
    expect(json.error).toBe("API_VALIDATION_ERROR");
  });
});
