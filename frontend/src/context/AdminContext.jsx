import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsAdmin(user.role === 'admin');
    } else {
      setIsAdmin(false);
    }
    setLoading(false);
  }, [user]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};

