
import React, { useState, useRef } from 'react';
import { uploadDataset } from '../services/api';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) return;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    try {
      const data = await uploadDataset(file);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
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
          <div className="drop-zone fade in" style={{ background: 'var(--black)', color: 'var(--white)' }}>
            <h3>SUCCESS</h3>
            <p style={{ color: 'var(--grey)' }}>ID: {result.dataset_id}</p>
            <p style={{ color: 'var(--grey)' }}>Saved {result.filename}</p>
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
