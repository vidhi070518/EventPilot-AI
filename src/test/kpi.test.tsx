import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import KPICards from "../components/KPICards";

describe("KPICards Component", () => {
  it("renders all KPI cards with initial values and descriptions", () => {
    render(
      <KPICards
        stadiumHealth={95}
        crowdDensity={62}
        activeAlerts={1}
        avgWaitTime={4.8}
      />
    );

    // Verify card titles are present
    expect(screen.getByText("Stadium Health")).toBeInTheDocument();
    expect(screen.getByText("Crowd Density")).toBeInTheDocument();
    expect(screen.getByText("Active Alerts")).toBeInTheDocument();
    expect(screen.getByText("Avg Gate Wait Time")).toBeInTheDocument();

    // Verify subtitles are present
    expect(screen.getByText("Telemetry & node status")).toBeInTheDocument();
    expect(screen.getByText("Pedestrian load balance")).toBeInTheDocument();
    expect(screen.getByText("Unresolved site incidents")).toBeInTheDocument();
    expect(screen.getByText("Turnstile scanning load")).toBeInTheDocument();

    // Verify icons are rendered (using test setup span data-testid mapping)
    expect(screen.getByTestId("icon-heart")).toBeInTheDocument();
    expect(screen.getByTestId("icon-users")).toBeInTheDocument();
    expect(screen.getByTestId("icon-alert-triangle")).toBeInTheDocument();
    expect(screen.getByTestId("icon-clock")).toBeInTheDocument();
  });
});
