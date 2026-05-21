import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Navbar from './components/layout/Navbar';

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <div className="border-b-3 border-black bg-grey px-6 py-4 flex gap-4 overflow-x-auto">
         <div className="flex items-center gap-2 font-sans font-black text-sm uppercase bg-black text-white px-3 py-1">
           <span className="text-yellow-500">01</span> UPLOAD
         </div>
         <div className="flex items-center gap-2 font-sans font-black text-sm uppercase text-black/50 px-3 py-1">
           <span>02</span> ANALYZE
         </div>
         <div className="flex items-center gap-2 font-sans font-black text-sm uppercase text-black/50 px-3 py-1">
           <span>03</span> AI PLAN
         </div>
         <div className="flex items-center gap-2 font-sans font-black text-sm uppercase text-black/50 px-3 py-1">
           <span>04</span> EXECUTE
         </div>
         <div className="flex items-center gap-2 font-sans font-black text-sm uppercase text-black/50 px-3 py-1">
           <span>05</span> RESULTS
         </div>
      </div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route element={<AppLayout />}>
          <Route path="/upload" element={<Upload />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
