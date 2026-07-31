import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const RouterContext = createContext(null);

function readLocation() {
  return {
    pathname: window.location.pathname,
    search: window.location.search
  };
}

export function RouterProvider({ children }) {
  const [location, setLocation] = useState(readLocation);

  useEffect(() => {
    const handlePopState = () => setLocation(readLocation());
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = useCallback((destination, options = {}) => {
    const target = typeof destination === 'string' ? destination : '/dashboard';
    if (options.replace) {
      window.history.replaceState(null, '', target);
    } else {
      window.history.pushState(null, '', target);
    }
    setLocation(readLocation());
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const value = useMemo(() => ({ location, navigate }), [location, navigate]);
  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useLocation() {
  const router = useContext(RouterContext);
  if (!router) throw new Error('useLocation phải được dùng bên trong RouterProvider.');
  return router.location;
}

export function useNavigate() {
  const router = useContext(RouterContext);
  if (!router) throw new Error('useNavigate phải được dùng bên trong RouterProvider.');
  return router.navigate;
}
