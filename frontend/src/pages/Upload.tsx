
import React, { useState, useRef } from 'react';
import { uploadDataset, analyzeDataset } from '../services/api';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  
  // New State for Analysis
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) return;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    let datasetId = null;
    
    try {
      const data = await uploadDataset(file);
      setResult(data);
      datasetId = data.dataset_id;
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }

    // If upload succeeded, trigger analysis immediately!
    if (datasetId) {
      setIsAnalyzing(true);
      setAnalysisError(null);
      try {
        const analysis = await analyzeDataset(datasetId);
        setAnalysisData(analysis);
      } catch (err: any) {
        setAnalysisError(err.message || "Unknown error occurred");
        console.error(err);
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  return (
    <div className="upload-body" style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1.4fr', minHeight: 0 }}>
      <div className="upload-left fade in">
        <div className="label" style={{ marginBottom: '1.5rem' }}>SYS_INITIALIZE</div>
        <h2>
          DRAG, DROP,<br/><em>TRANSFORM.</em>
        </h2>
        <p>
          The moment your file lands, the pipeline begins. Analysis in seconds. AI plan in under a minute. Clean dataset ready to execute.
        </p>
        <div className="format-tags">
          <div className="tag">.CSV</div>
          <div className="tag" style={{ opacity: '0.3', textDecoration: 'line-through' }}>.XLSX</div>
          <div className="tag" style={{ opacity: '0.3', textDecoration: 'line-through' }}>.JSON</div>
        </div>
      </div>

      <div className="upload-right">
        {result ? (
          <div className="drop-zone fade in" style={{ background: 'var(--black)', color: 'var(--white)', alignItems: 'flex-start', padding: '3rem', textAlign: 'left' }}>
            <h3 style={{color: 'var(--acid)', marginBottom: '1rem', marginTop: 0}}>
              {isAnalyzing ? 'ANALYZING DATASET...' : 'ANALYSIS COMPLETE'}
            </h3>
            <div style={{fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--grey)', marginBottom: '2rem'}}>
              ID: {result.dataset_id}<br/>
              FILE: {result.filename}
            </div>
            
            {analysisData && (
              <div style={{width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}} className="fade in">
                <div style={{border: '2px solid var(--white)', padding: '1.5rem', background: '#111'}}>
                  <div style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.5rem'}}>ROWS</div>
                  <div style={{fontSize: '2rem', fontFamily: 'var(--font-mono)'}}>{analysisData.metrics.rows}</div>
                </div>
                <div style={{border: '2px solid var(--white)', padding: '1.5rem', background: '#111'}}>
                  <div style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.5rem'}}>COLUMNS</div>
                  <div style={{fontSize: '2rem', fontFamily: 'var(--font-mono)'}}>{analysisData.metrics.columns}</div>
                </div>
                <div style={{border: '2px solid var(--white)', padding: '1.5rem', background: '#111', color: analysisData.metrics.total_duplicates > 0 ? '#ff4081' : 'var(--white)'}}>
                  <div style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.5rem', color: 'var(--white)'}}>DUPLICATES</div>
                  <div style={{fontSize: '2rem', fontFamily: 'var(--font-mono)'}}>{analysisData.metrics.total_duplicates}</div>
                </div>
                <div style={{border: '2px solid var(--white)', padding: '1.5rem', background: '#111', color: analysisData.metrics.total_missing > 0 ? '#ff4081' : 'var(--white)'}}>
                  <div style={{opacity: 0.5, fontSize: '0.75rem', marginBottom: '0.5rem', color: 'var(--white)'}}>MISSING VALUES</div>
                  <div style={{fontSize: '2rem', fontFamily: 'var(--font-mono)'}}>{analysisData.metrics.total_missing}</div>
                </div>
              </div>
            )}
            
            {analysisError && (
              <div style={{marginTop: '1.5rem', padding: '1rem', border: '1px solid #ff4081', color: '#ff4081', background: 'rgba(255, 64, 129, 0.1)', fontFamily: 'var(--font-mono)'}}>
                [ERROR]: {analysisError}
              </div>
            )}
            
          </div>
        ) : (
          <div 
            className={`drop-zone fade in ${isDragging ? 'dropped' : ''}`} 
            style={{ transitionDelay: '0.1s', cursor: 'pointer' }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) handleFileSelection(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" style={{display:'none'}} accept=".csv" onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])} />
            <div className="drop-icon">DRAG & DROP</div>
            <h3>{file ? file.name : 'DROP DATASET HERE'}</h3>
            <p>{file ? 'Click below to initialize' : 'or click to browse your local files.'}</p>
            {file && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }} 
                disabled={isUploading}
                className="btn btn-primary" 
                style={{ marginTop: '1.5rem' }}
              >
                {isUploading ? 'UPLOADING...' : 'INITIALIZE PIPELINE'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
