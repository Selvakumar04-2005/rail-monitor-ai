# Design Brief

## Direction

**Railway Command Center** — A dark, industrial-utilitarian monitoring dashboard built for railway administrators to track passenger occupancy, alert status, and AI-powered safety insights in real time.

## Tone

Purposeful precision with zero decoration. Railway-inspired semantics (teal = operational normal, amber = caution, red = critical) create instant situational awareness without cognitive overhead.

## Differentiation

Railway-specific status colors (teal/amber/red alignment with transport safety standards) applied consistently across occupancy visualizations, alerts, and live data streams for unambiguous system status recognition.

## Color Palette

| Token          | OKLCH           | Role                                      |
|----------------|-----------------|-------------------------------------------|
| background     | 0.14 0.01 260   | Deep slate primary surface                |
| foreground     | 0.94 0.01 260   | High-contrast text on dark background     |
| card           | 0.18 0.015 260  | Elevated content containers               |
| primary        | 0.72 0.18 180   | Teal accent—operational normal state      |
| accent         | 0.72 0.18 180   | Same as primary; teal for CTAs            |
| muted          | 0.22 0.02 260   | Secondary neutral—disabled/muted text     |
| destructive    | 0.62 0.22 25    | Red—critical alerts & overcrowding        |
| chart-1        | 0.72 0.18 180   | Teal—occupancy safe zones                 |
| chart-2        | 0.68 0.2 85     | Amber—warning occupancy levels            |
| chart-3        | 0.62 0.22 25    | Red—critical/overcrowded status           |
| chart-4        | 0.65 0.18 145   | Green—positive/resolved states            |
| chart-5        | 0.75 0.18 265   | Purple—secondary data streams              |

## Typography

- **Display:** Space Grotesk — geometric, confident, headings and critical labels. All-caps labels for section headers.
- **Body:** DM Sans — clean, highly legible, all body copy, data values, and UI labels.
- **Mono:** Geist Mono — numerical metrics, timestamps, system IDs.
- **Scale:** Hero `text-4xl font-bold tracking-tight` | H2 `text-2xl font-bold tracking-tight` | Label `text-xs font-semibold tracking-widest uppercase` | Body `text-base font-normal`

## Elevation & Depth

Cards elevated via `shadow-elevated` with subtle teal/amber/red border accents to signal status. Hover state lifts via `shadow-card-hover` and slight scale increase. No atmospheric effects; depth is structural only.

## Structural Zones

| Zone      | Background      | Border              | Notes                                                     |
|-----------|-----------------|---------------------|-----------------------------------------------------------|
| Header    | card (0.18)     | border (0.28)       | Logo + admin name + time. Sticky top. Border-bottom only. |
| Sidebar   | sidebar (0.16)  | sidebar-border      | Navigation icons, train selector. Fixed left.             |
| Content   | background      | —                   | Main grid area. Alternates: card bg for sections.         |
| Alert     | card + red tint  | destructive accent  | Floating or pinned alert panel. High z-index.             |
| Footer    | card            | border (top)        | Minimal; metadata & sync status.                          |

## Spacing & Rhythm

Compact density with tight vertical rhythm (gap-2 between elements, gap-4 between sections). Sidebar: 16px icon padding. Cards: 16px internal padding, 12px gaps between cards in grid. Status badges: 4px padding with 2px border.

## Component Patterns

- **Buttons:** Teal primary, slate hover, 8px border-radius. No shadow by default; elevated on hover via `shadow-elevated`. Small variants 32px height, regular 40px.
- **Cards:** 12px border-radius, slate background (0.18), border-border. Coach cards: status indicator left border (4px, color by occupancy). Alert cards: red left border with `animate-pulse-subtle`.
- **Badges:** Rounded-full, 3px padding, font-mono for metrics. Color by status: teal safe, amber warning, red critical.
- **Occupancy bars:** Thin progress bar (4px height) with gradient from teal → amber → red. No labels; values shown separately.

## Motion

- **Entrance:** Fade in + 2px downward slide over 200ms easing ease-out (data loading).
- **Hover:** Smooth transition-smooth (300ms) on background color, border, shadow. Slight scale-105 on card hover.
- **Decorative:** Alerts pulse via `animate-pulse-subtle` (2s cycle). No bouncy animations; all motion feels mechanical/utilitarian.

## Constraints

- No full-width color backgrounds; always use card containers with clear zones.
- All text must maintain foreground/background contrast ≥ 6:1 (AA+).
- Status colors (chart-1/2/3) are sacred; never reuse for non-status messaging.
- Icons: Lucide only. All icons inherit foreground color unless status-colored.

## Signature Detail

Railway-specific color semantics (teal operational / amber caution / red critical) applied consistently to every occupancy metric, alert severity, and system state—creating instant, unambiguous recognition of system health without reading text.
