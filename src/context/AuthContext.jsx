import { createContext, useState, useContext, useEffect } from 'react';
import { apiGet } from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedSchool = localStorage.getItem('school');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      // Restore school_id from user data
      if (user.schoolId) {
        localStorage.setItem('school_id', user.schoolId);
      }
      if (storedSchool) {
        setSchool(JSON.parse(storedSchool));
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

       // Store user info
       setUser({
         username: data.username,
         userId: data.userId,
         schoolId: data.schoolId,
       });
       localStorage.setItem('user', JSON.stringify({
         username: data.username,
         userId: data.userId,
         schoolId: data.schoolId,
       }));

       // Store school_id for API header
       localStorage.setItem('school_id', data.schoolId);

      // Fetch school details
      const schoolData = await apiGet(`api/schools/sch-1`);
      setSchool(schoolData);
      localStorage.setItem('school', JSON.stringify(schoolData));

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setSchool(null);
    localStorage.removeItem('user');
    localStorage.removeItem('school');
    localStorage.removeItem('school_id');
  };

  return (
    <AuthContext.Provider value={{ user, school, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
