"use client";

import React, { useState, useEffect } from "react";
import { 
  CloudSun, 
  AlertTriangle, 
  Play,
  Pause
} from "lucide-react";

interface HeaderProps {
  stadiumHealth: number;
  activeAlerts: number;
  aiConfidence: number;
  demoMode: boolean;
  setDemoMode: (mode: boolean) => void;
  weather?: string;
}

export default function Header({
  stadiumHealth,
  activeAlerts,
  aiConfidence,
  demoMode,
  setDemoMode,
  weather = "21°C | Clear"
}: HeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Radial Gauge Calculations
  const radius = 16;
  const strokeWidth = 3;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (aiConfidence / 100) * circumference;

  return (
    <header className="h-20 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-8 select-none shrink-0 relative z-20">
      {/* Title */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.7)]" />
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
            FIFA World Cup 2026
          </h2>
        </div>
        <p className="text-xs text-slate-400 font-medium">Live Operations (Simulation)</p>
      </div>

      {/* Center Controls & Info */}
      <div className="flex items-center gap-6">
        {/* Demo Mode Toggle */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-slate-900/50 border border-slate-800/80">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 font-mono tracking-wider">DEMO MODE</span>
            <span className="text-[9px] text-cyan-400 font-medium tracking-tight">Auto Scenario Cycle</span>
          </div>
          <button
            onClick={() => setDemoMode(!demoMode)}
            role="switch"
            aria-checked={demoMode}
            aria-label="Toggle Demo Mode Auto Scenario Cycle"
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-950 ${
              demoMode ? "bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.4)]" : "bg-slate-800"
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                demoMode ? "translate-x-5 text-cyan-600" : "translate-x-0 text-slate-400"
              }`}
            >
              {demoMode ? (
                <Play className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
              ) : (
                <Pause className="w-2.5 h-2.5 fill-current" aria-hidden="true" />
              )}
            </span>
          </button>
        </div>

        {/* Live Clock */}
        <div className="flex flex-col items-center bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-900 min-w-[90px]">
          <span className="text-[9px] font-semibold text-slate-500 font-mono uppercase tracking-widest">
            UTC Time
          </span>
          <span className="text-sm font-bold font-mono text-cyan-400 tracking-wider">
            {time || "10:34:02"}
          </span>
        </div>

        {/* Weather Info */}
        <div className="flex items-center gap-2 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-900">
          <CloudSun className="w-4 h-4 text-cyan-400" />
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
              Weather
            </span>
            <span className="text-xs font-bold text-slate-300 font-mono">
              {weather}
            </span>
          </div>
        </div>

        {/* Stadium Health Progress */}
        <div className="flex items-center gap-3 bg-slate-900/30 px-3 py-1 rounded-lg border border-slate-900" role="status" aria-label={`System Health: ${stadiumHealth}%`}>
          <div className="flex flex-col text-right">
            <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
              System Health
            </span>
            <span className={`text-xs font-bold font-mono ${
              stadiumHealth > 90 
                ? "text-emerald-400" 
                : stadiumHealth > 75 
                ? "text-amber-400" 
                : "text-rose-400"
            }`}>
              {stadiumHealth}%
            </span>
          </div>
          <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-out ${
                stadiumHealth > 90 
                  ? "bg-emerald-400" 
                  : stadiumHealth > 75 
                  ? "bg-amber-400" 
                  : "bg-rose-400"
              }`}
              style={{ width: `${stadiumHealth}%` }}
            />
          </div>
        </div>

        {/* Active Incidents Badge */}
        <div className="flex items-center gap-2 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-slate-900" role="status" aria-label={`${activeAlerts} active incidents`}>
          <div className="relative" aria-hidden="true">
            <AlertTriangle className={`w-4 h-4 ${activeAlerts > 0 ? "text-rose-400 animate-bounce" : "text-emerald-400"}`} />
            {activeAlerts > 0 && (
              <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
              Incidents
            </span>
            <span className="text-xs font-bold text-slate-300 font-mono">
              {activeAlerts} Active
            </span>
          </div>
        </div>

        {/* AI Confidence Status Gauge */}
        <div className="flex items-center gap-2.5 bg-slate-900/50 border border-slate-800/80 px-3 py-1.5 rounded-lg">
          <div className="relative w-8 h-8 flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="w-full h-full transform -rotate-90" role="img" aria-label={`AI Confidence Score: ${aiConfidence}%`}>
              <title>AI Confidence Score Radial Progress Gauge</title>
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="stroke-slate-800"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r={radius}
                className="stroke-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[8px] font-bold font-mono text-cyan-400">
              {aiConfidence}%
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-semibold uppercase tracking-wider font-mono">
              AI Confidence
            </span>
            <span className="text-[10px] font-bold text-slate-300 font-mono">
              Optimal Sync
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
