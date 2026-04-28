import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, T as TramFront, B as Badge, a as cn, b as TriangleAlert, C as Camera, s as severityColor, f as formatRelativeTime, d as Button, e as severityBg, Z as Zap, A as Activity, W as Wifi, g as getOccupancyRate, h as coachStatusBadgeCn } from "./index-DYLu-g8B.js";
import { S as Skeleton } from "./skeleton-IWFHe1VC.js";
import { U as Users, W as WifiOff } from "./wifi-off-JlzVhPE_.js";
import { C as CircleCheck } from "./circle-check-Bly6Mo4x.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "m12 14 4-4", key: "9kzdfg" }],
  ["path", { d: "M3.34 19a10 10 0 1 1 17.32 0", key: "19p75a" }]
];
const Gauge = createLucideIcon("gauge", __iconNode);
function occupancyColorClass(rate) {
  if (rate >= 90) return "text-destructive";
  if (rate >= 75) return "text-chart-2";
  return "text-chart-1";
}
function occupancyBarClass(rate) {
  if (rate >= 90) return "bg-destructive";
  if (rate >= 75) return "bg-chart-2";
  return "bg-chart-1";
}
function occupancyBadgeClass(rate) {
  if (rate >= 90)
    return "bg-destructive/15 text-destructive border-destructive/30";
  if (rate >= 75) return "bg-chart-2/15 text-chart-2 border-chart-2/30";
  return "bg-chart-1/15 text-chart-1 border-chart-1/30";
}
function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accentClass,
  ocid
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": ocid,
      className: "rounded-xl border border-border bg-card p-4 shadow-sm hover:shadow-md transition-smooth",
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric text-2xl leading-none", children: value }),
          sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-muted-foreground mt-1", children: sub })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: cn(
              "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
              accentClass
            ),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "w-4 h-4" })
          }
        )
      ] })
    }
  );
}
function CameraStatusRow({ cameras }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
    cameras.map((cam) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: cn(
            "block w-2 h-2 rounded-full",
            cam.status === "online" ? "bg-chart-1" : cam.status === "degraded" ? "bg-chart-2" : "bg-destructive"
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-1.5 py-0.5 rounded text-[9px] bg-foreground text-background opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none transition-opacity duration-150 z-10", children: [
        cam.label,
        ": ",
        cam.status
      ] })
    ] }, cam.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] text-muted-foreground ml-1 font-mono", children: [
      cameras.filter((c) => c.status === "online").length,
      "/",
      cameras.length
    ] })
  ] });
}
function CoachOccupancyRow({ coach, idx }) {
  const rate = getOccupancyRate(coach.detected, coach.capacity);
  const reserved = coach.reserved;
  const reservedRate = getOccupancyRate(reserved, coach.capacity);
  const barPct = Math.min(100, rate);
  const reservedPct = Math.min(100, reservedRate);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `dashboard.coach_row.item.${idx + 1}`,
      className: "rounded-lg border border-border bg-background/60 p-3 space-y-2",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-sm text-foreground w-9 shrink-0", children: coach.number }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              className: cn(
                "text-[10px] px-1.5 border shrink-0",
                coachStatusBadgeCn(coach.status)
              ),
              children: coach.class
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-xs min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 text-muted-foreground shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: cn("font-mono font-semibold", occupancyColorClass(rate)),
                children: coach.detected
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
              "/ ",
              coach.capacity
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-border", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground text-[11px]", children: [
              reserved,
              " reserved"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Badge,
            {
              className: cn(
                "text-[10px] px-1.5 border font-mono shrink-0",
                occupancyBadgeClass(rate)
              ),
              children: [
                rate,
                "%"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "relative h-2 rounded-full bg-muted overflow-hidden",
            "data-ocid": `dashboard.coach_bar.item.${idx + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute inset-y-0 left-0 rounded-full opacity-30 bg-primary transition-all duration-700",
                  style: { width: `${reservedPct}%` }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: cn(
                    "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
                    occupancyBarClass(rate)
                  ),
                  style: { width: `${barPct}%` }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3 h-3 text-muted-foreground shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(CameraStatusRow, { cameras: coach.cameras })
        ] })
      ]
    }
  );
}
function LiveDot() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-2 w-2 shrink-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-chart-1 opacity-75" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-chart-1" })
  ] });
}
function DashboardPage({
  train,
  alerts,
  onResolveAlert
}) {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);
  const totalDetected = train.coaches.reduce((s, c) => s + c.detected, 0);
  const totalCapacity = train.coaches.reduce((s, c) => s + c.capacity, 0);
  const totalCameras = train.coaches.reduce((s, c) => s + c.cameras.length, 0);
  const camerasOnline = train.coaches.flatMap((c) => c.cameras).filter((c) => c.status === "online").length;
  const activeAlerts = alerts.filter((a) => a.status === "active");
  const criticalAlerts = activeAlerts.filter((a) => a.severity === "critical");
  const stats = {
    totalPassengers: totalDetected,
    totalCapacity,
    occupancyRate: getOccupancyRate(totalDetected, totalCapacity),
    activeAlerts: activeAlerts.length,
    criticalAlerts: criticalAlerts.length,
    camerasOnline,
    totalCameras
  };
  if (!mounted) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-16 rounded-xl" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: ["passengers", "occupancy", "alerts", "cameras"].map(
        (k) => /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-24 rounded-xl" }, k)
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Skeleton, { className: "h-64 rounded-xl" })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "dashboard.train_info",
        className: "rounded-xl border border-primary/20 bg-primary/5 p-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TramFront, { className: "w-5 h-5 text-primary" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-display font-bold text-foreground text-base leading-tight", children: train.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground font-mono", children: [
                "#",
                train.number,
                " · ",
                train.origin,
                " → ",
                train.destination
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 ml-auto flex-wrap text-xs", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: "Departs" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-foreground", children: train.departureTime })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: "Arrives" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono font-semibold text-foreground", children: train.arrivalTime })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: "Speed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-mono font-semibold text-foreground", children: [
                train.speed,
                " km/h"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: "At Station" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate max-w-[120px]", children: train.currentStation })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: "Next" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate max-w-[120px]", children: train.nextStation })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Badge,
              {
                className: cn(
                  "text-[10px] border",
                  train.status === "on-time" ? "bg-chart-1/15 text-chart-1 border-chart-1/30" : train.status === "delayed" ? "bg-chart-2/15 text-chart-2 border-chart-2/30" : "bg-destructive/15 text-destructive border-destructive/30"
                ),
                children: train.status === "on-time" ? "On Time" : train.status === "delayed" ? `+${train.delayMinutes}m Delay` : "Cancelled"
              }
            )
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Total Passengers",
          value: stats.totalPassengers,
          sub: `of ${stats.totalCapacity} seats`,
          icon: Users,
          accentClass: "bg-primary/10 text-primary",
          ocid: "dashboard.passengers_stat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Occupancy Rate",
          value: `${stats.occupancyRate}%`,
          sub: stats.occupancyRate >= 90 ? "Above safe limit" : stats.occupancyRate >= 75 ? "Approaching threshold" : "Within safe limits",
          icon: Gauge,
          accentClass: stats.occupancyRate >= 90 ? "bg-destructive/10 text-destructive" : stats.occupancyRate >= 75 ? "bg-chart-2/10 text-chart-2" : "bg-chart-1/10 text-chart-1",
          ocid: "dashboard.occupancy_stat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "Active Alerts",
          value: stats.activeAlerts,
          sub: `${stats.criticalAlerts} critical`,
          icon: TriangleAlert,
          accentClass: stats.criticalAlerts > 0 ? "bg-destructive/10 text-destructive" : stats.activeAlerts > 0 ? "bg-chart-2/10 text-chart-2" : "bg-chart-1/10 text-chart-1",
          ocid: "dashboard.alerts_stat"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        StatCard,
        {
          label: "CCTV Online",
          value: `${stats.camerasOnline}/${stats.totalCameras}`,
          sub: "Cameras operational",
          icon: Camera,
          accentClass: "bg-primary/10 text-primary",
          ocid: "dashboard.cameras_stat"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:col-span-2 rounded-xl border border-border bg-card shadow-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-4 pb-3 border-b border-border", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground", children: "Coach Occupancy — Live" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:flex items-center gap-3 text-[10px] text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-chart-1 inline-block" }),
                "<75%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-chart-2 inline-block" }),
                "75–90%"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-2 h-2 rounded-full bg-destructive inline-block" }),
                ">90%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LiveDot, {})
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 grid grid-cols-1 sm:grid-cols-2 gap-3", children: train.coaches.map((coach, idx) => /* @__PURE__ */ jsxRuntimeExports.jsx(CoachOccupancyRow, { coach, idx }, coach.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card shadow-sm flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-4 pt-4 pb-3 border-b border-border shrink-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-semibold text-sm text-foreground", children: "Active Alerts" }),
          activeAlerts.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] bg-destructive/10 text-destructive border-destructive/30 border", children: activeAlerts.length })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-3 space-y-2 overflow-y-auto flex-1 max-h-96", children: activeAlerts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "dashboard.alerts.empty_state",
            className: "flex flex-col items-center justify-center py-8 gap-2",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "w-8 h-8 text-chart-1" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground text-center", children: "All clear — no active alerts" })
            ]
          }
        ) : activeAlerts.map((alert, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `dashboard.alert.item.${idx + 1}`,
            className: cn(
              "rounded-lg border p-3 space-y-2 text-xs",
              severityBg(alert.severity)
            ),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  TriangleAlert,
                  {
                    className: cn(
                      "w-3 h-3 mt-0.5 shrink-0",
                      severityColor(alert.severity)
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground line-clamp-2", children: alert.message }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px] mt-0.5", children: formatRelativeTime(alert.timestamp) })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  variant: "outline",
                  size: "sm",
                  className: "h-6 text-[10px] w-full",
                  "data-ocid": `dashboard.alert.resolve_button.${idx + 1}`,
                  onClick: () => onResolveAlert(alert.id),
                  children: "Resolve"
                }
              )
            ]
          },
          alert.id
        )) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-muted/30 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mb-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: "System Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[10px] text-muted-foreground flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-3 h-3" }),
          " Auto-refresh: 5s"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-3 text-xs", children: [
        { label: "AI Detection", value: "YOLO v8 Active", ok: true },
        { label: "Data Sync", value: "5s interval", ok: true },
        { label: "IC Network", value: "Connected", ok: true },
        { label: "Internet Identity", value: "Verified", ok: true }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-2 p-2.5 rounded-lg bg-card border border-border",
          children: [
            item.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-3.5 h-3.5 text-chart-1 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-3.5 h-3.5 text-destructive shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-foreground text-[10px]", children: item.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground truncate", children: item.value })
            ] })
          ]
        },
        item.label
      )) })
    ] })
  ] });
}
export {
  DashboardPage as default
};
