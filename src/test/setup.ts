import "@testing-library/jest-dom";
import React from "react";
import { vi } from "vitest";

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

type MockProps = { children?: React.ReactNode; className?: string; [key: string]: unknown };

// Mock Framer Motion
vi.mock("framer-motion", async () => {
  const actual = await vi.importActual("framer-motion");
  return {
    ...actual,
    motion: {
      div: ({ children, className, ...props }: MockProps) => React.createElement("div", { className, ...props }, children),
      span: ({ children, className, ...props }: MockProps) => React.createElement("span", { className, ...props }, children),
      button: ({ children, className, ...props }: MockProps) => React.createElement("button", { className, ...props }, children),
      h3: ({ children, className, ...props }: MockProps) => React.createElement("h3", { className, ...props }, children),
      p: ({ children, className, ...props }: MockProps) => React.createElement("p", { className, ...props }, children),
      li: ({ children, className, ...props }: MockProps) => React.createElement("li", { className, ...props }, children),
      ul: ({ children, className, ...props }: MockProps) => React.createElement("ul", { className, ...props }, children),
      a: ({ children, className, ...props }: MockProps) => React.createElement("a", { className, ...props }, children),
      section: ({ children, className, ...props }: MockProps) => React.createElement("section", { className, ...props }, children),
      article: ({ children, className, ...props }: MockProps) => React.createElement("article", { className, ...props }, children),
      nav: ({ children, className, ...props }: MockProps) => React.createElement("nav", { className, ...props }, children),
      aside: ({ children, className, ...props }: MockProps) => React.createElement("aside", { className, ...props }, children),
      header: ({ children, className, ...props }: MockProps) => React.createElement("header", { className, ...props }, children),
    },
    AnimatePresence: ({ children }: MockProps) => children,
    useReducedMotion: () => true,
  };
});

// Mock Lucide Icons statically
vi.mock("lucide-react", () => {
  const mockIcon = (name: string) => {
    const IconComponent = ({ className, ...props }: { className?: string; [key: string]: unknown }) =>
      React.createElement("span", { "data-testid": `icon-${name}`, className, ...props });
    IconComponent.displayName = `MockIcon_${name}`;
    return IconComponent;
  };

  return {
    LayoutDashboard: mockIcon("dashboard"),
    Radio: mockIcon("radio"),
    ShieldAlert: mockIcon("shield-alert"),
    Sparkles: mockIcon("sparkles"),
    Map: mockIcon("map"),
    Clock: mockIcon("clock"),
    Cpu: mockIcon("cpu"),
    Settings: mockIcon("settings"),
    Activity: mockIcon("activity"),
    ChevronRight: mockIcon("chevron-right"),
    ShieldCheck: mockIcon("shield-check"),
    Heart: mockIcon("heart"),
    Users: mockIcon("users"),
    ArrowUpRight: mockIcon("arrow-up-right"),
    ArrowDownRight: mockIcon("arrow-down-right"),
    TrendingDown: mockIcon("trending-down"),
    AlertTriangle: mockIcon("alert-triangle"),
    Play: mockIcon("play"),
    Pause: mockIcon("pause"),
    CheckCircle: mockIcon("check-circle"),
    CheckCircle2: mockIcon("check-circle-2"),
    Check: mockIcon("check"),
    X: mockIcon("x"),
    HelpCircle: mockIcon("help-circle"),
    Info: mockIcon("info"),
    Flame: mockIcon("flame"),
    Zap: mockIcon("zap"),
    UserCheck: mockIcon("user-check"),
    Sliders: mockIcon("sliders"),
    Layers: mockIcon("layers"),
    Search: mockIcon("search"),
    BellRing: mockIcon("bell-ring"),
    Send: mockIcon("send"),
    Terminal: mockIcon("terminal"),
  };
});

// Mock fetch globally
global.fetch = vi.fn();
