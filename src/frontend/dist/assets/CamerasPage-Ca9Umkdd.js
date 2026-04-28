import { c as createLucideIcon, r as reactExports, j as jsxRuntimeExports, W as Wifi, B as Badge, a as cn, h as coachStatusBadgeCn, l as ChevronRight, C as Camera, k as cameraStatusColor, m as formatTimestamp, g as getOccupancyRate, A as Activity, Z as Zap } from "./index-DYLu-g8B.js";
import { W as WifiOff, U as Users } from "./wifi-off-JlzVhPE_.js";
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$4 = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
  ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }]
];
const CircleAlert = createLucideIcon("circle-alert", __iconNode$4);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$3 = [
  [
    "path",
    {
      d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
      key: "1nclc0"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Eye = createLucideIcon("eye", __iconNode$3);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$2 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "m21 3-7 7", key: "1l2asr" }],
  ["path", { d: "m3 21 7-7", key: "tjx5ai" }],
  ["path", { d: "M9 21H3v-6", key: "wtvkvv" }]
];
const Maximize2 = createLucideIcon("maximize-2", __iconNode$2);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode$1 = [
  ["path", { d: "M4.9 19.1C1 15.2 1 8.8 4.9 4.9", key: "1vaf9d" }],
  ["path", { d: "M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5", key: "u1ii0m" }],
  ["circle", { cx: "12", cy: "12", r: "2", key: "1c9p78" }],
  ["path", { d: "M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5", key: "1j5fej" }],
  ["path", { d: "M19.1 4.9C23 8.8 23 15.1 19.1 19", key: "10b0cb" }]
];
const Radio = createLucideIcon("radio", __iconNode$1);
/**
 * @license lucide-react v0.511.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */
const __iconNode = [
  ["path", { d: "M3 7V5a2 2 0 0 1 2-2h2", key: "aa7l1z" }],
  ["path", { d: "M17 3h2a2 2 0 0 1 2 2v2", key: "4qcy5o" }],
  ["path", { d: "M21 17v2a2 2 0 0 1-2 2h-2", key: "6vwrx8" }],
  ["path", { d: "M7 21H5a2 2 0 0 1-2-2v-2", key: "ioqczr" }]
];
const Scan = createLucideIcon("scan", __iconNode);
function generateBoxes(count) {
  const colors = [
    "oklch(0.72 0.18 180)",
    "oklch(0.68 0.2 85)",
    "oklch(0.72 0.18 145)"
  ];
  return Array.from({ length: Math.min(count, 8) }, (_, i) => ({
    x: 5 + (i * 23 + 7) % 72,
    y: 10 + (i * 17 + 13) % 65,
    w: 14 + i * 11 % 16,
    h: 22 + i * 9 % 20,
    label: "person",
    conf: 0.82 + i % 5 * 0.03,
    color: colors[i % colors.length]
  }));
}
function YoloCanvas({
  detections,
  animate
}) {
  const canvasRef = reactExports.useRef(null);
  const frameRef = reactExports.useRef(0);
  const boxesRef = reactExports.useRef(generateBoxes(detections));
  reactExports.useEffect(() => {
    boxesRef.current = generateBoxes(detections);
  }, [detections]);
  reactExports.useEffect(() => {
    if (!animate) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let tick = 0;
    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1);
      }
      ctx.strokeStyle = "oklch(0.72 0.18 180)";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      const br = 12;
      for (const [cx, cy] of [
        [4, 4],
        [W - 4, 4],
        [4, H - 4],
        [W - 4, H - 4]
      ]) {
        const sx = cx < W / 2 ? 1 : -1;
        const sy = cy < H / 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx + sx * br, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + sy * br);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      for (let i = 0; i < boxesRef.current.length; i++) {
        const box = boxesRef.current[i];
        const drift = Math.sin(tick / 40 + i) * 1.2;
        const bx = (box.x + drift) / 100 * W;
        const by = (box.y + drift * 0.5) / 100 * H;
        const bw = box.w / 100 * W;
        const bh = box.h / 100 * H;
        ctx.shadowColor = box.color;
        ctx.shadowBlur = 4;
        ctx.strokeStyle = box.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.shadowBlur = 0;
        const label = `${box.label} ${(box.conf * 100).toFixed(0)}%`;
        ctx.font = "bold 9px monospace";
        const tw = ctx.measureText(label).width + 6;
        ctx.fillStyle = box.color.replace("0.72", "0.18").replace("0.68", "0.18");
        ctx.globalAlpha = 0.82;
        ctx.fillRect(bx, by - 14, tw, 13);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "oklch(0.97 0 0)";
        ctx.fillText(label, bx + 3, by - 4);
        ctx.strokeStyle = box.color;
        ctx.lineWidth = 2;
        const tick2 = 5;
        for (const [tx, ty] of [
          [bx, by],
          [bx + bw, by],
          [bx, by + bh],
          [bx + bw, by + bh]
        ]) {
          const dx = tx === bx ? 1 : -1;
          const dy = ty === by ? 1 : -1;
          ctx.beginPath();
          ctx.moveTo(tx + dx * tick2, ty);
          ctx.lineTo(tx, ty);
          ctx.lineTo(tx, ty + dy * tick2);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.roundRect(6, H - 22, 90, 16, 3);
      ctx.fill();
      ctx.fillStyle = "oklch(0.72 0.18 180)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`DETECTED: ${boxesRef.current.length}`, 12, H - 11);
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.roundRect(W - 66, H - 22, 60, 16, 3);
      ctx.fill();
      ctx.fillStyle = tick % 60 < 30 ? "oklch(0.62 0.22 25)" : "oklch(0.62 0.22 25 / 0.4)";
      ctx.font = "bold 9px monospace";
      ctx.fillText("● REC", W - 60, H - 11);
      tick++;
      frameRef.current = tick;
      raf = requestAnimationFrame(draw);
    }
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [animate]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "canvas",
    {
      ref: canvasRef,
      width: 640,
      height: 360,
      className: "w-full h-full object-contain",
      style: { imageRendering: "crisp-edges" }
    }
  );
}
function FeaturedFeed({
  camera,
  coachNumber
}) {
  const isOnline = camera.status === "online";
  const isDegraded = camera.status === "degraded";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "cameras.featured_feed",
      className: "relative rounded-xl border border-border bg-background overflow-hidden shadow-elevated",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: cn(
                  "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border",
                  isOnline ? "bg-chart-1/20 text-chart-1 border-chart-1/40" : isDegraded ? "bg-chart-2/20 text-chart-2 border-chart-2/40" : "bg-destructive/20 text-destructive border-destructive/40"
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: cn(
                        "w-1.5 h-1.5 rounded-full",
                        isOnline ? "bg-chart-1 animate-pulse" : isDegraded ? "bg-chart-2" : "bg-destructive"
                      )
                    }
                  ),
                  camera.status.toUpperCase()
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-white/70", children: [
              "Coach ",
              coachNumber,
              " · ",
              camera.label
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 text-[10px] font-mono text-white/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: camera.resolution }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-white/30", children: "|" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
              camera.fps,
              " FPS"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Maximize2, { className: "w-3 h-3 text-white/40" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "aspect-video relative", children: isOnline ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "absolute inset-0 bg-muted/30",
              style: {
                backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.06) 1px, transparent 2px, transparent 4px)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(YoloCanvas, { detections: camera.detectionsPerFrame, animate: true }) })
        ] }) : isDegraded ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-chart-2/10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-10 h-10 text-chart-2" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-chart-2", children: "Signal Degraded" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/40 mt-1", children: "Partial feed — detection unreliable" })
          ] })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-14 h-14 rounded-full border border-destructive/30 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-6 h-6 text-destructive" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium text-destructive", children: "Camera Offline" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] text-white/30 mt-1", children: "No feed available" })
          ] })
        ] }) }),
        isOnline && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-0 inset-x-0 z-20 flex items-center gap-4 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "w-3 h-3 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-white/80", children: "YOLO v8 ACTIVE" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-3 h-3 text-chart-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-chart-1 font-semibold", children: [
              camera.detectionsPerFrame,
              " persons/frame"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-auto text-[10px] font-mono text-white/40", children: formatTimestamp(camera.lastFrame) })
        ] })
      ]
    }
  );
}
function ThumbnailCard({
  camera,
  coachNumber,
  index,
  selected,
  onSelect
}) {
  const isOnline = camera.status === "online";
  const isDegraded = camera.status === "degraded";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `cameras.thumbnail.item.${index}`,
      onClick: onSelect,
      className: cn(
        "w-full text-left rounded-lg border overflow-hidden transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected ? "border-primary/60 shadow-[0_0_0_2px_oklch(var(--primary)/0.25)] bg-primary/5" : "border-border bg-card hover:border-border/80 hover:bg-card/80"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-video bg-muted overflow-hidden", children: [
          isOnline ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "absolute inset-0 opacity-60 bg-muted/30",
                style: {
                  backgroundImage: "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.08) 1px, transparent 2px, transparent 4px)"
                }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
              [0, 1, 2].slice(0, Math.min(3, camera.detectionsPerFrame)).map((i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "absolute border border-chart-1/60 rounded-sm",
                  style: {
                    width: 18 + i * 4,
                    height: 24 + i * 3,
                    top: -8 + i * 6,
                    left: -10 + i * 8
                  }
                },
                i
              )),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-6 h-6 text-white/20" })
            ] }) })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: isDegraded ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-5 h-5 text-chart-2/60" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-5 h-5 text-destructive/60" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute top-1.5 left-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: cn(
                "w-2 h-2 rounded-full",
                isOnline ? "bg-chart-1 animate-pulse" : isDegraded ? "bg-chart-2" : "bg-destructive"
              )
            }
          ) }),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 ring-2 ring-primary/50 ring-inset rounded-lg" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-2 py-1.5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px] font-medium text-foreground truncate", children: camera.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[10px] text-muted-foreground font-mono", children: [
              "C",
              coachNumber
            ] })
          ] }),
          isOnline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px] font-mono text-primary shrink-0 ml-1", children: [
            camera.detectionsPerFrame,
            "p"
          ] })
        ] })
      ]
    }
  );
}
function CoachTab({
  coach,
  active,
  index,
  onSelect
}) {
  const onlineCams = coach.cameras.filter((c) => c.status === "online").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      "data-ocid": `cameras.coach_tab.item.${index}`,
      onClick: onSelect,
      className: cn(
        "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-primary text-primary-foreground shadow-elevated" : "bg-card text-foreground border border-border hover:bg-muted/60"
      ),
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-xs opacity-60", children: coach.number }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: coach.class }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: cn(
              "text-[10px] font-mono px-1 rounded",
              active ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
            ),
            children: [
              onlineCams,
              "/",
              coach.cameras.length
            ]
          }
        )
      ]
    }
  );
}
function DetectionStats({ coach }) {
  const totalDetections = coach.cameras.reduce(
    (sum, c) => sum + c.detectionsPerFrame,
    0
  );
  const occRate = getOccupancyRate(coach.detected, coach.capacity);
  const stats = [
    {
      label: "Live Detections",
      value: coach.detected,
      sub: "persons detected",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "w-4 h-4" }),
      color: "text-primary"
    },
    {
      label: "AI Frames/sec",
      value: `${totalDetections}`,
      sub: "detections active",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }),
      color: "text-chart-1"
    },
    {
      label: "Occupancy",
      value: `${occRate}%`,
      sub: `${coach.detected}/${coach.capacity} capacity`,
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4" }),
      color: occRate >= 110 ? "text-destructive" : occRate >= 85 ? "text-chart-2" : "text-chart-1"
    },
    {
      label: "Cameras",
      value: `${coach.cameras.filter((c) => c.status === "online").length}/${coach.cameras.length}`,
      sub: "online",
      icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { className: "w-4 h-4" }),
      color: "text-chart-4"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: stats.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "rounded-lg border border-border bg-card px-3 py-2.5",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: cn("flex items-center gap-1.5 mb-1", s.color), children: [
          s.icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold text-label", children: s.label })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-metric leading-none", children: s.value }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] text-muted-foreground mt-0.5", children: s.sub })
      ]
    },
    s.label
  )) });
}
function CamerasPage({ train }) {
  const [activeCoachIdx, setActiveCoachIdx] = reactExports.useState(0);
  const [activeCamIdx, setActiveCamIdx] = reactExports.useState(0);
  const activeCoach = train.coaches[activeCoachIdx];
  const activeCamera = activeCoach == null ? void 0 : activeCoach.cameras[activeCamIdx];
  const handleCoachSelect = (idx) => {
    setActiveCoachIdx(idx);
    setActiveCamIdx(0);
  };
  const allCameras = train.coaches.flatMap((c) => c.cameras);
  const onlineCount = allCameras.filter((c) => c.status === "online").length;
  const degradedCount = allCameras.filter(
    (c) => c.status === "degraded"
  ).length;
  const offlineCount = allCameras.filter((c) => c.status === "offline").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "cameras.page",
        className: "flex items-start justify-between flex-wrap gap-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "CCTV Monitoring" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mt-0.5", children: [
              allCameras.length,
              " cameras · YOLO v8 real-time detection overlay · 1920×1080 30 FPS"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 text-xs flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "cameras.status.online",
                className: "flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Wifi, { className: "w-3.5 h-3.5 text-chart-1" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-chart-1 font-medium", children: [
                    onlineCount,
                    " online"
                  ] })
                ]
              }
            ),
            degradedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "cameras.status.degraded",
                className: "flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "w-3.5 h-3.5 text-chart-2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-chart-2 font-medium", children: [
                    degradedCount,
                    " degraded"
                  ] })
                ]
              }
            ),
            offlineCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                "data-ocid": "cameras.status.offline",
                className: "flex items-center gap-1.5",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(WifiOff, { className: "w-3.5 h-3.5 text-destructive" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-medium", children: [
                    offlineCount,
                    " offline"
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Radio, { className: "w-3 h-3 text-destructive animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive text-[10px] font-semibold", children: "LIVE" })
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "cameras.coach_tabs",
        className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] text-label shrink-0", children: "COACH" }),
          train.coaches.map((coach, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            CoachTab,
            {
              coach,
              active: i === activeCoachIdx,
              index: i + 1,
              onSelect: () => handleCoachSelect(i)
            },
            coach.id
          ))
        ]
      }
    ),
    activeCoach && activeCamera && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          FeaturedFeed,
          {
            camera: activeCamera,
            coachNumber: activeCoach.number
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-3 gap-2", children: activeCoach.cameras.map((cam, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          ThumbnailCard,
          {
            camera: cam,
            coachNumber: activeCoach.number,
            index: i + 1,
            selected: i === activeCamIdx,
            onSelect: () => setActiveCamIdx(i)
          },
          cam.id
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-elevated space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground", children: [
                  "Coach ",
                  activeCoach.number
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Badge,
                  {
                    className: cn(
                      "text-[10px] h-4 px-1.5 border",
                      coachStatusBadgeCn(activeCoach.status)
                    ),
                    children: activeCoach.status.toUpperCase()
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] text-muted-foreground mt-0.5", children: [
                activeCoach.class,
                " Class · Capacity ",
                activeCoach.capacity
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "w-4 h-4 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(DetectionStats, { coach: activeCoach })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card p-4 shadow-elevated space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Camera, { className: "w-4 h-4 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display font-semibold text-sm text-foreground", children: activeCamera.label })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2 text-xs", children: [
            ["Camera ID", activeCamera.id],
            ["Resolution", activeCamera.resolution],
            ["Frame Rate", `${activeCamera.fps} FPS`],
            [
              "Status",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: cameraStatusColor(activeCamera.status),
                  children: activeCamera.status.charAt(0).toUpperCase() + activeCamera.status.slice(1)
                },
                "status"
              )
            ],
            ["Last Frame", formatTimestamp(activeCamera.lastFrame)],
            [
              "Detections/Frame",
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "text-chart-1 font-mono font-bold",
                  children: activeCamera.detectionsPerFrame
                },
                "det"
              )
            ]
          ].map(([key, val]) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex items-center justify-between gap-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: key }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground text-right truncate max-w-[120px]", children: val })
              ]
            },
            String(key)
          )) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Scan, { className: "w-3.5 h-3.5 text-primary" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs font-semibold text-primary", children: "YOLO v8 Detection" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-auto flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-primary animate-pulse" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-mono text-primary", children: "ACTIVE" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2 text-[10px]", children: [
            ["Model", "YOLOv8n"],
            ["Inference", "~12ms"],
            ["Confidence", "0.82+"],
            ["Class", "person"]
          ].map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: k }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-foreground", children: v })
          ] }, k)) })
        ] })
      ] })
    ] })
  ] });
}
export {
  CamerasPage as default
};
