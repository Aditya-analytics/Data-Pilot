import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function Execute() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    document.body.id = 'screen-execute';
    return () => { document.body.id = ''; };
  }, []);

  useEffect(() => {
    const script = [
      "[SYS] INITIALIZING EXECUTION PIPELINE",
      "[SYS] LOADING PYJANITOR EXTENSIONS",
      "> EXECUTING STEP 01: DROP NULL COLUMNS",
      "SUCCESS: DROPPED 2 COLUMNS",
      "> EXECUTING STEP 02: IMPUTE MISSING NUMERICS",
      "SUCCESS: IMPUTED 234 ROWS (MEAN STRATEGY)",
      "> EXECUTING STEP 03: DEDUPLICATE",
      "SUCCESS: REMOVED 84 EXACT MATCHES",
      "[SYS] VALIDATING OUTPUT DATASET",
      "SUCCESS: VALIDATION PASSED (SCORE: 98/100)",
      "[SYS] GENERATING FINAL ARTIFACTS..."
    ];

    let timer: any;
    let isCancelled = false;

    const runScript = (index: number) => {
      if (isCancelled) return;
      if (index < script.length) {
        setLogs(prev => [...prev, script[index]]);
        setProgress(Math.floor(((index + 1) / script.length) * 100));
        timer = setTimeout(() => runScript(index + 1), 500);
      } else {
        timer = setTimeout(() => {
          if (!isCancelled) navigate(`/results/${id}`);
        }, 1000);
      }
    };

    runScript(0);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [id, navigate]);

  return (
    <div className="screen active" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="execute-body fade-in" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <div style={{ background: 'var(--white)', borderRight: 'var(--border)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '4rem' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '3rem', fontWeight: 900, marginBottom: '2rem', lineHeight: 1 }}>
            EXECUTING<br/>PIPELINE
          </h2>
          
          <div style={{ border: 'var(--border)', padding: '1.5rem', background: 'var(--grey)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>OVERALL PROGRESS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ flex: 1, height: '12px', background: 'var(--white)', border: 'var(--border-light)' }}>
                <div style={{ height: '100%', background: 'var(--black)', width: `${progress}%`, transition: 'width 0.2s' }}></div>
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 900, width: '60px', textAlign: 'right' }}>
                {progress}%
              </div>
            </div>
          </div>
        </div>

        <div className="plan-right">
          <div className="plan-right-header">
            <div>EXECUTION LOGS // REAL-TIME</div>
            <div className="cell-tag">
              <span className="status-dot"></span> LIVE
            </div>
          </div>
          <div className="plan-terminal" style={{ fontSize: '0.8rem', lineHeight: 2 }}>
            {logs.map((log, i) => (
              <div key={i} style={{ color: log.includes('SUCCESS') ? '#10B981' : log.includes('[SYS]') ? '#666' : 'var(--white)' }}>
                {log}
              </div>
            ))}
            <span className="term-cursor"></span>
          </div>
        </div>
      </div>
    </div>
  );
}
