import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const initialLogs = [
  { t: "datapilot analyze customer_data.csv", c: "" },
  { t: "Reading 12 columns × 1,200 rows...", c: "log-sys" },
  { t: "Missing values → age: 142, dept: 89", c: "log-err" },
  { t: "Duplicates found → 847 rows", c: "log-err" },
  { t: "datapilot plan --model gemini", c: "" },
  { t: "LLM generating cleaning strategy...", c: "log-sys" },
  { t: "[1] drop_duplicates ✓ conf 0.99", c: "log-ok" },
  { t: "datapilot execute --plan plan.json", c: "" },
  { t: "Quality score: 34 → 94 (+177%)", c: "log-ok" },
  { t: "cleaned_dataset.csv ready", c: "log-ok" },
  { t: "", c: "cursor-line" }
];

// Brutalist Animation Variants
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const brutalReveal: Variants = {
  hidden: { opacity: 0, y: 40, clipPath: 'inset(100% 0 0 0)' },
  show: { 
    opacity: 1, 
    y: 0, 
    clipPath: 'inset(0% 0 0 0)',
    transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }
  }
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -40 },
  show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } }
};

export default function Landing() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<{t: string, c: string}[]>([]);
  const termRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < initialLogs.length) {
        setLogs(prev => [...prev, initialLogs[currentIdx]]);
        currentIdx++;
      } else {
        currentIdx = 0;
        setLogs([{ t: "> RESETTING TERMINAL...", c: "log-sys" }]);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (termRef.current) {
      termRef.current.scrollTop = termRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="landing-page-root">
      
      {/* NAV */}
      <motion.nav 
        initial={{ y: -100 }} 
        animate={{ y: 0 }} 
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <div className="nav-brand">DATAPILOT</div>
        <div className="nav-links">
          <a href="#pipeline" className="nav-link">ORCHESTRATION_ARCHITECTURE</a>
          <a href="#features" className="nav-link">PLATFORM_FEATURES</a>
          <a href="#upload" className="nav-link">UPLOAD_DATA</a>
        </div>
        <div className="nav-status">
          <div className="status-dot"></div>
          SYS_ONLINE
        </div>
      </motion.nav>

      {/* HERO */}
      <header id="hero">
        <motion.div 
          className="hero-content"
          variants={staggerContainer}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={brutalReveal} className="hero-eyebrow">PROTOCOL_01: INGEST_AND_CLEAN</motion.div>
          <motion.h1 variants={brutalReveal}>
            YOUR DATA.<br/><em>SURGICALLY</em><br/>CLEANED.
          </motion.h1>
          <motion.p variants={brutalReveal} className="hero-desc">
            UPLOAD MESSY DATASETS. DATAPILOT AI ANALYZES EVERY COLUMN, PLANS A PRECISION CLEANING STRATEGY, EXECUTES IT SAFELY, THEN HANDS YOU A QUALITY-SCORED REPORT.
          </motion.p>
          <motion.button 
            variants={brutalReveal} 
            whileHover={{ scale: 0.98 }}
            whileTap={{ scale: 0.95 }}
            className="brutal-btn" 
            onClick={() => navigate('/upload')} 
          >
            INITIALIZE <span style={{ marginLeft: '0.8rem' }}>→</span>
          </motion.button>
        </motion.div>
        
        <motion.div 
          className="hero-terminal"
          initial={{ opacity: 0, x: 50, rotate: 2 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.4 }}
          whileHover={{ scale: 1.02, rotate: -1 }}
        >
          <div className="terminal-window" style={{ boxShadow: '16px 16px 0px 0px var(--black)' }}>
            <div className="term-header">
              <span>TERMINAL_VIEW</span>
              <span>ROOT@DATAPILOT</span>
            </div>
            <div className="term-body" id="term-logs" ref={termRef}>
              <div className="log log-sys">&gt; EXECUTING STARTUP SEQUENCE</div>
              <div className="log">&gt; MOUNTING DATA VOLUMES... <span className="log-ok">OK</span></div>
              <div className="log">&gt; SYSTEM READY. WAITING FOR INPUT...</div>
              {logs.map((log, i) => {
                if (!log) return null;
                return (
                <div key={i} className={`log ${log.c !== 'cursor-line' ? log.c : ''}`}>
                  {log.c === 'cursor-line' ? (
                    <>{log.t}<span className="cursor"></span></>
                  ) : (
                    log.t.startsWith('>') ? log.t : `> ${log.t}`
                  )}
                </div>
              )})}
              {!logs.some(l => l.c === 'cursor-line') && (
                <div className="log cursor-line"><span className="cursor"></span></div>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {/* PIPELINE */}
      <section id="pipeline">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          style={{ padding: '5rem 3rem 3rem 3rem', background: 'var(--white)' }}
        >
          <motion.div variants={brutalReveal} className="section-label" style={{ fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', padding: '0.3rem 0.6rem', background: 'var(--black)', color: 'var(--white)', marginBottom: '1.2rem', boxShadow: '2px 2px 0px 0px var(--grey)' }}>ORCHESTRATION_ARCHITECTURE</motion.div>
          <motion.h2 variants={brutalReveal} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3vw, 2.8rem)', fontWeight: '900', letterSpacing: '-0.02em', maxWidth: '750px', lineHeight: '1.1' }}>
            Built for <em>Reliability</em>.
          </motion.h2>
          <motion.p variants={brutalReveal} style={{ fontSize: '0.95rem', fontWeight: '700', color: '#333', lineHeight: '1.7', maxWidth: '500px', marginTop: '1.5rem' }}>
            A deterministic 7-step pipeline. We separate AI planning from safe execution to guarantee your data is never hallucinated or corrupted.
          </motion.p>
        </motion.div>
        
        <motion.div 
          className="pipeline-grid"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {[
            { num: '01', name: 'INGEST', desc: 'FastAPI endpoints. Direct file upload. No middleware.' },
            { num: '02', name: 'ANALYZE', desc: 'Dataprep engine. Detect nulls, duplicates, outliers.' },
            { num: '03', name: 'PLAN', desc: 'LangChain orchestration. Deterministic AI planning.' },
            { num: '04', name: 'EXECUTE', desc: 'PyJanitor + Pandas. Safe execution layer.' },
            { num: '05', name: 'VALIDATE', desc: 'Post-clean checks: integrity, type consistency, null reduction.' },
            { num: '06', name: 'REPORT', desc: 'ydata-profiling generates before/after reports with quality scores.' },
            { num: '07', name: 'VISUALIZE', desc: 'Interactive dashboard shows AI reasoning, diffs, and improvements.' }
          ].map((step, idx) => (
            <motion.div 
              key={idx} 
              className="pipe-step" 
              variants={slideIn}
              whileHover={{ y: -5 }}
            >
              <span className="pipe-num">{step.num}</span>
              <div className="pipe-name">{step.name}</div>
              <div className="pipe-desc">{step.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* FEATURES */}
      <section id="features">
        <motion.div 
          style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '1.5rem' }}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={brutalReveal} className="section-label" style={{ fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', padding: '0.3rem 0.6rem', background: 'var(--black)', color: 'var(--white)', marginBottom: '1.2rem', boxShadow: '2px 2px 0px 0px var(--white)' }}>PLATFORM FEATURES</motion.div>
          <motion.h2 variants={brutalReveal} style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.02em', maxWidth: '750px', marginBottom: '2rem', lineHeight: '1.1' }}>
            Intelligence you can <em>see</em>.
          </motion.h2>
        </motion.div>

        <motion.div 
          className="bento"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Quality Score Card */}
          <motion.div 
            className="bento-card span-4" 
            variants={brutalReveal}
            whileHover={{ scale: 1.02, zIndex: 10, boxShadow: '8px 8px 0px 0px var(--black)' }}
          >
            <div className="bento-card-label">QUALITY_ENGINE</div>
            <div className="bento-card-title">DATASET SCORE</div>
            <div className="bento-card-body">Real-time scoring across missing values, duplicates, and outliers.</div>
            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                transition={{ type: 'spring', delay: 0.5 }}
                style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: '900', lineHeight: '0.8' }}
              >
                94
              </motion.div>
              <div style={{ fontWeight: '800', fontSize: '1rem', color: '#666' }}>/ 100</div>
            </div>
          </motion.div>

          {/* AI Reasoning Card */}
          <motion.div 
            className="bento-card span-8" 
            variants={brutalReveal}
            whileHover={{ scale: 1.02, zIndex: 10, boxShadow: '8px 8px 0px 0px var(--black)' }}
          >
            <div className="bento-card-label">AI_PLANNER</div>
            <div className="bento-card-title">LLM REASONING</div>
            <div className="bento-card-body">Every cleaning decision is explained and validated. No hallucinations.</div>
            <div className="ai-reasoning">
              <div className="ai-step">
                <div className="ai-step-num">1</div>
                <div className="ai-step-text">Drop 847 exact duplicate rows. [Conf: 0.99]</div>
              </div>
              <div className="ai-step">
                <div className="ai-step-num">2</div>
                <div className="ai-step-text">Impute `age` nulls using median strategy. Skew detected.</div>
              </div>
            </div>
          </motion.div>

          {/* Diff Viewer Card */}
          <motion.div 
            className="bento-card span-8" 
            variants={brutalReveal}
            whileHover={{ scale: 1.02, zIndex: 10, boxShadow: '8px 8px 0px 0px var(--black)' }}
          >
            <div className="bento-card-label">BEFORE_AFTER</div>
            <div className="bento-card-title">CELL-LEVEL DIFFS</div>
            <div className="bento-card-body">Inspect exactly what changed row by row.</div>
            <div className="diff-view">
              <div className="diff-row diff-del">- user_001 | 28.0 | NaN</div>
              <div className="diff-row diff-add">+ user_001 | 28.0 | Sales</div>
              <div className="diff-row">  [↑ DUPLICATE REMOVED]</div>
            </div>
          </motion.div>

          {/* Outputs Card */}
          <motion.div 
            className="bento-card span-4" 
            variants={brutalReveal}
            whileHover={{ scale: 1.02, zIndex: 10, boxShadow: '8px 8px 0px 0px var(--black)' }}
          >
            <div className="bento-card-label">OUTPUTS</div>
            <div className="bento-card-title">AUDITABLE EXPORTS</div>
            <div className="bento-card-body">Download everything you need.</div>
            <div style={{ marginTop: '1rem', fontWeight: '800', fontSize: '0.75rem', lineHeight: '2' }}>
              [⬇] CLEANED_DATASET.CSV<br/>
              [⬇] PROFILING_REPORT.HTML
            </div>
          </motion.div>

          {/* CTA Mini Card */}
          <motion.div 
            className="bento-card span-12" 
            variants={brutalReveal}
            whileHover={{ scale: 1.01 }}
            style={{ background: 'var(--black)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem' }}
          >
            <div>
              <div className="bento-card-title" style={{ margin: '0', fontSize: '1.8rem' }}>READY TO CLEAN?</div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="brutal-btn" 
              style={{ background: 'var(--white)', color: 'var(--black)', fontSize: '0.85rem', padding: '0.8rem 1.6rem' }} 
              onClick={() => navigate('/upload')} 
            >
              UPLOAD DATASET →
            </motion.button>
          </motion.div>

        </motion.div>
      </section>

      {/* UPLOAD */}
      <section id="upload" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={brutalReveal} className="section-label" style={{ fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', padding: '0.3rem 0.6rem', background: 'var(--black)', color: 'var(--white)', marginBottom: '1.2rem', boxShadow: '2px 2px 0px 0px var(--grey)' }}>UPLOAD INTERFACE</motion.div>
          <motion.h2 variants={brutalReveal} className="upload-main-text">
            DRAG, DROP,<br/><em>TRANSFORM</em>.
          </motion.h2>
          <motion.p variants={brutalReveal} style={{ fontSize: '0.95rem', fontWeight: '700', color: '#333', lineHeight: '1.7', maxWidth: '400px' }}>
            The moment your file lands, the pipeline begins. Analysis in seconds. AI plan in under a minute. Clean dataset ready to download.
          </motion.p>
          <motion.div variants={staggerContainer} style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '800', fontSize: '0.85rem' }}>
            {['Automatic issue detection', 'LLM plans cleaning strategy', 'Review, approve, then execute', 'Download cleaned file + report'].map((item, idx) => (
              <motion.div key={idx} variants={slideIn} style={{ display: 'flex', gap: '10px' }}>
                <span style={{ color: 'var(--black)' }}>[+]</span> {item}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div 
          className="upload-zone" 
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.02, rotate: 1, boxShadow: '16px 16px 0px 0px var(--black)' }}
          whileTap={{ scale: 0.98, boxShadow: '4px 4px 0px 0px var(--black)' }}
          style={{ cursor: 'pointer', transition: 'box-shadow 0.2s' }} 
          onClick={() => navigate('/upload')} 
        >
          <span className="upload-icon">DRAG & DROP</span>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: '900', marginBottom: '0.8rem' }}>DROP YOUR DATASET HERE</div>
          <div style={{ fontWeight: '700', fontSize: '0.85rem', color: '#555', marginBottom: '1.5rem' }}>
            Drag & drop your file, or click to browse.<br/>
            DataPilot handles the rest automatically.
          </div>
          <div style={{ fontWeight: '800', fontSize: '0.75rem', marginBottom: '2rem', letterSpacing: '0.05em' }}>
            [.CSV] [.XLSX] [.JSON] [.PARQUET]
          </div>
          <button className="brutal-btn" style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem' }} onClick={(e) => { e.stopPropagation(); navigate('/upload'); }} >
            CHOOSE FILE →
          </button>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer>
        <div>
          <div className="footer-logo">DATAPILOT</div>
          <div style={{ fontWeight: '800', fontSize: '0.75rem', color: '#555' }}>AI-Powered Intelligent Data Cleaning Platform</div>
        </div>
        <div className="footer-right">
          Built with LangChain · FastAPI · PyJanitor<br/>
          Orchestration-first · Production-grade
        </div>
      </footer>

    </div>
  );
}
