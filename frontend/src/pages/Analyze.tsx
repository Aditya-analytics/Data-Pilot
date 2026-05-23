import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { analyzeDataset, getPreviewData } from '../services/api';

export default function Analyze() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.id = 'screen-analysis';
    return () => { document.body.id = ''; };
  }, []);

  useEffect(() => {
    if (id) {
      setLoading(true);
      Promise.all([
        analyzeDataset(id),
        getPreviewData(id).catch(() => []) // Fallback to empty if preview fails
      ])
        .then(([analysisRes, previewRes]) => {
          setData(analysisRes);
          setPreviewData(previewRes);
        })
        .catch(err => setError(err.message || "Failed to analyze dataset"))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleNext = () => {
    navigate(`/plan/${id}`);
  };

  return (
    <div className="screen active" style={{flex: 1}}>
      <div className="analysis-body fade-in">
        <div className="analysis-top">
          <div className="info-panel">
            <h3>DATASET INFO</h3>
            <div className="info-row">
              <span style={{ color: '#666' }}>ID</span>
              <span className="info-val">{id?.substring(0, 8)}...</span>
            </div>
            <div className="info-row">
              <span style={{ color: '#666' }}>FILE SIZE</span>
              <span className="info-val">UNKNOWN</span>
            </div>
            <div className="score-block">
              <span className="score-big" style={{ color: data ? 'var(--black)' : '#aaa' }}>
                {data ? data.metrics?.quality_score_before || 'N/A' : '--'}
              </span>
              <span className="score-label">QUALITY SCORE</span>
            </div>
          </div>
          
          <div className="issue-grid">
            <div className="issue-card">
              <div className="issue-card-label">TOTAL ROWS</div>
              <span className="issue-num">{loading ? '--' : data?.metrics?.rows || 0}</span>
              <span className="issue-desc">Analyzed Records</span>
            </div>
            <div className="issue-card">
              <div className="issue-card-label">TOTAL COLUMNS</div>
              <span className="issue-num">{loading ? '--' : data?.metrics?.columns || 0}</span>
              <span className="issue-desc">Detected Features</span>
            </div>
            <div className="issue-card">
              <div className="issue-card-label">MISSING VALUES</div>
              <span className={`issue-num ${data?.metrics?.total_missing > 0 ? 'warn' : ''}`}>
                {loading ? '--' : data?.metrics?.total_missing || 0}
              </span>
              <span className="issue-desc" style={{ color: data?.metrics?.total_missing > 0 ? '#ff4081' : 'inherit' }}>
                Needs Imputation
              </span>
            </div>
            <div className="issue-card">
              <div className="issue-card-label">DUPLICATES</div>
              <span className={`issue-num ${data?.metrics?.total_duplicates > 0 ? 'warn' : ''}`}>
                {loading ? '--' : data?.metrics?.total_duplicates || 0}
              </span>
              <span className="issue-desc" style={{ color: data?.metrics?.total_duplicates > 0 ? '#ff4081' : 'inherit' }}>
                Exact Row Matches
              </span>
            </div>
          </div>
        </div>

        <div className="analysis-table-section">
          <div className="table-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontWeight: 800 }}>DATA PREVIEW (SAMPLE 10 ROWS)</div>
              <div className="cell-tag">
                <span className="cell-dot" style={{ color: 'var(--black)' }}></span>
                NULL DETECTED
              </div>
            </div>
            <button 
              className="btn btn-primary btn-sm" 
              style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}
              disabled={loading || !!error}
              onClick={handleNext}
            >
              PROCEED TO AI PLAN →
            </button>
          </div>
          <div style={{ overflowX: 'auto', maxHeight: '350px', overflowY: 'auto', borderBottom: 'var(--border)' }}>
            <table className="data-table">
              <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                <tr>
                  {previewData.length > 0 ? (
                    Object.keys(previewData[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))
                  ) : (
                    <th>No Data</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {previewData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).map((val: any, cellIdx) => (
                      <td key={cellIdx} className={val === null || val === "" ? "cell-issue" : ""}>
                        {val === null || val === "" ? "NULL" : String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {error && (
          <div className="analysis-footer" style={{ color: 'red', fontWeight: 'bold' }}>
            [ERROR] {error}
          </div>
        )}
      </div>
    </div>
  );
}
