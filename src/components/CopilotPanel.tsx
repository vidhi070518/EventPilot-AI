"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ShieldAlert, 
  Zap, 
  Users, 
  Clock, 
  UserCheck, 
  TrendingDown, 
  Check, 
  Terminal,
  Activity
} from "lucide-react";
import { CoordinatedResponsePlan, PredictionDetails } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface CopilotPanelProps {
  isThinking: boolean;
  prediction: PredictionDetails | null;
  plans: CoordinatedResponsePlan[];
  onDeployPlan: (planId: string) => void;
  deployedPlanId: string | null;
  activityFeed: string[];
  apiStatus?: "idle" | "live" | "simulated" | "error";
}

export default function CopilotPanel({
  isThinking,
  prediction,
  plans,
  onDeployPlan,
  deployedPlanId,
  activityFeed,
  apiStatus = "simulated"
}: CopilotPanelProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");

  // Default select the first plan when plans change or if none selected
  useEffect(() => {
    if (plans.length > 0) {
      // If there's an already deployed plan in this scenario, select it
      if (deployedPlanId && plans.some(p => p.id === deployedPlanId)) {
        setSelectedPlanId(deployedPlanId);
      } else {
        setSelectedPlanId(plans[0].id);
      }
    }
  }, [plans, deployedPlanId]);

  const getRiskBadgeColor = (level?: string) => {
    switch (level) {
      case "CRITICAL":
        return "bg-rose-500/10 text-rose-500 border-rose-500/30 shadow-[0_0_8px_rgba(239,68,68,0.1)]";
      case "HIGH":
        return "bg-amber-500/10 text-amber-500 border-amber-500/30";
      case "MEDIUM":
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case "LOW":
      default:
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    }
  };

  const activePlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  return (
    <div className="glass-panel rounded-xl p-6 flex flex-col h-[585px] relative overflow-hidden select-none">
      {/* Ambient glass top highlights */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      {/* Title Header */}
      <div className="flex justify-between items-center mb-5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-950/60 border border-cyan-800/40 text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
              AI Operations Coordinator
            </h3>
            <p className="text-[10px] text-slate-500 font-medium">Predictive Decision Support Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2 animate-fade-in">
          {/* AI Source Badge */}
          {apiStatus === "live" ? (
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-950/30 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              Powered by Gemini 3.5 Flash
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[9px] font-mono text-amber-500/80 font-bold px-2 py-0.5 rounded bg-amber-950/20 border border-amber-500/20">
              <Terminal className="w-3.5 h-3.5 text-amber-500/80" />
              Local Simulation Mode
            </div>
          )}

          <div className="flex items-center gap-1 text-[9px] font-mono text-cyan-400 font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            <Activity className="w-3 h-3 text-cyan-400 animate-pulse" />
            COGNITIVE NODE ACTIVE
          </div>
        </div>
      </div>

      {/* Main Core Area */}
      <div className="flex-1 relative overflow-hidden min-h-0 flex flex-col">
        <AnimatePresence mode="wait">
          {isThinking ? (
            /* AI Thinking Experience Overlay */
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/40 rounded-lg border border-slate-900/60 p-6 z-10 scanline-grid overflow-hidden"
            >
              {/* Radar Circle */}
              <div className="relative w-40 h-40 rounded-full border border-cyan-500/20 flex items-center justify-center mb-6">
                <div className="absolute inset-2 rounded-full border border-cyan-500/10" />
                <div className="absolute inset-8 rounded-full border border-cyan-500/5" />
                {/* Sweep Sector */}
                <div className="absolute inset-0 rounded-full radar-sweep-effect animate-radar pointer-events-none" />
                {/* Horizontal & Vertical Crosshair Lines */}
                <div className="absolute left-0 right-0 h-[1px] bg-cyan-500/10" />
                <div className="absolute top-0 bottom-0 w-[1px] bg-cyan-500/10" />
                {/* Blinking Targets */}
                <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <div className="absolute bottom-1/3 right-1/4 w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                
                <Sparkles className="w-8 h-8 text-cyan-400/50 animate-pulse" />
              </div>

              {/* Text Loaders */}
              <h4 className="text-sm font-bold text-slate-200 uppercase tracking-widest font-mono mb-2">
                Analyzing Telemetry
              </h4>
              
              <div className="max-w-xs text-[10px] font-mono text-cyan-400/70 text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  <span>Syncing digital twin sensor nodes...</span>
                </div>
                <p className="text-slate-500 uppercase text-[8px] tracking-wider animate-pulse-slow">
                  Optimizing crowd routing models
                </p>
              </div>
            </motion.div>
          ) : (
            /* Coordinated Response Panel Core Content */
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col space-y-4 min-h-0"
            >
              {/* API Status Warning Banners */}
              {apiStatus === "simulated" && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-xs font-medium shrink-0 animate-fade-in">
                  <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                  <span>Local Simulation Mode active. Configure <strong className="text-cyan-400 font-mono">GEMINI_API_KEY</strong> environment variable to enable live Gemini predictions.</span>
                </div>
              )}

              {apiStatus === "error" && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-rose-950/20 border border-rose-500/20 text-rose-400 text-xs font-semibold shrink-0 animate-fade-in">
                  <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                  <span>AI Copilot is temporarily unavailable. Running on local safety fallback datasets.</span>
                </div>
              )}
              {/* Prediction details */}
              {prediction && (
                <div className="glass-panel bg-slate-950/60 rounded-lg p-4 border border-slate-900 relative">
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Risk Index:</span>
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${getRiskBadgeColor(prediction.riskLevel)}`}>
                      {prediction.riskLevel}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-cyan-400 font-mono tracking-wider uppercase block mb-1">
                    Predictive Threat Vector (Horizon: {prediction.forecastTime})
                  </span>
                  <p className="text-xs font-semibold text-slate-200 mb-2 leading-relaxed">
                    "{prediction.predictionText}"
                  </p>
                  <p className="text-[10px] text-slate-400">
                    <span className="font-bold text-slate-300">Situation:</span> {prediction.situationSummary}
                  </p>
                </div>
              )}

              {/* Strategy Selector (2-3 Plans side-by-side or tabs) */}
              <div className="flex-1 flex flex-col min-h-0">
                <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase mb-2 block">
                  Select Coordinated Response Plan
                </span>

                {/* Plan Selection Tabs */}
                <div className="grid grid-cols-3 gap-2 shrink-0 mb-3">
                  {plans.map((plan) => {
                    const isSelected = selectedPlanId === plan.id;
                    const isDeployed = deployedPlanId === plan.id;
                    
                    return (
                      <button
                        key={plan.id}
                        onClick={() => setSelectedPlanId(plan.id)}
                        className={`px-3 py-2.5 rounded-lg border text-left transition-all duration-200 relative ${
                          isSelected 
                            ? "bg-slate-900/80 border-cyan-500/50 shadow-md shadow-cyan-950/20" 
                            : "bg-slate-950/40 border-slate-900 hover:border-slate-800 hover:bg-slate-900/20"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className={`text-[10px] font-bold uppercase tracking-tight block ${
                            isSelected ? "text-cyan-400" : "text-slate-400"
                          }`}>
                            {plan.name.split(":")[0]}
                          </span>
                          {isDeployed && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                          )}
                        </div>
                        <span className="text-[9px] text-slate-500 truncate block mt-0.5">
                          {plan.name.split(":")[1]?.trim()}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Active Plan Detail Grid */}
                {activePlan && (
                  <div className="flex-1 flex flex-row gap-4 min-h-0 bg-slate-950/20 border border-slate-900/60 rounded-lg p-4">
                    {/* Left 3 columns: Actions list */}
                    <div className="w-3/5 flex flex-col justify-between min-h-0 shrink-0">
                      <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                        <span className="text-[9px] font-bold text-slate-500 font-mono tracking-wider uppercase block mb-1.5">
                          Coordinated Dispatch Actions
                        </span>
                        <ul className="space-y-1 text-xs">
                          {activePlan.actions.map((action, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-slate-200">
                              <span className="p-0.5 rounded bg-cyan-950/80 border border-cyan-800/40 text-cyan-400 mt-0.5">
                                <Check className="w-3 h-3" />
                              </span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Apply button */}
                      <div className="pt-2.5 shrink-0">
                        {deployedPlanId === activePlan.id ? (
                          <div className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-xs font-bold font-mono tracking-wider">
                            <Zap className="w-4 h-4 text-emerald-400" />
                            RESPONSE PLAN ACTIVATED & DEPLOYED
                          </div>
                        ) : (
                          <button
                            onClick={() => onDeployPlan(activePlan.id)}
                            className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs tracking-wider transition-all duration-200 shadow-lg shadow-cyan-500/10 active:scale-[0.99] font-mono"
                          >
                            DEPLOY OPERATIONAL PLAN
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right 2 columns: Impact Comparison Card */}
                    <div className="w-2/5 border-l border-slate-900 pl-4 flex flex-col justify-between overflow-y-auto max-h-full pr-1 shrink-0">
                      <div>
                        <span className="text-[9px] font-bold text-slate-500 font-mono tracking-wider uppercase block mb-2">
                          Projected Operational Impact
                        </span>
                        
                        {/* Comparison box */}
                        <div className="space-y-2">
                          {/* Wait Time */}
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-[10px] font-medium">Wait Time</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-rose-400 line-through text-[10px]">18m</span>
                              <span className="text-emerald-400 font-bold text-xs">{activePlan.predictedWaitTime}m</span>
                            </div>
                          </div>

                          {/* Crowd Density */}
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Users className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-[10px] font-medium">Density</span>
                            </div>
                            <div className="flex items-center gap-2 font-mono">
                              <span className="text-rose-400 line-through text-[10px]">91%</span>
                              <span className="text-emerald-400 font-bold text-xs">{activePlan.predictedCrowdDensity}%</span>
                            </div>
                          </div>

                          {/* Risk Reduction */}
                          <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <TrendingDown className="w-3.5 h-3.5 text-cyan-500" />
                              <span className="text-[10px] font-medium">Risk Reduction</span>
                            </div>
                            <span className="text-cyan-400 font-bold text-xs font-mono">
                              -{activePlan.riskReduction}%
                            </span>
                          </div>

                          {/* Staff Required */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                              <span className="text-[10px] font-medium">Deployment</span>
                            </div>
                            <span className="text-slate-300 font-bold text-[10px] font-mono">
                              {activePlan.staffRequired}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Small informational note */}
                      <div className="bg-slate-900/60 rounded p-2 border border-slate-800/40 text-[9px] text-slate-500 leading-tight">
                        Impact metrics are generated by the stadium's Digital Twin neural simulator.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI Activity Feed */}
      <div className="mt-4 border-t border-slate-900 pt-3 shrink-0">
        <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold text-slate-500 font-mono tracking-wider uppercase">
          <Terminal className="w-3.5 h-3.5 text-cyan-500" />
          <span>Cognitive Feed Telemetry</span>
        </div>
        <div className="bg-slate-950/80 rounded border border-slate-900/80 p-2.5 h-[65px] overflow-y-auto space-y-1 font-mono text-[9px] text-slate-400 leading-none">
          {activityFeed.map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-cyan-600 shrink-0">&gt;&gt;</span>
              <span className="text-slate-300 truncate">{log}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
