import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import CopilotPanel from "../components/CopilotPanel";

const mockPrediction = {
  riskLevel: "HIGH" as const,
  forecastTime: "15m",
  predictionText: "Spectator surge at South Gate turnstiles.",
  situationSummary: "Turnstile scanning rate bottleneck."
};

const mockPlans = [
  {
    id: "plan-1",
    name: "Plan A: Reroute Flow",
    actions: ["Redirect West Gate", "Staff South turnstile"],
    predictedWaitTime: 4,
    predictedCrowdDensity: 55,
    riskReduction: 30,
    staffRequired: "6 Guides"
  },
  {
    id: "plan-2",
    name: "Plan B: Biometric Reset",
    actions: ["Reboot South node", "Deploy standby guides"],
    predictedWaitTime: 6,
    predictedCrowdDensity: 58,
    riskReduction: 25,
    staffRequired: "4 Guides"
  }
];

describe("CopilotPanel Component", () => {
  it("renders the predictive warning and fallback alert correctly", () => {
    const handleDeploy = vi.fn();
    render(
      <CopilotPanel
        isThinking={false}
        prediction={mockPrediction}
        plans={mockPlans}
        onDeployPlan={handleDeploy}
        deployedPlanId={null}
        activityFeed={["[12:00:00] Initialized"]}
        apiStatus="error"
      />
    );

    // Verify fallback banner is present
    expect(screen.getByText(/AI Copilot is temporarily unavailable. Running on local safety fallback datasets./i)).toBeInTheDocument();

    // Verify predictive threat details are present
    expect(screen.getByText(/Spectator surge at South Gate turnstiles./i)).toBeInTheDocument();
    expect(screen.getByText(/Turnstile scanning rate bottleneck./i)).toBeInTheDocument();
  });

  it("allows selecting a plan and clicking deploy", () => {
    const handleDeploy = vi.fn();
    render(
      <CopilotPanel
        isThinking={false}
        prediction={mockPrediction}
        plans={mockPlans}
        onDeployPlan={handleDeploy}
        deployedPlanId={null}
        activityFeed={["[12:00:00] Initialized"]}
        apiStatus="live"
      />
    );

    // Verify tabs are rendered (Plan A and Plan B)
    const tabA = screen.getByRole("tab", { name: /Plan A/i });
    const tabB = screen.getByRole("tab", { name: /Plan B/i });
    expect(tabA).toBeInTheDocument();
    expect(tabB).toBeInTheDocument();

    // Deploy operational plan button should be present
    const deployBtn = screen.getByRole("button", { name: /Deploy response plan: Plan A: Reroute Flow/i });
    expect(deployBtn).toBeInTheDocument();

    // Click deploy plan and check callback call
    fireEvent.click(deployBtn);
    expect(handleDeploy).toHaveBeenCalledWith("plan-1");
  });
});
