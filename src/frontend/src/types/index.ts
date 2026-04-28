export type AlertSeverity = "info" | "warning" | "critical";
export type AlertStatus = "active" | "resolved";
export type CoachStatus = "normal" | "crowded" | "overcrowded" | "offline";
export type CameraStatus = "online" | "offline" | "degraded";
export type TrainStatus = "on-time" | "delayed" | "cancelled";

export interface Coach {
  id: string;
  number: string;
  class: "1A" | "2A" | "3A" | "SL" | "GEN";
  capacity: number;
  reserved: number;
  detected: number;
  status: CoachStatus;
  cameras: Camera[];
  lastUpdated: number;
}

export interface Camera {
  id: string;
  coachId: string;
  label: string;
  status: CameraStatus;
  fps: number;
  resolution: string;
  detectionsPerFrame: number;
  lastFrame: number;
}

export interface Alert {
  id: string;
  coachId: string;
  coachNumber: string;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  details: string;
  timestamp: number;
  resolvedAt?: number;
  resolvedBy?: string;
}

export interface Train {
  id: string;
  number: string;
  name: string;
  origin: string;
  destination: string;
  status: TrainStatus;
  departureTime: string;
  arrivalTime: string;
  currentStation: string;
  nextStation: string;
  speed: number;
  delayMinutes: number;
  coaches: Coach[];
}

export interface AIReport {
  id: string;
  trainId: string;
  generatedAt: number;
  summary: string;
  occupancyAnalysis: string;
  safetyAssessment: string;
  recommendations: string[];
  riskLevel: "low" | "medium" | "high";
  generatedBy: "gemini";
}

export interface DashboardStats {
  totalPassengers: number;
  totalCapacity: number;
  occupancyRate: number;
  activeAlerts: number;
  criticalAlerts: number;
  camerasOnline: number;
  totalCameras: number;
}

export interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}
