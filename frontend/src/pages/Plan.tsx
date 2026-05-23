import { useEffect, useState, Fragment } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generatePlan } from '../services/api';

export default function Plan() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvedSteps, setApprovedSteps] = useState<Set<number>>(new Set());
  const [revealedSteps, setRevealedSteps] = useState(0);

  useEffect(() => {
    document.body.id = 'screen-plan';
    return () => { document.body.id = ''; };
  }, []);

  useEffect(() => {
    if (!loading && plan?.steps && revealedSteps < plan.steps.length) {
      const timer = setTimeout(() => {
        setRevealedSteps(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [loading, plan, revealedSteps]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      generatePlan(id)
        .then(res => {
          setPlan(res);
          // By default approve all steps
          if (res?.steps) {
            setApprovedSteps(new Set(res.steps.map((_: any, i: number) => i)));
          }
        })
        .catch(err => setError(err.message || "Failed to generate AI plan"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const toggleApproval = (index: number) => {
    const newSet = new Set(approvedSteps);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setApprovedSteps(newSet);
  };

  const handleExecute = () => {
    navigate(`/execute/${id}`);
  };

  return (
    <div className="screen active" style={{flex: 1}}>
      <div className="plan-body fade-in">
        <div className="plan-left">
          <div className="plan-left-header">
            <h3>AI CLEANING PLAN</h3>
            <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#555' }}>
              {plan?.steps?.length || 0} STEPS PROPOSED
            </div>
          </div>
          
          <div className="plan-steps">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)' }}>
                ORCHESTRATING AI PLAN...
              </div>
            ) : error ? (
              <div style={{ padding: '1rem', border: '1px solid red', color: 'red' }}>
                [ERROR]: {error}
              </div>
            ) : (
              plan?.steps?.map((step: any, index: number) => {
                if (index >= revealedSteps) return null;
                const isApproved = approvedSteps.has(index);
                return (
                  <div key={index} className={`plan-step-card ${isApproved ? 'approved' : 'rejected'}`} style={{ animation: 'revealStep 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}>
                    <div className="plan-step-top">
                      <div className="plan-step-num">{(index + 1).toString().padStart(2, '0')}</div>
                      <div className="plan-step-info">
                        <div className="plan-step-name">{step.action}</div>
                        <div className="plan-step-desc">{step.reasoning}</div>
                        {step.columns && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.65rem', fontWeight: 800 }}>
                            TARGETS: {step.columns.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="plan-step-meta">
                      <div className="conf-bar-wrap">
                        CONF: {Math.round(step.confidence_score * 100)}%
                        <div className="conf-track">
                          <div className="conf-fill" style={{ width: `${step.confidence_score * 100}%` }}></div>
                        </div>
                      </div>
                      <div className="plan-step-actions">
                        <button 
                          className={`action-btn approve ${isApproved ? 'active-approve' : ''}`}
                          onClick={() => toggleApproval(index)}
                        >✓</button>
                        <button 
                          className={`action-btn reject ${!isApproved ? 'active-reject' : ''}`}
                          onClick={() => toggleApproval(index)}
                        >✗</button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="plan-footer">
            <button className="btn" onClick={() => navigate(`/analyze/${id}`)}>← BACK</button>
            <button 
              className="btn btn-primary" 
              onClick={handleExecute}
              disabled={loading || !!error || approvedSteps.size === 0 || revealedSteps < (plan?.steps?.length || 0)}
              style={{ transition: 'opacity 0.3s', opacity: revealedSteps < (plan?.steps?.length || 0) ? 0.5 : 1 }}
            >
              {revealedSteps < (plan?.steps?.length || 0) ? 'GENERATING PLAN...' : 'APPROVE & EXECUTE →'}
            </button>
          </div>
        </div>

        <div className="plan-right">
          <div className="plan-right-header">
            <div>TERMINAL // REASONING ENGINE</div>
            <div style={{ color: '#888' }}>{id?.substring(0,8)}</div>
          </div>
          <div className="plan-terminal">
            <span className="t-sys">[SYS]</span> INITIALIZING PLANNER ENGINE...<br />
            <span className="t-sys">[SYS]</span> INGESTING ANALYSIS REPORT...<br />
            <span className="t-ok">SUCCESS</span> DATA LOADED (1200 ROWS, 12 COLS)<br /><br />
            
            <style>{`@keyframes revealStep { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }`}</style>
            {plan?.steps?.map((step: any, index: number) => {
              if (index >= revealedSteps) return null;
              return (
              <Fragment key={`term-${index}`}>
                <span className="t-em">&gt; GENERATING STEP {(index+1).toString().padStart(2, '0')}</span><br />
                <span className="t-sys">[LLM]</span> ACTION: {step.action}<br />
                <span className="t-sys">[LLM]</span> REASONING: {step.reasoning}<br />
                <span className="t-warn">CONFIDENCE: {Math.round(step.confidence_score * 100)}%</span><br /><br />
              </Fragment>
              );
            })}
            {!loading && <span className="term-cursor"></span>}
          </div>
        </div>
      </div>
    </div>
  );
}
