import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadDataset } from '../services/api';
import { useDataset } from '../DatasetContext';

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { setDatasetId } = useDataset();

  // Add the screen ID for specific brutalist styling if needed
  useEffect(() => {
    document.body.id = 'screen-upload';
    return () => { document.body.id = ''; };
  }, []);

  const handleFileSelection = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      setError("Only .CSV files are supported at this time.");
      return;
    }
    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);
    
    try {
      const data = await uploadDataset(file);
      setDatasetId(data.dataset_id);
      // Navigate to analyze screen
      navigate(`/analyze/${data.dataset_id}`);
    } catch (err: any) {
      setError(err.message || "Failed to upload dataset. Ensure backend is running.");
      setIsUploading(false);
    }
  };

  return (
    <div className="screen active" style={{flex: 1}}>
      <div className="upload-body fade-in">
        <div className="upload-left">
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
          <div 
            className={`drop-zone fade-in ${isDragging ? 'over' : ''} ${file ? 'dropped' : ''}`} 
            style={{ transitionDelay: '0.1s' }}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if(e.dataTransfer.files) handleFileSelection(e.dataTransfer.files[0]); }}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              style={{display:'none'}} 
              accept=".csv" 
              onChange={(e) => e.target.files && handleFileSelection(e.target.files[0])} 
            />
            
            <div className="drop-icon">DRAG & DROP</div>
            <h3>{file ? file.name : 'DROP DATASET HERE'}</h3>
            <p>{file ? 'Click below to initialize pipeline' : 'or click to browse your local files.'}</p>
            
            {error && (
              <div style={{marginTop: '1.5rem', padding: '1rem', border: '1px solid #ff4081', color: '#ff4081', background: 'rgba(255, 64, 129, 0.1)', fontSize: '0.8rem'}}>
                [ERROR]: {error}
              </div>
            )}
            
            {file && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleUpload(); }} 
                disabled={isUploading}
                className="btn btn-primary fade-in" 
                style={{ marginTop: '2rem' }}
              >
                {isUploading ? 'UPLOADING...' : 'INITIALIZE PIPELINE →'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
