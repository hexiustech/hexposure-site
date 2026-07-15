// iris-logos.jsx — five Hexposure logomark concepts in the "Iris" direction
// (deep iris-violet, Sora type, enterprise-trust). All concepts anchor on the
// hexagon (HEX-posure). Concepts:
//   facet    · faceted vault / gem      — premium enterprise (the chosen Iris mark, refined)
//   aperture · camera-iris pinwheel     — "Iris": we see your exposure
//   pulse    · scan rings + blip        — continuous monitoring, techy
//   mono_h   · knockout H monogram      — typographic, scales to a favicon
//   crest    · engraved hexagon seal    — the vintage option
//
// Colors are JS constants (not CSS vars) so marks render identically inside
// any canvas artboard. variant: 'tile' | 'mark' | 'mono'.

const IRIS = {
  g1: "#c3aef2", g2: "#8b6ce6", g3: "#5e3fb0",
  accent: "#8b6ce6", accent2: "#7654d8", deep: "#5e3fb0", foam: "#c3aef2",
  ink: "#150c29", plum: "#241d44", plumDeep: "#1a1433",
  text: "#ece7fb", text2: "#b6acd9", text3: "#7d72a3", text4: "#534a78",
};

// pointy-top hexagon on a 0..100 canvas
const O = [[50, 8], [86.6, 29], [86.6, 71], [50, 92], [13.4, 71], [13.4, 29]];
const HEX = "M50 8 L86.6 29 L86.6 71 L50 92 L13.4 71 L13.4 29 Z";
function innerV(s) { return O.map(([x, y]) => [50 + s * (x - 50), 50 + s * (y - 50)]); }
function hexPath(s) {
  const v = innerV(s);
  return "M" + v.map(q => q.map(n => +n.toFixed(2)).join(" ")).join(" L") + " Z";
}

// ---------- per-concept inner glyph (wrapper draws the outer hex) ----------
function Glyph({ concept, detail, center, foam, w = 3.2 }) {
  if (concept === "facet") {
    const o = O, i = innerV(0.46);
    return (
      <g fill="none" stroke={detail} strokeWidth={w * 0.82} strokeLinejoin="round">
        <path d={hexPath(0.46)} />
        {o.map((v, k) => (
          <line key={k} x1={i[k][0].toFixed(2)} y1={i[k][1].toFixed(2)} x2={v[0]} y2={v[1]} />
        ))}
        <circle cx="50" cy="50" r="3.4" fill={center} stroke="none" />
      </g>
    );
  }
  if (concept === "aperture") {
    const a = innerV(0.34);
    return (
      <g>
        <g fill="none" stroke={detail} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round">
          {O.map((v, k) => {
            const n = a[(k + 1) % 6];
            return <line key={k} x1={v[0]} y1={v[1]} x2={n[0].toFixed(2)} y2={n[1].toFixed(2)} />;
          })}
          <path d={hexPath(0.34)} />
        </g>
        <circle cx="50" cy="50" r="6.4" fill={center} />
        <circle cx="47.4" cy="47.4" r="2" fill={foam} />
      </g>
    );
  }
  if (concept === "pulse") {
    return (
      <g>
        <circle cx="50" cy="50" r="9" fill="none" stroke={detail} strokeWidth="2.2" opacity="0.7" />
        <circle cx="50" cy="50" r="19" fill="none" stroke={detail} strokeWidth="2.2" opacity="0.34" />
        <circle cx="50" cy="50" r="29" fill="none" stroke={detail} strokeWidth="2.2" opacity="0.16" />
        <line x1="50" y1="50" x2="76" y2="35" stroke={center} strokeWidth="3.2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="4.3" fill={center} />
        <circle cx="71" cy="31" r="6.6" fill="none" stroke={foam} strokeWidth="1.4" opacity="0.55" />
        <circle cx="71" cy="31" r="3.4" fill={foam} />
      </g>
    );
  }
  if (concept === "mono_h") {
    return (
      <g fill={center}>
        <rect x="33.5" y="31" width="8.2" height="38" rx="1.6" />
        <rect x="58.3" y="31" width="8.2" height="38" rx="1.6" />
        <rect x="37" y="46" width="26" height="8" rx="1.6" />
      </g>
    );
  }
  return null;
}

// ---------- vintage crest (fully custom framing) ----------
function Crest({ size = 96, variant = "mark" }) {
  const uid = React.useId().replace(/[:]/g, "");
  const onTile = variant === "tile";
  const mono = variant === "mono";
  const line = mono ? "currentColor" : (onTile ? IRIS.foam : IRIS.foam);
  const accent = mono ? "currentColor" : IRIS.g1;
  const ticks = Array.from({ length: 24 }, (_, k) => {
    const ang = (k / 24) * Math.PI * 2 - Math.PI / 2;
    const r1 = 33.5, r2 = k % 2 === 0 ? 30 : 31.6;
    return (
      <line key={k}
        x1={(50 + r1 * Math.cos(ang)).toFixed(2)} y1={(50 + r1 * Math.sin(ang)).toFixed(2)}
        x2={(50 + r2 * Math.cos(ang)).toFixed(2)} y2={(50 + r2 * Math.sin(ang)).toFixed(2)}
        stroke={line} strokeWidth="1" opacity="0.7" />
    );
  });
  const iris = Array.from({ length: 12 }, (_, k) => {
    const ang = (k / 12) * Math.PI * 2;
    return (
      <line key={k}
        x1={(50 + 4 * Math.cos(ang)).toFixed(2)} y1={(50 + 4 * Math.sin(ang)).toFixed(2)}
        x2={(50 + 8.4 * Math.cos(ang)).toFixed(2)} y2={(50 + 8.4 * Math.sin(ang)).toFixed(2)}
        stroke={line} strokeWidth="0.8" opacity="0.55" />
    );
  });
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }} aria-label="Hexposure crest">
      {onTile && (
        <defs>
          <linearGradient id={"cg" + uid} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={IRIS.plum} />
            <stop offset="100%" stopColor={IRIS.plumDeep} />
          </linearGradient>
        </defs>
      )}
      {onTile && <rect x="3" y="3" width="94" height="94" rx="20" fill={`url(#cg${uid})`} />}
      <g fill="none" stroke={line} strokeLinejoin="round">
        <path d={HEX} strokeWidth="2.4" />
        <path d={hexPath(0.9)} strokeWidth="1" opacity="0.85" />
        <circle cx="50" cy="50" r="33.5" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="29.5" strokeWidth="0.8" opacity="0.7" />
      </g>
      {ticks}
      {/* eye */}
      <path d="M30 50 Q50 35.5 70 50 Q50 64.5 30 50 Z" fill="none" stroke={line} strokeWidth="1.8" />
      <circle cx="50" cy="50" r="9.2" fill="none" stroke={line} strokeWidth="1.4" />
      {iris}
      <circle cx="50" cy="50" r="4" fill={accent} />
      <circle cx="48.4" cy="48.4" r="1.3" fill={onTile ? IRIS.plumDeep : IRIS.plumDeep} opacity={mono ? 0 : 1} />
      {/* est ribbon */}
      <text x="50" y="83.5" textAnchor="middle"
        fontFamily="'IBM Plex Mono', monospace" fontSize="6.4" letterSpacing="2.2"
        fill={line} opacity="0.9">EST · MMXXVI</text>
    </svg>
  );
}

// ---------- the mark wrapper ----------
function IrisMark({ concept = "facet", variant = "mark", size = 96 }) {
  if (concept === "crest") return <Crest size={size} variant={variant} />;
  const uid = React.useId().replace(/[:]/g, "");
  const gid = "g" + uid;
  const grad = `url(#${gid})`;
  const round = concept === "aperture" || concept === "pulse";
  const join = round ? "round" : "miter";

  const Defs = (
    <defs>
      <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor={IRIS.g1} />
        <stop offset="52%" stopColor={IRIS.g2} />
        <stop offset="100%" stopColor={IRIS.g3} />
      </linearGradient>
    </defs>
  );

  if (variant === "tile") {
    const rad = concept === "mono_h" ? 22 : 20;
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }} aria-label="Hexposure icon">
        {Defs}
        <rect x="3" y="3" width="94" height="94" rx={rad} fill={grad} />
        {concept !== "mono_h" && (
          <path d={HEX} fill="none" stroke={IRIS.ink} strokeWidth="3.2" strokeLinejoin={join} opacity="0.92" />
        )}
        <Glyph concept={concept} detail={IRIS.ink} center={IRIS.ink} foam={IRIS.ink} />
      </svg>
    );
  }

  const mono = variant === "mono";
  const hexPaint = mono ? "currentColor" : grad;
  const detail = mono ? "currentColor" : IRIS.accent2;
  const center = mono ? "currentColor" : IRIS.accent;
  const foam = mono ? "currentColor" : IRIS.foam;

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }} aria-label="Hexposure">
      {Defs}
      {concept !== "mono_h"
        ? <path d={HEX} fill="none" stroke={hexPaint} strokeWidth="4" strokeLinejoin={join} />
        : <path d={HEX} fill="none" stroke={hexPaint} strokeWidth="4" strokeLinejoin="miter" />}
      <Glyph concept={concept} detail={detail} center={center} foam={foam} />
    </svg>
  );
}

// ---------- wordmark + lockup ----------
function IrisWord({ size = 32, mono = false }) {
  return (
    <span style={{
      fontFamily: "'Sora', system-ui, sans-serif", fontWeight: 800,
      fontSize: size, letterSpacing: "-0.035em", lineHeight: 1, whiteSpace: "nowrap",
    }}>
      <span style={{ color: mono ? "inherit" : IRIS.accent }}>Hex</span>
      <span style={{ color: mono ? "inherit" : IRIS.text }}>posure</span>
    </span>
  );
}
function IrisParent({ size = 11 }) {
  return (
    <span style={{
      fontFamily: "'IBM Plex Mono', monospace", fontSize: size, letterSpacing: "0.14em",
      textTransform: "uppercase", color: IRIS.text3, whiteSpace: "nowrap", fontWeight: 500,
    }}>
      by <span style={{ color: IRIS.accent2 }}>Hex</span>ius
    </span>
  );
}
function IrisLockup({ concept, markSize = 44, wordSize = 28, parent = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 13 }}>
      <IrisMark concept={concept} variant="mark" size={markSize} />
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <IrisWord size={wordSize} />
        {parent && <IrisParent size={wordSize * 0.36} />}
      </div>
    </div>
  );
}

Object.assign(window, { IRIS, IrisMark, IrisWord, IrisParent, IrisLockup, HEX });
