"use client";

import React, { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import KPICards from "@/components/KPICards";
import StadiumMap from "@/components/StadiumMap";
import LiveTimeline from "@/components/LiveTimeline";
import CopilotPanel from "@/components/CopilotPanel";
import Simulator from "@/components/Simulator";
import Notifications from "@/components/Notifications";
import Toast from "@/components/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { 
  StadiumSections, 
  DashboardMetrics, 
  TimelineEvent, 
  NotificationDispatch, 
  CoordinatedResponsePlan, 
  PredictionDetails,
  ScenarioData,
  ActiveIncident
} from "@/types";
import { 
  ShieldAlert, 
  Map, 
  Clock, 
  Cpu, 
  Settings, 
  Radio, 
  CloudSun, 
  AlertTriangle,
  Info, 
  CheckCircle,
  HelpCircle,
  Play,
  Volume2,
  Eye,
  Sliders,
  Layers,
  Activity,
  UserCheck,
  Zap,
  Flame,
  Search,
  BellRing,
  Sparkles
} from "lucide-react";

// Base data configurations for scenarios
const SCENARIOS: Record<string, ScenarioData> = {
  baseline: {
    name: "Baseline Operations",
    description: "Standard flow, optimal throughput, and normal weather.",
    metrics: { stadiumHealth: 98, crowdDensity: 42, activeAlerts: 0, avgWaitTime: 3.5 },
    confidence: 98,
    sections: {
      northGate: "green",
      southGate: "green",
      eastGate: "green",
      westGate: "green",
      vipEntrance: "green",
      foodCourt: "green",
      parking: "green"
    },
    prediction: {
      riskLevel: "LOW",
      forecastTime: "15 minutes",
      predictionText: "Spectator flow models indicate normal operations across all sectors.",
      situationSummary: "Optimal gate check-in throughput and balanced crowd distribution."
    },
    plans: [
      {
        id: "base-std",
        name: "Plan Alpha: Standard Optimization",
        actions: [
          "Maintain current turnstile configurations.",
          "Keep general admission routes active.",
          "Perform standard security patrol rotations."
        ],
        predictedWaitTime: 3.2,
        predictedCrowdDensity: 40,
        riskReduction: 5,
        staffRequired: "Standard Shift"
      },
      {
        id: "base-early",
        name: "Plan Beta: Concourse Re-Route Promo",
        actions: [
          "Activate concession screens with beverage discounts to disperse concourse load.",
          "Redirect early arrivals to Gate 4 auxiliary turnstiles."
        ],
        predictedWaitTime: 2.8,
        predictedCrowdDensity: 38,
        riskReduction: 12,
        staffRequired: "4 Concession Guides"
      }
    ],
    initialEvents: [
      { id: "e-b1", time: "10:30:15", message: "Biometric ticket validation systems report 99.8% uptime.", category: "success" },
      { id: "e-b2", time: "10:28:40", message: "Parking Lot P1 reaches 60% design capacity. Signs adjusting.", category: "info" },
      { id: "e-b3", time: "10:25:00", message: "Operations shift change complete. Radio check successful.", category: "info" }
    ],
    initialNotifications: [
      { id: "n-b1", time: "10:25:00", recipient: "Concession Team Alpha", message: "Concessions pre-game checklist complete.", status: "Delivered" },
      { id: "n-b2", time: "10:15:00", recipient: "Security Patrol P1", message: "Parking deck P1 perimeter scan: OK.", status: "Complete" }
    ]
  },
  kickoff: {
    name: "Match Kickoff Surge",
    description: "Peak arrival rates occurring 45 minutes before kick-off.",
    metrics: { stadiumHealth: 92, crowdDensity: 84, activeAlerts: 1, avgWaitTime: 12.5 },
    confidence: 95,
    sections: {
      northGate: "yellow",
      southGate: "yellow",
      eastGate: "green",
      westGate: "green",
      vipEntrance: "green",
      foodCourt: "green",
      parking: "yellow"
    },
    prediction: {
      riskLevel: "HIGH",
      forecastTime: "6 minutes",
      predictionText: "Based on current crowd movements, South Gate turnstiles will exceed safe queuing limits in 6 minutes.",
      situationSummary: "Pedestrian volume surge at South Gate subway exit creating high ingress density."
    },
    plans: [
      {
        id: "kick-route",
        name: "Plan Alpha: Dynamic Gate Re-routing",
        actions: [
          "Repoint dynamic wayfinding signage to West Gate.",
          "Open 6 auxiliary check-in turnstiles at West Gate concourse.",
          "Deploy 8 gate guides to manually filter queue lines at South Gate."
        ],
        predictedWaitTime: 5.5,
        predictedCrowdDensity: 65,
        riskReduction: 45,
        staffRequired: "8 Guides, 2 Leads"
      },
      {
        id: "kick-bypass",
        name: "Plan Beta: Turnstile Biometric Bypass",
        actions: [
          "Switch South Gate turnstiles to manual barcode scan override.",
          "Open central security gates for rapid visual ticket screening.",
          "Reassign 4 standby officers to South Gate perimeter."
        ],
        predictedWaitTime: 7.2,
        predictedCrowdDensity: 74,
        riskReduction: 30,
        staffRequired: "4 Security Officers"
      },
      {
        id: "kick-transit",
        name: "Plan Gamma: Express Concourse Shuttle",
        actions: [
          "Initiate shuttle route from South Gate terminal to East Entrance.",
          "Deploy 12 ground crew to guide spectators to shuttle queues."
        ],
        predictedWaitTime: 6.0,
        predictedCrowdDensity: 70,
        riskReduction: 40,
        staffRequired: "12 Ground Crew"
      }
    ],
    initialEvents: [
      { id: "e-k1", time: "10:32:00", message: "South Gate wait time surge detected: exceeding 12 minutes.", category: "warning", section: "South Gate" },
      { id: "e-k2", time: "10:30:10", message: "Metro transit terminal reports train arrival: 1,800 passengers.", category: "info", section: "South Gate" }
    ],
    initialNotifications: [
      { id: "n-k1", time: "10:32:15", recipient: "Crowd Guides Zone B", message: "Directing South Gate overflow to West Gate walkways.", status: "Active" }
    ]
  },
  rain: {
    name: "Heavy Rain Delays",
    description: "Slippery surfaces and slower vehicular traffic slowing down ingress.",
    metrics: { stadiumHealth: 84, crowdDensity: 76, activeAlerts: 2, avgWaitTime: 14.8 },
    confidence: 92,
    sections: {
      northGate: "yellow",
      southGate: "yellow",
      eastGate: "green",
      westGate: "green",
      vipEntrance: "yellow",
      foodCourt: "green",
      parking: "red"
    },
    prediction: {
      riskLevel: "HIGH",
      forecastTime: "4 minutes",
      predictionText: "Parking deck P2 is expected to halt flow within 4 minutes due to localized slippage at the ramp exit.",
      situationSummary: "Precipitation rates are causing severe vehicle backup and pedestrian slip hazards."
    },
    plans: [
      {
        id: "rain-transit",
        name: "Plan Alpha: Multi-Modal Transit Surge",
        actions: [
          "Dispatch 6 operations shuttle buggies to Parking P2 deck.",
          "Activate indoor pedestrian routes to bypass exposed stairwells.",
          "Distribute emergency rain ponchos to bottleneck checkpoints."
        ],
        predictedWaitTime: 8.5,
        predictedCrowdDensity: 62,
        riskReduction: 50,
        staffRequired: "6 Drivers, 4 Guides"
      },
      {
        id: "rain-divert",
        name: "Plan Beta: Parking Flow Diversion",
        actions: [
          "Close Parking P2 main ramp entry gates.",
          "Redirect incoming traffic to multi-level Parking Lot P4.",
          "Activate overhead digital roadway warning signs."
        ],
        predictedWaitTime: 9.8,
        predictedCrowdDensity: 66,
        riskReduction: 38,
        staffRequired: "8 Traffic Officers"
      }
    ],
    initialEvents: [
      { id: "e-r1", time: "10:33:10", message: "Rainfall rate increases to 14mm/hr. Wind speed 18 knots.", category: "warning" },
      { id: "e-r2", time: "10:31:05", message: "Parking Lot P2 slip alert triggered: vehicle queue backed up to highway.", category: "danger", section: "Parking" }
    ],
    initialNotifications: [
      { id: "n-r1", time: "10:31:30", recipient: "Traffic Control P2", message: "Prepare for entry diversion directives.", status: "Delivered" }
    ]
  },
  medical: {
    name: "Medical Incident",
    description: "Response coordination for a medical issue in the concessions zone.",
    metrics: { stadiumHealth: 90, crowdDensity: 68, activeAlerts: 1, avgWaitTime: 5.0 },
    confidence: 94,
    sections: {
      northGate: "green",
      southGate: "green",
      eastGate: "green",
      westGate: "green",
      vipEntrance: "green",
      foodCourt: "red",
      parking: "green"
    },
    prediction: {
      riskLevel: "HIGH",
      forecastTime: "3 minutes",
      predictionText: "Spectator cardiac issue in Concourse B is expected to block the primary medical buggy transit route within 3 minutes.",
      situationSummary: "Spectator distress alert logged at Concession Stand 4. Nearby crowds are clustering."
    },
    plans: [
      {
        id: "med-clear",
        name: "Plan Alpha: Medical Transit Clearance",
        actions: [
          "Dispatch Medical Team 2 on emergency buggy from North Bay.",
          "Deploy 6 nearby security officers to establish a crowd barrier.",
          "Direct Concourse B digital signage to guide pedestrians away."
        ],
        predictedWaitTime: 3.5,
        predictedCrowdDensity: 52,
        riskReduction: 65,
        staffRequired: "1 Med Team, 6 Officers"
      },
      {
        id: "med-perimeter",
        name: "Plan Beta: Local Area Isolation",
        actions: [
          "Deploy mobile queue barriers around Concession Stand 4.",
          "Command concession workers to halt center checkout registers.",
          "Coordinate buggy routing via external VIP roadway."
        ],
        predictedWaitTime: 4.2,
        predictedCrowdDensity: 58,
        riskReduction: 48,
        staffRequired: "8 Concourse staff"
      }
    ],
    initialEvents: [
      { id: "e-m1", time: "10:33:45", message: "Medical distress call received: Concession B Stand 4. Cardiac symptoms.", category: "danger", section: "Food Court" }
    ],
    initialNotifications: [
      { id: "n-m1", time: "10:34:00", recipient: "Medical Standby 2", message: "Medical Team 2 dispatched on responder buggy.", status: "Active" }
    ]
  },
  security: {
    name: "Security Event",
    description: "Bottleneck and protest flare incident requiring crowd control.",
    metrics: { stadiumHealth: 72, crowdDensity: 89, activeAlerts: 3, avgWaitTime: 22.5 },
    confidence: 89,
    sections: {
      northGate: "green",
      southGate: "red",
      eastGate: "green",
      westGate: "yellow",
      vipEntrance: "green",
      foodCourt: "yellow",
      parking: "yellow"
    },
    prediction: {
      riskLevel: "CRITICAL",
      forecastTime: "2 minutes",
      predictionText: "South Gate ticket scanner failure and flare lighting is expected to trigger structural bottleneck loads in 2 minutes.",
      situationSummary: "Unsanctioned smoke flare ignited in the outer plaza, causing spectator retreat and scanner failures."
    },
    plans: [
      {
        id: "sec-surge",
        name: "Plan Alpha: Tactical Surge & Reroute",
        actions: [
          "Deploy Security Team B to South Gate outer perimeter.",
          "Direct South Gate spectators to East/West gates via PA system.",
          "Activate South Gate concourse exhaust ventilation systems."
        ],
        predictedWaitTime: 9.5,
        predictedCrowdDensity: 65,
        riskReduction: 75,
        staffRequired: "16 Tactical Officers"
      },
      {
        id: "sec-isolate",
        name: "Plan Beta: Sector Lock & Diversion",
        actions: [
          "Lock South Gate entry turnstiles completely.",
          "Establish an isolation perimeter in the outer courtyard.",
          "Route arriving bus transfers directly to North Gate."
        ],
        predictedWaitTime: 13.5,
        predictedCrowdDensity: 75,
        riskReduction: 55,
        staffRequired: "12 Security Officers"
      }
    ],
    initialEvents: [
      { id: "e-s1", time: "10:33:02", message: "South Gate turnstile power node failure: 14 ticket scanners offline.", category: "danger", section: "South Gate" },
      { id: "e-s2", time: "10:32:10", message: "Pyro sensor trigger: smoke flare ignited in South Gate plaza crowd.", category: "danger", section: "South Gate" }
    ],
    initialNotifications: [
      { id: "n-s1", time: "10:33:15", recipient: "Security Team B", message: "Deploy to South Gate Plaza for crowd dispersion.", status: "Active" },
      { id: "n-s2", time: "10:33:25", recipient: "Facilities Group C", message: "Turnstile Power grid reset initiated.", status: "Sent" }
    ]
  }
};

// Periodic background logs for AI Activity Feed
const AI_ACTIVITY_FEED_LOGS = [
  "Analyzing crowd movement pattern vectors...",
  "Weather telemetry synchronized: Clear, 21°C.",
  "Biometric scan scan-rate models active.",
  "Prediction nodes active: monitoring gate entry.",
  "Digital Twin stadium node health status: 99.8%.",
  "Optimizing crowd re-routing algorithms.",
  "AI Confidence recalculating: sensor matrices updated.",
  "Verifying field personnel communication nodes.",
  "Synchronizing ticket scan rate delay models.",
  "Concourse load balance telemetry: nominal.",
  "Biometric turnstile firmware check: OK."
];

// Periodic background events for Live Event Engine
const BACKGROUND_EVENTS = [
  {
    message: "North Gate biometric check latency increases by 120ms.",
    category: "warning" as const,
    section: "North Gate",
    impact: { waitTime: 0.8, crowdDensity: 2, health: -1 }
  },
  {
    message: "Food Court B concessions queue wait time reaches 12 minutes.",
    category: "warning" as const,
    section: "Food Court",
    impact: { waitTime: 0.5, crowdDensity: 1, health: 0 }
  },
  {
    message: "Biometric ticket scanner reboot completed at West Gate.",
    category: "success" as const,
    section: "West Gate",
    impact: { waitTime: -1.2, crowdDensity: -2, health: 2 }
  },
  {
    message: "Parking Lot Lot P1 capacity reports 92% occupancy rate.",
    category: "info" as const,
    section: "Parking",
    impact: { waitTime: 0.4, crowdDensity: 1, health: 0 }
  },
  {
    message: "Security Patrol Echo reports completed check at VIP Sector.",
    category: "success" as const,
    section: "VIP Entrance",
    impact: { waitTime: 0, crowdDensity: 0, health: 1 }
  },
  {
    message: "Spectator flow congestion resolved near East Concourse.",
    category: "success" as const,
    section: "East Gate",
    impact: { waitTime: -0.6, crowdDensity: -1, health: 1 }
  },
  {
    message: "Operations Team Bravo returned to standby station at North Bay.",
    category: "info" as const,
    section: "North Gate",
    impact: { waitTime: 0, crowdDensity: 0, health: 0 }
  },
  {
    message: "Metro arrival: passenger count increases by 1,200.",
    category: "info" as const,
    section: "South Gate",
    impact: { waitTime: 1.0, crowdDensity: 3, health: -1 }
  }
];

// Active incidents generator
const getInitialIncidents = (scenarioKey: string): ActiveIncident[] => {
  switch (scenarioKey) {
    case "kickoff":
      return [
        { id: "inc-k1", time: "10:32:00", title: "Crowd Congestion at South Gate", description: "Spectator surge exceeds processing rates at turnstiles 1-12.", section: "South Gate", priority: "HIGH", status: "DISPATCHED" }
      ];
    case "rain":
      return [
        { id: "inc-r1", time: "10:31:05", title: "Ramp Slip Hazard at Parking P2", description: "Water accumulation causing traction loss and entry backup at main highway ramp.", section: "Parking", priority: "HIGH", status: "DISPATCHED" },
        { id: "inc-r2", time: "10:32:45", title: "VIP Entrance Ceiling Leak", description: "Localized water dripping onto public concourse walkways near VIP suites.", section: "VIP Entrance", priority: "LOW", status: "REPORTED" }
      ];
    case "medical":
      return [
        { id: "inc-m1", time: "10:33:45", title: "Cardiac Distress in Concourse B", description: "Spectator displaying signs of cardiac distress near concession stand 4. Responders deploying.", section: "Food Court", priority: "CRITICAL", status: "DISPATCHED" }
      ];
    case "security":
      return [
        { id: "inc-s1", time: "10:33:02", title: "South Gate Turnstile Node Offline", description: "Power fluctuation disconnected 14 barcode scanner arrays.", section: "South Gate", priority: "CRITICAL", status: "MITIGATING" },
        { id: "inc-s2", time: "10:32:10", title: "Smoke Flare Ignited in outer courtyard", description: "Protest group activated red pyrotechnics causing panic and congestion.", section: "South Gate", priority: "CRITICAL", status: "DISPATCHED" }
      ];
    case "baseline":
    default:
      return [];
  }
};

export default function WorkspaceConsole() {
  const [activeItem, setActiveItem] = useState<string>("Dashboard");
  const [activeScenario, setActiveScenario] = useState<string>("baseline");
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [deployedPlanId, setDeployedPlanId] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  
  // Dashboard Metrics state
  const [metrics, setMetrics] = useState<DashboardMetrics>(SCENARIOS.baseline.metrics);
  // Stadium Sections state
  const [sections, setSections] = useState<StadiumSections>(SCENARIOS.baseline.sections);
  // Predictions state
  const [prediction, setPrediction] = useState<PredictionDetails | null>(SCENARIOS.baseline.prediction);
  // Response Plans state
  const [plans, setPlans] = useState<CoordinatedResponsePlan[]>(SCENARIOS.baseline.plans);
  // Timeline Events state
  const [events, setEvents] = useState<TimelineEvent[]>(SCENARIOS.baseline.initialEvents);
  // Notifications state
  const [notifications, setNotifications] = useState<NotificationDispatch[]>(SCENARIOS.baseline.initialNotifications);
  
  // Active Incidents list state
  const [activeIncidents, setActiveIncidents] = useState<ActiveIncident[]>(getInitialIncidents("baseline"));

  // Gemini API and dynamic metrics states
  const [apiStatus, setApiStatus] = useState<"live" | "simulated" | "error">("simulated");
  const [confidence, setConfidence] = useState<number>(SCENARIOS.baseline.confidence);
  const [weather, setWeather] = useState<string>("21°C | Clear");

  // Settings states
  const [simulationSpeed, setSimulationSpeed] = useState<string>("1x");
  const [notificationPref, setNotificationPref] = useState<string>("all");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(90);
  const [autoDeploy, setAutoDeploy] = useState<boolean>(false);
  const [soundEffects, setSoundEffects] = useState<boolean>(true);
  const [animationToggle, setAnimationToggle] = useState<boolean>(true);
  const [themeName, setThemeName] = useState<string>("slate-dark");

  // Timeline Search / Filters state
  const [timelineSearch, setTimelineSearch] = useState<string>("");
  const [timelineFilter, setTimelineFilter] = useState<string>("all");

  // AI Activity Feed state
  const [activityFeed, setActivityFeed] = useState<string[]>([
    "Digital twin telemetry stream: OK.",
    "Prediction nodes active. Monitoring queue loads.",
    "Biometric scan latency: 140ms. Optimal.",
    "Weather forecast model synchronized: Clear, 21°C.",
    "Analyzing crowd movement pattern vectors..."
  ]);

  // Toast notification state
  const [toast, setToast] = useState<{ message: string; isVisible: boolean }>({
    message: "",
    isVisible: false
  });

  // Trigger baseline live AI fetch on mount
  useEffect(() => {
    selectScenario("baseline");
  }, []);

  // Track scenario changes for the 1.5s thinking screen
  const selectScenario = async (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    setDeployedPlanId(null);
    setIsThinking(true);

    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
    const triggerLog = `[${timestamp}] Simulation shift: Loading telemetry for ${SCENARIOS[scenarioKey].name}...`;
    setActivityFeed(prev => [triggerLog, ...prev.slice(0, 7)]);

    // Load physical telemetry and incidents immediately
    const mockData = SCENARIOS[scenarioKey];
    setMetrics(mockData.metrics);
    setSections(mockData.sections);
    setActiveIncidents(getInitialIncidents(scenarioKey));

    // Update weather status
    const currentScenarioWeather = scenarioKey === "rain" ? "17°C | Heavy Rain" : "21°C | Clear";
    setWeather(currentScenarioWeather);

    // Update timeline and notifications
    setEvents(prev => [...mockData.initialEvents, ...prev.filter(e => e.isCustomDispatch).slice(0, 15)]);
    setNotifications(prev => [...mockData.initialNotifications, ...prev.filter(n => n.status === "Active").slice(0, 15)]);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenarioKey,
          scenarioName: mockData.name,
          metrics: mockData.metrics,
          sections: mockData.sections,
          weather: currentScenarioWeather,
          activeAlerts: getInitialIncidents(scenarioKey).length
        })
      });

      const result = await response.json();

      // Enforce the 1.5 second loading experience
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 1500 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));

      if (result.success && result.data) {
        // Successful live LLM analysis
        const genData = result.data;
        setApiStatus("live");
        setConfidence(genData.confidence || 94);
        setPrediction({
          riskLevel: (genData.riskLevel as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') || "LOW",
          predictionText: genData.prediction || "",
          forecastTime: "15m",
          situationSummary: genData.summary || ""
        });
        
        // Map the generated plans with local plan IDs compatible with the simulator/deployer
        const mappedPlans = genData.plans.map((p: any, idx: number) => ({
          id: `plan-gen-${scenarioKey}-${idx}`,
          name: p.name,
          actions: p.actions,
          predictedWaitTime: Number(p.waitTime),
          predictedCrowdDensity: Number(p.crowdDensity),
          riskReduction: Number(p.riskReduction),
          staffRequired: p.staffRequired
        }));
        
        setPlans(mappedPlans);

        const finishedLog = `[${timestamp}] AI Model: Gemini live analysis completed (Confidence: ${genData.confidence}%).`;
        setActivityFeed(prev => [finishedLog, ...prev.slice(0, 7)]);
      } else {
        // Fallback to local simulation mode on error or missing key
        setApiStatus(result.error === "API_KEY_MISSING" ? "simulated" : "error");
        setConfidence(mockData.confidence);
        setPrediction(mockData.prediction);
        setPlans(mockData.plans);

        const errorMsg = result.error === "API_KEY_MISSING" 
          ? "Local Simulation Mode active (GEMINI_API_KEY missing)." 
          : `AI Copilot unavailable (error: ${result.error}). Running fallback simulation.`;
        
        const finishedLog = `[${timestamp}] AI Model: ${errorMsg}`;
        setActivityFeed(prev => [finishedLog, ...prev.slice(0, 7)]);
      }
    } catch (err: any) {
      // Network failure fallback
      const elapsed = Date.now() - startTime;
      const remainingDelay = Math.max(0, 1500 - elapsed);
      await new Promise(resolve => setTimeout(resolve, remainingDelay));

      setApiStatus("error");
      setConfidence(mockData.confidence);
      setPrediction(mockData.prediction);
      setPlans(mockData.plans);

      const finishedLog = `[${timestamp}] AI Model: Connection failed. Running fallback simulation.`;
      setActivityFeed(prev => [finishedLog, ...prev.slice(0, 7)]);
    } finally {
      setIsThinking(false);
    }
  };

  // Deploy Strategy Handler
  const handleDeployPlan = (planId: string) => {
    const selectedPlan = plans.find(p => p.id === planId);
    if (!selectedPlan) return;

    setDeployedPlanId(planId);

    // Simulate metric improvement based on selected strategy
    setMetrics(prev => ({
      stadiumHealth: Math.min(99, prev.stadiumHealth + Math.floor(selectedPlan.riskReduction / 5)),
      crowdDensity: Math.max(20, Math.round(selectedPlan.predictedCrowdDensity)),
      activeAlerts: Math.max(0, prev.activeAlerts - 1),
      avgWaitTime: Number(selectedPlan.predictedWaitTime.toFixed(1))
    }));

    // Update status of all active incidents to MITIGATING
    setActiveIncidents(prev => 
      prev.map(inc => ({ ...inc, status: "MITIGATING" }))
    );

    // Trigger Toast
    setToast({
      message: `${selectedPlan.name.split(":")[0]} successfully dispatched to ground operations.`,
      isVisible: true
    });

    const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });

    // Append response activation log to timeline
    const responseEvent: TimelineEvent = {
      id: `e-deploy-${Date.now()}`,
      time: timestamp,
      message: `[Response Plan Activated] Deploying ${selectedPlan.name.split(":")[0]}. Executing field team operations.`,
      category: "success",
      section: activeScenario === "kickoff" ? "South Gate" :
               activeScenario === "rain" ? "Parking" :
               activeScenario === "medical" ? "Food Court" :
               activeScenario === "security" ? "South Gate" : "Command Center",
      isCustomDispatch: true
    };
    setEvents(prev => [responseEvent, ...prev]);

    // Append staff dispatches to Notifications
    const newDispatches: NotificationDispatch[] = selectedPlan.actions.map((action, idx) => {
      let recipient = "Operations Guides";
      if (action.toLowerCase().includes("security") || action.toLowerCase().includes("tactical")) {
        recipient = "Security Command";
      } else if (action.toLowerCase().includes("medical") || action.toLowerCase().includes("ambulance")) {
        recipient = "Medical Dispatch";
      } else if (action.toLowerCase().includes("traffic") || action.toLowerCase().includes("parking")) {
        recipient = "Traffic Control";
      }

      return {
        id: `n-deploy-${Date.now()}-${idx}`,
        time: timestamp,
        recipient,
        message: `Response Plan: ${action}`,
        status: "Active"
      };
    });
    setNotifications(prev => [...newDispatches, ...prev]);

    // Update AI Activity Feed
    const dispatchLog = `[${timestamp}] Operations dispatch active: ${selectedPlan.name.split(":")[0]}. Operations Teams Dispatched.`;
    setActivityFeed(prev => [dispatchLog, ...prev.slice(0, 7)]);
  };

  // Demo Mode Auto-Cycling loop
  useEffect(() => {
    if (!demoMode) return;

    const cycleKeys = ["baseline", "kickoff", "rain", "medical", "security"];
    let currentIndex = cycleKeys.indexOf(activeScenario);
    let demoTimer: NodeJS.Timeout;
    let actionTimer: NodeJS.Timeout;

    const executeCycleStep = () => {
      const nextIndex = (currentIndex + 1) % cycleKeys.length;
      const nextScenario = cycleKeys[nextIndex];
      
      selectScenario(nextScenario);
      currentIndex = nextIndex;

      // Automatically Deploy the first Coordinated Response Plan
      actionTimer = setTimeout(() => {
        const scenarioPlans = SCENARIOS[nextScenario].plans;
        if (scenarioPlans.length > 0) {
          handleDeployPlan(scenarioPlans[0].id);
        }
      }, 5500); 
    };

    demoTimer = setInterval(executeCycleStep, 11500);

    return () => {
      clearInterval(demoTimer);
      clearTimeout(actionTimer);
    };
  }, [demoMode, activeScenario, plans]);

  // Live Event Engine (speed checks based on simulationSpeed state)
  useEffect(() => {
    let backgroundTimer: NodeJS.Timeout;

    const triggerBackgroundEvent = () => {
      if (isThinking) {
        scheduleNext();
        return;
      }

      const randomEvent = BACKGROUND_EVENTS[Math.floor(Math.random() * BACKGROUND_EVENTS.length)];
      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });

      // 1. Log to Timeline
      const timelineLog: TimelineEvent = {
        id: `e-bg-${Date.now()}`,
        time: timestamp,
        message: randomEvent.message,
        category: randomEvent.category,
        section: randomEvent.section
      };
      setEvents(prev => [timelineLog, ...prev]);

      // 2. Adjust metrics slightly based on event impact
      setMetrics(prev => ({
        stadiumHealth: Math.max(50, Math.min(99, prev.stadiumHealth + randomEvent.impact.health)),
        crowdDensity: Math.max(10, Math.min(99, prev.crowdDensity + randomEvent.impact.crowdDensity)),
        activeAlerts: prev.activeAlerts,
        avgWaitTime: Math.max(1.0, Number((prev.avgWaitTime + randomEvent.impact.waitTime).toFixed(1)))
      }));

      // 3. Add dispatch confirmation/monitoring notification
      const monitorDispatch: NotificationDispatch = {
        id: `n-bg-${Date.now()}`,
        time: timestamp,
        recipient: `Sensor Node ${randomEvent.section}`,
        message: `Telemetry update: ${randomEvent.message}`,
        status: "Delivered"
      };
      setNotifications(prev => [monitorDispatch, ...prev]);

      // 4. Update Activity Feed
      const activityLog = `[${timestamp}] Event engine: ${randomEvent.message} Recalculating wait times.`;
      setActivityFeed(prev => [activityLog, ...prev.slice(0, 7)]);

      scheduleNext();
    };

    const scheduleNext = () => {
      let baseDelay = 10000; // 10s default
      if (simulationSpeed === "5x") baseDelay = 3000;
      if (simulationSpeed === "10x") baseDelay = 1200;

      const randomDiff = Math.floor(Math.random() * (baseDelay * 0.5));
      const finalDelay = baseDelay + randomDiff;

      backgroundTimer = setTimeout(triggerBackgroundEvent, finalDelay);
    };

    scheduleNext();

    return () => clearTimeout(backgroundTimer);
  }, [isThinking, simulationSpeed]);

  // AI Activity Feed Ticker
  useEffect(() => {
    const activityInterval = setInterval(() => {
      if (isThinking) return;

      const randomLog = AI_ACTIVITY_FEED_LOGS[Math.floor(Math.random() * AI_ACTIVITY_FEED_LOGS.length)];
      const timestamp = new Date().toLocaleTimeString("en-US", { hour12: false });
      const newLogEntry = `[${timestamp}] telemetry node: ${randomLog}`;

      setActivityFeed(prev => [newLogEntry, ...prev.slice(0, 7)]);
    }, 6000);

    return () => clearInterval(activityInterval);
  }, [isThinking]);

  // Helper properties
  const alertsCount = activeIncidents.filter(inc => inc.status !== "RESOLVED").length;
  const aiConfidence = confidence;

  // Timeline Filtering Logic
  const getFilteredTimelineEvents = () => {
    return events.filter(e => {
      // 1. Filter by category
      if (timelineFilter !== "all" && e.category !== timelineFilter) return false;
      // 2. Filter by search query
      if (timelineSearch) {
        const query = timelineSearch.toLowerCase();
        return (
          e.message.toLowerCase().includes(query) || 
          e.section?.toLowerCase().includes(query) ||
          e.time.includes(query)
        );
      }
      return true;
    });
  };

  // Dynamic Workspace Render Switcher
  const renderWorkspace = () => {
    switch (activeItem) {
      case "Dashboard":
        return renderDashboardView();
      case "Live Operations":
        return renderLiveOperationsView();
      case "Incident Center":
        return renderIncidentCenterView();
      case "AI Copilot":
        return renderAICopilotView();
      case "Heatmap":
        return renderHeatmapView();
      case "Timeline":
        return renderTimelineView();
      case "Simulation":
        return renderSimulationView();
      case "Settings":
        return renderSettingsView();
      default:
        return renderDashboardView();
    }
  };

  // WORKSPACE 1: EXECUTIVE DASHBOARD
  const renderDashboardView = () => (
    <div className="space-y-6 flex flex-col h-fit">
      {/* 4 KPI Cards */}
      <div className="shrink-0">
        <KPICards 
          stadiumHealth={metrics.stadiumHealth}
          crowdDensity={metrics.crowdDensity}
          activeAlerts={alertsCount}
          avgWaitTime={metrics.avgWaitTime}
        />
      </div>



      {/* Grid: Map on Left, Summary Feed on Right */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-5 gap-6 min-h-0">
        <div className="lg:col-span-3 flex flex-col h-full min-h-0">
          <StadiumMap sections={sections} avgWaitTime={metrics.avgWaitTime} />
        </div>
        
        <div className="lg:col-span-2 flex flex-col h-full min-h-0 space-y-4 overflow-y-auto pr-1">
          {/* Quick AI status prediction */}
          {prediction && (
            <div className="glass-panel rounded-xl p-4 border-l-4 border-l-cyan-400">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] font-mono text-cyan-400 font-bold uppercase tracking-wider">
                  Active AI Prediction
                </span>
                <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded border uppercase bg-cyan-950/60 text-cyan-400 border-cyan-800/40`}>
                  {prediction.riskLevel} Risk
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-200 mb-1 leading-snug">
                "{prediction.predictionText}"
              </p>
              <button 
                onClick={() => setActiveItem("AI Copilot")}
                className="text-[9px] font-bold font-mono text-cyan-400 hover:underline flex items-center gap-1 mt-2.5"
              >
                Open AI Copilot to deploy Coordinated Response Plan &rarr;
              </button>
            </div>
          )}

          {/* Mini active incidents tracker */}
          <div className="glass-panel rounded-xl p-4">
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Active Threats Ledger ({activeIncidents.length})
            </span>
            <div className="space-y-2">
              {activeIncidents.length === 0 ? (
                <div className="flex items-center gap-2 p-2 bg-slate-900/30 border border-slate-900 rounded-lg text-[10px] text-slate-500 font-mono">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                  All gates nominal. Zero threats reported.
                </div>
              ) : (
                activeIncidents.map(inc => (
                  <div key={inc.id} className="flex justify-between items-center p-2 bg-slate-900/50 border border-slate-900 rounded-lg text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        inc.priority === "CRITICAL" ? "bg-rose-500 animate-ping" : "bg-amber-400"
                      }`} />
                      <span className="text-slate-300 font-semibold truncate">{inc.title}</span>
                    </div>
                    <button 
                      onClick={() => setActiveItem("Incident Center")}
                      className="text-[9px] text-slate-500 hover:text-cyan-400 font-mono underline"
                    >
                      Audit
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Simple preview of timeline */}
          <div className="glass-panel rounded-xl p-4 flex-1 min-h-[140px] overflow-hidden flex flex-col justify-between">
            <span className="text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider block mb-2">
              Recent Ops Timeline
            </span>
            <div className="flex-1 space-y-2 overflow-y-auto text-[11px] leading-tight">
              {events.slice(0, 3).map((e) => (
                <div key={e.id} className="flex items-start gap-2 text-slate-300">
                  <span className="font-mono text-[9px] text-slate-500 mt-0.5">{e.time}</span>
                  <span className="flex-1 line-clamp-1">{e.message}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => setActiveItem("Timeline")}
              className="text-[9px] font-bold font-mono text-slate-500 hover:text-cyan-400 hover:underline text-left mt-2 block"
            >
              Open Chronological Operations Log &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // WORKSPACE 2: LIVE OPERATIONS
  const renderLiveOperationsView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-fit">
      <div className="lg:col-span-3 flex flex-col h-full min-h-0">
        <StadiumMap sections={sections} avgWaitTime={metrics.avgWaitTime} />
      </div>
      
      <div className="lg:col-span-2 flex flex-col h-full min-h-0 space-y-6 overflow-y-auto pr-1">
        {/* Gate Status Ledger */}
        <div className="glass-panel rounded-xl p-5 flex flex-col flex-1 min-h-0">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                Gate Entry & Scanner Telemetry
              </h4>
            </div>
            <span className="text-[9px] font-mono text-slate-500 font-bold">7 NODES ONLINE</span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {[
              { id: "northGate", name: "North Gate Gateways", cap: "68%", rate: "125 Scans/m", load: 0.68, status: sections.northGate },
              { id: "southGate", name: "South Gate Gateways", cap: activeScenario === "security" ? "98%" : activeScenario === "kickoff" ? "88%" : "48%", rate: activeScenario === "security" ? "0 Scans/m (OFFLINE)" : "90 Scans/m", load: activeScenario === "security" ? 0.98 : activeScenario === "kickoff" ? 0.88 : 0.48, status: sections.southGate },
              { id: "eastGate", name: "East Gate Gateways", cap: "45%", rate: "140 Scans/m", load: 0.45, status: sections.eastGate },
              { id: "westGate", name: "West Gate Gateways", cap: activeScenario === "security" ? "78%" : "52%", rate: "110 Scans/m", load: activeScenario === "security" ? 0.78 : 0.52, status: sections.westGate },
              { id: "vipEntrance", name: "VIP Hospitality Gate", cap: "32%", rate: "75 Scans/m", load: 0.32, status: sections.vipEntrance },
              { id: "foodCourt", name: "Food Concourse B", cap: activeScenario === "medical" ? "92%" : "64%", rate: "N/A", load: activeScenario === "medical" ? 0.92 : 0.64, status: sections.foodCourt },
              { id: "parking", name: "Parking Lot Gates", cap: activeScenario === "rain" ? "96%" : "60%", rate: "92 Entries/m", load: activeScenario === "rain" ? 0.96 : 0.60, status: sections.parking }
            ].map(gate => (
              <div key={gate.id} className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      gate.status === "green" ? "bg-emerald-400 pulse-green" :
                      gate.status === "yellow" ? "bg-amber-400 pulse-yellow" :
                      "bg-rose-400 pulse-red"
                    }`} />
                    <span className="font-semibold text-slate-200">{gate.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 font-semibold">{gate.rate}</span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                    <span>Active Queue Load</span>
                    <span className="text-slate-300 font-bold">{gate.cap} Capacity</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-1000 ${
                        gate.status === "green" ? "bg-emerald-500" :
                        gate.status === "yellow" ? "bg-amber-500" :
                        "bg-rose-500"
                      }`}
                      style={{ width: `${gate.load * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ambient Sensor Readout widgets */}
        <div className="glass-panel rounded-xl p-4 grid grid-cols-2 gap-3 shrink-0">
          <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg text-center">
            <span className="text-[9px] text-slate-500 font-bold font-mono block mb-1">SCAN OVERRIDE LINK</span>
            <span className="text-xs font-bold text-emerald-400 font-mono">NOMINAL STATE</span>
          </div>
          <div className="p-2.5 bg-slate-900/30 border border-slate-900 rounded-lg text-center">
            <span className="text-[9px] text-slate-500 font-bold font-mono block mb-1">CCTV FEED CLUSTERS</span>
            <span className="text-xs font-bold text-cyan-400 font-mono">48 CHANNELS SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );

  // WORKSPACE 3: INCIDENT CENTER
  const renderIncidentCenterView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-fit">
      
      {/* Active Threats Ledger */}
      <div className="lg:col-span-3 flex flex-col h-full min-h-0 glass-panel rounded-xl p-6">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Active Threats Ledger
            </h4>
          </div>
          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-rose-400 font-mono font-semibold">
            {alertsCount} Active
          </span>
        </div>

        {/* Incidents Scroller */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {activeIncidents.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <CheckCircle className="w-12 h-12 text-emerald-500/30" />
              <div>
                <h5 className="text-slate-200 font-bold text-sm">All Sectors Nominal</h5>
                <p className="text-slate-500 text-xs mt-1">There are no unresolved incidents or scanner failures reported across the stadium.</p>
              </div>
            </div>
          ) : (
            activeIncidents.map((inc) => (
              <div 
                key={inc.id} 
                className={`p-4 bg-slate-900/30 border rounded-xl space-y-3 transition-all ${
                  inc.status === "MITIGATING" 
                    ? "border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.05)]" 
                    : "border-rose-500/20 shadow-[0_0_8px_rgba(239,68,68,0.05)]"
                }`}
              >
                {/* Header row */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-slate-500">{inc.time} | Location: {inc.section}</span>
                    <h5 className="text-slate-100 font-bold text-sm leading-tight">{inc.title}</h5>
                  </div>
                  
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border ${
                      inc.priority === "CRITICAL" ? "bg-rose-500/10 text-rose-400 border-rose-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}>
                      {inc.priority}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${
                      inc.status === "MITIGATING" ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40 animate-pulse" : "bg-rose-950/40 text-rose-400 border-rose-800/40"
                    }`}>
                      {inc.status}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {inc.description}
                </p>

                {/* Mitigation links */}
                <div className="border-t border-slate-900/80 pt-3 flex justify-between items-center">
                  <span className="text-[10px] text-slate-500 font-mono leading-none">
                    Telemetry Feed Status: Active Tracking
                  </span>
                  
                  {inc.status !== "MITIGATING" && (
                    <button 
                      onClick={() => setActiveItem("AI Copilot")}
                      className="px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-400 text-[10px] font-bold font-mono tracking-wider border border-cyan-800/40 transition-colors"
                    >
                      DEVIATE WITH COPILOT PLAN
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Dispatches notifications on Right */}
      <div className="lg:col-span-2 flex flex-col h-full min-h-0">
        <Notifications notifications={notifications} />
      </div>
    </div>
  );

  // WORKSPACE 4: AI OPERATIONS COPILOT (HERO)
  const renderAICopilotView = () => (
    <div className="h-fit flex flex-col">
      <CopilotPanel
        isThinking={isThinking}
        prediction={prediction}
        plans={plans}
        onDeployPlan={handleDeployPlan}
        deployedPlanId={deployedPlanId}
        activityFeed={activityFeed}
        apiStatus={apiStatus}
      />
    </div>
  );

  // WORKSPACE 5: HEATMAP DENSITY WIDGETS
  const renderHeatmapView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-fit">
      <div className="lg:col-span-3 flex flex-col h-full min-h-0">
        <StadiumMap sections={sections} avgWaitTime={metrics.avgWaitTime} />
      </div>

      <div className="lg:col-span-2 flex flex-col h-full min-h-0 glass-panel rounded-xl p-5 select-none justify-between overflow-y-auto">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Map className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Crowd Load Legend
            </h4>
          </div>
          
          <p className="text-[10px] text-slate-400 mb-4 leading-normal">
            Neural predictive heat distribution models spectator flow load factors. Red indicates bottlenecks close to structural density limits.
          </p>

          {/* Scale indicators */}
          <div className="space-y-3.5 mb-6">
            <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500" />
                <span className="font-semibold text-slate-300">0% - 50% Density</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Flow rates normal</span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-amber-500/20 border border-amber-500" />
                <span className="font-semibold text-slate-300">50% - 80% Density</span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Caution. Monitor scanners</span>
            </div>

            <div className="flex items-center justify-between text-xs border-b border-slate-900 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded bg-rose-500/20 border border-rose-500 animate-pulse" />
                <span className="font-semibold text-slate-300">80% - 100% Density</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 font-bold">Critical limits check</span>
            </div>
          </div>

          {/* Density numbers */}
          <div className="space-y-2.5">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider block mb-1">
              Active Density Coefficients
            </span>
            {[
              { zone: "North Ingress Concourse", val: "58%", status: "green" },
              { zone: "South Subway Gate Plazas", val: activeScenario === "kickoff" ? "91%" : activeScenario === "security" ? "95%" : "44%", status: activeScenario === "kickoff" || activeScenario === "security" ? "red" : "green" },
              { zone: "East Parking walkways", val: "38%", status: "green" },
              { zone: "West Biometric Gateways", val: activeScenario === "security" ? "74%" : "48%", status: activeScenario === "security" ? "yellow" : "green" }
            ].map((d, i) => (
              <div key={i} className="flex justify-between items-center text-xs font-mono p-2 bg-slate-900/30 border border-slate-950 rounded">
                <span className="text-slate-400">{d.zone}</span>
                <span className={`font-bold ${
                  d.status === "green" ? "text-emerald-400" :
                  d.status === "yellow" ? "text-amber-400" :
                  "text-rose-400"
                }`}>{d.val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/60 p-2.5 rounded border border-slate-800/40 text-[9px] text-slate-500 leading-normal mt-4">
          Heat distribution metrics computed live. External maps integrations mock synced.
        </div>
      </div>
    </div>
  );

  // WORKSPACE 6: LOG HISTORY TIMELINE (EXPANDED FILTER LIST)
  const renderTimelineView = () => {
    const filteredEvents = getFilteredTimelineEvents();

    return (
      <div className="glass-panel rounded-xl p-6 flex flex-col h-[585px] select-none">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center mb-5 shrink-0">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Operations Chronological Logs
            </h4>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 w-full md:w-auto items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={timelineSearch}
                onChange={(e) => setTimelineSearch(e.target.value)}
                placeholder="Search events log..."
                className="pl-8 pr-3 py-1.5 w-full sm:w-48 bg-slate-900 border border-slate-800 text-xs text-slate-100 rounded-lg placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors font-mono"
              />
            </div>

            {/* Category tabs */}
            <div className="flex bg-slate-950 p-1 border border-slate-800/80 rounded-lg text-[9px] font-bold font-mono">
              {["all", "danger", "warning", "success", "info"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setTimelineFilter(cat)}
                  className={`px-2 py-1 rounded capitalize transition-all ${
                    timelineFilter === cat 
                      ? "bg-slate-900 text-cyan-400 border-b border-b-cyan-500/40" 
                      : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filtered logs container */}
        <div className="flex-1 min-h-0 overflow-y-auto pr-1">
          <LiveTimeline events={filteredEvents} />
        </div>
      </div>
    );
  };

  // WORKSPACE 7: DIGITAL TWIN SIMULATION
  const renderSimulationView = () => (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-fit">
      
      {/* Scenario Triggers */}
      <div className="lg:col-span-2 flex flex-col h-full min-h-0">
        <Simulator activeScenario={activeScenario} onSelectScenario={selectScenario} />
      </div>

      {/* Sync diagnostics */}
      <div className="lg:col-span-3 glass-panel rounded-xl p-6 flex flex-col h-full min-h-0 select-none">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
              Digital Twin Sensor Diagnostics
            </h4>
          </div>
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-emerald-500/30 text-[9px] text-emerald-400 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            SYNC ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-3 gap-4 shrink-0 mb-4 text-center">
          <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg">
            <span className="text-[8px] text-slate-500 font-bold font-mono uppercase block mb-1">MOCK SENSOR LATENCY</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">12 ms</span>
          </div>
          <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg">
            <span className="text-[8px] text-slate-500 font-bold font-mono uppercase block mb-1">VIRTUAL CHANNELS</span>
            <span className="text-sm font-bold text-slate-200 font-mono">4,820 Nodes</span>
          </div>
          <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-lg">
            <span className="text-[8px] text-slate-500 font-bold font-mono uppercase block mb-1">COMPUTE CLUSTERS</span>
            <span className="text-sm font-bold text-slate-200 font-mono">8 Threads</span>
          </div>
        </div>

        <div className="flex-1 border border-slate-900 rounded-lg p-4 bg-slate-950/40 font-mono text-[10px] text-slate-400 overflow-y-auto space-y-2.5">
          <div className="flex justify-between border-b border-slate-900 pb-1.5 text-slate-500 text-[9px]">
            <span>Telemetry Channel</span>
            <span>Update Frequency</span>
            <span>Status</span>
          </div>
          {[
            { tag: "NORTH_GATE_ENTRY_FLOW", rate: "125 Hz", stat: "NOMINAL" },
            { tag: "SOUTH_GATE_ENTRY_FLOW", rate: activeScenario === "security" ? "0 Hz" : "90 Hz", stat: activeScenario === "security" ? "POWER_FAIL" : "NOMINAL" },
            { tag: "CONCOURSE_B_TEMP_CHECK", rate: "12 Hz", stat: "NOMINAL" },
            { tag: "PARKING_LOT_SENSOR_P1", rate: "6 Hz", stat: "NOMINAL" },
            { tag: "VIP_SECTOR_DOOR_TRIGS", rate: "60 Hz", stat: "NOMINAL" }
          ].map((ch, i) => (
            <div key={i} className="flex justify-between items-center text-[10px]">
              <span className="text-slate-300">{ch.tag}</span>
              <span className="text-slate-400">{ch.rate}</span>
              <span className={`font-bold ${ch.stat === "NOMINAL" ? "text-emerald-400" : "text-rose-400"}`}>{ch.stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // WORKSPACE 8: OPERATIONS SETTINGS
  const renderSettingsView = () => (
    <div className="glass-panel rounded-xl p-6 h-fit flex flex-col select-none">
      <div className="flex items-center gap-2 mb-6 shrink-0">
        <Settings className="w-4 h-4 text-cyan-400" />
        <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
          Operations Settings Console
        </h4>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left Settings group */}
        <div className="space-y-5">
          {/* Demo Mode Toggle */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 font-mono">Auto Scenario Cycle (Demo Mode)</span>
              <span className="text-[10px] text-slate-500">Automatically loops telemetry incidents for hackathons.</span>
            </div>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                demoMode ? "bg-cyan-500" : "bg-slate-800"
              }`}
            >
              <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out ${
                demoMode ? "translate-x-5" : "translate-x-0"
              }`} />
            </button>
          </div>

          {/* Simulation speed */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 font-mono">Digital Twin Simulation Speed</span>
              <span className="text-[10px] text-slate-500">Sets the pace for background live event iterations.</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[9px] font-bold font-mono">
              {[
                { label: "1x (Real)", val: "1x" },
                { label: "5x (Fast)", val: "5x" },
                { label: "10x (Hyper)", val: "10x" }
              ].map(speed => (
                <button
                  key={speed.val}
                  onClick={() => setSimulationSpeed(speed.val)}
                  className={`py-1.5 rounded border transition-colors ${
                    simulationSpeed === speed.val 
                      ? "bg-slate-950 text-cyan-400 border-cyan-500/40" 
                      : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {speed.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notification Filter Preferences */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 font-mono">Dispatches Filtering Filter</span>
              <span className="text-[10px] text-slate-500">Filters notifications logged to dispatch feed.</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[9px] font-bold font-mono">
              {[
                { label: "All Logs", val: "all" },
                { label: "Critical Only", val: "critical" },
                { label: "Mute", val: "mute" }
              ].map(pref => (
                <button
                  key={pref.val}
                  onClick={() => setNotificationPref(pref.val)}
                  className={`py-1.5 rounded border transition-colors ${
                    notificationPref === pref.val 
                      ? "bg-slate-950 text-cyan-400 border-cyan-500/40" 
                      : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Settings group */}
        <div className="space-y-5">
          {/* AI Confidence Limit slider */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3.5">
            <div className="flex justify-between items-center">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200 font-mono">AI Suggestion Threshold</span>
                <span className="text-[10px] text-slate-500">Minimum confidence to request dispatches.</span>
              </div>
              <span className="text-xs font-bold text-cyan-400 font-mono">{confidenceThreshold}%</span>
            </div>
            <input
              type="range"
              min="80"
              max="99"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-1 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Sound & Animations toggles */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200 font-mono">Audio Notifications chime</span>
                <span className="text-[10px] text-slate-500">Chime on new incoming threats.</span>
              </div>
              <button
                onClick={() => setSoundEffects(!soundEffects)}
                className={`relative inline-flex h-4 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  soundEffects ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  soundEffects ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-950 pt-4">
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200 font-mono">Reduced Motion Animations</span>
                <span className="text-[10px] text-slate-500">Locks framer-motion slide entries to save cycles.</span>
              </div>
              <button
                onClick={() => setAnimationToggle(!animationToggle)}
                className={`relative inline-flex h-4 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  animationToggle ? "bg-cyan-500" : "bg-slate-800"
                }`}
              >
                <span className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  animationToggle ? "translate-x-5" : "translate-x-0"
                }`} />
              </button>
            </div>
          </div>

          {/* Theme customizer */}
          <div className="p-4 bg-slate-900/30 border border-slate-900 rounded-xl space-y-3">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-slate-200 font-mono">Dashboard Workspace Style</span>
              <span className="text-[10px] text-slate-500">Adjust the contrast variables of the interface.</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-[9px] font-bold font-mono">
              {[
                { label: "Deep Navy", val: "slate-dark" },
                { label: "Obsidian Black", val: "obsidian" },
                { label: "Steel Gray", val: "steel" }
              ].map(theme => (
                <button
                  key={theme.val}
                  onClick={() => setThemeName(theme.val)}
                  className={`py-1.5 rounded border transition-colors ${
                    themeName === theme.val 
                      ? "bg-slate-950 text-cyan-400 border-cyan-500/40" 
                      : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-400"
                  }`}
                >
                  {theme.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className={`h-screen w-screen text-slate-100 flex overflow-hidden font-sans transition-all duration-300 ${
      themeName === "obsidian" ? "bg-black" :
      themeName === "steel" ? "bg-zinc-950" : "bg-slate-950"
    }`}>
      {/* Background scanline overlay */}
      <div className="absolute inset-0 scanline-grid opacity-30 pointer-events-none z-0" />
      
      {/* Sidebar - controls activeItem */}
      <Sidebar activeItem={activeItem} setActiveItem={setActiveItem} />

      {/* Main Console Layout */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Fixed Header */}
        <Header 
          stadiumHealth={metrics.stadiumHealth}
          activeAlerts={alertsCount}
          aiConfidence={aiConfidence}
          demoMode={demoMode}
          setDemoMode={setDemoMode}
          weather={weather}
        />

        {/* Dynamic Workspace Container */}
        <main className="flex-1 overflow-y-auto p-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={animationToggle ? { opacity: 0, y: 12 } : { opacity: 1 }}
              animate={{ opacity: 1, y: 0 }}
              exit={animationToggle ? { opacity: 0, y: -12 } : { opacity: 1 }}
              transition={{ duration: 0.22, ease: "easeInOut" }}
              className="w-full h-fit flex flex-col"
            >
              {renderWorkspace()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Feedback Success Toaster */}
        <Toast 
          message={toast.message} 
          isVisible={toast.isVisible} 
          onClose={() => setToast(prev => ({ ...prev, isVisible: false }))} 
        />
      </div>
    </div>
  );
}
