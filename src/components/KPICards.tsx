"use client";

import React, { useEffect, useState, useRef } from "react";
import { 
  Heart, 
  Users, 
  AlertTriangle, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { motion } from "framer-motion";

interface KPICardsProps {
  stadiumHealth: number;
  crowdDensity: number;
  activeAlerts: number;
  avgWaitTime: number;
}

// Custom Hook to count up/down smoothly
function useCountUp(target: number, duration: number = 800, decimals: number = 0) {
  const [count, setCount] = useState(target);
  const prevTargetRef = useRef(target);

  useEffect(() => {
    const start = count;
    const end = target;
    if (start === end) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Quad Easing Out
      const easeOutQuad = (t: number) => t * (2 - t);
      const easedProgress = easeOutQuad(progress);
      
      const currentVal = start + (end - start) * easedProgress;
      const factor = Math.pow(10, decimals);
      setCount(Math.round(currentVal * factor) / factor);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(animate);
      }
    };

    animationFrameId = window.requestAnimationFrame(animate);
    prevTargetRef.current = target;

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [target, duration, decimals]);

  return count;
}

export default function KPICards({
  stadiumHealth,
  crowdDensity,
  activeAlerts,
  avgWaitTime
}: KPICardsProps) {
  const animatedHealth = useCountUp(stadiumHealth);
  const animatedDensity = useCountUp(crowdDensity);
  const animatedAlerts = useCountUp(activeAlerts);
  const animatedWaitTime = useCountUp(avgWaitTime, 800, 1);

  // Keep track of previous values to show up/down indicators
  const [prevValues, setPrevValues] = useState({
    health: stadiumHealth,
    density: crowdDensity,
    alerts: activeAlerts,
    waitTime: avgWaitTime
  });

  useEffect(() => {
    // Small delay to capture trends
    const timer = setTimeout(() => {
      setPrevValues({
        health: stadiumHealth,
        density: crowdDensity,
        alerts: activeAlerts,
        waitTime: avgWaitTime
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [stadiumHealth, crowdDensity, activeAlerts, avgWaitTime]);

  const cards = [
    {
      title: "Stadium Health",
      value: animatedHealth,
      suffix: "%",
      subtitle: "Telemetry & node status",
      icon: Heart,
      color: "cyan",
      trend: stadiumHealth >= prevValues.health ? "up" : "down",
      trendValue: `${Math.abs(stadiumHealth - prevValues.health)}%`,
      status: stadiumHealth > 90 ? "Optimal" : stadiumHealth > 75 ? "Caution" : "Critical",
      statusColor: stadiumHealth > 90 ? "text-emerald-400" : stadiumHealth > 75 ? "text-amber-400" : "text-rose-400"
    },
    {
      title: "Crowd Density",
      value: animatedDensity,
      suffix: "%",
      subtitle: "Pedestrian load balance",
      icon: Users,
      color: "blue",
      trend: crowdDensity >= prevValues.density ? "up" : "down",
      trendValue: `${Math.abs(crowdDensity - prevValues.density)}%`,
      status: crowdDensity < 65 ? "Normal" : crowdDensity < 85 ? "Congested" : "Overload",
      statusColor: crowdDensity < 65 ? "text-emerald-400" : crowdDensity < 85 ? "text-amber-400" : "text-rose-400"
    },
    {
      title: "Active Alerts",
      value: animatedAlerts,
      suffix: "",
      subtitle: "Unresolved site incidents",
      icon: AlertTriangle,
      color: "rose",
      trend: activeAlerts >= prevValues.alerts ? "up" : "down",
      trendValue: `${Math.abs(activeAlerts - prevValues.alerts)}`,
      status: activeAlerts === 0 ? "Clear" : activeAlerts <= 2 ? "Warning" : "Critical",
      statusColor: activeAlerts === 0 ? "text-emerald-400" : activeAlerts <= 2 ? "text-amber-400" : "text-rose-400"
    },
    {
      title: "Avg Gate Wait Time",
      value: animatedWaitTime,
      suffix: " min",
      subtitle: "Turnstile scanning load",
      icon: Clock,
      color: "amber",
      trend: avgWaitTime >= prevValues.waitTime ? "up" : "down",
      trendValue: `${Math.abs(avgWaitTime - prevValues.waitTime).toFixed(1)}m`,
      status: avgWaitTime < 6 ? "Fast" : avgWaitTime < 12 ? "Moderate" : "Severe",
      statusColor: avgWaitTime < 6 ? "text-emerald-400" : avgWaitTime < 12 ? "text-amber-400" : "text-rose-400"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;

        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.08 }}
            className="glass-panel glass-card-hover rounded-xl p-5 relative overflow-hidden flex flex-col justify-between h-[135px]"
          >
            {/* Ambient Background Glow overlay */}
            <div className="absolute -top-12 -right-12 w-24 h-24 rounded-full bg-cyan-500/5 blur-xl pointer-events-none" />
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs text-slate-400 font-semibold tracking-wide uppercase font-mono">
                  {card.title}
                </span>
                <p className="text-[10px] text-slate-500 font-medium">{card.subtitle}</p>
              </div>
              <div className={`p-2 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400`}>
                <Icon className="w-4.5 h-4.5" />
              </div>
            </div>

            {/* Value & Trend */}
            <div className="flex items-end justify-between mt-4">
              <div>
                <span className="text-3xl font-bold font-mono tracking-tight text-slate-100">
                  {card.value}
                </span>
                <span className="text-sm font-semibold text-slate-400 font-mono">
                  {card.suffix}
                </span>
              </div>

              <div className="flex flex-col items-end">
                <span className={`text-[10px] font-bold font-mono ${card.statusColor} uppercase tracking-wider`}>
                  {card.status}
                </span>
                <div className="flex items-center text-[10px] text-slate-400 font-mono">
                  {card.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3 text-cyan-400 mr-0.5 shrink-0" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 text-rose-500 mr-0.5 shrink-0" />
                  )}
                  <span className={card.trend === "up" ? "text-cyan-400/90" : "text-rose-500/90"}>
                    {card.trendValue}
                  </span>
                </div>
              </div>
            </div>

            {/* Card bottom colored micro border */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent to-transparent ${
              card.color === "cyan" ? "hover:to-cyan-500 hover:from-cyan-900" :
              card.color === "blue" ? "hover:to-blue-500 hover:from-blue-900" :
              card.color === "rose" ? "hover:to-rose-500 hover:from-rose-900" :
              "hover:to-amber-500 hover:from-amber-900"
            } transition-all duration-300`} />
          </motion.div>
        );
      })}
    </div>
  );
}
