import React, { useEffect } from 'react';
import Header from './components/Header';
import DashboardPage from './pages/DashboardPage';
import MyCoursesPage from './pages/MyCoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import ReaderPage from './pages/ReaderPage';
import { RouterProvider, useLocation, useNavigate } from './router';

function CurrentPage() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname === '/') navigate('/dashboard', { replace: true });
  }, [location.pathname, navigate]);

  if (location.pathname === '/my-courses') return <MyCoursesPage />;
  if (location.pathname === '/course/comp2010') return <CourseDetailPage />;
  if (location.pathname === '/course/comp2010/reader') return <ReaderPage />;
  return <DashboardPage />;
}

function Layout() {
  const location = useLocation();
  const isReader = location.pathname.includes('/reader');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxHeight: '100vh',
        overflow: isReader ? 'hidden' : 'auto',
        backgroundColor: '#f0f4f8'
      }}
    >
      {!isReader && <Header />}
      <main style={{ flex: 1, height: isReader ? '100%' : 'auto', overflow: isReader ? 'hidden' : 'visible' }}>
        <CurrentPage />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <RouterProvider>
      <Layout />
    </RouterProvider>
  );
}
