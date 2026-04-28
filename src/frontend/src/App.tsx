import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { useAuth } from "@/hooks/useAuth";
import { getCoachStatusFromOccupancy } from "@/lib/utils";
import type { Alert, Camera, Coach, Train } from "@/types";
import { Loader2, Shield, Zap } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ─── Lazy page imports ────────────────────────────────────────────────────────
import { Suspense, lazy } from "react";
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const CoachesPage = lazy(() => import("@/pages/CoachesPage"));
const CamerasPage = lazy(() => import("@/pages/CamerasPage"));
const AlertsPage = lazy(() => import("@/pages/AlertsPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const AnalyticsPage = lazy(() => import("@/pages/AnalyticsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));

// ─── Mock data generators ─────────────────────────────────────────────────────
function generateCamera(coachId: string, idx: number): Camera {
  const statuses: Camera["status"][] = [
    "online",
    "online",
    "online",
    "degraded",
    "online",
  ];
  return {
    id: `cam-${coachId}-${idx}`,
    coachId,
    label: idx === 0 ? "Entry/Exit" : idx === 1 ? "Mid Section" : "Vestibule",
    status: statuses[Math.floor(Math.random() * statuses.length)],
    fps: 30,
    resolution: "1920x1080",
    detectionsPerFrame: Math.floor(Math.random() * 12) + 1,
    lastFrame: Date.now() - Math.floor(Math.random() * 3000),
  };
}

const COACH_CLASSES: Coach["class"][] = ["1A", "2A", "3A", "SL", "GEN", "GEN"];
const COACH_CAPACITIES = { "1A": 24, "2A": 46, "3A": 64, SL: 72, GEN: 90 };

function generateCoaches(): Coach[] {
  return Array.from({ length: 6 }, (_, i) => {
    const cls = COACH_CLASSES[i];
    const capacity = COACH_CAPACITIES[cls];
    const reserved = Math.floor(capacity * (0.6 + Math.random() * 0.35));
    const detected = Math.max(
      0,
      reserved + Math.floor((Math.random() - 0.3) * 20),
    );
    const coachId = `coach-${i + 1}`;
    return {
      id: coachId,
      number: `C${String(i + 1).padStart(2, "0")}`,
      class: cls,
      capacity,
      reserved,
      detected,
      status: getCoachStatusFromOccupancy(detected, capacity),
      cameras: Array.from({ length: 3 }, (__, j) => generateCamera(coachId, j)),
      lastUpdated: Date.now() - Math.floor(Math.random() * 5000),
    };
  });
}

const INITIAL_TRAIN: Train = {
  id: "train-12345",
  number: "12345",
  name: "Rajdhani Express",
  origin: "New Delhi",
  destination: "Mumbai Central",
  status: "on-time",
  departureTime: "16:35",
  arrivalTime: "08:15",
  currentStation: "Bhopal Jn",
  nextStation: "Itarsi Jn",
  speed: 118,
  delayMinutes: 0,
  coaches: generateCoaches(),
};

function generateAlerts(coaches: Coach[]): Alert[] {
  const alerts: Alert[] = [];
  let id = 1;
  for (const coach of coaches) {
    const rate = Math.round((coach.detected / coach.capacity) * 100);
    if (rate >= 110) {
      alerts.push({
        id: `alert-${id++}`,
        coachId: coach.id,
        coachNumber: coach.number,
        severity: "critical",
        status: "active",
        message: `Coach ${coach.number} severely overcrowded`,
        details: `Detected ${coach.detected} passengers vs capacity of ${coach.capacity} (${rate}% occupancy). Immediate action required.`,
        timestamp: Date.now() - Math.floor(Math.random() * 120_000),
      });
    } else if (rate >= 90) {
      alerts.push({
        id: `alert-${id++}`,
        coachId: coach.id,
        coachNumber: coach.number,
        severity: "warning",
        status: "active",
        message: `Coach ${coach.number} nearing capacity`,
        details: `Detected ${coach.detected} passengers vs capacity of ${coach.capacity} (${rate}% occupancy). Monitor closely.`,
        timestamp: Date.now() - Math.floor(Math.random() * 300_000),
      });
    }
  }
  // Add some historical resolved alerts
  alerts.push({
    id: `alert-${id++}`,
    coachId: "coach-1",
    coachNumber: "C01",
    severity: "warning",
    status: "resolved",
    message: "Coach C01 crowding resolved",
    details: "Occupancy normalized after passenger redistribution.",
    timestamp: Date.now() - 1_800_000,
    resolvedAt: Date.now() - 1_200_000,
    resolvedBy: "Admin",
  });
  return alerts;
}

// ─── Auth screen ──────────────────────────────────────────────────────────────
function LoginScreen() {
  const { login, isLoading } = useAuth();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Zap className="w-8 h-8 text-primary" />
            </div>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              RailWatch
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Railway Passenger Monitoring System
            </p>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-elevated space-y-5">
          <div className="space-y-1">
            <h2 className="font-display font-semibold text-foreground">
              Admin Access
            </h2>
            <p className="text-xs text-muted-foreground">
              Authenticate with Internet Identity to access the monitoring
              dashboard.
            </p>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <Shield className="w-4 h-4 text-chart-1 shrink-0" />
            <div>
              <p className="text-xs font-medium text-foreground">
                Internet Identity
              </p>
              <p className="text-[11px] text-muted-foreground">
                Decentralized · Passwordless · Sovereign
              </p>
            </div>
          </div>

          <Button
            className="w-full font-medium"
            data-ocid="login.submit_button"
            onClick={login}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Authenticating…
              </>
            ) : (
              <>
                <Shield className="w-4 h-4 mr-2" />
                Sign in with Internet Identity
              </>
            )}
          </Button>
        </div>

        <p className="text-center text-[11px] text-muted-foreground">
          Restricted to authorized railway personnel only
        </p>
      </div>
    </div>
  );
}

// ─── Loading fallback ─────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { isAuthenticated, isLoading } = useAuth();
  const [activePage, setActivePage] = useState("dashboard");
  const [train, setTrain] = useState<Train>(INITIAL_TRAIN);
  const [alerts, setAlerts] = useState<Alert[]>(() =>
    generateAlerts(INITIAL_TRAIN.coaches),
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // ── 5-second auto-refresh ───────────────────────────────────────────────────
  const refresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setTrain((prev) => {
        const coaches = prev.coaches.map((coach) => {
          const delta = Math.floor((Math.random() - 0.4) * 6);
          const detected = Math.max(
            0,
            Math.min(coach.capacity + 20, coach.detected + delta),
          );
          return {
            ...coach,
            detected,
            status: getCoachStatusFromOccupancy(detected, coach.capacity),
            cameras: coach.cameras.map((cam) => ({
              ...cam,
              detectionsPerFrame: Math.max(
                0,
                cam.detectionsPerFrame + Math.floor((Math.random() - 0.5) * 3),
              ),
              lastFrame: Date.now(),
            })),
            lastUpdated: Date.now(),
          };
        });
        return {
          ...prev,
          coaches,
          speed: Math.max(
            60,
            Math.min(130, prev.speed + Math.floor((Math.random() - 0.5) * 10)),
          ),
        };
      });
      setAlerts((prev) => {
        const filtered = prev.filter(
          (a) => a.status === "resolved" || Math.random() > 0.05,
        );
        return filtered;
      });
      setIsRefreshing(false);
      setLastRefresh(Date.now());
    }, 400);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [isAuthenticated, refresh]);

  const handleResolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId
          ? {
              ...a,
              status: "resolved" as const,
              resolvedAt: Date.now(),
              resolvedBy: "Admin",
            }
          : a,
      ),
    );
    toast.success("Alert resolved", {
      description: "Alert has been marked as resolved.",
    });
  }, []);

  // ── Auth loading ────────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-display">
            Initializing RailWatch…
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <Toaster theme="dark" position="bottom-right" />
      </>
    );
  }

  // ── Render page ─────────────────────────────────────────────────────────────
  const pageProps = {
    train,
    alerts,
    onResolveAlert: handleResolveAlert,
    onRefresh: refresh,
  };

  return (
    <>
      <Layout
        activePage={activePage}
        onNavigate={setActivePage}
        train={train}
        alerts={alerts}
        isRefreshing={isRefreshing}
        lastRefresh={lastRefresh}
      >
        <Suspense fallback={<PageLoader />}>
          {activePage === "dashboard" && <DashboardPage {...pageProps} />}
          {activePage === "coaches" && <CoachesPage {...pageProps} />}
          {activePage === "cameras" && <CamerasPage {...pageProps} />}
          {activePage === "alerts" && <AlertsPage {...pageProps} />}
          {activePage === "reports" && <ReportsPage {...pageProps} />}
          {activePage === "analytics" && <AnalyticsPage {...pageProps} />}
          {activePage === "settings" && <SettingsPage {...pageProps} />}
        </Suspense>
      </Layout>
      <Toaster theme="dark" position="bottom-right" />
    </>
  );
}
