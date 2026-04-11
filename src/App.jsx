import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ListTeachers from './pages/TeacherManagement/ListTeachers';
import AddTeacher from './pages/TeacherManagement/AddTeacher';
import EditTeacher from './pages/TeacherManagement/EditTeacher';
import ListStudents from './pages/StudentManagement/ListStudents';
import AddStudent from './pages/StudentManagement/AddStudent';
import EditStudent from './pages/StudentManagement/EditStudent';
import FeeTracking from './pages/FeeManagement/FeeTracking';
import Payroll from './pages/Payroll';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Recruitment from './pages/Recruitment';
import Performance from './pages/Performance';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Sidebar />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/teachers" element={<ListTeachers />} />
              <Route path="/teachers/add" element={<AddTeacher />} />
              <Route path="/teachers/edit/:id" element={<EditTeacher />} />
              <Route path="/students" element={<ListStudents />} />
              <Route path="/students/add" element={<AddStudent />} />
              <Route path="/students/edit/:id" element={<EditStudent />} />
              <Route path="/fees" element={<FeeTracking />} />
              <Route path="/payroll" element={<Payroll />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/leave" element={<Leave />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/performance" element={<Performance />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
