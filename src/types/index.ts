export type SectionStatus = 'green' | 'yellow' | 'red';

export interface StadiumSections {
  northGate: SectionStatus;
  southGate: SectionStatus;
  eastGate: SectionStatus;
  westGate: SectionStatus;
  vipEntrance: SectionStatus;
  foodCourt: SectionStatus;
  parking: SectionStatus;
}

export type EventCategory = 'info' | 'warning' | 'danger' | 'success';

export interface TimelineEvent {
  id: string;
  time: string;
  message: string;
  category: EventCategory;
  section?: string;
  isCustomDispatch?: boolean;
}

export interface CoordinatedResponsePlan {
  id: string;
  name: string;
  actions: string[];
  predictedWaitTime: number;
  predictedCrowdDensity: number;
  riskReduction: number; // e.g. 45 for 45% reduction
  staffRequired: string; // e.g. "12 Officers, 3 Leads"
}

export interface NotificationDispatch {
  id: string;
  time: string;
  message: string;
  status: 'Sent' | 'Delivered' | 'Active' | 'Complete';
  recipient: string;
}

export interface PredictionDetails {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  forecastTime: string;
  predictionText: string;
  situationSummary: string;
}

export interface DashboardMetrics {
  stadiumHealth: number;
  crowdDensity: number;
  activeAlerts: number;
  avgWaitTime: number;
}

export interface ScenarioData {
  name: string;
  description: string;
  metrics: DashboardMetrics;
  confidence: number;
  sections: StadiumSections;
  prediction: PredictionDetails;
  plans: CoordinatedResponsePlan[];
  initialEvents: TimelineEvent[];
  initialNotifications: NotificationDispatch[];
}

export interface ActiveIncident {
  id: string;
  time: string;
  title: string;
  description: string;
  section: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'REPORTED' | 'DISPATCHED' | 'MITIGATING' | 'RESOLVED';
}

