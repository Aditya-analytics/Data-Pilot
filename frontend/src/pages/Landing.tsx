import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

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
      {/* The original body content */}
      

  {/* NAV */}
  <nav>
    <div className="nav-brand">DATAPILOT</div>
    <div className="nav-links">
      <a href="#pipeline" className="nav-link">PIPELINE_ARCHITECTURE</a>
      <a href="#features" className="nav-link">PLATFORM_FEATURES</a>
      <a href="#upload" className="nav-link">UPLOAD_DATA</a>
    </div>
    <div className="nav-status">
      <div className="status-dot"></div>
      SYS_ONLINE
    </div>
  </nav>

  {/* HERO */}
  <header id="hero">
    <div className="hero-content">
      <div className="hero-eyebrow fade-in">PROTOCOL_01: INGEST_AND_CLEAN</div>
      <h1 className="fade-in" style={{ transitionDelay: '0.1s' }}>
        YOUR DATA.<br/><em>SURGICALLY</em><br/>CLEANED.
      </h1>
      <p className="hero-desc fade-in" style={{ transitionDelay: '0.2s' }}>
        UPLOAD MESSY DATASETS. DATAPILOT AI ANALYZES EVERY COLUMN, PLANS A PRECISION CLEANING STRATEGY, EXECUTES IT SAFELY, THEN HANDS YOU A QUALITY-SCORED REPORT.
      </p>
      <button className="brutal-btn fade-in" style={{ transitionDelay: '0.3s' }} onClick={() => navigate('/upload')} >
        INITIALIZE <span style={{ marginLeft: '0.8rem' }}>→</span>
      </button>
    </div>
    
    <div className="hero-terminal fade-in" style={{ transitionDelay: '0.4s' }}>
      <div className="terminal-window">
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
          {/* Default cursor if animation hasn't reached cursor-line yet */}
          {!logs.some(l => l.c === 'cursor-line') && (
            <div className="log cursor-line"><span className="cursor"></span></div>
          )}
        </div>
      </div>
    </div>
  </header>

  {/* PIPELINE */}
  <section id="pipeline">
    <div className="section-title-bar fade-in">ARCHITECTURE_PIPELINE</div>
    <div className="pipeline-grid">
      <div className="pipe-step fade-in">
        <span className="pipe-num">01</span>
        <div className="pipe-name">INGEST</div>
        <div className="pipe-desc">FastAPI endpoints. Direct file upload. No middleware.</div>
      </div>
      <div className="pipe-step fade-in" style={{ transitionDelay: '0.1s' }}>
        <span className="pipe-num">02</span>
        <div className="pipe-name">ANALYZE</div>
        <div className="pipe-desc">Dataprep engine. Detect nulls, duplicates, outliers.</div>
      </div>
      <div className="pipe-step fade-in" style={{ transitionDelay: '0.2s' }}>
        <span className="pipe-num">03</span>
        <div className="pipe-name">PLAN</div>
        <div className="pipe-desc">LangChain orchestration. Deterministic AI planning.</div>
      </div>
      <div className="pipe-step fade-in" style={{ transitionDelay: '0.3s' }}>
        <span className="pipe-num">04</span>
        <div className="pipe-name">EXECUTE</div>
        <div className="pipe-desc">PyJanitor + Pandas. Safe execution layer.</div>
      </div>
      <div className="pipe-step fade-in" style={{ transitionDelay: '0.4s' }}>
        <span className="pipe-num">05</span>
        <div className="pipe-name">VALIDATE</div>
        <div className="pipe-desc">Post-clean checks: integrity, type consistency, null reduction.</div>
      </div>
      <div className="pipe-step fade-in" style={{ transitionDelay: '0.5s' }}>
        <span className="pipe-num">06</span>
        <div className="pipe-name">REPORT</div>
        <div className="pipe-desc">ydata-profiling generates before/after reports with quality scores.</div>
      </div>
      <div className="pipe-step fade-in" style={{ transitionDelay: '0.6s' }}>
        <span className="pipe-num">07</span>
        <div className="pipe-name">VISUALIZE</div>
        <div className="pipe-desc">Interactive dashboard shows AI reasoning, diffs, and improvements.</div>
      </div>
    </div>
  </section>

  {/* FEATURES */}
  <section id="features">
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '1.5rem' }}>
      <div className="section-label" style={{ fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', padding: '0.3rem 0.6rem', background: 'var(--black)', color: 'var(--white)', marginBottom: '1.2rem', boxShadow: '2px 2px 0px 0px var(--white)' }}>PLATFORM FEATURES</div>
      <h2 className="fade-in" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.8rem, 2.5vw, 2.5rem)', fontWeight: '900', letterSpacing: '-0.02em', maxWidth: '750px', marginBottom: '2rem', lineHeight: '1.1' }}>
        Intelligence you can <em>see</em>.
      </h2>
    </div>

    <div className="bento">
      {/* Quality Score Card */}
      <div className="bento-card span-4 fade-in">
        <div className="bento-card-label">QUALITY_ENGINE</div>
        <div className="bento-card-title">DATASET SCORE</div>
        <div className="bento-card-body">Real-time scoring across missing values, duplicates, and outliers.</div>
        <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: '900', lineHeight: '0.8' }}>94</div>
          <div style={{ fontWeight: '800', fontSize: '1rem', color: '#666' }}>/ 100</div>
        </div>
      </div>

      {/* AI Reasoning Card */}
      <div className="bento-card span-8 fade-in" style={{ transitionDelay: '0.1s' }}>
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
      </div>

      {/* Diff Viewer Card */}
      <div className="bento-card span-8 fade-in" style={{ transitionDelay: '0.2s' }}>
        <div className="bento-card-label">BEFORE_AFTER</div>
        <div className="bento-card-title">CELL-LEVEL DIFFS</div>
        <div className="bento-card-body">Inspect exactly what changed row by row.</div>
        <div className="diff-view">
          <div className="diff-row diff-del">- user_001 | 28.0 | NaN</div>
          <div className="diff-row diff-add">+ user_001 | 28.0 | Sales</div>
          <div className="diff-row">  [↑ DUPLICATE REMOVED]</div>
        </div>
      </div>

      {/* Outputs Card */}
      <div className="bento-card span-4 fade-in" style={{ transitionDelay: '0.3s' }}>
        <div className="bento-card-label">OUTPUTS</div>
        <div className="bento-card-title">AUDITABLE EXPORTS</div>
        <div className="bento-card-body">Download everything you need.</div>
        <div style={{ marginTop: '1rem', fontWeight: '800', fontSize: '0.75rem', lineHeight: '2' }}>
          [⬇] CLEANED_DATASET.CSV<br/>
          [⬇] PROFILING_REPORT.HTML
        </div>
      </div>

      {/* CTA Mini Card */}
      <div className="bento-card span-12 fade-in" style={{ transitionDelay: '0.4s', background: 'var(--black)', color: 'var(--white)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '2rem' }}>
        <div>
          <div className="bento-card-title" style={{ margin: '0', fontSize: '1.8rem' }}>READY TO CLEAN?</div>
        </div>
        <button className="brutal-btn" style={{ background: 'var(--white)', color: 'var(--black)', fontSize: '0.85rem', padding: '0.8rem 1.6rem' }} onClick={() => navigate('/upload')} >
          UPLOAD DATASET →
        </button>
      </div>

    </div>
  </section>

  {/* UPLOAD */}
  <section id="upload" style={{ maxWidth: '1400px', margin: '0 auto' }}>
    <div className="fade-in">
      <div className="section-label" style={{ fontSize: '0.7rem', fontWeight: '800', display: 'inline-block', padding: '0.3rem 0.6rem', background: 'var(--black)', color: 'var(--white)', marginBottom: '1.2rem', boxShadow: '2px 2px 0px 0px var(--grey)' }}>UPLOAD INTERFACE</div>
      <h2 className="upload-main-text">
        DRAG, DROP,<br/><em>TRANSFORM</em>.
      </h2>
      <p style={{ fontSize: '0.95rem', fontWeight: '700', color: '#333', lineHeight: '1.7', maxWidth: '400px' }}>
        The moment your file lands, the pipeline begins. Analysis in seconds. AI plan in under a minute. Clean dataset ready to download.
      </p>
      <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '10px', fontWeight: '800', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--black)' }}>[+]</span> Automatic issue detection</div>
        <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--black)' }}>[+]</span> LLM plans cleaning strategy</div>
        <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--black)' }}>[+]</span> Review, approve, then execute</div>
        <div style={{ display: 'flex', gap: '10px' }}><span style={{ color: 'var(--black)' }}>[+]</span> Download cleaned file + report</div>
      </div>
    </div>

    <div className="upload-zone fade-in" style={{ transitionDelay: '0.2s', cursor: 'pointer' }} onClick={() => navigate('/upload')} >
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
    </div>
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
