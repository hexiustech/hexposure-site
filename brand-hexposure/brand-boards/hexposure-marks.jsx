// hexposure-marks.jsx — three hexagon logo concepts + wordmark system
// concept 'aperture' (A · eye/exposure) | 'gem' (B · faceted vault) | 'reticle' (C · scope)
// variant 'mark' (outline + glyph on transparent) | 'tile' (gradient app-icon, knockout glyph) | 'mono'
// All paint is driven by inherited CSS vars so dark/light + per-direction theming is automatic.

const HEX = "M50 8 L86.6 29 L86.6 71 L50 92 L13.4 71 L13.4 29 Z";

// inner hexagon scaled by s about centre (50,50)
function hexScaled(s) {
  const V = [[50,8],[86.6,29],[86.6,71],[50,92],[13.4,71],[13.4,29]];
  const p = V.map(([x,y]) => [50 + s*(x-50), 50 + s*(y-50)]);
  return "M" + p.map(q => q.map(n => +n.toFixed(2)).join(" ")).join(" L") + " Z";
}
const OUTER_V = [[50,8],[86.6,29],[86.6,71],[50,92],[13.4,71],[13.4,29]];
function innerV(s){ return OUTER_V.map(([x,y]) => [50 + s*(x-50), 50 + s*(y-50)]); }

// ---- per-concept glyph (excludes the outer hex, which the wrapper draws) ----
function ConceptGlyph({ concept, paint, detail, foam }) {
  if (concept === "aperture") {
    return (
      <g>
        <path d={hexScaled(0.6)} fill="none" style={{ stroke: detail }} strokeWidth="3.4" strokeLinejoin="round" />
        <circle cx="50" cy="50" r="7" style={{ fill: paint }} />
        <circle cx="46.5" cy="46.5" r="2.4" style={{ fill: foam }} />
      </g>
    );
  }
  if (concept === "gem") {
    const o = OUTER_V, i = innerV(0.5);
    return (
      <g style={{ stroke: detail }} strokeWidth="2.6" fill="none" strokeLinejoin="round">
        <path d={hexScaled(0.5)} />
        {o.map((v, k) => (
          <line key={k} x1={i[k][0].toFixed(2)} y1={i[k][1].toFixed(2)} x2={v[0]} y2={v[1]} />
        ))}
      </g>
    );
  }
  // reticle
  return (
    <g>
      <g style={{ stroke: detail }} strokeWidth="3.2" strokeLinecap="round">
        <line x1="50" y1="17" x2="50" y2="40" />
        <line x1="50" y1="60" x2="50" y2="83" />
        <line x1="17" y1="50" x2="40" y2="50" />
        <line x1="60" y1="50" x2="83" y2="50" />
      </g>
      <circle cx="50" cy="50" r="8.5" fill="none" style={{ stroke: detail }} strokeWidth="2.6" />
      <circle cx="50" cy="50" r="2.4" style={{ fill: paint }} />
      <circle cx="66" cy="33" r="4" style={{ fill: foam }} />
      <circle cx="66" cy="33" r="7.5" fill="none" style={{ stroke: foam }} strokeWidth="1.4" opacity="0.5" />
    </g>
  );
}

function Mark({ concept = "aperture", variant = "mark", size = 96, rounded }) {
  const uid = React.useId().replace(/[:]/g, "");
  const gid = "g" + uid;
  const grad = `url(#${gid})`;
  const rad = rounded != null ? rounded : (concept === "aperture" ? 26 : concept === "gem" ? 20 : 14);
  const round = concept === "aperture";

  const Defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" style={{ stopColor: "var(--g1)" }} />
        <stop offset="52%" style={{ stopColor: "var(--g2)" }} />
        <stop offset="100%" style={{ stopColor: "var(--g3)" }} />
      </linearGradient>
    </defs>
  );

  if (variant === "tile") {
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }} aria-label="Hexposure icon">
        {Defs}
        <rect x="3" y="3" width="94" height="94" rx={rad} style={{ fill: grad }} />
        <path d={HEX} fill="none" style={{ stroke: "var(--ink)" }} strokeWidth="3.2" strokeLinejoin={round ? "round" : "miter"} opacity="0.92" />
        <ConceptGlyph concept={concept} paint="var(--ink)" detail="var(--ink)" foam="var(--ink)" />
      </svg>
    );
  }

  const mono = variant === "mono";
  const hexPaint = mono ? "currentColor" : grad;
  const detail = mono ? "currentColor" : "var(--accent-2)";
  const center = mono ? "currentColor" : "var(--accent)";
  const foam = mono ? "currentColor" : "var(--foam)";

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }} aria-label="Hexposure">
      {Defs}
      <path d={HEX} fill="none" style={{ stroke: hexPaint }} strokeWidth="4" strokeLinejoin={round ? "round" : "miter"} />
      <ConceptGlyph concept={concept} paint={center} detail={detail} foam={mono ? "currentColor" : foam} />
    </svg>
  );
}

// ---- wordmark: "Hex" accent + rest in text colour ----
function Wordmark({ size = 34, mono = false }) {
  return (
    <span style={{
      fontFamily: "var(--font-head)", fontWeight: 800, fontSize: size,
      letterSpacing: "-0.03em", lineHeight: 1, whiteSpace: "nowrap"
    }}>
      <span style={{ color: mono ? "inherit" : "var(--accent)" }}>Hex</span>
      <span style={{ color: mono ? "inherit" : "var(--text)" }}>posure</span>
    </span>
  );
}

// ---- "by Hexius" parent tag, Hex thread highlighted ----
function ParentTag({ size = 12 }) {
  return (
    <span style={{
      fontFamily: "var(--font-mono)", fontSize: size, letterSpacing: "0.08em",
      textTransform: "uppercase", color: "var(--text-3)", whiteSpace: "nowrap", fontWeight: 500
    }}>
      by <span style={{ color: "var(--accent-2)" }}>Hex</span>ius
    </span>
  );
}

// ---- horizontal lockup ----
function Lockup({ concept, markSize = 40, wordSize = 26, parent = false }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <Mark concept={concept} variant="mark" size={markSize} />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Wordmark size={wordSize} />
        {parent && <ParentTag size={wordSize * 0.34} />}
      </div>
    </div>
  );
}

Object.assign(window, { Mark, Wordmark, ParentTag, Lockup, HEX });
