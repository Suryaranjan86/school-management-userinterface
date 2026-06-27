import { createContext, useState, useContext, useEffect } from 'react';
import { apiGet } from '../api';
import { BASE_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    console.log('AuthContext useEffect - Checking localStorage');
    const storedUser = localStorage.getItem('user');
    const storedSchool = localStorage.getItem('school');
    console.log('Stored user:', storedUser);
    console.log('Stored school:', storedSchool);
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUser(user);
      // Restore school_id from user data
      if (user.schoolId) {
        localStorage.setItem('school_id', user.schoolId);
      }
      if (storedSchool) {
        const parsedSchool = JSON.parse(storedSchool);
        console.log('Setting school from localStorage:', parsedSchool);
        setSchool(parsedSchool);
      } else {
        console.log('No stored school found');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}api/users/login`, {
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
         role: data.role,
       });
       localStorage.setItem('user', JSON.stringify({
         username: data.username,
         userId: data.userId,
         schoolId: data.schoolId,
         role: data.role,
       }));

       // Store school_id for API header
       localStorage.setItem('school_id', data.schoolId);

      // Fetch school details
      console.log('Fetching school details...');
      const schoolData = await apiGet(`api/schools`);
      console.log('School data received:', schoolData);
      setSchool(schoolData);
      localStorage.setItem('school', JSON.stringify(schoolData));
      console.log('School saved to localStorage');

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
