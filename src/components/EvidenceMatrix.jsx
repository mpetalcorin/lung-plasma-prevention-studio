import React from "react";
import { motion } from "framer-motion";
import { BookOpen, CheckCircle2, AlertTriangle, Target, TestTube2 } from "lucide-react";

const evidenceRows = [
  {
    icon: <BookOpen />,
    title: "Core discovery",
    level: "High",
    text: "A 14-protein plasma signature was identified using machine learning to predict future lung cancer risk.",
  },
  {
    icon: <CheckCircle2 />,
    title: "Validation",
    level: "Strong",
    text: "The protein signature was tested across multiple independent cohorts, supporting reproducibility.",
  },
  {
    icon: <AlertTriangle />,
    title: "Risk drivers",
    level: "Biologically plausible",
    text: "Smoking, particulate matter exposure, COPD-like injury, IL-1β inflammation, and EGFR-mutant clones may amplify the signal.",
  },
  {
    icon: <Target />,
    title: "Prevention window",
    level: "Translational",
    text: "The signature may help identify people more likely to benefit from anti-IL-1β molecular prevention.",
  },
  {
    icon: <TestTube2 />,
    title: "Clinical caution",
    level: "Research only",
    text: "This is not yet a routine clinical diagnostic test and should not be used for treatment decisions without clinical validation.",
  },
];

export default function EvidenceMatrix() {
  return (
    <section className="panel">
      <div className="panel-title">
        <BookOpen />
        <div>
          <h2>Scientific Evidence Matrix</h2>
          <p>How the paper moves from discovery to possible prevention.</p>
        </div>
      </div>

      <div className="evidence-matrix">
        {evidenceRows.map((row, index) => (
          <motion.div
            className="evidence-card"
            key={row.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.02 }}
          >
            <div className="evidence-icon">{row.icon}</div>
            <h3>{row.title}</h3>
            <span>{row.level}</span>
            <p>{row.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
