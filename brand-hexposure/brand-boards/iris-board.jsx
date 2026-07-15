// iris-board.jsx — five Hexposure logo concepts on a design canvas
const { DesignCanvas, DCSection, DCArtboard, DCPostIt } = window;
const { IRIS, IrisMark, IrisWord, IrisParent, IrisLockup } = window;

const AB_W = 452, AB_H = 624;
const PANEL = "#16112a";       // artboard fill (iris dark)
const STAGE = "#1d1638";       // inner stage
const STAGE_LT = "#efe9fb";    // light-context chip
const BORDER = "#2a2350";

const ibStyles = {
  card: {
    width: "100%", height: "100%", background: PANEL, color: IRIS.text,
    fontFamily: "'Sora', system-ui, sans-serif", padding: "30px 30px 26px",
    display: "flex", flexDirection: "column", boxSizing: "border-box",
  },
  mono: { fontFamily: "'IBM Plex Mono', monospace" },
};

function FaviconStack({ concept }) {
  const sizes = [44, 30, 18];
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
      {sizes.map((s) => (
        <div key={s} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
          <IrisMark concept={concept} variant="tile" size={s} />
          <span style={{ ...ibStyles.mono, fontSize: 9, color: IRIS.text4, letterSpacing: ".06em" }}>{s}px</span>
        </div>
      ))}
    </div>
  );
}

function ConceptCard({ num, name, desc, idea, concept }) {
  return (
    <div style={ibStyles.card}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{
          ...ibStyles.mono, fontSize: 12, fontWeight: 600, color: IRIS.accent,
          border: `1px solid ${IRIS.deep}`, borderRadius: 999, padding: "5px 11px", letterSpacing: ".1em",
        }}>{num}</span>
        <span style={{ fontSize: 21, fontWeight: 700, letterSpacing: "-.02em" }}>{name}</span>
      </div>
      <div style={{ ...ibStyles.mono, fontSize: 10.5, color: IRIS.text3, letterSpacing: ".12em", textTransform: "uppercase", marginTop: 10 }}>{desc}</div>

      {/* hero icon */}
      <div style={{
        marginTop: 20, borderRadius: 16, background: STAGE, border: `1px solid ${BORDER}`,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 26, padding: "30px 0 34px",
        backgroundImage: "radial-gradient(120% 90% at 50% 4%, rgba(139,108,230,.18), transparent 62%)",
      }}>
        <IrisMark concept={concept} variant="tile" size={120} />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <IrisMark concept={concept} variant="mark" size={56} />
          <div style={{ width: 64, height: 64, borderRadius: 14, background: STAGE_LT, display: "grid", placeItems: "center" }}>
            <div style={{ color: IRIS.deep }}><IrisMark concept={concept} variant="mono" size={40} /></div>
          </div>
        </div>
      </div>

      {/* lockup */}
      <div style={{ marginTop: 22, paddingTop: 20, borderTop: `1px solid ${BORDER}` }}>
        <IrisLockup concept={concept} markSize={42} wordSize={26} parent={true} />
      </div>

      {/* favicons */}
      <div style={{ marginTop: "auto", paddingTop: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18 }}>
        <FaviconStack concept={concept} />
        <div style={{ maxWidth: "44%", fontSize: 12, lineHeight: 1.5, color: IRIS.text2, textWrap: "pretty", textAlign: "right" }}>{idea}</div>
      </div>
    </div>
  );
}

const CONCEPTS = [
  {
    num: "01", name: "Facet", concept: "facet",
    desc: "Faceted vault · premium",
    idea: "The refined house mark — a cut gem inside the hex. Reads composed and enterprise-grade.",
  },
  {
    num: "02", name: "Aperture", concept: "aperture",
    desc: "Camera-iris · the namesake",
    idea: "Six blades close to a pupil. Literally an iris — “we see your exposure.”",
  },
  {
    num: "03", name: "Pulse", concept: "pulse",
    desc: "Scan rings + blip · monitoring",
    idea: "A radar sweep catching one signal. Says continuous, always-on detection.",
  },
  {
    num: "04", name: "Monogram", concept: "mono_h",
    desc: "Knockout H · system glyph",
    idea: "Just the H, carved from the hex. Survives down to a 16px favicon and an app badge.",
  },
  {
    num: "05", name: "Seal", concept: "crest",
    desc: "Engraved crest · vintage",
    idea: "A heritage security seal — engraved eye, tick ring, EST line. Trust with a long memory.",
  },
];

function App() {
  return (
    <DesignCanvas>
      <DCSection id="iris-logos" title="Hexposure · Iris — Logo Options"
        subtitle="Five marks in the Iris direction (deep violet · Sora). Four modern, one vintage. Drag to reorder · click to focus.">
        {CONCEPTS.map((c) => (
          <DCArtboard key={c.concept} id={c.concept} label={`${c.num} · ${c.name}`}
            width={AB_W} height={AB_H} style={{ background: PANEL }}>
            <ConceptCard {...c} />
          </DCArtboard>
        ))}
        <DCPostIt top={-8} right={40} rotate={2.5} width={196}>
          Same hexagon + iris-violet palette across all five — so they read as one family. Pick one (or mix: e.g. Aperture mark + Monogram favicon).
        </DCPostIt>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
