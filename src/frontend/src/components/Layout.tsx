import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import type { Alert, Train } from "@/types";
import { useCallback, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  activePage: string;
  onNavigate: (page: string) => void;
  train: Train;
  alerts: Alert[];
  isRefreshing: boolean;
  lastRefresh: number;
}

export function Layout({
  children,
  activePage,
  onNavigate,
  train,
  alerts,
  isRefreshing,
  lastRefresh,
}: LayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeAlertCount = alerts.filter((a) => a.status === "active").length;

  const handleMenuToggle = useCallback(() => {
    // On mobile (< md), open the sheet drawer; on desktop, collapse sidebar
    if (window.innerWidth < 768) {
      setMobileOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  }, []);

  const handleAlertClick = useCallback(() => {
    onNavigate("alerts");
  }, [onNavigate]);

  const handleMobileNavigate = useCallback(
    (page: string) => {
      onNavigate(page);
      setMobileOpen(false);
    },
    [onNavigate],
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:flex flex-col transition-smooth shrink-0",
          sidebarCollapsed ? "w-16" : "w-60",
        )}
      >
        <Sidebar
          activePage={activePage}
          onNavigate={onNavigate}
          alertCount={activeAlertCount}
          collapsed={sidebarCollapsed}
        />
      </div>

      {/* Mobile sheet drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="p-0 w-60 bg-sidebar border-sidebar-border"
          data-ocid="layout.mobile_nav_sheet"
        >
          <Sidebar
            activePage={activePage}
            onNavigate={handleMobileNavigate}
            alertCount={activeAlertCount}
            collapsed={false}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Header
          trainName={train.name}
          trainNumber={train.number}
          currentStation={train.currentStation}
          nextStation={train.nextStation}
          status={train.status}
          delayMinutes={train.delayMinutes}
          alertCount={activeAlertCount}
          isRefreshing={isRefreshing}
          lastRefresh={lastRefresh}
          onMenuToggle={handleMenuToggle}
          onAlertClick={handleAlertClick}
          activePage={activePage}
        />

        <main className="flex-1 overflow-y-auto bg-background">
          <div className="p-4 md:p-6 min-h-full">{children}</div>
        </main>

        {/* Footer */}
        <footer className="shrink-0 border-t border-border bg-muted/40 px-4 py-2 flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground">
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
          <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-mono">
            <span>YOLO v8</span>
            <span className="text-border">|</span>
            <span>Gemini AI</span>
            <span className="text-border">|</span>
            <span>IC Network</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
