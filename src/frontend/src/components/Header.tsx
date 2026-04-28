import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Bell, Menu, RefreshCw, Shield, Wifi } from "lucide-react";

interface HeaderProps {
  trainName: string;
  trainNumber: string;
  currentStation: string;
  nextStation: string;
  status: "on-time" | "delayed" | "cancelled";
  delayMinutes: number;
  alertCount: number;
  isRefreshing: boolean;
  lastRefresh: number;
  onMenuToggle: () => void;
  onAlertClick: () => void;
  activePage: string;
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  coaches: "Coach Monitor",
  cameras: "CCTV Feeds",
  alerts: "Alerts & Incidents",
  reports: "AI Reports",
  analytics: "Analytics",
  settings: "Settings",
};

export function Header({
  trainName,
  trainNumber,
  currentStation,
  nextStation,
  status,
  delayMinutes,
  alertCount,
  isRefreshing,
  lastRefresh,
  onMenuToggle,
  onAlertClick,
  activePage,
}: HeaderProps) {
  return (
    <header className="h-14 flex items-center gap-3 px-4 bg-card border-b border-border shadow-elevated shrink-0">
      {/* Menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onMenuToggle}
        data-ocid="header.menu_toggle"
        className="h-8 w-8 text-muted-foreground hover:text-foreground"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-4 h-4" />
      </Button>

      <Separator orientation="vertical" className="h-6 bg-border" />

      {/* Page title */}
      <div className="min-w-0">
        <h1 className="font-display font-semibold text-sm text-foreground truncate">
          {PAGE_TITLES[activePage] ?? "RailWatch"}
        </h1>
      </div>

      <div className="flex-1" />

      {/* Train status pill */}
      <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted border border-border text-xs">
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full shrink-0",
            status === "on-time"
              ? "bg-chart-1 animate-pulse-subtle"
              : status === "delayed"
                ? "bg-chart-2"
                : "bg-destructive",
          )}
        />
        <span className="font-mono font-medium text-foreground">
          {trainNumber}
        </span>
        <Separator orientation="vertical" className="h-3 bg-border" />
        <span className="text-muted-foreground truncate max-w-32">
          {trainName}
        </span>
        {status === "delayed" && delayMinutes > 0 && (
          <Badge className="h-4 px-1 text-[10px] bg-chart-2/15 text-chart-2 border border-chart-2/30">
            +{delayMinutes}m
          </Badge>
        )}
      </div>

      {/* Station info */}
      <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground">
        <Wifi className="w-3 h-3 text-chart-1 shrink-0" />
        <span className="font-medium text-foreground truncate max-w-24">
          {currentStation}
        </span>
        <span className="text-muted-foreground/50">→</span>
        <span className="truncate max-w-24">{nextStation}</span>
      </div>

      <Separator
        orientation="vertical"
        className="hidden md:block h-6 bg-border"
      />

      {/* Refresh indicator */}
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCw
          className={cn(
            "w-3 h-3 transition-smooth",
            isRefreshing
              ? "animate-spin text-primary"
              : "text-muted-foreground/50",
          )}
        />
        <span className="font-mono hidden sm:block">
          {formatTimestamp(lastRefresh)}
        </span>
      </div>

      {/* Internet Identity indicator */}
      <div className="flex items-center gap-1 text-xs">
        <Shield className="w-3 h-3 text-chart-1" />
        <span className="hidden sm:block text-chart-1 font-medium text-[10px]">
          II
        </span>
      </div>

      {/* Alert bell */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onAlertClick}
        data-ocid="header.alerts_button"
        className="h-8 w-8 relative text-muted-foreground hover:text-foreground"
        aria-label="View alerts"
      >
        <Bell className={cn("w-4 h-4", alertCount > 0 && "text-chart-2")} />
        {alertCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 flex items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground animate-pulse-subtle">
            {alertCount > 9 ? "9+" : alertCount}
          </span>
        )}
      </Button>
    </header>
  );
}
