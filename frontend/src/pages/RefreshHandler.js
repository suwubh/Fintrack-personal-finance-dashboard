import { useEffect } from 'react';

export default function RefrshHandler({ setIsAuthenticated }) {
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated]);

  return null;
}
