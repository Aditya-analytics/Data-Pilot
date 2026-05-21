import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center p-6 border-b-3 border-black bg-white">
      <Link to="/" className="text-2xl font-sans font-black tracking-tighter flex items-center gap-2">
        DATAPILOT
        <span className="w-3 h-3 bg-black block"></span>
      </Link>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-xs font-bold font-mono border-3 border-black px-3 py-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-blink"></span>
          AI ENGINE ONLINE
        </div>
        <Link to="/upload" className="brutal-button brutal-button-primary text-sm py-2 px-4">
          LAUNCH APP &rarr;
        </Link>
      </div>
    </nav>
  );
}
