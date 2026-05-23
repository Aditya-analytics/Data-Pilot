import { Link } from 'react-router-dom';

export default function Navbar() {
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
        <div className="status-dot"></div>
        SYSTEM ONLINE
      </div>
    </nav>
  );
}
