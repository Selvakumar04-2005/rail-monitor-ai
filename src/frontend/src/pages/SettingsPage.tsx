import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import type { Alert, Train } from "@/types";
import {
  Clock,
  LogOut,
  RefreshCw,
  Shield,
  Train as TrainIcon,
  Zap,
} from "lucide-react";

interface SettingsPageProps {
  train: Train;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

export default function SettingsPage({ train }: SettingsPageProps) {
  const { identity, logout } = useAuth();
  const principal = identity?.getPrincipal().toString() ?? "Unknown";

  return (
    <div className="max-w-2xl space-y-5">
      <div>
        <h2 className="font-display font-bold text-lg text-foreground">
          Settings
        </h2>
        <p className="text-xs text-muted-foreground">
          System configuration and session management
        </p>
      </div>

      {/* Session */}
      <div className="rounded-xl border border-border bg-card shadow-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            Session & Authentication
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-1">
            <p className="text-label">Principal ID</p>
            <p className="font-mono text-xs text-foreground break-all bg-muted p-2 rounded-md border border-border">
              {principal}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse-subtle" />
              <span className="text-xs text-chart-1 font-medium">
                Internet Identity — Verified
              </span>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="gap-2 h-8 text-xs"
              data-ocid="settings.logout_button"
              onClick={logout}
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Train config */}
      <div className="rounded-xl border border-border bg-card shadow-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <TrainIcon className="w-4 h-4 text-primary" />
            Active Train Configuration
          </h3>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3 text-xs">
          {[
            { label: "Train Number", value: train.number },
            { label: "Train Name", value: train.name },
            { label: "Origin", value: train.origin },
            { label: "Destination", value: train.destination },
            { label: "Coaches", value: `${train.coaches.length}` },
            {
              label: "Cameras",
              value: `${train.coaches.flatMap((c) => c.cameras).length}`,
            },
          ].map((item) => (
            <div key={item.label}>
              <p className="text-label">{item.label}</p>
              <p className="font-medium text-foreground mt-0.5">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* System info */}
      <div className="rounded-xl border border-border bg-card shadow-elevated">
        <div className="p-4 border-b border-border">
          <h3 className="font-display font-semibold text-sm text-foreground flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            System Information
          </h3>
        </div>
        <div className="p-4 space-y-3">
          {[
            {
              label: "Platform",
              value: "Internet Computer (ICP)",
              badge: "Sovereign",
            },
            {
              label: "AI Detection",
              value: "YOLO v8 Simulation",
              badge: "Active",
            },
            {
              label: "Report Engine",
              value: "Google Gemini AI",
              badge: "Connected",
            },
            { label: "Refresh Interval", value: "5 seconds", badge: null },
            {
              label: "Camera Resolution",
              value: "1920×1080 @ 30fps",
              badge: null,
            },
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-3 py-1">
              <div className="flex-1 min-w-0">
                <p className="text-label">{item.label}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">
                  {item.value}
                </p>
              </div>
              {item.badge && (
                <Badge className="text-[10px] px-1.5 border bg-chart-1/10 text-chart-1 border-chart-1/30">
                  {item.badge}
                </Badge>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Branding */}
      <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors duration-200"
          >
            Built with love using caffeine.ai
          </a>
        </p>
      </div>
    </div>
  );
}
