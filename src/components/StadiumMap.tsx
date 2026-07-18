"use client";

import React, { useState } from "react";
import { MapPin, Info } from "lucide-react";
import { StadiumSections, SectionStatus } from "@/types";

interface StadiumMapProps {
  sections: StadiumSections;
  avgWaitTime: number;
}

interface SectionMeta {
  id: keyof StadiumSections;
  name: string;
  capacity: string;
  scanRate: string;
  description: string;
}

const StadiumMap = React.memo(function StadiumMap({ sections, avgWaitTime }: StadiumMapProps) {
  const [hoveredSection, setHoveredSection] = useState<SectionMeta | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const sectionMetadata: Record<keyof StadiumSections, SectionMeta> = {
    northGate: {
      id: "northGate",
      name: "North Gate",
      capacity: "18,500 Spectators",
      scanRate: "125 Scans/min",
      description: "Primary entrance for General Admission (Category 2 & 3)."
    },
    southGate: {
      id: "southGate",
      name: "South Gate",
      capacity: "22,000 Spectators",
      scanRate: "90 Scans/min",
      description: "Highest capacity gate. Links to Metro station hub."
    },
    eastGate: {
      id: "eastGate",
      name: "East Gate",
      capacity: "15,000 Spectators",
      scanRate: "140 Scans/min",
      description: "Direct walkway access from East Bus Station."
    },
    westGate: {
      id: "westGate",
      name: "West Gate",
      capacity: "16,000 Spectators",
      scanRate: "110 Scans/min",
      description: "Secondary entrance with automated biometric gates."
    },
    vipEntrance: {
      id: "vipEntrance",
      name: "VIP & Press Entrance",
      capacity: "4,500 VIP guests",
      scanRate: "75 Scans/min",
      description: "Dedicated access point for VIP hospitality suites."
    },
    foodCourt: {
      id: "foodCourt",
      name: "Food Court Concourse B",
      capacity: "800 concurrent seating",
      scanRate: "N/A (POS Speed: 4.8s)",
      description: "Central concessions zone featuring 12 food stations."
    },
    parking: {
      id: "parking",
      name: "Parking Zone P1 - P4",
      capacity: "12,000 Vehicles",
      scanRate: "92 Entries/min",
      description: "Multi-level parking structure and rideshare drop-off."
    }
  };

  const getStatusColors = (status: SectionStatus) => {
    switch (status) {
      case "green":
        return {
          fill: "rgba(16, 185, 129, 0.15)",
          stroke: "#10b981",
          text: "text-emerald-400",
          bg: "bg-emerald-500/10",
          border: "border-emerald-500/30",
          glow: ""
        };
      case "yellow":
        return {
          fill: "rgba(245, 158, 11, 0.18)",
          stroke: "#f59e0b",
          text: "text-amber-400",
          bg: "bg-amber-500/10",
          border: "border-amber-500/30",
          glow: ""
        };
      case "red":
        return {
          fill: "rgba(239, 68, 68, 0.22)",
          stroke: "#ef4444",
          text: "text-rose-400",
          bg: "bg-rose-500/10",
          border: "border-rose-500/30",
          glow: "animate-pulse"
        };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left + 15,
      y: e.clientY - rect.top + 15
    });
  };

  const handleMouseEnter = (sectionKey: keyof StadiumSections) => {
    setHoveredSection(sectionMetadata[sectionKey]);
  };

  return (
    <section className="glass-panel rounded-xl p-6 flex flex-col h-[400px] relative select-none" aria-label="Digital Twin Stadium Overview">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
            Digital Twin Stadium Overview
          </h3>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/25 border border-emerald-500" />
            <span className="text-slate-400">Green (Safe)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/25 border border-amber-500" />
            <span className="text-slate-400">Yellow (Caution)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-rose-500/25 border border-rose-500 animate-pulse" />
            <span className="text-slate-400">Red (Critical)</span>
          </div>
        </div>
      </div>

      {/* SVG Interactive Container */}
      <div 
        className="flex-1 relative flex items-center justify-center bg-slate-950/40 rounded-lg border border-slate-900/60 overflow-hidden cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredSection(null)}
      >
        <svg 
          viewBox="0 0 500 320" 
          className="w-full h-full max-w-[420px] max-h-[290px]"
        >
          {/* Background grid details */}
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="500" height="320" fill="url(#mapGlow)" pointerEvents="none" />

          {/* PARKING AREA (Outer Sector) */}
          <g 
            className="transition-all duration-300 ease-in-out focus:outline-none focus:stroke-white group"
            tabIndex={0}
            role="img"
            aria-label={`Parking Area status: ${sections.parking}. ${sectionMetadata.parking.description}`}
            onMouseEnter={() => handleMouseEnter("parking")}
            onFocus={() => handleMouseEnter("parking")}
            onBlur={() => setHoveredSection(null)}
          >
            <rect 
              x="20" 
              y="70" 
              width="60" 
              height="180" 
              rx="4" 
              fill={getStatusColors(sections.parking).fill}
              stroke={getStatusColors(sections.parking).stroke}
              strokeWidth="1.5"
              className="cursor-pointer hover:opacity-80"
            />
            <text x="50" y="163" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wider opacity-80">PARKING</text>
          </g>

          {/* FOOD COURT AREA (Concourse Outer Ring) */}
          <g 
            className="transition-all duration-300 ease-in-out focus:outline-none focus:stroke-white group"
            tabIndex={0}
            role="img"
            aria-label={`Food Court status: ${sections.foodCourt}. ${sectionMetadata.foodCourt.description}`}
            onMouseEnter={() => handleMouseEnter("foodCourt")}
            onFocus={() => handleMouseEnter("foodCourt")}
            onBlur={() => setHoveredSection(null)}
          >
            <path 
              d="M 410 70 L 460 70 L 460 250 L 410 250 Z" 
              fill={getStatusColors(sections.foodCourt).fill}
              stroke={getStatusColors(sections.foodCourt).stroke}
              strokeWidth="1.5"
              className="cursor-pointer hover:opacity-80"
            />
            <text x="435" y="163" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wider opacity-80">FOOD</text>
          </g>

          {/* STADIUM BOWL (Outer boundary ring) */}
          <ellipse 
            cx="250" 
            cy="160" 
            rx="135" 
            ry="95" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="2" 
            strokeDasharray="4 4" 
            pointerEvents="none"
          />

          {/* NORTH GATE */}
          <path
            d="M 180 50 A 100 70 0 0 1 320 50 L 305 75 A 80 50 0 0 0 195 75 Z"
            fill={getStatusColors(sections.northGate).fill}
            stroke={getStatusColors(sections.northGate).stroke}
            strokeWidth="2"
            tabIndex={0}
            role="img"
            aria-label={`North Gate status: ${sections.northGate}. ${sectionMetadata.northGate.description}`}
            className="cursor-pointer hover:opacity-90 transition-all duration-300 focus:outline-none focus:stroke-white"
            onMouseEnter={() => handleMouseEnter("northGate")}
            onFocus={() => handleMouseEnter("northGate")}
            onBlur={() => setHoveredSection(null)}
          />
          <text x="250" y="64" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wider opacity-90">NORTH GATE</text>

          {/* SOUTH GATE */}
          <path
            d="M 180 270 A 100 70 0 0 0 320 270 L 305 245 A 80 50 0 0 1 195 245 Z"
            fill={getStatusColors(sections.southGate).fill}
            stroke={getStatusColors(sections.southGate).stroke}
            strokeWidth="2"
            tabIndex={0}
            role="img"
            aria-label={`South Gate status: ${sections.southGate}. ${sectionMetadata.southGate.description}`}
            className="cursor-pointer hover:opacity-90 transition-all duration-300 focus:outline-none focus:stroke-white"
            onMouseEnter={() => handleMouseEnter("southGate")}
            onFocus={() => handleMouseEnter("southGate")}
            onBlur={() => setHoveredSection(null)}
          />
          <text x="250" y="260" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wider opacity-90">SOUTH GATE</text>

          {/* EAST GATE */}
          <path
            d="M 390 120 A 100 70 0 0 1 390 200 L 360 190 A 80 50 0 0 0 360 130 Z"
            fill={getStatusColors(sections.eastGate).fill}
            stroke={getStatusColors(sections.eastGate).stroke}
            strokeWidth="2"
            tabIndex={0}
            role="img"
            aria-label={`East Gate status: ${sections.eastGate}. ${sectionMetadata.eastGate.description}`}
            className="cursor-pointer hover:opacity-90 transition-all duration-300 focus:outline-none focus:stroke-white"
            onMouseEnter={() => handleMouseEnter("eastGate")}
            onFocus={() => handleMouseEnter("eastGate")}
            onBlur={() => setHoveredSection(null)}
          />
          <text x="374" y="163" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wide opacity-90">EAST GATE</text>

          {/* WEST GATE */}
          <path
            d="M 110 120 A 100 70 0 0 0 110 200 L 140 190 A 80 50 0 0 1 140 130 Z"
            fill={getStatusColors(sections.westGate).fill}
            stroke={getStatusColors(sections.westGate).stroke}
            strokeWidth="2"
            tabIndex={0}
            role="img"
            aria-label={`West Gate status: ${sections.westGate}. ${sectionMetadata.westGate.description}`}
            className="cursor-pointer hover:opacity-90 transition-all duration-300 focus:outline-none focus:stroke-white"
            onMouseEnter={() => handleMouseEnter("westGate")}
            onFocus={() => handleMouseEnter("westGate")}
            onBlur={() => setHoveredSection(null)}
          />
          <text x="126" y="163" fill="#ffffff" fontSize="7" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wide opacity-90">WEST GATE</text>

          {/* VIP ENTRANCE */}
          <path
            d="M 130 95 A 110 75 0 0 1 165 70 L 175 90 A 90 60 0 0 0 145 110 Z"
            fill={getStatusColors(sections.vipEntrance).fill}
            stroke={getStatusColors(sections.vipEntrance).stroke}
            strokeWidth="2"
            tabIndex={0}
            role="img"
            aria-label={`VIP Entrance status: ${sections.vipEntrance}. ${sectionMetadata.vipEntrance.description}`}
            className="cursor-pointer hover:opacity-90 transition-all duration-300 focus:outline-none focus:stroke-white"
            onMouseEnter={() => handleMouseEnter("vipEntrance")}
            onFocus={() => handleMouseEnter("vipEntrance")}
            onBlur={() => setHoveredSection(null)}
          />
          <text x="154" y="93" fill="#ffffff" fontSize="7.5" fontWeight="bold" textAnchor="middle" pointerEvents="none" className="font-mono tracking-wider opacity-90">VIP</text>

          {/* Pitch & Inner Stadium Core */}
          <ellipse cx="250" cy="160" rx="90" ry="60" fill="#0b0f19" stroke="#1e293b" strokeWidth="2.5" pointerEvents="none" />
          <ellipse cx="250" cy="160" rx="80" ry="50" fill="none" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" pointerEvents="none" />
          
          {/* Soccer Pitch Graphic representation */}
          <rect x="215" y="135" width="70" height="50" fill="none" stroke="#1e293b" strokeWidth="1.5" rx="3" pointerEvents="none" />
          <line x1="250" y1="135" x2="250" y2="185" stroke="#1e293b" strokeWidth="1.5" pointerEvents="none" />
          <circle cx="250" cy="160" r="10" fill="none" stroke="#1e293b" strokeWidth="1.5" pointerEvents="none" />
        </svg>

        {/* Hover Tooltip - Positioned relatively inside the SVG relative box */}
        {hoveredSection && (
          <div 
            style={{ 
              position: "absolute", 
              left: `${tooltipPos.x}px`, 
              top: `${tooltipPos.y}px` 
            }}
            className="glass-panel-glow border border-slate-700 bg-slate-950/95 p-3 rounded-lg shadow-xl pointer-events-none min-w-[200px] z-50 animate-fade-in"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white tracking-wide">{hoveredSection.name}</span>
              <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded uppercase tracking-wider ${
                getStatusColors(sections[hoveredSection.id]).bg
              } ${
                getStatusColors(sections[hoveredSection.id]).text
              }`}>
                {sections[hoveredSection.id]}
              </span>
            </div>
            
            <p className="text-[10px] text-slate-400 mb-2 leading-tight">
              {hoveredSection.description}
            </p>

            <div className="border-t border-slate-900 pt-2 space-y-1">
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-slate-500">Design Capacity:</span>
                <span className="text-slate-300 font-bold">{hoveredSection.capacity}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-slate-500">Processing Rate:</span>
                <span className="text-slate-300 font-bold">{hoveredSection.scanRate}</span>
              </div>
              <div className="flex justify-between items-center text-[9px] font-mono">
                <span className="text-slate-500">Flow Wait Time:</span>
                <span className={`font-bold ${
                  sections[hoveredSection.id] === "green" ? "text-emerald-400" :
                  sections[hoveredSection.id] === "yellow" ? "text-amber-400" :
                  "text-rose-400"
                }`}>
                  {sections[hoveredSection.id] === "green" ? "~3.5 min" :
                   sections[hoveredSection.id] === "yellow" ? `~${(avgWaitTime * 0.8).toFixed(1)} min` :
                   `~${(avgWaitTime * 1.5).toFixed(1)} min`}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500">
        <Info className="w-3.5 h-3.5 text-cyan-505" aria-hidden="true" />
        <span>Keyboard: Tab through gates to inspect active capacity and flow wait time telemetry.</span>
      </div>
    </section>
  );
});

export default StadiumMap;
