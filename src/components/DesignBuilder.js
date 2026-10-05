import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ColorThemes from './ColorThemes';
import { DRAFT_STORAGE_KEY } from './TileDesigns';
import {
  RULE_PRESETS,
  TONES,
  buildPattern,
  compileRule,
  facetCoords,
  formatDesignLiteral,
  mod,
  toneFractions,
  verifyPeriodic
} from '../lib/hexLattice';
import { computeHexCenters, hexVertices } from '../hooks/useP5BrushTesselation';

const PREVIEW_RADIUS = 26;
const TONE_CYCLE = [...TONES];
const SQRT3 = Math.sqrt(3);

/**
 * Sizes and centers the single-tile editor.
 *
 * `computeHexCenters` puts hexagon (0, 0) at the canvas origin, so without an
 * offset the first tile hangs off the top-left corner. The radius also has to
 * shrink for large tiles — a 6 x 18 repeat has 108 hexagons and will not fit at
 * a fixed size.
 */
const editorLayout = (width, height, cols, rows) => {
  const radius = Math.max(7, Math.min(
    46,
    width / ((cols + 1.5) * 1.5),
    height / ((rows + 1.5) * SQRT3)
  ));
  return {
    radius,
    offsetX: width / 2 - ((cols - 1) * 1.5 * radius) / 2,
    offsetY: height / 2 - ((rows - 1) * SQRT3 * radius + (SQRT3 * radius) / 2) / 2
  };
};

/** Fills one facet triangle on a 2D context. */
const fillFacet = (ctx, x, y, vertices, facet, color) => {
  const a = vertices[facet];
  const b = vertices[(facet + 1) % 6];
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
};

/** True when `(px, py)` falls inside the triangle `(x, y) - a - b`. */
const insideFacet = (px, py, x, y, a, b) => {
  const sign = (ax, ay, bx, by, cx, cy) => (ax - cx) * (by - cy) - (bx - cx) * (ay - cy);
  const d1 = sign(px, py, x, y, a[0], a[1]);
  const d2 = sign(px, py, a[0], a[1], b[0], b[1]);
  const d3 = sign(px, py, b[0], b[1], x, y);
  const hasNeg = d1 < 0 || d2 < 0 || d3 < 0;
  const hasPos = d1 > 0 || d2 > 0 || d3 > 0;
  return !(hasNeg && hasPos);
};

/**
 * Builder for hexatile designs.
 *
 * Two ways in, sharing one pattern: paint facets directly for small tiles, or
 * write a rule over the triangle-lattice coordinates for the large repeats
 * where painting hundreds of facets by hand is impractical. A rule can be baked
 * into the grid and then hand-tweaked, so the two modes compose.
 */
const DesignBuilder = () => {
  const [cols, setCols] = useState(2);
  const [rows, setRows] = useState(2);
  const [mode, setMode] = useState('paint');
  const [themeName, setThemeName] = useState('Basic Bee');
  const [brushTone, setBrushTone] = useState('dark');
  const [designName, setDesignName] = useState('myDesign');
  const [ruleSource, setRuleSource] = useState(RULE_PRESETS[0].source);
  const [grid, setGrid] = useState(() => buildPattern(2, 2, () => 'light'));
  const [copied, setCopied] = useState(false);

  const previewRef = useRef(null);
  const editorRef = useRef(null);
  const theme = ColorThemes[themeName] || ColorThemes['Basic Bee'];

  const compiled = useMemo(() => (mode === 'rule' ? compileRule(ruleSource) : { rule: null, error: null }), [mode, ruleSource]);

  const periodicity = useMemo(() => {
    if (mode !== 'rule' || !compiled.rule) return [];
    try {
      return verifyPeriodic(cols, rows, compiled.rule);
    } catch (error) {
      return [`Error while checking the tile: ${error.message}`];
    }
  }, [mode, compiled.rule, cols, rows]);

  // In rule mode the pattern is derived; in paint mode the grid is the source of
  // truth. Keeping both behind one value means preview, export and tone counts
  // never have to care which mode is active.
  const pattern = useMemo(() => {
    if (mode === 'rule' && compiled.rule) {
      try {
        return buildPattern(cols, rows, compiled.rule);
      } catch (error) {
        return null;
      }
    }
    return grid;
  }, [mode, compiled.rule, cols, rows, grid]);

  /** Resizes the painted grid, keeping whatever already overlaps the new size. */
  const resize = useCallback((nextCols, nextRows) => {
    const c = Math.max(1, Math.min(24, nextCols));
    const r = Math.max(1, Math.min(24, nextRows));
    setCols(c);
    setRows(r);
    setGrid((previous) => buildPattern(c, r, ({ col, row, f }) => previous[col]?.[row]?.[f]?.c || 'light'));
  }, []);

  /** Copies the current rule output into the painted grid for hand-tweaking. */
  const bakeRuleIntoGrid = useCallback(() => {
    if (!compiled.rule) return;
    setGrid(buildPattern(cols, rows, compiled.rule));
    setMode('paint');
  }, [compiled.rule, cols, rows]);

  const applyPreset = useCallback((preset) => {
    setRuleSource(preset.source);
    setMode('rule');
    resize(preset.cols, preset.rows);
  }, [resize]);

  // Repaint the tiled preview whenever the pattern or theme changes.
  useEffect(() => {
    const canvas = previewRef.current;
    if (!canvas || !pattern) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = theme.bg || '#ffffff';
    ctx.fillRect(0, 0, width, height);

    const centers = computeHexCenters(width, height, PREVIEW_RADIUS, false);
    centers.forEach(({ x, y, col, row }) => {
      const facets = pattern[mod(col, pattern.length)][mod(row, pattern[0].length)];
      const vertices = hexVertices(x, y, PREVIEW_RADIUS, false);
      for (let f = 0; f < 6; f++) {
        fillFacet(ctx, x, y, vertices, f, theme[facets[f].c] || '#888');
      }
    });
  }, [pattern, theme]);

  // Repaint the editable single-tile view. Drawn at the same geometry as the
  // preview so a facet is clicked where it actually appears in the tiling.
  useEffect(() => {
    const canvas = editorRef.current;
    if (!canvas || !pattern) return;
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    const ctx = canvas.getContext('2d');
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.fillStyle = '#1b1b1b';
    ctx.fillRect(0, 0, width, height);

    const { radius, offsetX, offsetY } = editorLayout(width, height, pattern.length, pattern[0].length);
    const centers = computeHexCenters(width, height, radius, false);
    centers.forEach(({ x: cx, y: cy, col, row }) => {
      const x = cx + offsetX;
      const y = cy + offsetY;
      const inTile = col >= 0 && col < pattern.length && row >= 0 && row < pattern[0].length;
      const facets = pattern[mod(col, pattern.length)][mod(row, pattern[0].length)];
      const vertices = hexVertices(x, y, radius, false);
      ctx.globalAlpha = inTile ? 1 : 0.22;
      for (let f = 0; f < 6; f++) {
        fillFacet(ctx, x, y, vertices, f, theme[facets[f].c] || '#888');
      }
      ctx.globalAlpha = 1;
      if (inTile) {
        ctx.strokeStyle = 'rgba(255,255,255,0.28)';
        ctx.lineWidth = 1;
        for (let f = 0; f < 6; f++) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(vertices[f][0], vertices[f][1]);
          ctx.stroke();
        }
      }
    });
  }, [pattern, theme]);

  /**
   * Finds the facet under the pointer, or null when the pointer is outside the
   * editable tile. Shared by painting and the coordinate readout so both agree.
   */
  const facetUnderCursor = useCallback((event) => {
    const canvas = editorRef.current;
    if (!canvas) return null;
    const box = canvas.getBoundingClientRect();
    const { radius, offsetX, offsetY } = editorLayout(box.width, box.height, cols, rows);
    const px = event.clientX - box.left - offsetX;
    const py = event.clientY - box.top - offsetY;

    const centers = computeHexCenters(box.width, box.height, radius, false);
    for (const { x, y, col, row } of centers) {
      if (col < 0 || col >= cols || row < 0 || row >= rows) continue;
      if (Math.hypot(px - x, py - y) > radius * 1.05) continue;
      const vertices = hexVertices(x, y, radius, false);
      for (let f = 0; f < 6; f++) {
        if (insideFacet(px, py, x, y, vertices[f], vertices[(f + 1) % 6])) {
          return facetCoords(col, row, f);
        }
      }
    }
    return null;
  }, [cols, rows]);

  /** Cycles the clicked facet's tone, or sets it straight to the active tone. */
  const paintAt = useCallback((event, cycle) => {
    if (mode !== 'paint') return;
    const target = facetUnderCursor(event);
    if (!target) return;
    const { col, row, f } = target;
    setGrid((previous) => {
      const next = previous.map((column) => column.map((facets) => facets.map((facet) => ({ ...facet }))));
      const current = next[col][row][f].c;
      next[col][row][f].c = cycle
        ? TONE_CYCLE[(TONE_CYCLE.indexOf(current) + 1) % TONE_CYCLE.length]
        : brushTone;
      return next;
    });
  }, [mode, brushTone, facetUnderCursor]);

  const literal = useMemo(() => (pattern ? formatDesignLiteral(designName || 'myDesign', pattern) : ''), [pattern, designName]);
  const fractions = useMemo(() => (pattern ? toneFractions(pattern) : {}), [pattern]);

  const copyLiteral = useCallback(() => {
    if (!literal) return;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    };
    // `writeText` rejects when the document is not focused, so keep a fallback.
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(literal).then(done, () => window.prompt('Copy this design:', literal));
      return;
    }
    window.prompt('Copy this design:', literal);
  }, [literal]);

  /**
   * Saves the design into the draft store `TileDesigns` reads at load, then
   * opens the real brush renderer. That is the only way to see the design with
   * texture — the builder's own preview is flat for instant feedback.
   */
  const previewWithBrush = useCallback(() => {
    if (!pattern) return;
    const name = designName || 'myDesign';
    let drafts = {};
    try {
      drafts = JSON.parse(window.localStorage.getItem(DRAFT_STORAGE_KEY) || '{}');
    } catch (error) {
      drafts = {};
    }
    drafts[name] = { tileShape: 'flatTopHexatile', tilePattern: pattern };
    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(drafts));
    const params = new URLSearchParams({
      pattern: name,
      size: '40',
      theme: themeName,
      brush: 'true',
      secret: 'true'
    });
    // A full load is required: TileDesigns reads the draft store at module load.
    window.open(`${window.location.pathname}#/tesselate?${params}`, '_blank');
  }, [pattern, designName, themeName]);

  const [hover, setHover] = useState(null);

  return (
    <div style={styles.page}>
      <aside style={styles.panel}>
        <h1 style={styles.title}>Design builder</h1>

        <section style={styles.section}>
          <label style={styles.label}>Tile size</label>
          <div style={styles.row}>
            <Stepper label="cols" value={cols} onChange={(v) => resize(v, rows)} step={2} />
            <Stepper label="rows" value={rows} onChange={(v) => resize(cols, v)} step={1} />
          </div>
          <p style={styles.hint}>
            Columns must be even — odd columns sit half a hexagon lower, so an odd
            width cannot repeat.
          </p>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Mode</label>
          <div style={styles.row}>
            {['paint', 'rule'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{ ...styles.toggle, ...(mode === m ? styles.toggleOn : {}) }}
              >
                {m}
              </button>
            ))}
          </div>
        </section>

        {mode === 'paint' ? (
          <section style={styles.section}>
            <label style={styles.label}>Tone</label>
            <div style={styles.row}>
              {TONES.map((tone) => (
                <button
                  key={tone}
                  onClick={() => setBrushTone(tone)}
                  title={tone}
                  style={{
                    ...styles.swatch,
                    background: theme[tone] || '#888',
                    outline: brushTone === tone ? '2px solid #7ac' : '1px solid #444'
                  }}
                />
              ))}
            </div>
            <p style={styles.hint}>Click a facet to paint it. Shift-click cycles through every tone.</p>
          </section>
        ) : (
          <section style={styles.section}>
            <label style={styles.label}>Rule</label>
            <textarea
              value={ruleSource}
              onChange={(event) => setRuleSource(event.target.value)}
              spellCheck={false}
              style={styles.textarea}
            />
            <p style={styles.hint}>
              In scope: <code>band</code>, <code>tc</code>, <code>up</code>, <code>col</code>,
              {' '}<code>row</code>, <code>f</code>, plus <code>mod()</code> and <code>zig()</code>.
              Return a tone name.
            </p>
            {compiled.error && <p style={styles.error}>{compiled.error}</p>}
            {periodicity.map((issue) => <p key={issue} style={styles.error}>{issue}</p>)}
            {!compiled.error && periodicity.length === 0 && (
              <p style={styles.ok}>Tile repeats cleanly at {cols} x {rows}.</p>
            )}
            <button onClick={bakeRuleIntoGrid} disabled={!compiled.rule} style={styles.button}>
              Bake into grid and switch to paint
            </button>
          </section>
        )}

        <section style={styles.section}>
          <label style={styles.label}>Presets</label>
          <div style={styles.presetGrid}>
            {RULE_PRESETS.map((preset) => (
              <button key={preset.name} onClick={() => applyPreset(preset)} style={styles.preset}>
                {preset.name}
              </button>
            ))}
          </div>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Theme</label>
          <select value={themeName} onChange={(event) => setThemeName(event.target.value)} style={styles.select}>
            {Object.keys(ColorThemes).map((name) => <option key={name}>{name}</option>)}
          </select>
        </section>

        <section style={styles.section}>
          <label style={styles.label}>Export</label>
          <input
            value={designName}
            onChange={(event) => setDesignName(event.target.value.replace(/[^A-Za-z0-9]/g, ''))}
            style={styles.input}
            placeholder="designName"
          />
          <button onClick={copyLiteral} style={styles.button} disabled={!literal}>
            {copied ? 'Copied' : 'Copy for TileDesigns.js'}
          </button>
          <button onClick={previewWithBrush} style={styles.button} disabled={!pattern}>
            Preview with brush texture
          </button>
          <p style={styles.hint}>
            {Object.entries(fractions).map(([tone, pct]) => `${tone} ${pct}%`).join(' · ')}
            {pattern ? ` · ${pattern.length * pattern[0].length * 6} facets` : ''}
          </p>
        </section>
      </aside>

      <main style={styles.main}>
        <div style={styles.editorWrap}>
          <div style={styles.paneLabel}>
            Tile {cols} x {rows}
            {hover && (
              <span style={styles.coords}>
                band {hover.band} · tc {hover.tc} · {hover.up ? 'up' : 'down'} · facet {hover.f}
              </span>
            )}
          </div>
          <canvas
            ref={editorRef}
            style={{ ...styles.canvas, cursor: mode === 'paint' ? 'pointer' : 'default' }}
            onClick={(event) => paintAt(event, event.shiftKey)}
            onMouseMove={(event) => setHover(facetUnderCursor(event))}
            onMouseLeave={() => setHover(null)}
          />
        </div>
        <div style={styles.previewWrap}>
          <div style={styles.paneLabel}>Tiled preview</div>
          <canvas ref={previewRef} style={styles.canvas} />
        </div>
      </main>
    </div>
  );
};

const Stepper = ({ label, value, onChange, step }) => (
  <div style={styles.stepper}>
    <button onClick={() => onChange(value - step)} style={styles.stepButton}>−</button>
    <span style={styles.stepValue}>{value}<small style={styles.stepLabel}>{label}</small></span>
    <button onClick={() => onChange(value + step)} style={styles.stepButton}>+</button>
  </div>
);

const styles = {
  page: { display: 'flex', height: '100vh', background: '#111', color: '#eee', font: '13px/1.45 -apple-system, system-ui, sans-serif' },
  panel: { width: 320, flex: '0 0 320px', padding: 18, overflowY: 'auto', borderRight: '1px solid #262626', boxSizing: 'border-box' },
  title: { font: '600 12px/1 inherit', letterSpacing: '.08em', textTransform: 'uppercase', color: '#8a8', margin: '0 0 18px' },
  section: { margin: '0 0 20px' },
  label: { display: 'block', font: '600 10px/1 inherit', letterSpacing: '.08em', textTransform: 'uppercase', color: '#888', margin: '0 0 7px' },
  row: { display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' },
  hint: { margin: '7px 0 0', fontSize: 11, color: '#777' },
  error: { margin: '7px 0 0', fontSize: 11, color: '#e08a7a' },
  ok: { margin: '7px 0 0', fontSize: 11, color: '#8a8' },
  stepper: { display: 'flex', alignItems: 'center', gap: 4, background: '#1c1c1c', borderRadius: 5, padding: 3 },
  stepButton: { width: 24, height: 24, border: 0, borderRadius: 4, background: '#2a2a2a', color: '#ddd', cursor: 'pointer', fontSize: 14 },
  stepValue: { minWidth: 44, textAlign: 'center', fontVariantNumeric: 'tabular-nums' },
  stepLabel: { display: 'block', fontSize: 9, color: '#777', textTransform: 'uppercase', letterSpacing: '.06em' },
  toggle: { flex: 1, padding: '7px 0', border: '1px solid #333', borderRadius: 5, background: '#1c1c1c', color: '#aaa', cursor: 'pointer', textTransform: 'capitalize' },
  toggleOn: { background: '#2f3a33', border: '1px solid #4a6', color: '#cfe' },
  swatch: { width: 34, height: 34, borderRadius: 5, border: 0, cursor: 'pointer', padding: 0 },
  textarea: { width: '100%', minHeight: 210, background: '#191919', color: '#dfe', border: '1px solid #333', borderRadius: 5, padding: 9, font: '12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace', resize: 'vertical', boxSizing: 'border-box' },
  button: { width: '100%', marginTop: 8, padding: '8px 0', border: '1px solid #3a4', borderRadius: 5, background: '#223', color: '#cfe', cursor: 'pointer' },
  presetGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 },
  preset: { padding: '7px 4px', border: '1px solid #333', borderRadius: 5, background: '#1c1c1c', color: '#bbb', cursor: 'pointer', fontSize: 11 },
  select: { width: '100%', padding: 7, background: '#191919', color: '#ddd', border: '1px solid #333', borderRadius: 5 },
  input: { width: '100%', padding: 7, background: '#191919', color: '#ddd', border: '1px solid #333', borderRadius: 5, boxSizing: 'border-box', font: '12px ui-monospace, Menlo, monospace' },
  main: { flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 },
  editorWrap: { flex: '0 0 46%', display: 'flex', flexDirection: 'column', borderBottom: '1px solid #262626', minHeight: 0 },
  previewWrap: { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 },
  paneLabel: { padding: '7px 12px', font: '600 10px/1 inherit', letterSpacing: '.08em', textTransform: 'uppercase', color: '#777', display: 'flex', justifyContent: 'space-between' },
  coords: { color: '#6a8', fontVariantNumeric: 'tabular-nums', textTransform: 'none', letterSpacing: 0 },
  canvas: { flex: 1, width: '100%', minHeight: 0, display: 'block' }
};

export default DesignBuilder;
