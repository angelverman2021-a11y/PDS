import { useState } from 'react';
import { MOCK_USERS } from '../constants';
import { AuthContext } from './AuthContextCore';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const login = (role) => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setUser(MOCK_USERS[role]);
      setLoading(false);
    }, 800);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
