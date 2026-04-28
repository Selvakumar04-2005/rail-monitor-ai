import type {
  AlertSeverity,
  CameraStatus,
  CoachStatus,
  TrainStatus,
} from "@/types";
import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function formatTimestamp(ts: number): string {
  return new Date(ts).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60_000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

export function getOccupancyRate(detected: number, capacity: number): number {
  if (capacity === 0) return 0;
  return Math.round((detected / capacity) * 100);
}

export function getCoachStatusFromOccupancy(
  detected: number,
  capacity: number,
): CoachStatus {
  const rate = getOccupancyRate(detected, capacity);
  if (rate >= 110) return "overcrowded";
  if (rate >= 85) return "crowded";
  return "normal";
}

export function severityColor(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "text-destructive";
    case "warning":
      return "text-chart-2";
    case "info":
      return "text-primary";
  }
}

export function severityBg(severity: AlertSeverity): string {
  switch (severity) {
    case "critical":
      return "bg-destructive/10 border-destructive/30";
    case "warning":
      return "bg-chart-2/10 border-chart-2/30";
    case "info":
      return "bg-primary/10 border-primary/30";
  }
}

export function coachStatusColor(status: CoachStatus): string {
  switch (status) {
    case "normal":
      return "text-chart-1";
    case "crowded":
      return "text-chart-2";
    case "overcrowded":
      return "text-destructive";
    case "offline":
      return "text-muted-foreground";
  }
}

export function coachStatusBadgeCn(status: CoachStatus): string {
  switch (status) {
    case "normal":
      return "bg-chart-1/15 text-chart-1 border-chart-1/30";
    case "crowded":
      return "bg-chart-2/15 text-chart-2 border-chart-2/30";
    case "overcrowded":
      return "bg-destructive/15 text-destructive border-destructive/30";
    case "offline":
      return "bg-muted text-muted-foreground border-border";
  }
}

export function cameraStatusColor(status: CameraStatus): string {
  switch (status) {
    case "online":
      return "text-chart-1";
    case "offline":
      return "text-destructive";
    case "degraded":
      return "text-chart-2";
  }
}

export function trainStatusBadge(status: TrainStatus): string {
  switch (status) {
    case "on-time":
      return "bg-chart-1/15 text-chart-1 border-chart-1/30";
    case "delayed":
      return "bg-chart-2/15 text-chart-2 border-chart-2/30";
    case "cancelled":
      return "bg-destructive/15 text-destructive border-destructive/30";
  }
}

export function occupancyBarColor(rate: number): string {
  if (rate >= 110) return "bg-destructive";
  if (rate >= 85) return "bg-chart-2";
  return "bg-chart-1";
}
