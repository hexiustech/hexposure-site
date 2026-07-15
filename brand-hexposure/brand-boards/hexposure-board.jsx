// hexposure-board.jsx — three brand directions, each fully themed, on one comparison page.

const DIRECTIONS = [
  {
    key: "a", num: "01", name: "Clay", concept: "aperture",
    persona: "Approachable · plain-spoken",
    blurb: "The anti-intimidation brand. Warm terracotta, the opposite of the black-and-red cyber cliché — it feels like a trusted advisor, not a warning. The hexagon opens into an aperture: what you expose, seen plainly.",
    fontHead: "Manrope", fontMono: "JetBrains Mono",
    typeNote: "Manrope · 800 / 400 — rounded humanist, friendly and legible",
    colorNote: "Burnt terracotta — warm, human, reassuring. Rare in security.",
    taglines: [
      "See what you’re exposing — before someone else does.",
      "Your attack surface, in plain English.",
      "Know what to fix first. Skip the 400-row spreadsheet.",
    ],
    swatches: [
      { role: "Signal", dark: "#E0784D", light: "#BC5A2E" },
      { role: "Deep", dark: "#B5512B", light: "#8F3C1C" },
      { role: "Sand", dark: "#F4B48C", light: "#E08A5E" },
      { role: "Surface", dark: "#1E1813", light: "#FFFFFF" },
      { role: "Canvas", dark: "#14100D", light: "#F6EEE7" },
      { role: "Text", dark: "#F3E9E1", light: "#2A1A11" },
    ],
  },
  {
    key: "b", num: "02", name: "Iris", concept: "gem",
    persona: "Calm · trustworthy · enterprise",
    blurb: "Premium trust — without the default corporate blue everyone else uses. Deep iris violet reads composed, intelligent and modern, the kind of palette a board takes seriously. The hexagon is cut like a vault facet.",
    fontHead: "Sora", fontMono: "IBM Plex Mono",
    typeNote: "Sora · 700 / 400 — geometric, precise, quietly premium",
    colorNote: "Deep iris violet — trust and intelligence, sidestepping the blue cliché.",
    taglines: [
      "Exposure, under control.",
      "The outside view of your security.",
      "Clarity on exactly what an attacker can reach.",
    ],
    swatches: [
      { role: "Signal", dark: "#8B6CE6", light: "#6A45C8" },
      { role: "Deep", dark: "#5E3FB0", light: "#472C90" },
      { role: "Lilac", dark: "#C3AEF2", light: "#8B6CE6" },
      { role: "Surface", dark: "#1A1530", light: "#FFFFFF" },
      { role: "Canvas", dark: "#110E1C", light: "#F2EFFA" },
      { role: "Text", dark: "#ECE7FB", light: "#16102E" },
    ],
  },
  {
    key: "c", num: "03", name: "Phosphor", concept: "reticle",
    persona: "Technical · precise · instrument",
    blurb: "The bold one. Electric lime on cool graphite reads like a live instrument — a readout that’s actively scanning. Energetic and unmistakably technical without resorting to neon-green-on-black hacker tropes.",
    fontHead: "Space Grotesk", fontMono: "Space Mono",
    typeNote: "Space Grotesk · 700 / 400 — engineered, monospace-adjacent edges",
    colorNote: "Electric lime on graphite — instrument-grade, alive, attention-grabbing.",
    taglines: [
      "Every exposure. Pinpointed.",
      "An attacker’s-eye view of your perimeter.",
      "Find it before they do.",
    ],
    swatches: [
      { role: "Signal", dark: "#B6E021", light: "#5E7A0A" },
      { role: "Deep", dark: "#8FB510", light: "#46600A" },
      { role: "Glow", dark: "#D6F56B", light: "#7E9E18" },
      { role: "Surface", dark: "#16191A", light: "#FFFFFF" },
      { role: "Canvas", dark: "#0D0F10", light: "#EDF1EA" },
      { role: "Text", dark: "#EAF1DE", light: "#171F0C" },
    ],
  },
];

/* ---------- small pieces ---------- */
function Card({ label, children, span = 1, className = "" }) {
  return (
    <div className={"card span-" + span + " " + className}>
      {label && <div className="card-lbl">{label}</div>}
      {children}
    </div>
  );
}

function Swatch({ s, mode }) {
  const hex = s[mode];
  const ink = ["Surface", "Canvas"].includes(s.role) || (mode === "light" && s.role === "Foam");
  return (
    <div className="sw" style={{ background: hex, color: ink ? "var(--text)" : "var(--ink-on)" }}>
      <span className="sw-n">{s.role}</span>
      <span className="sw-x">{hex}</span>
    </div>
  );
}

/* ---------- applied sample: a mini product surface ---------- */
function Applied({ d }) {
  return (
    <div className="applied">
      <div className="app-nav">
        <Lockup concept={d.concept} markSize={26} wordSize={17} />
        <div className="app-nav-links">
          <span>Findings</span><span>Attack paths</span><span>Domains</span>
        </div>
        <button className="app-cta">Run a scan</button>
      </div>
      <div className="app-hero">
        <span className="app-kick">Private beta · {d.name}</span>
        <h4 className="app-h">{d.taglines[0]}</h4>
        <div className="app-row">
          <span className="app-data">47<i>/100</i> · 14 critical</span>
          <button className="app-cta sm">See my exposure →</button>
        </div>
      </div>
    </div>
  );
}

function Direction({ d, mode }) {
  return (
    <section className={"dir dir-" + d.key} data-screen-label={d.num + " " + d.name}>
      <div className="dir-head">
        <div className="dir-id">
          <span className="dir-num">{d.num}</span>
          <div>
            <h2 className="dir-name">{d.name}</h2>
            <span className="dir-persona">{d.persona}</span>
          </div>
        </div>
        <p className="dir-blurb">{d.blurb}</p>
      </div>

      <div className="bento">
        {/* primary logomark */}
        <Card label="Primary logomark" span={4} className="logo-card">
          <div className="logo-stage">
            <Mark concept={d.concept} variant="mark" size={132} />
          </div>
          <div className="lockup-row two">
            <div className="lk-col">
              <Lockup concept={d.concept} markSize={34} wordSize={24} parent={false} />
              <span className="lk-tag">Standalone</span>
            </div>
            <div className="lk-div"></div>
            <div className="lk-col">
              <Lockup concept={d.concept} markSize={34} wordSize={24} parent={true} />
              <span className="lk-tag">With parent</span>
            </div>
          </div>
        </Card>

        {/* app icon */}
        <Card label="App icon · favicon" span={2} className="icon-card">
          <div className="icon-stage">
            <Mark concept={d.concept} variant="tile" size={84} />
          </div>
          <div className="fav-row">
            <div className="fav"><Mark concept={d.concept} variant="tile" size={40} /><span>40</span></div>
            <div className="fav"><Mark concept={d.concept} variant="tile" size={24} /><span>24</span></div>
            <div className="fav"><Mark concept={d.concept} variant="tile" size={16} /><span>16</span></div>
          </div>
        </Card>

        {/* wordmark + parent */}
        <Card label="Wordmark · the Hex thread" span={3} className="word-card">
          <div className="word-big"><Wordmark size={42} /></div>
          <div className="word-parent">
            <Mark concept={d.concept} variant="mark" size={26} />
            <ParentTag size={13} />
          </div>
          <p className="word-note">
            <b>Hex</b> ties product to parent — <span className="thread">Hex</span>posure, the app · <span className="thread">Hex</span>ius, the company.
          </p>
          <div className="word-mono">
            <span className="mono-chip">Hexposure</span>
            <span className="mono-chip ghost">one-colour</span>
          </div>
        </Card>

        {/* color */}
        <Card label="Colour" span={3} className="color-card">
          <div className="sw-grid">
            {d.swatches.map((s) => <Swatch key={s.role} s={s} mode={mode} />)}
          </div>
          <div className="grad-bar"><span>Brand gradient · 135°</span></div>
          <p className="color-note">{d.colorNote}</p>
        </Card>

        {/* type */}
        <Card label="Typography" span={3} className="type-card">
          <div className="ty-head">Aa</div>
          <div className="ty-note">{d.typeNote}</div>
          <div className="ty-sample-h">See your exposure clearly</div>
          <div className="ty-sample-b">Plain-language findings, ranked by real business risk, with a step-by-step fix for each one.</div>
          <div className="ty-sample-m">api-edge.acme.ca · port 8443 · CVSS 9.1</div>
          <div className="ty-foot">{d.fontHead} · {d.fontMono}</div>
        </Card>

        {/* taglines */}
        <Card label="Tagline options" span={3} className="tag-card">
          {d.taglines.map((t, i) => (
            <div className="tag-line" key={i}>
              <span className="tag-n">{String(i + 1).padStart(2, "0")}</span>
              <span className="tag-t">{t}</span>
            </div>
          ))}
        </Card>

        {/* applied sample */}
        <Card label="In context" span={6} className="applied-card">
          <Applied d={d} />
        </Card>
      </div>
    </section>
  );
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const mode = t.theme;
  const setMode = (m) => setTweak("theme", m);

  React.useEffect(() => {
    document.documentElement.setAttribute("data-mode", mode);
    try { localStorage.setItem("hx-mode", mode); } catch (e) {}
  }, [mode]);

  return (
    <div className="page">
      <header className="masthead">
        <div className="mast-l">
          <span className="mast-eyebrow">Brand exploration · 3 directions</span>
          <h1 className="mast-title"><span className="t-accent">Hex</span>posure</h1>
          <p className="mast-sub">Same name, three personalities. Each leans into the hexagon and the <b>Hex</b> thread to Hexius — pick a direction, or mix the parts you like.</p>
        </div>
        <div className="mast-r">
          <button className="mode-toggle" onClick={() => setMode(mode === "dark" ? "light" : "dark")}>
            <span className={"mt-opt" + (mode === "dark" ? " on" : "")}>Dark</span>
            <span className={"mt-opt" + (mode === "light" ? " on" : "")}>Light</span>
          </button>
          <span className="mast-hint">Toggle applies to all three</span>
        </div>
      </header>

      {DIRECTIONS.map((d) => <Direction key={d.key} d={d} mode={mode} />)}

      <footer className="page-foot">
        <span><b>Hexposure</b> · external attack-surface management · a <b>Hex</b>ius product</span>
        <span className="foot-mono">brand v0.1 — exploration · {new Date().getFullYear()}</span>
      </footer>

      <TweaksPanel>
        <TweakSection label="Theme" />
        <TweakRadio label="Mode" value={t.theme} options={["dark", "light"]}
          onChange={(v) => setTweak("theme", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
