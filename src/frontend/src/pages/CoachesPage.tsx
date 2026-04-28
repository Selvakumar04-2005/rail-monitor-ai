import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  cameraStatusColor,
  cn,
  coachStatusBadgeCn,
  coachStatusColor,
  formatRelativeTime,
  getOccupancyRate,
  occupancyBarColor,
} from "@/lib/utils";
import type { Alert, Coach, Train } from "@/types";
import { Camera, Signal, Users, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

interface CoachesPageProps {
  train: Train;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

function CoachCard({ coach, index }: { coach: Coach; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const rate = getOccupancyRate(coach.detected, coach.capacity);
  const barColor = occupancyBarColor(rate);
  const activeCameras = coach.cameras.filter(
    (c) => c.status === "online",
  ).length;

  return (
    <div
      data-ocid={`coaches.coach_card.item.${index + 1}`}
      className="rounded-xl border border-border bg-card shadow-elevated hover:shadow-card-hover transition-smooth"
    >
      {/* Card header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border shrink-0">
          <span className="font-mono font-bold text-sm text-foreground">
            {coach.number}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-semibold text-sm text-foreground">
              Coach {coach.number}
            </span>
            <Badge
              className={cn(
                "text-[10px] px-1.5 border",
                coachStatusBadgeCn(coach.status),
              )}
            >
              {coach.class}
            </Badge>
            <Badge
              className={cn(
                "text-[10px] px-1.5 border",
                coachStatusBadgeCn(coach.status),
              )}
            >
              {coach.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {formatRelativeTime(coach.lastUpdated)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p
            className={cn(
              "font-mono font-bold text-lg",
              coachStatusColor(coach.status),
            )}
          >
            {rate}%
          </p>
          <p className="text-[10px] text-muted-foreground">occupancy</p>
        </div>
      </div>

      {/* Occupancy bar */}
      <div className="px-4 pb-3 space-y-1.5">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" />
            {coach.detected} detected
          </span>
          <span>
            {coach.reserved} reserved / {coach.capacity} capacity
          </span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={cn("h-full rounded-full transition-smooth", barColor)}
            style={{ width: `${Math.min(100, rate)}%` }}
          />
        </div>
        {rate > 100 && (
          <div className="h-1 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-destructive/40"
              style={{ width: `${Math.min(100, rate - 100)}%` }}
            />
          </div>
        )}
      </div>

      <Separator className="bg-border" />

      {/* Camera summary */}
      <button
        type="button"
        className="w-full flex items-center gap-3 p-3 px-4 hover:bg-muted/30 transition-smooth"
        onClick={() => setExpanded((v) => !v)}
        data-ocid={`coaches.coach_camera_toggle.item.${index + 1}`}
      >
        <Camera className="w-3.5 h-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground flex-1 text-left">
          {activeCameras}/{coach.cameras.length} cameras online
        </span>
        <Signal
          className={cn(
            "w-3 h-3 transition-smooth",
            activeCameras === coach.cameras.length
              ? "text-chart-1"
              : "text-chart-2",
          )}
        />
      </button>

      {/* Expanded cameras */}
      {expanded && (
        <div className="px-4 pb-4 space-y-2">
          {coach.cameras.map((cam) => (
            <div
              key={cam.id}
              className="flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-border text-xs"
            >
              {cam.status === "online" ? (
                <Wifi className="w-3 h-3 text-chart-1 shrink-0" />
              ) : (
                <WifiOff className="w-3 h-3 text-destructive shrink-0" />
              )}
              <span className="flex-1 text-foreground">{cam.label}</span>
              <span
                className={cn("font-medium", cameraStatusColor(cam.status))}
              >
                {cam.status}
              </span>
              <span className="font-mono text-muted-foreground">
                {cam.detectionsPerFrame} det/f
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CoachesPage({ train }: CoachesPageProps) {
  const totalDetected = train.coaches.reduce((s, c) => s + c.detected, 0);
  const totalCapacity = train.coaches.reduce((s, c) => s + c.capacity, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Coach Monitor
          </h2>
          <p className="text-xs text-muted-foreground">
            {train.coaches.length} coaches · {totalDetected}/{totalCapacity}{" "}
            total passengers
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse-subtle" />
          <span>Live AI Detection</span>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap">
        {[
          { label: "Normal (<85%)", cls: "bg-chart-1" },
          { label: "Crowded (85–110%)", cls: "bg-chart-2" },
          { label: "Overcrowded (>110%)", cls: "bg-destructive" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-full", item.cls)} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {train.coaches.map((coach, i) => (
          <CoachCard key={coach.id} coach={coach} index={i} />
        ))}
      </div>
    </div>
  );
}
