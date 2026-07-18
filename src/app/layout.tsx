import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EventPilot AI | Operations Coordination Command Center",
  description: "Enterprise Operations Coordination Command Center for FIFA World Cup 2026. GenAI-powered Digital Twin telemetry, predictive risk forecasts, and dynamic team dispatches.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased dark">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-full bg-slate-950 text-slate-100 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
