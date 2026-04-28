import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cn,
  coachStatusBadgeCn,
  formatRelativeTime,
  getOccupancyRate,
  severityBg,
  severityColor,
} from "@/lib/utils";
import type { Alert, Camera, Coach, DashboardStats, Train } from "@/types";
import {
  Activity,
  AlertTriangle,
  Camera as CameraIcon,
  CheckCircle2,
  Gauge,
  Train as TrainIcon,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

interface DashboardPageProps {
  train: Train;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

// ── Color helpers matching req-3 spec: green <75%, yellow 75-90%, red >90% ──
function occupancyColorClass(rate: number): string {
  if (rate >= 90) return "text-destructive";
  if (rate >= 75) return "text-chart-2";
  return "text-chart-1";
}

function occupancyBarClass(rate: number): string {
  if (rate >= 90) return "bg-destructive";
  if (rate >= 75) return "bg-chart-2";
  return "bg-chart-1";
}

function occupancyBadgeClass(rate: number): string {
  if (rate >= 90)
    return "bg-destructive/15 text-destructive border-destructive/30";
  if (rate >= 75) return "bg-chart-2/15 text-chart-2 border-chart-2/30";
  return "bg-chart-1/15 text-chart-1 border-chart-1/30";
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accentClass,
  ocid,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  accentClass: string;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-smooth"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-label">{label}</p>
          <p className="text-metric text-2xl leading-none">{value}</p>
          {sub && (
            <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>
          )}
        </div>
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
            accentClass,
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}

// ── Camera status dots ────────────────────────────────────────────────────────
function CameraStatusRow({ cameras }: { cameras: Camera[] }) {
  return (
    <div className="flex items-center gap-1">
      {cameras.map((cam) => (
        <span key={cam.id} className="relative group">
          <span
            className={cn(
              "block w-2 h-2 rounded-full",
              cam.status === "online"
                ? "bg-chart-1"
                : cam.status === "degraded"
                  ? "bg-chart-2"
                  : "bg-destructive",
            )}
          />
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded text-[9px] bg-foreground text-background opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity duration-150 z-10">
            {cam.label}: {cam.status}
          </span>
        </span>
      ))}
      <span className="text-[10px] text-muted-foreground ml-1 font-mono">
        {cameras.filter((c) => c.status === "online").length}/{cameras.length}
      </span>
    </div>
  );
}

// ── Coach row with occupancy bar ──────────────────────────────────────────────
function CoachOccupancyRow({ coach, idx }: { coach: Coach; idx: number }) {
  const rate = getOccupancyRate(coach.detected, coach.capacity);
  const reserved = coach.reserved;
  const reservedRate = getOccupancyRate(reserved, coach.capacity);
  const barPct = Math.min(100, rate);
  const reservedPct = Math.min(100, reservedRate);

  return (
    <div
      data-ocid={`dashboard.coach_row.item.${idx + 1}`}
      className="rounded-lg border border-border bg-background/60 p-3 space-y-2"
    >
      {/* Coach header */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-mono font-bold text-sm text-foreground w-9 shrink-0">
          {coach.number}
        </span>
        <Badge
          className={cn(
            "text-[10px] px-1.5 border shrink-0",
            coachStatusBadgeCn(coach.status),
          )}
        >
          {coach.class}
        </Badge>
        {/* Detected vs reserved */}
        <div className="flex items-center gap-1.5 text-xs min-w-0 flex-1">
          <Users className="w-3 h-3 text-muted-foreground shrink-0" />
          <span
            className={cn("font-mono font-semibold", occupancyColorClass(rate))}
          >
            {coach.detected}
          </span>
          <span className="text-muted-foreground">/ {coach.capacity}</span>
          <span className="text-border">·</span>
          <span className="text-muted-foreground text-[11px]">
            {reserved} reserved
          </span>
        </div>
        <Badge
          className={cn(
            "text-[10px] px-1.5 border font-mono shrink-0",
            occupancyBadgeClass(rate),
          )}
        >
          {rate}%
        </Badge>
      </div>

      {/* Stacked occupancy bars: reserved (bottom) + detected (top) */}
      <div
        className="relative h-2 rounded-full bg-muted overflow-hidden"
        data-ocid={`dashboard.coach_bar.item.${idx + 1}`}
      >
        {/* Reserved bar (lighter) */}
        <div
          className="absolute inset-y-0 left-0 rounded-full opacity-30 bg-primary transition-all duration-700"
          style={{ width: `${reservedPct}%` }}
        />
        {/* Detected bar */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
            occupancyBarClass(rate),
          )}
          style={{ width: `${barPct}%` }}
        />
      </div>

      {/* Camera status */}
      <div className="flex items-center gap-1.5">
        <CameraIcon className="w-3 h-3 text-muted-foreground shrink-0" />
        <CameraStatusRow cameras={coach.cameras} />
      </div>
    </div>
  );
}

// ── Pulse dot for live indicator ──────────────────────────────────────────────
function LiveDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-chart-1" />
    </span>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DashboardPage({
  train,
  alerts,
  onResolveAlert,
}: DashboardPageProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const totalDetected = train.coaches.reduce((s, c) => s + c.detected, 0);
  const totalCapacity = train.coaches.reduce((s, c) => s + c.capacity, 0);
  const totalCameras = train.coaches.reduce((s, c) => s + c.cameras.length, 0);
  const camerasOnline = train.coaches
    .flatMap((c) => c.cameras)
    .filter((c) => c.status === "online").length;
  const activeAlerts = alerts.filter((a) => a.status === "active");
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "critical");

  const stats: DashboardStats = {
    totalPassengers: totalDetected,
    totalCapacity,
    occupancyRate: getOccupancyRate(totalDetected, totalCapacity),
    activeAlerts: activeAlerts.length,
    criticalAlerts: criticalAlerts.length,
    camerasOnline,
    totalCameras,
  };

  if (!mounted) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-16 rounded-xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(["passengers", "occupancy", "alerts", "cameras"] as const).map(
            (k) => (
              <Skeleton key={k} className="h-24 rounded-xl" />
            ),
          )}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Train info banner ─────────────────────────────────────────────── */}
      <div
        data-ocid="dashboard.train_info"
        className="rounded-xl border border-primary/20 bg-primary/5 p-4"
      >
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
              <TrainIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-display font-bold text-foreground text-base leading-tight">
                {train.name}
              </p>
              <p className="text-xs text-muted-foreground font-mono">
                #{train.number} · {train.origin} → {train.destination}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 ml-auto flex-wrap text-xs">
            <div>
              <p className="text-label">Departs</p>
              <p className="font-mono font-semibold text-foreground">
                {train.departureTime}
              </p>
            </div>
            <div>
              <p className="text-label">Arrives</p>
              <p className="font-mono font-semibold text-foreground">
                {train.arrivalTime}
              </p>
            </div>
            <div>
              <p className="text-label">Speed</p>
              <p className="font-mono font-semibold text-foreground">
                {train.speed} km/h
              </p>
            </div>
            <div>
              <p className="text-label">At Station</p>
              <p className="font-medium text-foreground truncate max-w-[120px]">
                {train.currentStation}
              </p>
            </div>
            <div>
              <p className="text-label">Next</p>
              <p className="font-medium text-foreground truncate max-w-[120px]">
                {train.nextStation}
              </p>
            </div>
            <Badge
              className={cn(
                "text-[10px] border",
                train.status === "on-time"
                  ? "bg-chart-1/15 text-chart-1 border-chart-1/30"
                  : train.status === "delayed"
                    ? "bg-chart-2/15 text-chart-2 border-chart-2/30"
                    : "bg-destructive/15 text-destructive border-destructive/30",
              )}
            >
              {train.status === "on-time"
                ? "On Time"
                : train.status === "delayed"
                  ? `+${train.delayMinutes}m Delay`
                  : "Cancelled"}
            </Badge>
          </div>
        </div>
      </div>

      {/* ── Stats grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Passengers"
          value={stats.totalPassengers}
          sub={`of ${stats.totalCapacity} seats`}
          icon={Users}
          accentClass="bg-primary/10 text-primary"
          ocid="dashboard.passengers_stat"
        />
        <StatCard
          label="Occupancy Rate"
          value={`${stats.occupancyRate}%`}
          sub={
            stats.occupancyRate >= 90
              ? "Above safe limit"
              : stats.occupancyRate >= 75
                ? "Approaching threshold"
                : "Within safe limits"
          }
          icon={Gauge}
          accentClass={
            stats.occupancyRate >= 90
              ? "bg-destructive/10 text-destructive"
              : stats.occupancyRate >= 75
                ? "bg-chart-2/10 text-chart-2"
                : "bg-chart-1/10 text-chart-1"
          }
          ocid="dashboard.occupancy_stat"
        />
        <StatCard
          label="Active Alerts"
          value={stats.activeAlerts}
          sub={`${stats.criticalAlerts} critical`}
          icon={AlertTriangle}
          accentClass={
            stats.criticalAlerts > 0
              ? "bg-destructive/10 text-destructive"
              : stats.activeAlerts > 0
                ? "bg-chart-2/10 text-chart-2"
                : "bg-chart-1/10 text-chart-1"
          }
          ocid="dashboard.alerts_stat"
        />
        <StatCard
          label="CCTV Online"
          value={`${stats.camerasOnline}/${stats.totalCameras}`}
          sub="Cameras operational"
          icon={CameraIcon}
          accentClass="bg-primary/10 text-primary"
          ocid="dashboard.cameras_stat"
        />
      </div>

      {/* ── Coach occupancy + alerts ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Coach occupancy grid */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border">
            <h2 className="font-display font-semibold text-sm text-foreground">
              Coach Occupancy — Live
            </h2>
            <div className="flex items-center gap-2">
              {/* Legend */}
              <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-chart-1 inline-block" />
                  &lt;75%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-chart-2 inline-block" />
                  75–90%
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-destructive inline-block" />
                  &gt;90%
                </span>
              </div>
              <LiveDot />
            </div>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {train.coaches.map((coach, idx) => (
              <CoachOccupancyRow key={coach.id} coach={coach} idx={idx} />
            ))}
          </div>
        </div>

        {/* Active alerts panel */}
        <div className="rounded-xl border border-border bg-card shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border shrink-0">
            <h2 className="font-display font-semibold text-sm text-foreground">
              Active Alerts
            </h2>
            {activeAlerts.length > 0 && (
              <Badge className="text-[10px] bg-destructive/10 text-destructive border-destructive/30 border">
                {activeAlerts.length}
              </Badge>
            )}
          </div>
          <div className="p-3 space-y-2 overflow-y-auto flex-1 max-h-96">
            {activeAlerts.length === 0 ? (
              <div
                data-ocid="dashboard.alerts.empty_state"
                className="flex flex-col items-center justify-center py-8 gap-2"
              >
                <CheckCircle2 className="w-8 h-8 text-chart-1" />
                <p className="text-xs text-muted-foreground text-center">
                  All clear — no active alerts
                </p>
              </div>
            ) : (
              activeAlerts.map((alert, idx) => (
                <div
                  key={alert.id}
                  data-ocid={`dashboard.alert.item.${idx + 1}`}
                  className={cn(
                    "rounded-lg border p-3 space-y-2 text-xs",
                    severityBg(alert.severity),
                  )}
                >
                  <div className="flex items-start gap-2">
                    <AlertTriangle
                      className={cn(
                        "w-3 h-3 mt-0.5 shrink-0",
                        severityColor(alert.severity),
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground line-clamp-2">
                        {alert.message}
                      </p>
                      <p className="text-muted-foreground text-[10px] mt-0.5">
                        {formatRelativeTime(alert.timestamp)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-6 text-[10px] w-full"
                    data-ocid={`dashboard.alert.resolve_button.${idx + 1}`}
                    onClick={() => onResolveAlert(alert.id)}
                  >
                    Resolve
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── System status bar ───────────────────────────────────────────────── */}
      <div className="rounded-xl border border-border bg-muted/30 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-primary" />
          <h3 className="font-display font-semibold text-sm text-foreground">
            System Status
          </h3>
          <span className="ml-auto text-[10px] text-muted-foreground flex items-center gap-1">
            <Activity className="w-3 h-3" /> Auto-refresh: 5s
          </span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { label: "AI Detection", value: "YOLO v8 Active", ok: true },
            { label: "Data Sync", value: "5s interval", ok: true },
            { label: "IC Network", value: "Connected", ok: true },
            { label: "Internet Identity", value: "Verified", ok: true },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border"
            >
              {item.ok ? (
                <Wifi className="w-3.5 h-3.5 text-chart-1 shrink-0" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-destructive shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-muted-foreground text-[10px]">
                  {item.label}
                </p>
                <p className="font-medium text-foreground truncate">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
