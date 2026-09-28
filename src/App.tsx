import { useEffect, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  BellRing,
  Camera,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Cpu,
  Database,
  Eye,
  FileCheck2,
  Gauge,
  KeyRound,
  Layers3,
  Menu,
  Moon,
  Network,
  ScanFace,
  ServerCog,
  ShieldCheck,
  Sun,
  WifiOff,
  X,
  Zap,
} from "lucide-react";

type Theme = "dark" | "light";

const problemItems = [
  {
    icon: Eye,
    title: "Too many screens, too few eyes",
    text: "Operators monitor many feeds at once, so a single important event can be easy to miss.",
    answer: "Edge computers watch each feed and surface rule-based alerts for review.",
  },
  {
    icon: WifiOff,
    title: "Remote links are thin and unreliable",
    text: "Streaming every camera feed uses bandwidth that remote posts may not have, and links can drop out.",
    answer: "Send compact event messages and queue them locally until the link returns.",
  },
  {
    icon: FileCheck2,
    title: "Evidence gets questioned later",
    text: "A screenshot or a log line alone can be difficult to verify after an incident.",
    answer: "Keep changes in a signed, hash-chained ledger alongside the original evidence files.",
  },
];

const capabilities = [
  {
    icon: Activity,
    label: "VISION / TRACKING",
    title: "Tracks people and vehicles",
    text: "Edge-side detection follows people and vehicles as continuous tracks instead of treating every frame as a new event.",
    detail: "YOLO11 · ByteTrack",
  },
  {
    icon: CircleDot,
    label: "CAMERA RULES",
    title: "Zones you draw",
    text: "Set restricted polygons and crossing lines per camera. Flag intrusion, loitering, wrong-way movement, night activity, speeding or crowding.",
    detail: "Per-camera zones and lines",
  },
  {
    icon: Camera,
    label: "VEHICLE INTELLIGENCE",
    title: "Reads number plates",
    text: "Run number-plate recognition at the edge and attach a detected plate to the related event for operator review.",
    detail: "PaddleOCR",
  },
  {
    icon: ScanFace,
    label: "IDENTITY WORKFLOW",
    title: "Checks faces against each other",
    text: "Use track IDs to support cross-camera re-identification, with same-person face comparison when that workflow is enabled.",
    detail: "Track handoffs · SCRFD · ArcFace",
  },
  {
    icon: WifiOff,
    label: "OFFLINE CONTINUITY",
    title: "Keeps working when links drop",
    text: "Hold events in a local queue during an outage, then resend them when connectivity returns without counting duplicates twice.",
    detail: "Designed for up to 24 hours",
  },
  {
    icon: Zap,
    label: "LOW-BANDWIDTH BY DESIGN",
    title: "Sends events, not video",
    text: "Transmit compact event data. Request live video or clips from the edge only when an operator needs to investigate.",
    detail: "50 kbps per camera target",
  },
  {
    icon: ShieldCheck,
    label: "AUDITABLE EVIDENCE",
    title: "Evidence you can verify",
    text: "Record each alert change in a signed hash chain and retain original uploads alongside the event record.",
    detail: "SHA-256 chain · HMAC signatures",
  },
  {
    icon: KeyRound,
    label: "ACCESS CONTROL",
    title: "Access by role and camera",
    text: "Enforce camera-level permissions for Admin, Supervisor, Operator and Auditor workflows, with operators limited to assigned feeds.",
    detail: "Role-aware camera permissions",
  },
];

const alertSteps = [
  {
    number: "01",
    title: "Spot",
    text: "The edge computer reads the camera feed and follows each detected person or vehicle as one track.",
    icon: Eye,
  },
  {
    number: "02",
    title: "Check",
    text: "Zone rules run beside the camera. Plate and face checks run when those workflows are enabled.",
    icon: ScanFace,
  },
  {
    number: "03",
    title: "Hold",
    text: "The event enters a local queue first, so an interrupted link does not lose the alert.",
    icon: Database,
  },
  {
    number: "04",
    title: "Record",
    text: "The control-room server groups repeats and writes the event to the signed evidence ledger.",
    icon: FileCheck2,
  },
  {
    number: "05",
    title: "Act",
    text: "Operators review the snapshot and clip, then acknowledge or close the alert. Signed notifications can reach command systems.",
    icon: BellRing,
  },
];

const architecture = [
  {
    icon: Cpu,
    eyebrow: "01 / EDGE NODE",
    title: "At each camera",
    intro: "Detection and rules stay close to the video source.",
    rows: [
      ["Detection & tracking", "YOLO11 · ByteTrack · ONNX Runtime · OpenCV"],
      ["Zones & identity", "Camera polygons, PaddleOCR, SCRFD with ArcFace"],
      ["Local continuity", "Duplicate-safe queue · FFmpeg/HLS on request"],
    ],
  },
  {
    icon: ServerCog,
    eyebrow: "02 / CONTROL ROOM",
    title: "In the control room",
    intro: "Events, evidence, access and live updates are coordinated centrally.",
    rows: [
      ["API & rules", "FastAPI · SQLAlchemy"],
      ["Alerts & evidence", "PostgreSQL 16 · Alembic"],
      ["Signed evidence", "SHA-256 hash chain · HMAC signatures"],
      ["Live state & health", "Redis · WebSocket · Prometheus metrics"],
    ],
  },
  {
    icon: Layers3,
    eyebrow: "03 / OPERATOR VIEW",
    title: "On the operator’s screen",
    intro: "A role-aware workspace for reviewing incidents and managing cameras.",
    rows: [
      ["Review", "Live alert queue · snapshots · clips · original files"],
      ["Configure", "Camera zone editor · role-based access"],
      ["Report", "Incident summaries · CSV export"],
    ],
  },
];

const designTargets = [
  {
    value: "Under 2 s",
    measure: "Event to operator screen",
    detail: "Rules run at the edge and alerts are pushed over WebSocket.",
  },
  {
    value: "50 kbps",
    measure: "Uplink per camera",
    detail: "Only event data is sent; video stays at the edge until requested.",
  },
  {
    value: "5–10 fps",
    measure: "Frames analysed per camera",
    detail: "YOLO11 and ByteTrack run through ONNX Runtime on the edge node.",
  },
  {
    value: "24 hours",
    measure: "Target link outage buffer",
    detail: "A local queue resends events safely when connectivity returns.",
  },
];

const navigation = [
  ["Challenges", "#problem"],
  ["Capabilities", "#capabilities"],
  ["How it works", "#how-it-works"],
  ["Architecture", "#architecture"],
  ["About", "#about"],
];

function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem("ibvap-theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {
    // Theme selection still works for this session when storage is unavailable.
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function SectorMap() {
  return (
    <figure className="sector-figure" aria-labelledby="sector-caption">
      <div className="sector-frame">
        <div className="sector-toolbar">
          <span className="sector-location"><span className="toolbar-mark"><MapSymbol /></span> SECTOR 08 <span className="toolbar-slash">/</span> RIVER POST</span>
          <span className="sample-tag"><span /> SAMPLE EVENT</span>
        </div>

        <svg className="sector-map" viewBox="0 0 720 470" role="img" aria-label="Illustrative border-sector map showing camera coverage, a restricted zone, and a detected crossing">
          <defs>
            <pattern id="zone-hatch" width="9" height="9" patternTransform="rotate(35)" patternUnits="userSpaceOnUse">
              <line x1="0" x2="0" y1="0" y2="9" className="map-hatch-line" />
            </pattern>
            <pattern id="map-grid" width="72" height="72" patternUnits="userSpaceOnUse">
              <path d="M 72 0 L 0 0 0 72" className="map-grid-line" />
            </pattern>
          </defs>

          <rect x="0" y="0" width="720" height="470" className="map-ground" />
          <rect x="0" y="0" width="720" height="470" fill="url(#map-grid)" />
          <g className="map-grid-labels" aria-hidden="true">
            <text x="24" y="95">42</text><text x="24" y="167">43</text><text x="24" y="239">44</text><text x="24" y="311">45</text><text x="24" y="383">46</text>
            <text x="110" y="25">17</text><text x="254" y="25">16</text><text x="398" y="25">15</text><text x="542" y="25">14</text><text x="660" y="25">13</text>
          </g>

          <g className="map-contours" aria-hidden="true">
            <path d="M-20 118 C75 48 132 76 201 126 S319 187 398 127 S564 39 744 98" />
            <path d="M-22 139 C77 69 131 98 195 148 S317 207 408 150 S575 62 747 120" />
            <path d="M-20 383 C91 301 140 322 217 368 S329 426 427 370 S590 278 742 332" />
            <path d="M-20 405 C87 324 150 346 222 390 S331 448 436 391 S597 300 741 353" />
            <path d="M104 -22 C52 63 78 96 129 157 S190 259 153 333 S107 423 145 495" />
            <path d="M626 -22 C570 55 593 118 644 174 S693 280 650 350 S606 434 641 495" />
          </g>

          <path className="map-river" d="M70 96 C166 144 132 190 224 210 S367 209 405 270 S519 316 650 397" />
          <text className="map-river-label" x="278" y="225" transform="rotate(13 278 225)">RIVER</text>

          <path className="map-boundary" d="M65 305 C199 283 270 326 377 307 S547 281 665 292" />
          <text className="map-boundary-label" x="107" y="294">INTERNATIONAL BOUNDARY</text>

          <polygon className="map-zone-fill" points="431,253 576,235 623,335 477,359 436,318" />
          <polygon className="map-zone-hatch" points="431,253 576,235 623,335 477,359 436,318" />
          <polygon className="map-zone-outline" points="431,253 576,235 623,335 477,359 436,318" />
          <text className="map-zone-label" x="482" y="279">RESTRICTED ZONE A</text>

          <path className="map-person-path" d="M670 126 C624 158 630 198 580 220 S532 252 526 304" />

          <g className="camera-beams" aria-hidden="true">
            <path d="M145 237 L83 173 L220 178 Z" />
            <path d="M373 167 L329 231 L462 269 Z" />
            <path d="M570 354 L500 399 L647 425 Z" />
          </g>

          <g className="camera-marker" transform="translate(145 237)">
            <circle r="12" /><path d="M-5 -4h7l5 4v6h-12z" /><circle className="camera-lens" cx="2" cy="1" r="1.8" />
          </g>
          <g className="camera-marker camera-marker-active" transform="translate(373 167)">
            <circle r="12" /><path d="M-5 -4h7l5 4v6h-12z" /><circle className="camera-lens" cx="2" cy="1" r="1.8" />
          </g>
          <g className="camera-marker" transform="translate(570 354)">
            <circle r="12" /><path d="M-5 -4h7l5 4v6h-12z" /><circle className="camera-lens" cx="2" cy="1" r="1.8" />
          </g>

          <text className="map-camera-label" x="111" y="260">NORTH POST</text>
          <text className="map-camera-label" x="347" y="144">RIVER POST</text>
          <text className="map-camera-label" x="548" y="382">GATE ROAD</text>

          <circle className="map-alert-halo" cx="526" cy="304" r="18" />
          <circle className="map-alert-point" cx="526" cy="304" r="5.5" />
          <path className="map-alert-leader" d="M533 300 L568 278" />
          <text className="map-alert-label" x="569" y="275">CROSSING</text>
        </svg>

        <aside className="map-alert-card" aria-label="Example alert details">
          <div className="map-alert-heading">
            <span className="alert-kind"><span /> ZONE INTRUSION</span>
            <time>02:14:07 IST</time>
          </div>
          <strong>River post · Restricted zone A</strong>
          <p>Person detected <span>Confidence 0.91</span></p>
          <div className="ledger-stamp"><Check size={15} /> Signed to ledger <b>Entry 48,213</b></div>
        </aside>
      </div>
      <figcaption id="sector-caption">Illustrative alert flow: edge detection → operator review → signed evidence record.</figcaption>
    </figure>
  );
}

function MapSymbol() {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true">
      <path d="M3 4.5 7.5 2l5 2.3L17 2v13.5L12.5 18l-5-2.3L3 18V4.5Z" />
      <path d="M7.5 2v13.7M12.5 4.3V18" />
    </svg>
  );
}

function App() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (themeColor) themeColor.content = theme === "dark" ? "#0F1B21" : "#E8ECE4";
    try {
      localStorage.setItem("ibvap-theme", theme);
    } catch {
      // Ignore storage errors; the selected theme remains active until the page closes.
    }
  }, [theme]);

  useEffect(() => {
    const closeMenuOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", closeMenuOnEscape);
    return () => document.removeEventListener("keydown", closeMenuOnEscape);
  }, []);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className="site-header">
        <div className="header-row wrap">
          <a className="brand" href="#top" aria-label="IBVAP home">
            <span className="brand-mark"><Eye size={21} strokeWidth={1.8} /></span>
            <span className="brand-name">IBVAP</span>
          </a>

          <nav id="primary-navigation" className={`primary-navigation${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
            {navigation.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>{label}</a>
            ))}
          </nav>

          <div className="header-actions">
            <button
              className="icon-button theme-button"
              type="button"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              onClick={toggleTheme}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <a className="header-cta" href="#how-it-works">Follow an alert <ArrowRight size={15} /></a>
            <button
              className="icon-button menu-button"
              type="button"
              aria-controls="primary-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="hero wrap" id="top">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-rule" /> SMART INDIA HACKATHON 2026 <span className="eyebrow-divider">/</span> SIH26187</div>
            <h1>Border cameras that <span>raise the alert</span> themselves.</h1>
            <p className="hero-lead">
              IBVAP puts AI beside the camera. It spots people and vehicles, checks the zones you draw, and sends compact alerts to the control room. Each event is recorded for later verification.
            </p>
            <div className="hero-actions">
              <a className="button button-primary" href="#how-it-works">See how it works <ArrowRight size={17} /></a>
              <a className="button button-secondary" href="#capabilities">Explore capabilities <ChevronRight size={17} /></a>
            </div>
            <div className="hero-proof" aria-label="Platform design principles">
              <span><CheckCircle2 size={16} /> Works with existing cameras</span>
              <span><CheckCircle2 size={16} /> Built for weak links</span>
              <span><CheckCircle2 size={16} /> Traceable event records</span>
            </div>
          </div>
          <div className="hero-visual"><SectorMap /></div>
        </section>

        <section className="target-ribbon" aria-label="Design targets">
          <div className="wrap target-ribbon-inner">
            <span className="target-ribbon-label"><Gauge size={17} /> DESIGN TARGETS</span>
            <div><strong>Under 2 s</strong><span>event delivery</span></div>
            <div><strong>50 kbps</strong><span>per camera</span></div>
            <div><strong>24 hours</strong><span>offline queue</span></div>
            <a href="#targets">View targets <ArrowDownRight size={15} /></a>
          </div>
        </section>

        <section className="section wrap problem-section" id="problem">
          <div className="section-heading">
            <div>
              <span className="section-kicker">THE OPERATIONAL GAP</span>
              <h2>Why cameras alone aren’t enough.</h2>
            </div>
            <p>Remote border posts need more than another video wall. They need a way to notice, deliver and verify the event that matters.</p>
          </div>

          <div className="problem-grid">
            {problemItems.map(({ icon: Icon, title, text, answer }, index) => (
              <article className="problem-card" key={title}>
                <div className="problem-card-top"><span className="problem-icon"><Icon size={20} /></span><span className="problem-index">0{index + 1}</span></div>
                <h3>{title}</h3>
                <p className="problem-copy">{text}</p>
                <div className="problem-answer"><span>IBVAP</span><p>{answer}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="section capabilities-section" id="capabilities">
          <div className="wrap">
            <div className="section-heading section-heading-centered">
              <span className="section-kicker">WHAT IBVAP CAN DO</span>
              <h2>From detection to a verifiable record.</h2>
              <p>Edge analytics, event delivery and evidence review work together across the camera network.</p>
            </div>

            <div className="capability-grid">
              {capabilities.map(({ icon: Icon, label, title, text, detail }) => (
                <article className="capability-card" key={title}>
                  <div className="capability-icon"><Icon size={21} strokeWidth={1.8} /></div>
                  <span className="capability-label">{label}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                  <div className="capability-detail"><span />{detail}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section wrap workflow-section" id="how-it-works">
          <div className="section-heading">
            <div>
              <span className="section-kicker">HOW AN ALERT TRAVELS</span>
              <h2>Five steps. One accountable event.</h2>
            </div>
            <p>The edge handles detection first. The control room then gives operators a record they can review and act on.</p>
          </div>

          <ol className="workflow-list">
            {alertSteps.map(({ number, title, text, icon: Icon }) => (
              <li className="workflow-step" key={number}>
                <div className="workflow-step-top"><span className="workflow-number">{number}</span><span className="workflow-icon"><Icon size={20} /></span></div>
                <h3>{title}</h3>
                <p>{text}</p>
                {number !== "05" && <span className="workflow-connector" aria-hidden="true"><ArrowRight size={15} /></span>}
              </li>
            ))}
          </ol>
        </section>

        <section className="section architecture-section" id="architecture">
          <div className="wrap">
            <div className="section-heading">
              <div>
                <span className="section-kicker">HOW IT’S BUILT</span>
                <h2>Three parts, each with one job.</h2>
              </div>
              <p>Detection happens beside the video. Decisions and records happen in the control room. Operators work from one permission-aware view.</p>
            </div>

            <div className="architecture-grid">
              {architecture.map(({ icon: Icon, eyebrow, title, intro, rows }) => (
                <article className="architecture-card" key={title}>
                  <div className="architecture-card-head"><span className="architecture-icon"><Icon size={20} /></span><span>{eyebrow}</span></div>
                  <h3>{title}</h3>
                  <p className="architecture-intro">{intro}</p>
                  <dl className="architecture-rows">
                    {rows.map(([term, description]) => (
                      <div key={term}><dt>{term}</dt><dd>{description}</dd></div>
                    ))}
                  </dl>
                </article>
              ))}
            </div>

            <div className="integration-note"><Network size={18} /><p><strong>Also connects to command systems</strong> through signed webhooks that retry until delivered. The stack is packaged as Docker Compose services behind Nginx.</p></div>
          </div>
        </section>

        <section className="section wrap targets-section" id="targets">
          <div className="section-heading target-heading">
            <div>
              <span className="section-kicker">DESIGN TARGETS</span>
              <h2>Designed around remote conditions.</h2>
            </div>
            <p>These are design targets from the project brief. Measurements on field hardware are in progress.</p>
          </div>

          <div className="design-target-grid">
            {designTargets.map(({ value, measure, detail }) => (
              <article className="design-target-card" key={measure}>
                <span className="target-check"><Check size={15} /></span>
                <strong>{value}</strong>
                <h3>{measure}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title">
          <div className="wrap">
            <div className="about-grid">
              <div className="about-copy">
                <span className="section-kicker">ABOUT THE PROJECT</span>
                <h2 id="about-title">About us</h2>
                <p>We’re building IBVAP for Smart India Hackathon 2026 under problem statement SIH26187. We started from three facts about border posts: they’re remote, their links are unreliable, and an alert is only useful if it can be trusted later.</p>
                <p>Every design choice in IBVAP follows from those three facts. We run the vision work at the camera, keep alerts safe through outages, and make the evidence record verifiable.</p>
              </div>

              <dl className="about-facts">
                <div><dt>Competition</dt><dd>Smart India Hackathon 2026</dd></div>
                <div><dt>Problem statement</dt><dd>SIH26187</dd></div>
                <div><dt>Team</dt><dd>Tech Tofaan</dd></div>
                <div><dt>Institute</dt><dd>MMMUT Gorakhpur</dd></div>
                <div><dt>Stage</dt><dd>Working prototype</dd></div>
              </dl>
            </div>

            <h3 className="team-title">The team</h3>
            <ul className="team-list">
              <li className="team-member"><span className="team-avatar" aria-hidden="true">AM</span><div><strong className="team-name">Arpita Mishra</strong><span className="team-role">AI model training</span></div></li>
              <li className="team-member"><span className="team-avatar" aria-hidden="true">SK</span><div><strong className="team-name">Saumyjeet Kumar</strong><span className="team-role">AI model training</span></div></li>
              <li className="team-member"><span className="team-avatar" aria-hidden="true">SM</span><div><strong className="team-name">Shivam Mishra</strong><span className="team-role">AI model training</span></div></li>
              <li className="team-member"><span className="team-avatar" aria-hidden="true">SK</span><div><strong className="team-name">Saurabh Kumar</strong><span className="team-role">Backend and system design</span></div></li>
              <li className="team-member"><span className="team-avatar" aria-hidden="true">S</span><div><strong className="team-name">Satyavrat</strong><span className="team-role">Backend design</span></div></li>
              <li className="team-member"><span className="team-avatar" aria-hidden="true">VS</span><div><strong className="team-name">Vishaka Singh</strong><span className="team-role">Research</span></div></li>
            </ul>
          </div>
        </section>

        <section className="closing-cta wrap" aria-label="Explore the platform">
          <div>
            <span className="section-kicker">DETECTION · CONTEXT · RESPONSE</span>
            <h2>Follow one alert from camera to signed record.</h2>
          </div>
          <a className="button button-light" href="#how-it-works">Explore the alert flow <ArrowRight size={17} /></a>
        </section>
      </main>

      <footer className="site-footer">
        <div className="wrap footer-main">
          <div className="footer-brand-block">
            <a className="brand" href="#top" aria-label="IBVAP home">
              <span className="brand-mark"><Eye size={20} strokeWidth={1.8} /></span>
              <span className="brand-name">IBVAP</span>
            </a>
            <p>Intelligent Border Video Analytics Platform</p>
          </div>
          <nav className="footer-navigation" aria-label="Footer navigation">
            {navigation.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
          </nav>
        </div>
        <div className="wrap footer-bottom">
          <span>© {new Date().getFullYear()} IBVAP · SIH 2026 · SIH26187</span>
          <a href="#top">Back to top <ArrowRight size={14} /></a>
        </div>
      </footer>
    </div>
  );
}

export default App;
