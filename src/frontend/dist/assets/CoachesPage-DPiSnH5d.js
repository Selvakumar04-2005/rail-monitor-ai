import { c as createLucideIcon, j as jsxRuntimeExports, a as cn, r as reactExports, g as getOccupancyRate, B as Badge, h as coachStatusBadgeCn, f as formatRelativeTime, i as coachStatusColor, S as Separator, C as Camera, W as Wifi, k as cameraStatusColor, o as occupancyBarColor } from "./index-DYLu-g8B.js";
import { U as Users, W as WifiOff } from "./wifi-off-JlzVhPE_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M2 20h.01", key: "4haj6o" }],
  ["path", { d: "M7 20v-4", key: "j294jx" }],
  ["path", { d: "M12 20v-8", key: "i3yub9" }],
  ["path", { d: "M17 20V8", key: "1tkaf5" }],
  ["path", { d: "M22 4v16", key: "sih9yq" }]
];
const Signal = createLucideIcon("signal", __iconNode);
function CoachCard({ coach, index }) {
  const [expanded, setExpanded] = reactExports.useState(false);
  const rate = getOccupancyRate(coach.detected, coach.capacity);
  const barColor = occupancyBarColor(rate);
  const activeCameras = coach.cameras.filter(
    (c) => c.status === "online"
  ).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": `coaches.coach_card.item.${index + 1}`,
      className: "rounded-xl border border-border bg-card shadow-elevated hover:shadow-card-hover transition-smooth",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 p-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-lg bg-muted flex items-center justify-center border border-border shrink-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono font-bold text-sm text-foreground", children: coach.number }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-display font-semibold text-sm text-foreground", children: [
                "Coach ",
                coach.number
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: cn(
                    "text-[10px] px-1.5 border",
                    coachStatusBadgeCn(coach.status)
                  ),
                  children: coach.class
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  className: cn(
                    "text-[10px] px-1.5 border",
                    coachStatusBadgeCn(coach.status)
                  ),
                  children: coach.status
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground mt-0.5", children: formatRelativeTime(coach.lastUpdated) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right shrink-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "p",
              {
                className: cn(
                  "font-mono font-bold text-lg",
                  coachStatusColor(coach.status)
                ),
                children: [
                  rate,
                  "%"
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground", children: "occupancy" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-4 pb-3 space-y-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-xs text-muted-foreground", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3" }),
              coach.detected,
              " detected"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              coach.reserved,
              " reserved / ",
              coach.capacity,
              " capacity"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn("h-full rounded-full transition-smooth", barColor),
              style: { width: `${Math.min(100, rate)}%` }
            }
          ) }),
          rate > 100 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 rounded-full bg-muted overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "h-full rounded-full bg-destructive/40",
              style: { width: `${Math.min(100, rate - 100)}%` }
            }
          ) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { className: "bg-border" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "w-full flex items-center gap-3 p-3 px-4 hover:bg-muted/30 transition-smooth",
            onClick: () => setExpanded((v) => !v),
            "data-ocid": `coaches.coach_camera_toggle.item.${index + 1}`,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-3.5 h-3.5 text-muted-foreground" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground flex-1 text-left", children: [
                activeCameras,
                "/",
                coach.cameras.length,
                " cameras online"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Signal,
                {
                  className: cn(
                    "w-3 h-3 transition-smooth",
                    activeCameras === coach.cameras.length ? "text-chart-1" : "text-chart-2"
                  )
                }
              )
            ]
          }
        ),
        expanded && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "px-4 pb-4 space-y-2", children: coach.cameras.map((cam) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center gap-3 p-2 rounded-md bg-muted/30 border border-border text-xs",
            children: [
              cam.status === "online" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-3 h-3 text-chart-1 shrink-0" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-3 h-3 text-destructive shrink-0" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-foreground", children: cam.label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cn("font-medium", cameraStatusColor(cam.status)),
                  children: cam.status
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-muted-foreground", children: [
                cam.detectionsPerFrame,
                " det/f"
              ] })
            ]
          },
          cam.id
        )) })
      ]
    }
  );
}
function CoachesPage({ train }) {
  const totalDetected = train.coaches.reduce((s, c) => s + c.detected, 0);
  const totalCapacity = train.coaches.reduce((s, c) => s + c.capacity, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Coach Monitor" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          train.coaches.length,
          " coaches · ",
          totalDetected,
          "/",
          totalCapacity,
          " ",
          "total passengers"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-xs text-muted-foreground", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse-subtle" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Live AI Detection" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4 text-[11px] text-muted-foreground flex-wrap", children: [
      { label: "Normal (<85%)", cls: "bg-chart-1" },
      { label: "Crowded (85–110%)", cls: "bg-chart-2" },
      { label: "Overcrowded (>110%)", cls: "bg-destructive" }
    ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("w-2.5 h-2.5 rounded-full", item.cls) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label })
    ] }, item.label)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4", children: train.coaches.map((coach, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(CoachCard, { coach, index: i }, coach.id)) })
  ] });
}
export {
  CoachesPage as default
};
