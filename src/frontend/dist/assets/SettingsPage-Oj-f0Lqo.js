import { aL as useAuth, j as jsxRuntimeExports, aG as Shield, d as Button, aM as LogOut, T as TramFront, Z as Zap, B as Badge } from "./index-DYLu-g8B.js";
function SettingsPage({ train }) {
  const { identity, logout } = useAuth();
  const principal = (identity == null ? void 0 : identity.getPrincipal().toString()) ?? "Unknown";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-2xl space-y-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display font-bold text-lg text-foreground", children: "Settings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "System configuration and session management" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Shield, { className: "w-4 h-4 text-primary" }),
        "Session & Authentication"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: "Principal ID" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono text-xs text-foreground break-all bg-muted p-2 rounded-md border border-border", children: principal })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1.5 h-1.5 rounded-full bg-chart-1 animate-pulse-subtle" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-chart-1 font-medium", children: "Internet Identity — Verified" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "destructive",
              size: "sm",
              className: "gap-2 h-8 text-xs",
              "data-ocid": "settings.logout_button",
              onClick: logout,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "w-3.5 h-3.5" }),
                "Sign Out"
              ]
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TramFront, { className: "w-4 h-4 text-primary" }),
        "Active Train Configuration"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 grid grid-cols-2 gap-3 text-xs", children: [
        { label: "Train Number", value: train.number },
        { label: "Train Name", value: train.name },
        { label: "Origin", value: train.origin },
        { label: "Destination", value: train.destination },
        { label: "Coaches", value: `${train.coaches.length}` },
        {
          label: "Cameras",
          value: `${train.coaches.flatMap((c) => c.cameras).length}`
        }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: item.label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium text-foreground mt-0.5", children: item.value })
      ] }, item.label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border border-border bg-card shadow-elevated", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b border-border", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display font-semibold text-sm text-foreground flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Zap, { className: "w-4 h-4 text-primary" }),
        "System Information"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 space-y-3", children: [
        {
          label: "Platform",
          value: "Internet Computer (ICP)",
          badge: "Sovereign"
        },
        {
          label: "AI Detection",
          value: "YOLO v8 Simulation",
          badge: "Active"
        },
        {
          label: "Report Engine",
          value: "Google Gemini AI",
          badge: "Connected"
        },
        { label: "Refresh Interval", value: "5 seconds", badge: null },
        {
          label: "Camera Resolution",
          value: "1920×1080 @ 30fps",
          badge: null
        }
      ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 py-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-label", children: item.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs font-medium text-foreground mt-0.5", children: item.value })
        ] }),
        item.badge && /* @__PURE__ */ jsxRuntimeExports.jsx(Badge, { className: "text-[10px] px-1.5 border bg-chart-1/10 text-chart-1 border-chart-1/30", children: item.badge })
      ] }, item.label)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border border-border bg-muted/30 p-4 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
      "© ",
      (/* @__PURE__ */ new Date()).getFullYear(),
      ".",
      " ",
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "hover:text-primary transition-colors duration-200",
          children: "Built with love using caffeine.ai"
        }
      )
    ] }) })
  ] });
}
export {
  SettingsPage as default
};
