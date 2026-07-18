"use client";

import React from "react";
import { 
  LayoutDashboard, 
  Radio, 
  ShieldAlert, 
  Sparkles, 
  Map, 
  Clock, 
  Cpu, 
  Settings,
  Activity,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

interface SidebarProps {
  activeItem: string;
  setActiveItem: (item: string) => void;
}

export default function Sidebar({ activeItem, setActiveItem }: SidebarProps) {
  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Live Operations", icon: Radio, count: "LIVE" },
    { name: "Incident Center", icon: ShieldAlert, count: "2" },
    { name: "AI Copilot", icon: Sparkles, highlight: true },
    { name: "Heatmap", icon: Map },
    { name: "Timeline", icon: Clock },
    { name: "Simulation", icon: Cpu },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/80 backdrop-blur-md flex flex-col h-screen select-none shrink-0">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
            <Activity className="w-5 h-5 text-white" />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <div>
            <h1 className="font-bold text-white tracking-tight leading-none text-base">EventPilot</h1>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase tracking-widest leading-none">Operations</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400 font-mono font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          V2.6
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider px-3 mb-2 font-mono">
          Operations Center
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.name;

          return (
            <button
              key={item.name}
              onClick={() => setActiveItem(item.name)}
              aria-current={isActive ? "page" : undefined}
              aria-label={item.count ? `${item.name} (${item.count})` : item.name}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-200 group text-left ${
                isActive
                  ? "bg-slate-900 text-cyan-400 font-semibold border-l-2 border-cyan-400 shadow-md shadow-cyan-950/20"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors duration-200 ${
                  isActive ? "text-cyan-400" : "text-slate-500 group-hover:text-slate-400"
                } ${item.highlight ? "text-cyan-400 animate-pulse-slow" : ""}`} />
                <span className={item.highlight ? "text-cyan-300 font-medium" : ""}>
                  {item.name}
                </span>
              </div>
              
              {item.count && (
                <span 
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide font-mono ${
                    item.count === "LIVE" 
                      ? "bg-cyan-950 text-cyan-400 border border-cyan-800/40 animate-pulse-slow" 
                      : "bg-rose-950 text-rose-400 border border-rose-800/40"
                  }`}
                  aria-label={item.count === "LIVE" ? "Live operations feed active" : `${item.count} alerts active`}
                >
                  {item.count}
                </span>
              )}

              {!item.count && !isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              )}
            </button>
          );
        })}
      </nav>

      {/* Operator Account Footer */}
      <div className="p-4 border-t border-slate-900 bg-slate-900/30">
        <div className="flex items-center gap-3 p-1.5 rounded-lg bg-slate-900/50 border border-slate-800/30" role="region" aria-label="Operator info">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 font-bold border border-slate-700 font-mono" aria-hidden="true">
            OP
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-200 truncate">Operator_Alpha</p>
            <p className="text-[10px] text-slate-400 truncate">Operations Lead</p>
          </div>
          <div 
            className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)] animate-pulse" 
            role="status"
            aria-label="Operator Online"
          />
        </div>
      </div>
    </aside>
  );
}
