import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Activity,
  Atom,
  Biohazard,
  Brain,
  CloudFog,
  Database,
  Download,
  FlaskConical,
  HeartPulse,
  Microscope,
  ShieldCheck,
  Sparkles,
  Wind,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  Pie,
  PieChart,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import EvidenceMatrix from "./components/EvidenceMatrix";
import "./style.css";

const proteins = [
  { name: "CXCL17", className: "Inflammatory signalling", source: "Epithelial / immune", weight: 8.5 },
  { name: "WFDC2", className: "Epithelial secretion", source: "AT2 / epithelial", weight: 9.1 },
  { name: "CEACAM5", className: "Epithelial shedding", source: "Epithelial", weight: 7.8 },
  { name: "LAMP3", className: "Surfactant / AT2 stress", source: "AT2 cells", weight: 8.8 },
  { name: "SFTPA1", className: "Surfactant biology", source: "AT2 cells", weight: 7.2 },
  { name: "SFTPD", className: "Surfactant immunity", source: "AT2 cells", weight: 7.6 },
  { name: "CDCP1", className: "Inflammatory / epithelial signalling", source: "Epithelial", weight: 7.7 },
  { name: "PRSS8", className: "Epithelial barrier biology", source: "Airway / epithelial", weight: 6.9 },
  { name: "PLAUR", className: "Inflammation / tissue remodelling", source: "Myeloid cells", weight: 8.2 },
  { name: "PIGR", className: "Mucosal immunity", source: "Epithelial", weight: 6.7 },
  { name: "MMP12", className: "Matrix remodelling", source: "Macrophage / myeloid", weight: 8.0 },
  { name: "ALPP", className: "Epithelial signal", source: "Epithelial", weight: 6.4 },
  { name: "GDF15", className: "Stress / inflammation", source: "Myeloid / epithelial", weight: 8.4 },
  { name: "TNFSF13B", className: "Immune signalling", source: "Fibroblast / immune", weight: 7.4 },
];

const pathwayData = [
  { pathway: "Air pollution", value: 88 },
  { pathway: "Smoking exposure", value: 84 },
  { pathway: "IL-1β inflammation", value: 91 },
  { pathway: "EGFR-mutant clones", value: 79 },
  { pathway: "AT2 stress", value: 86 },
  { pathway: "KAC state", value: 82 },
];

const preventionData = [
  { group: "Low signature", placebo: 18, antiIL1B: 15 },
  { group: "Medium signature", placebo: 36, antiIL1B: 27 },
  { group: "High signature", placebo: 72, antiIL1B: 39 },
];

const timelineData = [
  { year: "-6 yrs", signal: 22, visibleTumor: 0, inflammation: 35 },
  { year: "-5 yrs", signal: 33, visibleTumor: 0, inflammation: 42 },
  { year: "-4 yrs", signal: 47, visibleTumor: 0, inflammation: 54 },
  { year: "-3 yrs", signal: 59, visibleTumor: 5, inflammation: 66 },
  { year: "-2 yrs", signal: 72, visibleTumor: 12, inflammation: 75 },
  { year: "-1 yr", signal: 86, visibleTumor: 38, inflammation: 82 },
  { year: "Diagnosis", signal: 95, visibleTumor: 82, inflammation: 88 },
];

const cohortData = [
  { name: "UK Biobank", value: 48099 },
  { name: "External cohorts", value: 55839 },
  { name: "CANTOS", value: 4651 },
  { name: "TALENT", value: 752 },
];

const kacSteps = [
  "Healthy lung epithelial cell",
  "Air pollution or smoking exposure",
  "Macrophage IL-1β release",
  "AT2 / epithelial stress response",
  "KRT8+ CLDN4+ KAC-like transitional state",
  "Early tumour-promoting niche",
  "Detectable plasma protein signature",
];

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function App() {
  const [smoking, setSmoking] = useState(45);
  const [pollution, setPollution] = useState(55);
  const [copd, setCopd] = useState(25);
  const [age, setAge] = useState(62);
  const [proteinScore, setProteinScore] = useState(58);
  const [selectedProtein, setSelectedProtein] = useState(proteins[0]);
  const [activeStep, setActiveStep] = useState(0);
  const [dark, setDark] = useState(true);

  const riskScore = useMemo(() => {
    const raw =
      age * 0.23 +
      smoking * 0.24 +
      pollution * 0.18 +
      copd * 0.16 +
      proteinScore * 0.31;
    return clamp(Math.round(raw), 0, 100);
  }, [age, smoking, pollution, copd, proteinScore]);

  const category =
    riskScore >= 75
      ? "High molecular promotion signal"
      : riskScore >= 45
      ? "Intermediate molecular promotion signal"
      : "Lower molecular promotion signal";

  const radarData = [
    { axis: "Age", value: age },
    { axis: "Smoking", value: smoking },
    { axis: "PM exposure", value: pollution },
    { axis: "COPD", value: copd },
    { axis: "Protein signature", value: proteinScore },
    { axis: "IL-1β axis", value: clamp(Math.round((pollution + smoking + proteinScore) / 3), 0, 100) },
  ];

  const exportReport = () => {
    const report = `
Lung Plasma Prevention Studio Report

Risk score: ${riskScore}/100
Category: ${category}

Input profile:
Age score: ${age}
Smoking / pack-year burden: ${smoking}
Particulate matter exposure: ${pollution}
COPD / chronic lung injury: ${copd}
14-protein plasma signature score: ${proteinScore}

Scientific interpretation:
This app models the concept that circulating plasma proteins can act as early molecular warning signals of lung tumour promotion. The paper describes a 14-protein plasma signature associated with future lung cancer risk, air pollution exposure, smoking, EGFR-mutant lung clones, IL-1β inflammation, and early alveolar transitional states.

Important note:
This is a research education tool only. It is not a diagnostic tool or treatment recommendation.
`;
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "lung_plasma_prevention_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={dark ? "app dark" : "app light"}>
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="aurora aurora-three" />

      <header className="hero">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="hero-copy"
        >
          <div className="badge">
            <Sparkles size={18} />
            Molecular Cancer Prevention Dashboard
          </div>

          <h1>Lung Plasma Prevention Studio</h1>

          <p>
            A scientific browser app inspired by plasma protein signals that may reveal
            lung tumour promotion years before clinical diagnosis.
          </p>

          <div className="hero-actions">
            <button onClick={exportReport}>
              <Download size={18} />
              Export report
            </button>

            <button className="secondary" onClick={() => setDark(!dark)}>
              <Activity size={18} />
              Toggle theme
            </button>
          </div>
        </motion.div>

        <motion.div
          className="hero-orb"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
        >
          <div className="orb-core">
            <Microscope size={64} />
            <span>14 proteins</span>
          </div>

          {proteins.slice(0, 8).map((p, i) => (
            <motion.div
              key={p.name}
              className={`orbit-dot dot-${i}`}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ repeat: Infinity, duration: 2 + i * 0.2 }}
            >
              {p.name}
            </motion.div>
          ))}
        </motion.div>
      </header>

      <section className="grid metrics">
        <Metric icon={<HeartPulse />} title="Risk score" value={`${riskScore}/100`} subtitle={category} />
        <Metric icon={<FlaskConical />} title="Signature model" value="14 proteins" subtitle="Plasma warning panel" />
        <Metric icon={<CloudFog />} title="Exposure axis" value="PM / smoke" subtitle="Environmental tumour promotion" />
        <Metric icon={<ShieldCheck />} title="Prevention axis" value="IL-1β" subtitle="Anti-inflammatory interception" />
      </section>

      <main className="main-grid">
        <section className="panel simulator">
          <div className="panel-title">
            <Brain />
            <div>
              <h2>Interactive Molecular Risk Simulator</h2>
              <p>Move the sliders to simulate clinical and molecular risk factors.</p>
            </div>
          </div>

          <Slider label="Age-associated risk" value={age} setValue={setAge} />
          <Slider label="Smoking or pack-year burden" value={smoking} setValue={setSmoking} />
          <Slider label="Particulate matter / air pollution exposure" value={pollution} setValue={setPollution} />
          <Slider label="COPD or chronic lung injury burden" value={copd} setValue={setCopd} />
          <Slider label="14-protein plasma signature score" value={proteinScore} setValue={setProteinScore} />

          <div className="risk-meter">
            <div className="risk-fill" style={{ width: `${riskScore}%` }} />
            <span>{riskScore}%</span>
          </div>

          <div className="interpretation">
            <h3>{category}</h3>
            <p>
              This educational model reflects the concept that plasma proteins,
              chronic lung inflammation, air pollution, smoking, COPD, and age may
              combine to reveal a tumour-promoting lung environment before cancer
              becomes clinically visible.
            </p>
          </div>
        </section>

        <section className="panel chart-panel">
          <div className="panel-title">
            <Activity />
            <div>
              <h2>Early Warning Timeline</h2>
              <p>Protein signals may rise before a tumour is obvious on imaging.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="sig" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="tum" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#fb7185" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#fb7185" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="signal" stroke="#38bdf8" fill="url(#sig)" strokeWidth={3} />
              <Area type="monotone" dataKey="visibleTumor" stroke="#fb7185" fill="url(#tum)" strokeWidth={3} />
              <Line type="monotone" dataKey="inflammation" stroke="#facc15" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </section>
      </main>

      <section className="panel">
        <div className="panel-title">
          <Atom />
          <div>
            <h2>The 14-Protein Plasma Signature</h2>
            <p>Click each protein to view its role in the tumour-promotion network.</p>
          </div>
        </div>

        <div className="protein-layout">
          <div className="protein-grid">
            {proteins.map((p, i) => (
              <motion.button
                key={p.name}
                className={selectedProtein.name === p.name ? "protein-card active" : "protein-card"}
                onClick={() => setSelectedProtein(p)}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                whileHover={{ y: -6, scale: 1.03 }}
              >
                <strong>{p.name}</strong>
                <span>{p.className}</span>
                <div className="mini-bar">
                  <div style={{ width: `${p.weight * 10}%` }} />
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedProtein.name}
              className="protein-detail"
              initial={{ opacity: 0, x: 25 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -25 }}
            >
              <h3>{selectedProtein.name}</h3>
              <p><b>Functional class:</b> {selectedProtein.className}</p>
              <p><b>Likely signal source:</b> {selectedProtein.source}</p>
              <p>
                This protein is part of the circulating warning panel. The full pattern
                reflects lung epithelial stress, immune activation, inflammation, and
                tissue remodelling.
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <EvidenceMatrix />

      <section className="dashboard-grid">
        <section className="panel">
          <div className="panel-title">
            <Wind />
            <div>
              <h2>Pathway Pressure Map</h2>
              <p>Biological and environmental forces that converge on lung tumour promotion.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={pathwayData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="pathway" angle={-20} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                {pathwayData.map((entry, index) => (
                  <Cell
                    key={entry.pathway}
                    fill={["#38bdf8", "#a78bfa", "#fb7185", "#facc15", "#34d399", "#f97316"][index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Biohazard />
            <div>
              <h2>Risk Geometry</h2>
              <p>Multidimensional profile of molecular and exposure risk.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="axis" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar dataKey="value" stroke="#38bdf8" fill="#38bdf8" fillOpacity={0.35} strokeWidth={3} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </section>
      </section>

      <section className="panel">
        <div className="panel-title">
          <Microscope />
          <div>
            <h2>KAC Transitional-State Animation</h2>
            <p>Different lung epithelial lineages may converge toward a risky repair-like state.</p>
          </div>
        </div>

        <div className="kac-stage">
          {kacSteps.map((step, i) => (
            <motion.div
              key={step}
              className={activeStep === i ? "kac-node active" : "kac-node"}
              onClick={() => setActiveStep(i)}
              animate={{
                y: activeStep === i ? [-6, 6, -6] : 0,
                scale: activeStep === i ? 1.08 : 1,
              }}
              transition={{ repeat: activeStep === i ? Infinity : 0, duration: 2 }}
            >
              <span>{i + 1}</span>
              {step}
            </motion.div>
          ))}
        </div>

        <div className="kac-description">
          <h3>{kacSteps[activeStep]}</h3>
          <p>
            Lung injury, EGFR-mutant clones, particulate matter, and IL-1β inflammation
            can push lung epithelial cells and their surrounding environment toward
            states associated with early tumour promotion.
          </p>
        </div>

        <button className="wide-button" onClick={() => setActiveStep((activeStep + 1) % kacSteps.length)}>
          Animate next biological step
        </button>
      </section>

      <section className="dashboard-grid">
        <section className="panel">
          <div className="panel-title">
            <ShieldCheck />
            <div>
              <h2>Anti-IL-1β Prevention Concept</h2>
              <p>Educational visualization of prevention benefit by molecular signature group.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <BarChart data={preventionData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="group" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="placebo" fill="#fb7185" radius={[10, 10, 0, 0]} />
              <Bar dataKey="antiIL1B" fill="#34d399" radius={[10, 10, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        <section className="panel">
          <div className="panel-title">
            <Database />
            <div>
              <h2>Evidence Cohort Map</h2>
              <p>Population-scale and trial-scale evidence streams represented conceptually.</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie
                data={cohortData}
                dataKey="value"
                nameKey="name"
                outerRadius={110}
                innerRadius={55}
                paddingAngle={4}
              >
                {cohortData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={["#38bdf8", "#a78bfa", "#34d399", "#f97316"][index]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </section>

      <section className="panel science-brief">
        <div className="panel-title">
          <FlaskConical />
          <div>
            <h2>Scientific Interpretation Engine</h2>
            <p>Readable explanation generated from the current simulated profile.</p>
          </div>
        </div>

        <div className="brief-grid">
          <div>
            <h3>What the signal may mean</h3>
            <p>
              A high score suggests a molecular pattern consistent with epithelial stress,
              inflammatory signalling, immune-cell activation, and tissue remodelling.
            </p>
          </div>

          <div>
            <h3>What may drive the signal</h3>
            <p>
              Particulate matter, smoking exposure, COPD-like chronic injury,
              EGFR-mutant lung clones, macrophage inflammation, and IL-1β signalling
              may work together.
            </p>
          </div>

          <div>
            <h3>Prevention logic</h3>
            <p>
              The prevention idea is to intercept a risky inflammatory lung environment
              before malignancy becomes established.
            </p>
          </div>

          <div>
            <h3>Clinical caution</h3>
            <p>
              This app is educational. It is not a diagnostic tool, treatment recommendation,
              or replacement for medical assessment.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <p>
          Lung Plasma Prevention Studio, educational research visualization app for
          molecular cancer prevention and early lung cancer risk interpretation.
        </p>
      </footer>
    </div>
  );
}

function Metric({ icon, title, value, subtitle }) {
  return (
    <motion.div
      className="metric"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 220 }}
    >
      <div className="metric-icon">{icon}</div>
      <span>{title}</span>
      <strong>{value}</strong>
      <small>{subtitle}</small>
    </motion.div>
  );
}

function Slider({ label, value, setValue }) {
  return (
    <div className="slider-wrap">
      <div className="slider-label">
        <span>{label}</span>
        <b>{value}</b>
      </div>

      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
