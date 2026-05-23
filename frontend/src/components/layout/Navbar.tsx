import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDataset } from '../../DatasetContext';
import { deleteDataset } from '../../services/api';
import { useState } from 'react';

export default function Navbar() {
  const { datasetId, setDatasetId } = useDataset();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAbort = async () => {
    if (!datasetId) return;
    if (window.confirm("WARNING: This will permanently delete the dataset and cancel the pipeline. Proceed?")) {
      setIsDeleting(true);
      try {
        await deleteDataset(datasetId);
        setDatasetId(null);
        navigate('/');
      } catch (err) {
        alert("Failed to abort pipeline. Dataset may not have been fully deleted.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const showAbort = datasetId && location.pathname !== '/';

  return (
    <nav>
      <div className="nav-brand" onClick={() => window.location.href = '/'}>
        DATAPILOT
      </div>
      <div className="nav-links">
        <Link to="/upload" className="nav-link">NEW PIPELINE</Link>
        <a className="nav-link">DOCS</a>
        <a className="nav-link">SETTINGS</a>
      </div>
      <div className="nav-status">
        {showAbort ? (
          <button 
            className={`brutal-btn-danger ${isDeleting ? 'loading' : ''}`} 
            onClick={handleAbort}
            disabled={isDeleting}
          >
            {isDeleting ? 'ABORTING...' : 'ABORT PIPELINE ✗'}
          </button>
        ) : (
          <>
            <div className="status-dot"></div>
            SYSTEM ONLINE
          </>
        )}
      </div>
    </nav>
  );
}
