import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Camera,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Train,
  Zap,
} from "lucide-react";

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  alertCount?: number;
  collapsed?: boolean;
}

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "coaches", label: "Coach Monitor", icon: Train },
  { id: "cameras", label: "CCTV Feeds", icon: Camera },
  { id: "alerts", label: "Alerts", icon: AlertTriangle },
  { id: "reports", label: "AI Reports", icon: FileText },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function Sidebar({
  activePage,
  onNavigate,
  alertCount = 0,
  collapsed = false,
}: SidebarProps) {
  const { logout, identity } = useAuth();

  const principalShort =
    identity?.getPrincipal().toString().slice(0, 8) ?? "unknown";

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-sidebar border-r border-sidebar-border transition-smooth",
        collapsed ? "w-16" : "w-60",
      )}
    >
      {/* Brand */}
      <div
        className={cn(
          "flex items-center gap-3 px-4 py-4 border-b border-sidebar-border",
          collapsed && "justify-center px-2",
        )}
      >
        <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/20 border border-primary/40 shrink-0">
          <Zap className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-display font-bold text-sm text-sidebar-foreground truncate">
              RailWatch
            </p>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">
              Monitoring
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          const hasBadge = item.id === "alerts" && alertCount > 0;

          return (
            <button
              key={item.id}
              type="button"
              data-ocid={`nav.${item.id}_link`}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth group",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-sidebar-primary/15 text-sidebar-primary border border-sidebar-primary/20"
                  : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent",
              )}
            >
              <Icon
                className={cn(
                  "w-4 h-4 shrink-0",
                  isActive
                    ? "text-sidebar-primary"
                    : "text-muted-foreground group-hover:text-sidebar-foreground",
                )}
              />
              {!collapsed && (
                <>
                  <span className="flex-1 text-left truncate">
                    {item.label}
                  </span>
                  {hasBadge && (
                    <Badge className="h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground border-0 animate-pulse-subtle">
                      {alertCount > 99 ? "99+" : alertCount}
                    </Badge>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3 h-3 text-sidebar-primary/60" />
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Activity indicator */}
      {!collapsed && (
        <div className="px-3 py-2 mx-2 mb-2 rounded-md bg-chart-1/5 border border-chart-1/15">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse-subtle" />
            <span className="text-[11px] text-chart-1 font-medium">
              Live · 5s refresh
            </span>
            <Activity className="w-3 h-3 text-chart-1 ml-auto" />
          </div>
        </div>
      )}

      <Separator className="bg-sidebar-border" />

      {/* Bottom actions */}
      <div
        className={cn(
          "p-2 space-y-0.5",
          collapsed && "flex flex-col items-center",
        )}
      >
        <button
          type="button"
          data-ocid="nav.settings_link"
          onClick={() => onNavigate("settings")}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-smooth",
            collapsed && "justify-center px-2",
            activePage === "settings"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent",
          )}
        >
          <Settings className="w-4 h-4 shrink-0" />
          {!collapsed && <span className="truncate">Settings</span>}
        </button>

        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-sidebar-accent/50 mt-1">
            <div className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-bold text-primary uppercase">
                AD
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-sidebar-foreground truncate">
                Admin
              </p>
              <p className="text-[10px] text-muted-foreground truncate font-mono">
                {principalShort}…
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              data-ocid="nav.logout_button"
              onClick={logout}
              className="h-6 w-6 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-3 h-3" />
            </Button>
          </div>
        )}

        {collapsed && (
          <Button
            variant="ghost"
            size="icon"
            data-ocid="nav.logout_button"
            onClick={logout}
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        )}
      </div>
    </aside>
  );
}
