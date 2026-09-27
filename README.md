# CNC Pattern Generator

Single-file web app that generates parametric wave/weave patterns for
CNC-cut decorative panels (MDF, plexiglass, plywood) and exports them as
SVG or DXF for CAM software.

Open `cnc-pattern-generator.html` directly in a browser — no build step, no
dependencies, no server required.

## Features

- **Panel size** in millimeters or inches.
- **7 pattern types**, 33 motifs total, each built on different math —
  not just sine waves:
  - **Wave / Weave** (6 motifs) — sine bands, from simple zigzag weaves
    to the classic crossing "eye / lens" pattern (`Wave 5`, the
    reference preset from the original desktop tool this reproduces).
  - **Lissajous Curves** (6 motifs) — parametric `x=sin(a·t+phase)`,
    `y=sin(b·t)` closed loops tiled on a grid, one integer frequency
    ratio per motif (3:2, 5:4, 2:1, 5:2, 7:6, 4:3).
  - **Rose Curves** (6 motifs) — polar rhodonea curves `r=cos(k·θ)`,
    tiled on a staggered grid so rosettes interlock.
  - **Spirals** (5 motifs) — Archimedean (linear radius) and
    logarithmic (exponential radius) spirals, 1–3 interleaved arms.
  - **Truchet Tiles** (3 motifs) — each grid tile gets a deterministic,
    seeded pseudo-random orientation of arcs or diagonals, giving a
    non-repeating all-over texture from a tiny reproducible rule.
  - **Zellige Star Lattice** (4 motifs) — N-point star polygons on a
    triangular grid, in the spirit of Moroccan zellige / Islamic
    geometric star motifs (5/6/8/12-point).
  - **Hex Honeycomb** (3 motifs) — proper edge-to-edge flat-top hexagon
    tiling, with optional inner hexagon or radial struts.

  The sidebar's 6 numeric knobs (Step, Gap, Offset, Wave Offset, Width
  Scale %, Height Scale %) are shared across all pattern types but are
  relabelled per type (e.g. "Wave Offset" becomes "Random Seed" for
  Truchet tiles, "Rotation (deg)" for rose curves/spirals/zellige).
- **Multi-panel layout** in a single row, with per-panel manual nudge
  (dx/dy) on top of the automatic position, and an optional "Continuous
  Pattern" mode that keeps every pattern type's grid/phase aligned across
  panel boundaries so adjacent panels tile seamlessly.
- **Zoom** control for the live SVG preview.
- **Export to SVG** (vector paths, millimeter-scaled viewBox) and
  **Export to DXF** (ASCII R12, `LWPOLYLINE` entities on `PANEL` and
  `WAVE` layers) for import into CAM / CNC software — works the same
  way for every pattern type.

## Architecture

The script is organized around **pattern types**, each with its own list
of **families** (motif presets) and its own generator function. Every
generator returns a flat list of clipped polylines in panel-local
millimeter coordinates — that's the only contract the renderer and the
SVG/DXF exporters care about, so adding a pattern type never touches
rendering or export code.

Grid-based pattern types (Lissajous, rose, spiral, Truchet, zellige, hex)
share one `gridCells()` helper that lays out cell centers across the
panel — anchored to the panel's absolute X position when "Continuous
Pattern" is on, so the grid lines up seamlessly across panel boundaries,
the same way the wave pattern's phase does. A generic `clipPolylineRect()`
(clip on Y then X, interpolating both coordinates at each boundary
crossing) replaces the old Y-only clip and works for every pattern type,
including closed loops that exit and re-enter the panel on any side.

### Wave / Weave

Each pattern is a set of horizontal "bands" stacked down the panel
height. Each band contains `n` sine-wave lines; the look comes from how
amplitude varies across those `n` lines:

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
**Offset**: `bandPitch = (n - 1) * step + gap`.

| id    | n | taper   | look                          |
|-------|---|---------|-------------------------------|
| wave1 | 2 | zigzag  | simple crossing weave         |
| wave2 | 3 | zigzag  | triple zigzag                 |
| wave3 | 4 | lens    | four-line lens weave          |
| wave4 | 5 | zigzag  | diamond zigzag                |
| wave5 | 3 | lens    | classic eye/lens (reference)  |
| wave6 | 6 | lens    | dense six-line lens weave     |

### Lissajous curves

One closed loop per grid cell: `x = R·scaleX·sin(a·t + phase)`,
`y = R·scaleY·sin(b·t)` for `t` in `[0, 2π]`. The `a:b` integer ratio
(3:2, 5:4, 2:1, 5:2, 7:6, 4:3) sets the loop shape; **Phase (deg)** shifts
it, **X/Y Amplitude %** stretch each axis independently.

### Rose (rhodonea) curves

Polar curve `r = R·cos(k·θ)`, one rosette per grid cell on a staggered
grid so neighbours interlock. `k` sets the petal count (2→4 petals,
3→3, 4→8, 5→5, 7→7); `k=1.5` traces a 3-lobe curve over `4π`.
**Rotation (deg)** spins each rosette; **X/Y Scale %** stretch it.

### Spirals

1–3 interleaved arms per grid cell, each either **Archimedean**
(`r = maxR·t`, linear) or **logarithmic** (`r = r₀·e^(b·θ)`, exponential /
equiangular). **Rotation (deg)** offsets the whole motif; **X/Y Scale %**
stretch it.

### Truchet tiles

Each grid tile gets a deterministic pseudo-random orientation — two
quarter-circle arcs (classic Truchet look), a diagonal split, or a random
mix of both — from a hash of the tile's grid coordinates and **Random
Seed**. Same seed always reproduces the same tiling; changing the seed
reshuffles it. This is the one pattern type that is deliberately *not* a
simple periodic repeat.

### Zellige star lattice

An `N`-point star polygon (radii alternating **Star Radius %** and
**Star Radius % × Inner Ratio %**) at every point of a triangular grid,
in the spirit of Moroccan zellige / Islamic geometric star motifs
(5/6/8/12-point presets). **Rotation (deg)** spins every star.

### Hex honeycomb

A proper edge-to-edge flat-top hexagon tiling (`Hex Size` = corner
radius, `Hex Spacing` = extra gap between cells). The `double` variant
adds a concentric inner hexagon; `tri` adds six struts from center to
each corner.

Adding a new pattern type means adding one `{ id, families }` entry to
`PATTERN_TYPES`, one generator function, one entry in
`PATTERN_FIELD_CONFIG` (how to label/show the 6 shared numeric fields for
that type), and one `case` in the `generatePanelLines()` dispatcher —
nothing else needs to change. Adding a new motif to an existing type is
just one more object in that type's family array.

## Known gaps / ideas for a future pass

- Panel layout is currently 1D (single row) — no grid/rows, no
  drag-to-reposition.
- No persistence (reload loses all settings/panels).
- DXF export is minimal R12 (two layers, no color/linetype control).
- No collision/overlap warnings when Step is smaller than a plausible
  router bit diameter.
- No image-modulated amplitude (grayscale-driven relief).
- No undo/history.
- Zellige star lattice is a simplified star-polygon tiling, not the full
  compass-and-straightedge Islamic geometric construction (no
  interlacing/strapwork between stars).
- Truchet tile randomization is a fixed hash, not exposed as a
  "shuffle" button — changing the seed field is currently the only way
  to reroll a tiling.
