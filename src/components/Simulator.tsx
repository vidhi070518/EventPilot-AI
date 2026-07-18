"use client";

import React from "react";
import { 
  CloudRain, 
  Flame, 
  Heart, 
  TrendingUp, 
  Activity, 
  RefreshCw 
} from "lucide-react";

interface SimulatorProps {
  activeScenario: string;
  onSelectScenario: (scenario: string) => void;
}

export default function Simulator({ activeScenario, onSelectScenario }: SimulatorProps) {
  const scenarios = [
    {
      id: "kickoff",
      name: "Match Kickoff",
      icon: Activity,
      color: "border-cyan-500/20 hover:border-cyan-400 text-cyan-400 bg-cyan-950/10",
      activeColor: "border-cyan-400 bg-cyan-950/40 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]",
      desc: "Simulate gate entry surge & peak ticket scan rates."
    },
    {
      id: "rain",
      name: "Heavy Rain",
      icon: CloudRain,
      color: "border-blue-500/20 hover:border-blue-400 text-blue-400 bg-blue-950/10",
      activeColor: "border-blue-400 bg-blue-950/40 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.25)]",
      desc: "Simulate slippery walkway hazards & vehicle parking delays."
    },
    {
      id: "medical",
      name: "Medical Emergency",
      icon: Heart,
      color: "border-amber-500/20 hover:border-amber-400 text-amber-400 bg-amber-950/10",
      activeColor: "border-amber-400 bg-amber-950/40 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.25)]",
      desc: "Trigger medical incident dispatch in Concourse B."
    },
    {
      id: "security",
      name: "Security Incident",
      icon: Flame,
      color: "border-rose-500/20 hover:border-rose-400 text-rose-400 bg-rose-950/10",
      activeColor: "border-rose-400 bg-rose-950/40 text-rose-400 shadow-[0_0_15px_rgba(239,68,68,0.25)]",
      desc: "Simulate turnstile failure & crowd bottlenecks at South Gate."
    }
  ];

  return (
    <section className="glass-panel rounded-xl p-5 flex flex-col h-[280px] select-none justify-between" aria-label="Digital Twin Simulator">
      {/* Header Info */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" aria-hidden="true" />
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
              Digital Twin Simulation
            </h3>
          </div>
          {activeScenario !== "baseline" && (
            <button
              onClick={() => onSelectScenario("baseline")}
              aria-label="Reset simulation to baseline nominal status"
              className="flex items-center gap-1.5 text-[9px] font-bold font-mono text-slate-400 hover:text-cyan-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <RefreshCw className="w-3 h-3" aria-hidden="true" />
              RESET SYSTEM
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-400 leading-normal">
          Test operational scenarios before they happen using an AI-powered digital twin of the stadium.
        </p>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3 my-3" role="group" aria-label="Simulation Scenarios">
        {scenarios.map((scenario) => {
          const Icon = scenario.icon;
          const isActive = activeScenario === scenario.id;

          return (
            <button
              key={scenario.id}
              onClick={() => onSelectScenario(scenario.id)}
              aria-pressed={isActive}
              aria-label={`Simulate ${scenario.name}. ${scenario.desc}`}
              className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all duration-300 group h-[75px] focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
                isActive ? scenario.activeColor : scenario.color
              }`}
            >
              <div className="flex justify-between items-start w-full">
                <span className="text-[10px] font-bold tracking-wide uppercase font-mono">
                  {scenario.name}
                </span>
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 duration-200 ${
                  isActive ? "animate-pulse" : ""
                }`} aria-hidden="true" />
              </div>
              <span className="text-[8px] text-slate-500 group-hover:text-slate-400 transition-colors leading-tight font-medium">
                {scenario.desc}
              </span>
            </button>
          );
        })}
      </div>

      {/* Footnote */}
      <div className="text-[8px] text-slate-500 font-mono flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" aria-hidden="true" />
        <span>Scenario shifts will re-route real-time telemetry datasets.</span>
      </div>
    </section>
  );
}
