"use client";

import React, { useRef, useEffect } from "react";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  Sparkles,
  Zap
} from "lucide-react";
import { TimelineEvent } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface LiveTimelineProps {
  events: TimelineEvent[];
}

export default function LiveTimeline({ events }: LiveTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when a new event arrives
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [events]);

  const getCategoryIcon = (category: string, isCustomDispatch?: boolean) => {
    if (isCustomDispatch) {
      return <Zap className="w-3.5 h-3.5 text-cyan-400" />;
    }
    switch (category) {
      case "warning":
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
      case "danger":
        return <XCircle className="w-3.5 h-3.5 text-rose-500" />;
      case "success":
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />;
      case "info":
      default:
        return <Info className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getCategoryStyles = (category: string, isCustomDispatch?: boolean) => {
    if (isCustomDispatch) {
      return "border-cyan-500/30 bg-cyan-950/20 text-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.1)]";
    }
    switch (category) {
      case "warning":
        return "border-amber-500/20 bg-amber-950/10 text-amber-400";
      case "danger":
        return "border-rose-500/20 bg-rose-950/10 text-rose-400";
      case "success":
        return "border-emerald-500/20 bg-emerald-950/10 text-emerald-400";
      case "info":
      default:
        return "border-blue-500/20 bg-blue-950/10 text-blue-400";
    }
  };

  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col h-[400px] select-none">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
            Live Incident Timeline
          </h3>
        </div>
        <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[9px] text-slate-400 font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          STREAMING
        </span>
      </div>

      {/* Events Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-3 pr-2 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {events.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
              No recent operational events logged.
            </div>
          ) : (
            events.map((event, idx) => (
              <motion.div
                key={`${event.id}-${idx}`}
                initial={{ opacity: 0, x: 20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3.5 rounded-lg border flex gap-3 text-xs leading-relaxed ${getCategoryStyles(event.category, event.isCustomDispatch)}`}
              >
                {/* Left Side Category Icon + Pulse */}
                <div className="flex flex-col items-center pt-0.5">
                  <div className="relative">
                    {getCategoryIcon(event.category, event.isCustomDispatch)}
                    {event.category === "danger" && (
                      <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1">
                  <div className="flex justify-between items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-slate-400">
                      {event.time}
                    </span>
                    {event.section && (
                      <span className="px-1.5 py-0.2 rounded bg-slate-900/60 border border-slate-800/40 text-[9px] text-slate-400 font-mono">
                        {event.section}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200">{event.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
