import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  cn,
  formatRelativeTime,
  formatTimestamp,
  severityBg,
  severityColor,
} from "@/lib/utils";
import type { Alert, AlertSeverity, Train } from "@/types";
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  Info,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";

interface AlertsPageProps {
  train: Train;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

const SEVERITY_ICONS: Record<AlertSeverity, React.ElementType> = {
  critical: AlertOctagon,
  warning: AlertTriangle,
  info: Info,
};

const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  critical: "Critical",
  warning: "Warning",
  info: "Info",
};

// ─── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  colorClass,
  bgClass,
  ocid,
}: {
  label: string;
  value: number;
  sub: string;
  icon: React.ElementType;
  colorClass: string;
  bgClass: string;
  ocid: string;
}) {
  return (
    <div
      data-ocid={ocid}
      className="rounded-xl border border-border bg-card p-4 space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="text-label">{label}</span>
        <div
          className={cn(
            "w-7 h-7 rounded-md flex items-center justify-center",
            bgClass,
          )}
        >
          <Icon className={cn("w-3.5 h-3.5", colorClass)} />
        </div>
      </div>
      <p className={cn("text-metric text-3xl font-bold", colorClass)}>
        {value}
      </p>
      <p className="text-xs text-muted-foreground">{sub}</p>
    </div>
  );
}

// ─── Alert row ─────────────────────────────────────────────────────────────────
function AlertRow({
  alert,
  index,
  onResolve,
}: {
  alert: Alert;
  index: number;
  onResolve: (id: string) => void;
}) {
  const Icon = SEVERITY_ICONS[alert.severity];
  const isResolved = alert.status === "resolved";

  return (
    <div
      data-ocid={`alerts.item.${index + 1}`}
      className={cn(
        "rounded-xl border p-4 transition-smooth",
        isResolved
          ? "bg-muted/20 border-border opacity-60 hover:opacity-80"
          : severityBg(alert.severity),
      )}
    >
      <div className="flex items-start gap-3">
        {/* Severity icon */}
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
            alert.severity === "critical"
              ? "bg-destructive/15"
              : alert.severity === "warning"
                ? "bg-chart-2/15"
                : "bg-primary/15",
          )}
        >
          <Icon className={cn("w-4 h-4", severityColor(alert.severity))} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1.5">
          {/* Title row */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-display font-semibold text-sm text-foreground">
              {alert.message}
            </p>
            <Badge
              className={cn(
                "text-[10px] px-1.5 py-0 border capitalize font-medium",
                alert.severity === "critical"
                  ? "bg-destructive/10 text-destructive border-destructive/30"
                  : alert.severity === "warning"
                    ? "bg-chart-2/10 text-chart-2 border-chart-2/30"
                    : "bg-primary/10 text-primary border-primary/30",
              )}
            >
              {SEVERITY_LABELS[alert.severity]}
            </Badge>
            {isResolved && (
              <Badge className="text-[10px] px-1.5 py-0 border bg-chart-1/10 text-chart-1 border-chart-1/30">
                <CheckCircle2 className="w-2.5 h-2.5 mr-1" />
                Resolved
              </Badge>
            )}
          </div>

          {/* Details */}
          <p className="text-xs text-muted-foreground leading-relaxed">
            {alert.details}
          </p>

          {/* Meta row */}
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatTimestamp(alert.timestamp)}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-muted-foreground/40" />
              {formatRelativeTime(alert.timestamp)}
            </span>
            <span className="flex items-center gap-1 font-mono font-medium text-foreground/70">
              Coach {alert.coachNumber}
            </span>
            {isResolved && alert.resolvedAt && (
              <span className="flex items-center gap-1 text-chart-1">
                <CheckCircle2 className="w-3 h-3" />
                Resolved by {alert.resolvedBy ?? "System"} ·{" "}
                {formatRelativeTime(alert.resolvedAt)}
              </span>
            )}
          </div>
        </div>

        {/* Resolve CTA */}
        {!isResolved && (
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs shrink-0 gap-1 border-border hover:border-chart-1/50 hover:bg-chart-1/10 hover:text-chart-1 transition-smooth"
            data-ocid={`alerts.resolve_button.${index + 1}`}
            onClick={() => onResolve(alert.id)}
          >
            <CheckCircle2 className="w-3 h-3" />
            Resolve
          </Button>
        )}
      </div>
    </div>
  );
}

// ─── Severity filter pills ─────────────────────────────────────────────────────
type FilterOption = "all" | AlertSeverity;

function SeverityFilter({
  value,
  onChange,
  counts,
}: {
  value: FilterOption;
  onChange: (v: FilterOption) => void;
  counts: Record<FilterOption, number>;
}) {
  const options: { key: FilterOption; label: string }[] = [
    { key: "all", label: "All" },
    { key: "critical", label: "Critical" },
    { key: "warning", label: "Warning" },
    { key: "info", label: "Info" },
  ];

  return (
    <div className="flex items-center gap-1.5" data-ocid="alerts.filter.tab">
      <Filter className="w-3.5 h-3.5 text-muted-foreground mr-0.5" />
      {options.map((opt) => (
        <button
          key={opt.key}
          type="button"
          data-ocid={`alerts.filter_${opt.key}.tab`}
          onClick={() => onChange(opt.key)}
          className={cn(
            "px-2.5 py-1 rounded-lg text-xs font-medium transition-smooth flex items-center gap-1",
            value === opt.key
              ? opt.key === "critical"
                ? "bg-destructive/15 text-destructive border border-destructive/25"
                : opt.key === "warning"
                  ? "bg-chart-2/15 text-chart-2 border border-chart-2/25"
                  : "bg-primary/15 text-primary border border-primary/25"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60 border border-transparent",
          )}
        >
          {opt.label}
          {counts[opt.key] > 0 && (
            <span
              className={cn(
                "rounded-full px-1 min-w-4 text-center text-[10px] font-bold",
                value === opt.key ? "opacity-100" : "opacity-60",
              )}
            >
              {counts[opt.key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({
  type,
  ocid,
}: { type: "active" | "resolved"; ocid: string }) {
  return (
    <div
      data-ocid={ocid}
      className="flex flex-col items-center justify-center py-16 gap-4 rounded-xl border border-border bg-card"
    >
      {type === "active" ? (
        <>
          <div className="w-14 h-14 rounded-full bg-chart-1/10 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7 text-chart-1" />
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground">
              All Clear
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No active alerts — all coaches operating normally
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center">
            <Clock className="w-7 h-7 text-muted-foreground" />
          </div>
          <div className="text-center">
            <p className="font-display font-semibold text-foreground">
              No Resolved Alerts
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Alert history will appear here once incidents are resolved
            </p>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default function AlertsPage({
  alerts,
  onResolveAlert,
}: AlertsPageProps) {
  const [filter, setFilter] = useState<FilterOption>("all");
  const [activeTab, setActiveTab] = useState<"active" | "resolved">("active");

  const active = useMemo(
    () => alerts.filter((a) => a.status === "active"),
    [alerts],
  );
  const resolved = useMemo(
    () =>
      alerts
        .filter((a) => a.status === "resolved")
        .sort((a, b) => (b.resolvedAt ?? 0) - (a.resolvedAt ?? 0)),
    [alerts],
  );

  const criticalActive = active.filter((a) => a.severity === "critical");
  const warningActive = active.filter((a) => a.severity === "warning");

  // Filter counts for pills
  const currentList = activeTab === "active" ? active : resolved;
  const counts: Record<FilterOption, number> = {
    all: currentList.length,
    critical: currentList.filter((a) => a.severity === "critical").length,
    warning: currentList.filter((a) => a.severity === "warning").length,
    info: currentList.filter((a) => a.severity === "info").length,
  };

  const filtered = useMemo(() => {
    if (filter === "all") return currentList;
    return currentList.filter((a) => a.severity === filter);
  }, [currentList, filter]);

  // Trend indicator for active alerts
  const hasImproved = criticalActive.length === 0;

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            Alerts & Incidents
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time overcrowding detection and incident management
          </p>
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border",
            hasImproved
              ? "bg-chart-1/10 text-chart-1 border-chart-1/25"
              : "bg-destructive/10 text-destructive border-destructive/25",
          )}
          data-ocid="alerts.status_indicator"
        >
          {hasImproved ? (
            <>
              <TrendingDown className="w-3.5 h-3.5" />
              System Stable
            </>
          ) : (
            <>
              <TrendingUp className="w-3.5 h-3.5" />
              {criticalActive.length} Critical Issue
              {criticalActive.length !== 1 ? "s" : ""}
            </>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        data-ocid="alerts.stats.section"
      >
        <StatCard
          label="Active Alerts"
          value={active.length}
          sub={`${criticalActive.length} critical · ${warningActive.length} warning`}
          icon={AlertTriangle}
          colorClass={active.length > 0 ? "text-chart-2" : "text-chart-1"}
          bgClass={active.length > 0 ? "bg-chart-2/10" : "bg-chart-1/10"}
          ocid="alerts.stat_active.card"
        />
        <StatCard
          label="Critical"
          value={criticalActive.length}
          sub="Require immediate action"
          icon={AlertOctagon}
          colorClass={
            criticalActive.length > 0 ? "text-destructive" : "text-chart-1"
          }
          bgClass={
            criticalActive.length > 0 ? "bg-destructive/10" : "bg-chart-1/10"
          }
          ocid="alerts.stat_critical.card"
        />
        <StatCard
          label="Warning"
          value={warningActive.length}
          sub="Monitor closely"
          icon={AlertTriangle}
          colorClass={
            warningActive.length > 0 ? "text-chart-2" : "text-muted-foreground"
          }
          bgClass={warningActive.length > 0 ? "bg-chart-2/10" : "bg-muted"}
          ocid="alerts.stat_warning.card"
        />
        <StatCard
          label="Resolved"
          value={resolved.length}
          sub="Total incidents cleared"
          icon={CheckCircle2}
          colorClass="text-chart-1"
          bgClass="bg-chart-1/10"
          ocid="alerts.stat_resolved.card"
        />
      </div>

      {/* Tabs + filter */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => {
          setActiveTab(v as "active" | "resolved");
          setFilter("all");
        }}
        data-ocid="alerts.tabs"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <TabsList className="bg-muted/50 border border-border">
            <TabsTrigger
              value="active"
              data-ocid="alerts.active.tab"
              className="gap-1.5"
            >
              Active
              {active.length > 0 && (
                <Badge className="h-4 min-w-4 px-1 text-[10px] bg-destructive/90 text-destructive-foreground border-0 rounded-full">
                  {active.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="resolved"
              data-ocid="alerts.resolved.tab"
              className="gap-1.5"
            >
              History
              {resolved.length > 0 && (
                <Badge className="h-4 min-w-4 px-1 text-[10px] bg-muted-foreground/40 text-foreground border-0 rounded-full">
                  {resolved.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <SeverityFilter value={filter} onChange={setFilter} counts={counts} />
        </div>

        {/* Active alerts */}
        <TabsContent value="active" className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState type="active" ocid="alerts.active.empty_state" />
          ) : (
            <>
              {/* Critical group */}
              {filter === "all" && criticalActive.length > 0 && (
                <div className="space-y-2">
                  <p className="text-label flex items-center gap-1.5">
                    <AlertOctagon className="w-3 h-3 text-destructive" />
                    Critical — Immediate Action Required
                  </p>
                  {criticalActive.map((alert, i) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      index={i}
                      onResolve={onResolveAlert}
                    />
                  ))}
                </div>
              )}

              {/* Warning group */}
              {filter === "all" && warningActive.length > 0 && (
                <div className="space-y-2 mt-4">
                  <p className="text-label flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-chart-2" />
                    Warnings — Monitor Closely
                  </p>
                  {warningActive.map((alert, i) => (
                    <AlertRow
                      key={alert.id}
                      alert={alert}
                      index={criticalActive.length + i}
                      onResolve={onResolveAlert}
                    />
                  ))}
                </div>
              )}

              {/* Filtered view (non-all) */}
              {filter !== "all" &&
                filtered.map((alert, i) => (
                  <AlertRow
                    key={alert.id}
                    alert={alert}
                    index={i}
                    onResolve={onResolveAlert}
                  />
                ))}
            </>
          )}
        </TabsContent>

        {/* Resolved / history */}
        <TabsContent value="resolved" className="mt-4 space-y-3">
          {filtered.length === 0 ? (
            <EmptyState type="resolved" ocid="alerts.resolved.empty_state" />
          ) : (
            <div className="space-y-2">
              <p className="text-label">
                Alert History · {filtered.length} record
                {filtered.length !== 1 ? "s" : ""}
              </p>
              {filtered.map((alert, i) => (
                <AlertRow
                  key={alert.id}
                  alert={alert}
                  index={i}
                  onResolve={onResolveAlert}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
