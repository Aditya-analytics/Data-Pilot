import { BrowserRouter as Router, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import Landing from './pages/Landing';
import Upload from './pages/Upload';
import Analyze from './pages/Analyze';
import Plan from './pages/Plan';
import Execute from './pages/Execute';
import Results from './pages/Results';
import Navbar from './components/layout/Navbar';
import { DatasetProvider } from './DatasetContext';
import { AnimatePresence, motion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const pageVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  out: { opacity: 0, y: -20, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } }
};

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
  >
    {children}
  </motion.div>
);

const steps = [
  { path: '/upload', num: '01', label: 'UPLOAD' },
  { path: '/analyze', num: '02', label: 'ANALYZE' },
  { path: '/plan', num: '03', label: 'AI PLAN' },
  { path: '/execute', num: '04', label: 'EXECUTE' },
  { path: '/results', num: '05', label: 'RESULTS' },
];

function AppLayout() {
  const location = useLocation();

  const getStepStatus = (stepPath: string) => {
    const currentStepIndex = steps.findIndex(s => location.pathname.includes(s.path));
    const thisStepIndex = steps.findIndex(s => s.path === stepPath);
    
    if (thisStepIndex === currentStepIndex) return 'active';
    if (thisStepIndex < currentStepIndex) return 'done';
    return '';
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--grey)' }}>
        <Navbar />
        <div className="step-bar overflow-x-auto">
          {steps.map((step) => {
            const status = getStepStatus(step.path);
            return (
              <div key={step.path} className={`step-item ${status}`}>
                <span className="step-num" style={{ color: status === 'active' ? 'var(--yellow)' : 'inherit' }}>
                  {step.num}
                </span>{' '}
                {step.label}
              </div>
            );
          })}
        </div>
        <Outlet />
      </div>
    </PageWrapper>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route element={<AppLayout />}>
          <Route path="/upload" element={<PageWrapper><Upload /></PageWrapper>} />
          <Route path="/analyze/:id" element={<PageWrapper><Analyze /></PageWrapper>} />
          <Route path="/plan/:id" element={<PageWrapper><Plan /></PageWrapper>} />
          <Route path="/execute/:id" element={<PageWrapper><Execute /></PageWrapper>} />
          <Route path="/results/:id" element={<PageWrapper><Results /></PageWrapper>} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

import { useEffect } from 'react';
import Lenis from 'lenis';

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
    });
    
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    
    requestAnimationFrame(raf);
    
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <DatasetProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </DatasetProvider>
  );
}

export default App;
