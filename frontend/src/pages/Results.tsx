import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataset } from '../DatasetContext';
import { deleteDataset } from '../services/api';

export default function Results() {
  const navigate = useNavigate();
  const { datasetId, setDatasetId } = useDataset();
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    document.body.id = 'screen-results';
    return () => { document.body.id = ''; };
  }, []);

  const handleStartOver = async () => {
    if (!datasetId) {
      navigate('/upload');
      return;
    }
    
    setIsResetting(true);
    try {
      await deleteDataset(datasetId);
      setDatasetId(null);
      navigate('/upload');
    } catch (err) {
      alert("Failed to clean up dataset on server, but restarting anyway.");
      setDatasetId(null);
      navigate('/upload');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="screen active" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      <div className="fade-in" style={{ padding: '3rem', background: 'var(--white)', borderBottom: 'var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 900 }}>PIPELINE COMPLETE.</h2>
          <p style={{ fontWeight: 700, color: '#555' }}>Your dataset has been successfully processed and validated.</p>
        </div>
        <button 
          className={`brutal-btn-danger ${isResetting ? 'loading' : ''}`} 
          onClick={handleStartOver}
          disabled={isResetting}
        >
          {isResetting ? 'RESTARTING...' : 'START OVER ↺'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--black)', borderBottom: 'var(--border)' }}>
        <div style={{ background: 'var(--white)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666', marginBottom: '1rem' }}>QUALITY SCORE: BEFORE</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, lineHeight: 0.8, color: '#ff4081' }}>34</div>
        </div>
        <div style={{ background: 'var(--grey)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#666', marginBottom: '1rem' }}>IMPROVEMENT</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, lineHeight: 0.8 }}>+64</div>
        </div>
        <div style={{ background: 'var(--black)', color: 'var(--white)', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#aaa', marginBottom: '1rem' }}>QUALITY SCORE: AFTER</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 900, lineHeight: 0.8, color: '#10B981' }}>98</div>
        </div>
      </div>

      <div style={{ flex: 1, background: 'var(--grey)', padding: '3rem', display: 'flex', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ border: 'var(--border)', background: 'var(--white)', padding: '2rem', width: '300px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem' }}>CLEANED DATASET</h3>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '2rem' }}>Ready for ML training or analytics.</p>
          <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>↓ DOWNLOAD CSV</button>
        </div>

        <div style={{ border: 'var(--border)', background: 'var(--white)', padding: '2rem', width: '300px', textAlign: 'center', boxShadow: 'var(--shadow-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem' }}>QUALITY REPORT</h3>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#555', marginBottom: '2rem' }}>Detailed ydata-profiling HTML report.</p>
          <button className="btn" style={{ width: '100%', justifyContent: 'center' }}>↓ DOWNLOAD HTML</button>
        </div>
      </div>
    </div>
  );
}
