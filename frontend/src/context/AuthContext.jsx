import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { if (!localStorage.getItem('emilo_token')) { setLoading(false); return; } api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => { localStorage.removeItem('emilo_token'); }).finally(() => setLoading(false)); }, []);
  const acceptAuth = data => { localStorage.setItem('emilo_token', data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem('emilo_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, setUser, loading, acceptAuth, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
