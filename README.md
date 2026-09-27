# CNC Pattern Generator

Single-file web app that generates parametric wave/weave patterns for
CNC-cut decorative panels (MDF, plexiglass, plywood) and exports them as
SVG or DXF for CAM software.

Open `cnc-pattern-generator.html` directly in a browser — no build step, no
dependencies, no server required.

## Features

- **Panel size** in millimeters or inches.
- **Wave settings**: step, gap, wave offset, width/height scale, and a
  computed (read-only) band pitch ("Offset").
- **6 pattern families** (`Wave 1`–`Wave 6`), from simple zigzag weaves to
  the classic crossing "eye / lens" pattern (`Wave 5`, the reference
  preset from the original desktop tool this reproduces).
- **Multi-panel layout** in a single row, with per-panel manual nudge
  (dx/dy) on top of the automatic position, and an optional "Continuous
  Pattern" mode that carries the wave phase across panel boundaries so
  adjacent panels tile seamlessly.
- **Zoom** control for the live SVG preview.
- **Export to SVG** (vector paths, millimeter-scaled viewBox) and
  **Export to DXF** (ASCII R12, `LWPOLYLINE` entities on `PANEL` and
  `WAVE` layers) for import into CAM / CNC software.

## Core algorithm

Each pattern is a set of horizontal "bands" stacked down the panel height.
Each band contains `n` sine-wave lines; the look comes from how amplitude
varies across those `n` lines:

- `taper: 'lens'` — amplitude goes from `+A` to `-A` linearly across the
  `n` lines, so lines cross and pinch at shared nodes (the "eye" shape).
- `taper: 'zigzag'` — amplitude alternates `+A / -A` with no
  interpolation (simple over/under weave, no pinch points).

Per-line formula (local coordinates, panel-relative):

```
y(x) = yBase + Ak * sin(2π·(globalX + x)/λ + parity + phaseShift)
```

- `λ` (wavelength) = `2 * step * (widthScale/100)`
- `A` (amplitude) = `0.9 * step * (heightScale/100)`
- `parity` = `π` on every other band, creating the brick-like offset
  between rows
- `phaseShift` = `(waveOffset / λ) * 2π`
- `globalX` = the panel's absolute X position when "Continuous Pattern"
  is on, or `0` per panel when it's off

Band pitch (vertical spacing between band centers), shown read-only as
**Offset**:

```
bandPitch = (n - 1) * step + gap
```

Lines are sampled along X and clipped vertically to `[0, panelHeight]`,
which can split one sine into multiple polyline segments at panel edges.

## Pattern families

| id    | n | taper   | look                          |
|-------|---|---------|-------------------------------|
| wave1 | 2 | zigzag  | simple crossing weave         |
| wave2 | 3 | zigzag  | triple zigzag                 |
| wave3 | 4 | lens    | four-line lens weave          |
| wave4 | 5 | zigzag  | diamond zigzag                |
| wave5 | 3 | lens    | classic eye/lens (reference)  |
| wave6 | 6 | lens    | dense six-line lens weave     |

Adding a new family only requires adding one `{ n, taper }` entry to the
`FAMILIES` array in the script — nothing else needs to change.

## Known gaps / ideas for a future pass

- Panel layout is currently 1D (single row) — no grid/rows, no
  drag-to-reposition.
- No persistence (reload loses all settings/panels).
- DXF export is minimal R12 (two layers, no color/linetype control).
- No collision/overlap warnings when Step is smaller than a plausible
  router bit diameter.
- No image-modulated amplitude (grayscale-driven relief).
- No undo/history.
