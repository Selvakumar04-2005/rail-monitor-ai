import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  cameraStatusColor,
  cn,
  coachStatusBadgeCn,
  formatTimestamp,
  getOccupancyRate,
} from "@/lib/utils";
import type { Alert, Camera, Coach, Train } from "@/types";
import {
  Activity,
  AlertCircle,
  Camera as CameraIcon,
  ChevronRight,
  Eye,
  Maximize2,
  Radio,
  Scan,
  Users,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CamerasPageProps {
  train: Train;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

// ─── YOLO Detection Canvas ────────────────────────────────────────────────────
interface BoundingBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  conf: number;
  color: string;
}

function generateBoxes(count: number): BoundingBox[] {
  const colors = [
    "oklch(0.72 0.18 180)",
    "oklch(0.68 0.2 85)",
    "oklch(0.72 0.18 145)",
  ];
  return Array.from({ length: Math.min(count, 8) }, (_, i) => ({
    x: 5 + ((i * 23 + 7) % 72),
    y: 10 + ((i * 17 + 13) % 65),
    w: 14 + ((i * 11) % 16),
    h: 22 + ((i * 9) % 20),
    label: "person",
    conf: 0.82 + (i % 5) * 0.03,
    color: colors[i % colors.length],
  }));
}

function YoloCanvas({
  detections,
  animate,
}: {
  detections: number;
  animate: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(0);
  const boxesRef = useRef<BoundingBox[]>(generateBoxes(detections));

  useEffect(() => {
    boxesRef.current = generateBoxes(detections);
  }, [detections]);

  useEffect(() => {
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

      // Scanline overlay
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      for (let y = 0; y < H; y += 4) {
        ctx.fillRect(0, y, W, 1);
      }

      // Corner brackets (frame HUD)
      ctx.strokeStyle = "oklch(0.72 0.18 180)";
      ctx.lineWidth = 1.5;
      ctx.globalAlpha = 0.6;
      const br = 12;
      for (const [cx, cy] of [
        [4, 4],
        [W - 4, 4],
        [4, H - 4],
        [W - 4, H - 4],
      ] as [number, number][]) {
        const sx = cx < W / 2 ? 1 : -1;
        const sy = cy < H / 2 ? 1 : -1;
        ctx.beginPath();
        ctx.moveTo(cx + sx * br, cy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(cx, cy + sy * br);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // Bounding boxes with slight drift animation
      for (let i = 0; i < boxesRef.current.length; i++) {
        const box = boxesRef.current[i];
        const drift = Math.sin(tick / 40 + i) * 1.2;
        const bx = ((box.x + drift) / 100) * W;
        const by = ((box.y + drift * 0.5) / 100) * H;
        const bw = (box.w / 100) * W;
        const bh = (box.h / 100) * H;

        // Box shadow glow
        ctx.shadowColor = box.color;
        ctx.shadowBlur = 4;
        ctx.strokeStyle = box.color;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bx, by, bw, bh);
        ctx.shadowBlur = 0;

        // Label background
        const label = `${box.label} ${(box.conf * 100).toFixed(0)}%`;
        ctx.font = "bold 9px monospace";
        const tw = ctx.measureText(label).width + 6;
        ctx.fillStyle = box.color
          .replace("0.72", "0.18")
          .replace("0.68", "0.18");
        ctx.globalAlpha = 0.82;
        ctx.fillRect(bx, by - 14, tw, 13);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "oklch(0.97 0 0)";
        ctx.fillText(label, bx + 3, by - 4);

        // Corner ticks on box
        ctx.strokeStyle = box.color;
        ctx.lineWidth = 2;
        const tick2 = 5;
        for (const [tx, ty] of [
          [bx, by],
          [bx + bw, by],
          [bx, by + bh],
          [bx + bw, by + bh],
        ] as [number, number][]) {
          const dx = tx === bx ? 1 : -1;
          const dy = ty === by ? 1 : -1;
          ctx.beginPath();
          ctx.moveTo(tx + dx * tick2, ty);
          ctx.lineTo(tx, ty);
          ctx.lineTo(tx, ty + dy * tick2);
          ctx.stroke();
        }
      }

      // Count HUD
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.roundRect(6, H - 22, 90, 16, 3);
      ctx.fill();
      ctx.fillStyle = "oklch(0.72 0.18 180)";
      ctx.font = "bold 9px monospace";
      ctx.fillText(`DETECTED: ${boxesRef.current.length}`, 12, H - 11);

      // FPS / REC indicator
      ctx.fillStyle = "rgba(0,0,0,0.5)";
      ctx.roundRect(W - 66, H - 22, 60, 16, 3);
      ctx.fill();
      ctx.fillStyle =
        tick % 60 < 30 ? "oklch(0.62 0.22 25)" : "oklch(0.62 0.22 25 / 0.4)";
      ctx.font = "bold 9px monospace";
      ctx.fillText("● REC", W - 60, H - 11);

      tick++;
      frameRef.current = tick;
      raf = requestAnimationFrame(draw);
    }

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [animate]);

  return (
    <canvas
      ref={canvasRef}
      width={640}
      height={360}
      className="w-full h-full object-contain"
      style={{ imageRendering: "crisp-edges" }}
    />
  );
}

// ─── Featured feed (large view) ───────────────────────────────────────────────
function FeaturedFeed({
  camera,
  coachNumber,
}: {
  camera: Camera;
  coachNumber: string;
}) {
  const isOnline = camera.status === "online";
  const isDegraded = camera.status === "degraded";

  return (
    <div
      data-ocid="cameras.featured_feed"
      className="relative rounded-xl border border-border bg-background overflow-hidden shadow-elevated"
    >
      {/* Top HUD bar */}
      <div className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono font-semibold border",
              isOnline
                ? "bg-chart-1/20 text-chart-1 border-chart-1/40"
                : isDegraded
                  ? "bg-chart-2/20 text-chart-2 border-chart-2/40"
                  : "bg-destructive/20 text-destructive border-destructive/40",
            )}
          >
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full",
                isOnline
                  ? "bg-chart-1 animate-pulse"
                  : isDegraded
                    ? "bg-chart-2"
                    : "bg-destructive",
              )}
            />
            {camera.status.toUpperCase()}
          </div>
          <span className="text-[10px] font-mono text-white/70">
            Coach {coachNumber} · {camera.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-white/60">
          <span>{camera.resolution}</span>
          <span className="text-white/30">|</span>
          <span>{camera.fps} FPS</span>
          <Maximize2 className="w-3 h-3 text-white/40" />
        </div>
      </div>

      {/* Feed area */}
      <div className="aspect-video relative">
        {isOnline ? (
          <>
            {/* Dark noise texture background */}
            <div
              className="absolute inset-0 bg-muted/30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.06) 1px, transparent 2px, transparent 4px)",
              }}
            />
            {/* YOLO detection canvas */}
            <div className="absolute inset-0">
              <YoloCanvas detections={camera.detectionsPerFrame} animate />
            </div>
          </>
        ) : isDegraded ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-chart-2/10">
            <AlertCircle className="w-10 h-10 text-chart-2" />
            <div className="text-center">
              <p className="text-sm font-medium text-chart-2">
                Signal Degraded
              </p>
              <p className="text-[11px] text-white/40 mt-1">
                Partial feed — detection unreliable
              </p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-full border border-destructive/30 flex items-center justify-center">
              <WifiOff className="w-6 h-6 text-destructive" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-destructive">
                Camera Offline
              </p>
              <p className="text-[11px] text-white/30 mt-1">
                No feed available
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom stats bar */}
      {isOnline && (
        <div className="absolute bottom-0 inset-x-0 z-20 flex items-center gap-4 px-3 py-2 bg-gradient-to-t from-black/70 to-transparent pointer-events-none">
          <div className="flex items-center gap-1.5">
            <Scan className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-mono text-white/80">
              YOLO v8 ACTIVE
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3 h-3 text-chart-1" />
            <span className="text-[10px] font-mono text-chart-1 font-semibold">
              {camera.detectionsPerFrame} persons/frame
            </span>
          </div>
          <div className="ml-auto text-[10px] font-mono text-white/40">
            {formatTimestamp(camera.lastFrame)}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Thumbnail feed card ──────────────────────────────────────────────────────
function ThumbnailCard({
  camera,
  coachNumber,
  index,
  selected,
  onSelect,
}: {
  camera: Camera;
  coachNumber: string;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const isOnline = camera.status === "online";
  const isDegraded = camera.status === "degraded";

  return (
    <button
      type="button"
      data-ocid={`cameras.thumbnail.item.${index}`}
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-lg border overflow-hidden transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary/60 shadow-[0_0_0_2px_oklch(var(--primary)/0.25)] bg-primary/5"
          : "border-border bg-card hover:border-border/80 hover:bg-card/80",
      )}
    >
      {/* Mini feed */}
      <div className="relative aspect-video bg-muted overflow-hidden">
        {isOnline ? (
          <>
            <div
              className="absolute inset-0 opacity-60 bg-muted/30"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, transparent 0px, rgba(0,0,0,0.08) 1px, transparent 2px, transparent 4px)",
              }}
            />
            {/* Static YOLO overlay (non-animated for thumbnails) */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {[0, 1, 2]
                  .slice(0, Math.min(3, camera.detectionsPerFrame))
                  .map((i) => (
                    <div
                      key={i}
                      className="absolute border border-chart-1/60 rounded-sm"
                      style={{
                        width: 18 + i * 4,
                        height: 24 + i * 3,
                        top: -8 + i * 6,
                        left: -10 + i * 8,
                      }}
                    />
                  ))}
                <CameraIcon className="w-6 h-6 text-white/20" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isDegraded ? (
              <AlertCircle className="w-5 h-5 text-chart-2/60" />
            ) : (
              <WifiOff className="w-5 h-5 text-destructive/60" />
            )}
          </div>
        )}

        {/* Status dot */}
        <div className="absolute top-1.5 left-1.5">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isOnline
                ? "bg-chart-1 animate-pulse"
                : isDegraded
                  ? "bg-chart-2"
                  : "bg-destructive",
            )}
          />
        </div>

        {/* Selected indicator */}
        {selected && (
          <div className="absolute inset-0 ring-2 ring-primary/50 ring-inset rounded-lg" />
        )}
      </div>

      {/* Label */}
      <div className="px-2 py-1.5 flex items-center justify-between">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-foreground truncate">
            {camera.label}
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            C{coachNumber}
          </p>
        </div>
        {isOnline && (
          <span className="text-[10px] font-mono text-primary shrink-0 ml-1">
            {camera.detectionsPerFrame}p
          </span>
        )}
      </div>
    </button>
  );
}

// ─── Coach selector tab ───────────────────────────────────────────────────────
function CoachTab({
  coach,
  active,
  index,
  onSelect,
}: {
  coach: Coach;
  active: boolean;
  index: number;
  onSelect: () => void;
}) {
  const onlineCams = coach.cameras.filter((c) => c.status === "online").length;

  return (
    <button
      type="button"
      data-ocid={`cameras.coach_tab.item.${index}`}
      onClick={onSelect}
      className={cn(
        "relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground shadow-elevated"
          : "bg-card text-foreground border border-border hover:bg-muted/60",
      )}
    >
      <span className="font-mono text-xs opacity-60">{coach.number}</span>
      <span>{coach.class}</span>
      <span
        className={cn(
          "text-[10px] font-mono px-1 rounded",
          active
            ? "bg-primary-foreground/20 text-primary-foreground"
            : "bg-muted text-muted-foreground",
        )}
      >
        {onlineCams}/{coach.cameras.length}
      </span>
    </button>
  );
}

// ─── Detection stats panel ────────────────────────────────────────────────────
function DetectionStats({ coach }: { coach: Coach }) {
  const totalDetections = coach.cameras.reduce(
    (sum, c) => sum + c.detectionsPerFrame,
    0,
  );
  const occRate = getOccupancyRate(coach.detected, coach.capacity);

  const stats = [
    {
      label: "Live Detections",
      value: coach.detected,
      sub: "persons detected",
      icon: <Users className="w-4 h-4" />,
      color: "text-primary",
    },
    {
      label: "AI Frames/sec",
      value: `${totalDetections}`,
      sub: "detections active",
      icon: <Activity className="w-4 h-4" />,
      color: "text-chart-1",
    },
    {
      label: "Occupancy",
      value: `${occRate}%`,
      sub: `${coach.detected}/${coach.capacity} capacity`,
      icon: <Zap className="w-4 h-4" />,
      color:
        occRate >= 110
          ? "text-destructive"
          : occRate >= 85
            ? "text-chart-2"
            : "text-chart-1",
    },
    {
      label: "Cameras",
      value: `${coach.cameras.filter((c) => c.status === "online").length}/${coach.cameras.length}`,
      sub: "online",
      icon: <Eye className="w-4 h-4" />,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-2">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-lg border border-border bg-card px-3 py-2.5"
        >
          <div className={cn("flex items-center gap-1.5 mb-1", s.color)}>
            {s.icon}
            <span className="text-[10px] font-semibold text-label">
              {s.label}
            </span>
          </div>
          <p className="text-metric leading-none">{s.value}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
        </div>
      ))}
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────
export default function CamerasPage({ train }: CamerasPageProps) {
  const [activeCoachIdx, setActiveCoachIdx] = useState(0);
  const [activeCamIdx, setActiveCamIdx] = useState(0);

  const activeCoach = train.coaches[activeCoachIdx];
  const activeCamera = activeCoach?.cameras[activeCamIdx];

  // Reset camera selection when coach changes
  const handleCoachSelect = (idx: number) => {
    setActiveCoachIdx(idx);
    setActiveCamIdx(0);
  };

  // Global stats
  const allCameras = train.coaches.flatMap((c) => c.cameras);
  const onlineCount = allCameras.filter((c) => c.status === "online").length;
  const degradedCount = allCameras.filter(
    (c) => c.status === "degraded",
  ).length;
  const offlineCount = allCameras.filter((c) => c.status === "offline").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        data-ocid="cameras.page"
        className="flex items-start justify-between flex-wrap gap-3"
      >
        <div>
          <h2 className="font-display font-bold text-lg text-foreground">
            CCTV Monitoring
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {allCameras.length} cameras · YOLO v8 real-time detection overlay ·
            1920×1080 30 FPS
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div
            data-ocid="cameras.status.online"
            className="flex items-center gap-1.5"
          >
            <Wifi className="w-3.5 h-3.5 text-chart-1" />
            <span className="text-chart-1 font-medium">
              {onlineCount} online
            </span>
          </div>
          {degradedCount > 0 && (
            <div
              data-ocid="cameras.status.degraded"
              className="flex items-center gap-1.5"
            >
              <AlertCircle className="w-3.5 h-3.5 text-chart-2" />
              <span className="text-chart-2 font-medium">
                {degradedCount} degraded
              </span>
            </div>
          )}
          {offlineCount > 0 && (
            <div
              data-ocid="cameras.status.offline"
              className="flex items-center gap-1.5"
            >
              <WifiOff className="w-3.5 h-3.5 text-destructive" />
              <span className="text-destructive font-medium">
                {offlineCount} offline
              </span>
            </div>
          )}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-destructive/10 border border-destructive/30">
            <Radio className="w-3 h-3 text-destructive animate-pulse" />
            <span className="text-destructive text-[10px] font-semibold">
              LIVE
            </span>
          </div>
        </div>
      </div>

      {/* Coach selector */}
      <div
        data-ocid="cameras.coach_tabs"
        className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none"
      >
        <span className="text-[10px] text-label shrink-0">COACH</span>
        {train.coaches.map((coach, i) => (
          <CoachTab
            key={coach.id}
            coach={coach}
            active={i === activeCoachIdx}
            index={i + 1}
            onSelect={() => handleCoachSelect(i)}
          />
        ))}
      </div>

      {/* Main content — featured + sidebar */}
      {activeCoach && activeCamera && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Left — featured feed */}
          <div className="space-y-3">
            <FeaturedFeed
              camera={activeCamera}
              coachNumber={activeCoach.number}
            />

            {/* Camera thumbnails strip */}
            <div className="grid grid-cols-3 gap-2">
              {activeCoach.cameras.map((cam, i) => (
                <ThumbnailCard
                  key={cam.id}
                  camera={cam}
                  coachNumber={activeCoach.number}
                  index={i + 1}
                  selected={i === activeCamIdx}
                  onSelect={() => setActiveCamIdx(i)}
                />
              ))}
            </div>
          </div>

          {/* Right — stats + info panel */}
          <div className="space-y-3">
            {/* Coach info */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-elevated space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display font-semibold text-sm text-foreground">
                      Coach {activeCoach.number}
                    </h3>
                    <Badge
                      className={cn(
                        "text-[10px] h-4 px-1.5 border",
                        coachStatusBadgeCn(activeCoach.status),
                      )}
                    >
                      {activeCoach.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {activeCoach.class} Class · Capacity {activeCoach.capacity}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </div>

              <DetectionStats coach={activeCoach} />
            </div>

            {/* Active camera info */}
            <div className="rounded-xl border border-border bg-card p-4 shadow-elevated space-y-3">
              <div className="flex items-center gap-2">
                <CameraIcon className="w-4 h-4 text-primary" />
                <h3 className="font-display font-semibold text-sm text-foreground">
                  {activeCamera.label}
                </h3>
              </div>
              <div className="space-y-2 text-xs">
                {[
                  ["Camera ID", activeCamera.id],
                  ["Resolution", activeCamera.resolution],
                  ["Frame Rate", `${activeCamera.fps} FPS`],
                  [
                    "Status",
                    <span
                      key="status"
                      className={cameraStatusColor(activeCamera.status)}
                    >
                      {activeCamera.status.charAt(0).toUpperCase() +
                        activeCamera.status.slice(1)}
                    </span>,
                  ],
                  ["Last Frame", formatTimestamp(activeCamera.lastFrame)],
                  [
                    "Detections/Frame",
                    <span
                      key="det"
                      className="text-chart-1 font-mono font-bold"
                    >
                      {activeCamera.detectionsPerFrame}
                    </span>,
                  ],
                ].map(([key, val]) => (
                  <div
                    key={String(key)}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="text-muted-foreground">{key}</span>
                    <span className="font-mono text-foreground text-right truncate max-w-[120px]">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* YOLO model info */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Scan className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">
                  YOLO v8 Detection
                </span>
                <div className="ml-auto flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] font-mono text-primary">
                    ACTIVE
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[10px]">
                {[
                  ["Model", "YOLOv8n"],
                  ["Inference", "~12ms"],
                  ["Confidence", "0.82+"],
                  ["Class", "person"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-muted-foreground">{k}</span>
                    <span className="font-mono text-foreground">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
