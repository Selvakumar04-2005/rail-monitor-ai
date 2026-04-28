import { getOccupancyRate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Alert, Train } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface AnalyticsPageProps {
  train: Train;
  alerts: Alert[];
  onResolveAlert: (id: string) => void;
  onRefresh: () => void;
}

const COLORS = [
  "oklch(0.72 0.18 180)",
  "oklch(0.68 0.2 85)",
  "oklch(0.62 0.22 25)",
  "oklch(0.65 0.18 145)",
  "oklch(0.75 0.18 265)",
  "oklch(0.7 0.15 60)",
];

export default function AnalyticsPage({ train }: AnalyticsPageProps) {
  const coachData = train.coaches.map((c) => ({
    name: c.number,
    detected: c.detected,
    reserved: c.reserved,
    capacity: c.capacity,
    rate: getOccupancyRate(c.detected, c.capacity),
  }));

  const alertTrend = Array.from({ length: 12 }, (_, i) => ({
    time: `${String(Date.now() - (11 - i) * 300_000).slice(-5)}`,
    label: `-${(11 - i) * 5}m`,
    alerts: Math.floor(Math.random() * 4),
    critical: Math.random() > 0.7 ? 1 : 0,
  }));

  const classDistribution = [
    {
      name: "1A",
      value: train.coaches
        .filter((c) => c.class === "1A")
        .reduce((s, c) => s + c.detected, 0),
    },
    {
      name: "2A",
      value: train.coaches
        .filter((c) => c.class === "2A")
        .reduce((s, c) => s + c.detected, 0),
    },
    {
      name: "3A",
      value: train.coaches
        .filter((c) => c.class === "3A")
        .reduce((s, c) => s + c.detected, 0),
    },
    {
      name: "SL",
      value: train.coaches
        .filter((c) => c.class === "SL")
        .reduce((s, c) => s + c.detected, 0),
    },
    {
      name: "GEN",
      value: train.coaches
        .filter((c) => c.class === "GEN")
        .reduce((s, c) => s + c.detected, 0),
    },
  ].filter((d) => d.value > 0);

  const tooltipStyle = {
    backgroundColor: "oklch(0.18 0.015 260)",
    border: "1px solid oklch(0.28 0.015 260)",
    borderRadius: "8px",
    color: "oklch(0.94 0.01 260)",
    fontSize: "11px",
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-display font-bold text-lg text-foreground">
          Analytics
        </h2>
        <p className="text-xs text-muted-foreground">
          Real-time journey analytics for Train {train.number}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Occupancy by coach */}
        <div className="rounded-xl border border-border bg-card shadow-elevated p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm text-foreground">
            Occupancy by Coach
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={coachData}
              barGap={2}
              margin={{ top: 0, right: 0, bottom: 0, left: -10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.015 260)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(0.54 0.01 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.54 0.01 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar
                dataKey="reserved"
                fill="oklch(0.72 0.18 180 / 0.4)"
                radius={[2, 2, 0, 0]}
                name="Reserved"
              />
              <Bar
                dataKey="detected"
                fill="oklch(0.72 0.18 180)"
                radius={[2, 2, 0, 0]}
                name="Detected"
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-primary/40" />
              <span>Reserved</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-sm bg-primary" />
              <span>AI Detected</span>
            </div>
          </div>
        </div>

        {/* Occupancy rate by coach */}
        <div className="rounded-xl border border-border bg-card shadow-elevated p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm text-foreground">
            Occupancy Rate (%)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={coachData}
              margin={{ top: 0, right: 0, bottom: 0, left: -10 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.015 260)"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "oklch(0.54 0.01 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.54 0.01 260)" }}
                axisLine={false}
                tickLine={false}
                domain={[0, 130]}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(v) => [`${v}%`, "Occupancy"]}
              />
              {coachData.map((entry) => (
                <Bar
                  key={entry.name}
                  dataKey="rate"
                  radius={[2, 2, 0, 0]}
                  data={[entry]}
                  fill={
                    entry.rate >= 110
                      ? "oklch(0.62 0.22 25)"
                      : entry.rate >= 85
                        ? "oklch(0.68 0.2 85)"
                        : "oklch(0.65 0.18 145)"
                  }
                  name="Rate"
                />
              ))}
              <Bar dataKey="rate" radius={[2, 2, 0, 0]} name="Occupancy %">
                {coachData.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.rate >= 110
                        ? "oklch(0.62 0.22 25)"
                        : entry.rate >= 85
                          ? "oklch(0.68 0.2 85)"
                          : "oklch(0.65 0.18 145)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-1 text-[10px]">
            <div className="w-16 h-1 rounded bg-destructive opacity-60" />
            <span className="text-muted-foreground">100% threshold</span>
          </div>
        </div>

        {/* Alert trend */}
        <div className="rounded-xl border border-border bg-card shadow-elevated p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm text-foreground">
            Alert Activity (Last Hour)
          </h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart
              data={alertTrend}
              margin={{ top: 4, right: 4, bottom: 0, left: -20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.28 0.015 260)"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 9, fill: "oklch(0.54 0.01 260)" }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "oklch(0.54 0.01 260)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="oklch(0.68 0.2 85)"
                strokeWidth={2}
                dot={false}
                name="Alerts"
              />
              <Line
                type="monotone"
                dataKey="critical"
                stroke="oklch(0.62 0.22 25)"
                strokeWidth={2}
                dot={false}
                name="Critical"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Class distribution */}
        <div className="rounded-xl border border-border bg-card shadow-elevated p-4 space-y-3">
          <h3 className="font-display font-semibold text-sm text-foreground">
            Passenger Class Distribution
          </h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie
                  data={classDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {classDistribution.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {classDistribution.map((entry, i) => (
                <div
                  key={entry.name}
                  className="flex items-center gap-2 text-xs"
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{entry.name}</span>
                  <span className="font-mono font-semibold text-foreground ml-auto">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
