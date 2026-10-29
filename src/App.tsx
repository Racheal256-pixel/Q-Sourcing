import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoadingVector } from './components/Illustrations';

const CandidateGig = lazy(() =>
  import('./pages/CandidateGig').then((module) => ({ default: module.CandidateGig })),
);
const CandidateHome = lazy(() =>
  import('./pages/CandidateHome').then((module) => ({ default: module.CandidateHome })),
);
const CandidateProfile = lazy(() =>
  import('./pages/CandidateProfile').then((module) => ({ default: module.CandidateProfile })),
);
const EmployerCandidate = lazy(() =>
  import('./pages/EmployerCandidate').then((module) => ({ default: module.EmployerCandidate })),
);
const EmployerGig = lazy(() =>
  import('./pages/EmployerGig').then((module) => ({ default: module.EmployerGig })),
);
const EmployerHome = lazy(() =>
  import('./pages/EmployerHome').then((module) => ({ default: module.EmployerHome })),
);

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="card empty-state">
      <h1 className="h2">Page not found.</h1>
      <p>Pick a view to continue the demo.</p>
      <div className="empty-actions">
        <Link className="btn btn-primary" to="/employer">
          Employer view
        </Link>
        <Link className="btn btn-secondary" to="/candidate">
          Candidate view
        </Link>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <Suspense fallback={<LoadingVector />}>
          <Routes>
            <Route path="/" element={<Navigate to="/employer" replace />} />
            <Route path="/employer" element={<EmployerHome />} />
            <Route path="/employer/gigs/:gigId" element={<EmployerGig />} />
            <Route path="/employer/gigs/:gigId/candidates/:candId" element={<EmployerCandidate />} />
            <Route path="/candidate" element={<CandidateHome />} />
            <Route path="/candidate/profile" element={<CandidateProfile mode="edit" />} />
            <Route path="/candidate/profile/new" element={<CandidateProfile mode="new" />} />
            <Route path="/candidate/gigs/:gigId" element={<CandidateGig />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
