"use client";

import React, { useRef, useEffect } from "react";
import { 
  Send, 
  CheckCircle, 
  MessageSquare,
  Shield,
  Activity,
  AlertCircle
} from "lucide-react";
import { NotificationDispatch } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationsProps {
  notifications: NotificationDispatch[];
}

export default function Notifications({ notifications }: NotificationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when a new dispatch occurs
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [notifications]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-emerald-950/60 text-emerald-400 border-emerald-800/40";
      case "Active":
        return "bg-cyan-950/60 text-cyan-400 border-cyan-800/40 animate-pulse";
      case "Delivered":
        return "bg-slate-900 text-slate-400 border-slate-800";
      case "Sent":
      default:
        return "bg-blue-950/60 text-blue-400 border-blue-800/40";
    }
  };

  const getRecipientIcon = (recipient: string) => {
    if (recipient.toLowerCase().includes("security")) {
      return <Shield className="w-3.5 h-3.5 text-cyan-400" />;
    }
    if (recipient.toLowerCase().includes("medical")) {
      return <Activity className="w-3.5 h-3.5 text-rose-400" />;
    }
    return <AlertCircle className="w-3.5 h-3.5 text-amber-400" />;
  };

  return (
    <div className="glass-panel rounded-xl p-5 flex flex-col h-[280px] select-none">
      {/* Title */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Send className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-200 tracking-wide uppercase font-mono">
            Operations Team Dispatched
          </h3>
        </div>
        <span className="text-[10px] font-mono text-slate-500 font-bold">
          TOTAL: {notifications.length}
        </span>
      </div>

      {/* Dispatches List */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-2.5 pr-1 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {notifications.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-500 text-xs font-mono">
              No active dispatches on record.
            </div>
          ) : (
            notifications.map((dispatch, idx) => (
              <motion.div
                key={`${dispatch.id}-${idx}`}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg hover:border-slate-800/60 hover:bg-slate-900/50 transition-all flex items-start gap-3"
              >
                {/* Icon box based on team */}
                <div className="p-1.5 rounded bg-slate-950 border border-slate-900 shrink-0">
                  {getRecipientIcon(dispatch.recipient)}
                </div>

                {/* Dispatch Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-slate-300 truncate">
                      {dispatch.recipient}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500 font-medium whitespace-nowrap">
                      {dispatch.time}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug line-clamp-2">
                    {dispatch.message}
                  </p>
                </div>

                {/* Dispatch Status Badge */}
                <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono tracking-wider border uppercase shrink-0 ${getStatusStyle(dispatch.status)}`}>
                  {dispatch.status}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
