import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ListStudents from './pages/StudentManagement/ListStudents';
import AddStudent from './pages/StudentManagement/AddStudent';
import EditStudent from './pages/StudentManagement/EditStudent';
import StudentDetails from './pages/StudentManagement/StudentDetails';
import AddFee from './pages/FeeManagement/AddFee';
import FeeTracking from './pages/FeeManagement/FeeTracking';
import UnpaidFeeTracking from './pages/FeeManagement/UnpaidFeeTracking';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <Box sx={{ display: 'flex' }}>
                    <Sidebar />
                    <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                      <Header />
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/students" element={<ListStudents />} />
                        <Route path="/students/add" element={<AddStudent />} />
                        <Route path="/students/edit/:id" element={<EditStudent />} />
                        <Route path="/students/:id" element={<StudentDetails />} />
                        <Route path="/add-fee" element={<AddFee />} />
                        <Route path="/fees" element={<FeeTracking />} />
                        <Route path="/unpaid-fees" element={<UnpaidFeeTracking />} />
                      </Routes>
                    </Box>
                  </Box>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
