import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apis } from '../utils/apis';

export const AdminuseCheckAuth = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // 👈 Flag to track if component is mounted

    const checkToken = async () => {
      try {
        const response = await fetch(apis().admingetAccess, {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const result = await response.json();

        if (isMounted) {
          if (result?.status) {
            setIsAuthenticated(true);
          } else {
            navigate('/admin/login');
          }
        }
      } catch (err) {
        if (isMounted) {
          navigate('/admin/login');
        }
      } finally {
        if (isMounted) setLoading(false); // ✅ Only update state if still mounted
      }
    };

    checkToken();

    return () => {
      isMounted = false; // ✅ Cleanup: prevent state updates after unmount
    };
  }, [navigate]);

  return { isAuthenticated, loading };
};   