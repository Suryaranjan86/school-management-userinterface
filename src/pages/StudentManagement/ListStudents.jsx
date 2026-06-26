import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Checkbox, FormControl, InputLabel, Select, MenuItem, Card, CardContent } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiDelete } from '../../api';

function ListStudents() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAcademicYear, setselectedAcademicYear] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet('api/students');
      setStudents(data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
      setError('Failed to load students. Please check if the backend is running.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (id) => {
    setSelected((prevSelected) =>
      prevSelected.includes(id) ? prevSelected.filter((sid) => sid !== id) : [...prevSelected, id]
    );
  };

  const handleEdit = () => {
    if (selected.length === 1) {
      navigate(`/students/edit/${selected[0]}`);
    }
  };

  const handleDelete = async () => {
    if (selected.length > 0) {
      if (window.confirm(`Delete ${selected.length} student(s)?`)) {
        try {
          for (const id of selected) {
            await apiDelete(`api/students/${id}`);
          }
          setSelected([]);
          fetchStudents(); // Refetch after deletion
        } catch (error) {
          console.error('Error deleting students:', error);
        }
      }
    }
  };

   // Get unique classes and academicYeares
   const uniqueClasses = [...new Set(students.map(student => student.clsId).filter(Boolean))].map(id => {
     const student = students.find(s => s.clsId === id);
     return { id, name: student.clsName };
   });

   const uniqueAcademicYear = [...new Set(students.map(student => student.academicYear).filter(Boolean))];

   const filteredStudents = students.filter(student => {
     const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
     const matchesClass = selectedClass === '' || student.clsId === selectedClass;
     const matchesAcademicYear = selectedAcademicYear === '' || student.academicYear === selectedAcademicYear;
     return matchesSearch && matchesClass && matchesAcademicYear;
   });

  const formatDate = (value) => {
    if (!value) return '';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  if (loading) {
    return <Typography variant="h6" align="center" sx={{ mt: 4 }}>Loading students...</Typography>;
  }

  if (error) {
    return <Typography variant="h6" align="center" sx={{ mt: 4, color: 'error.main' }}>{error}</Typography>;
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Students
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Browse and manage student records in a clean table view.
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ bgcolor: '#7d3bed', '&:hover': { bgcolor: '#6a2fb8' }, textTransform: 'none' }}
            onClick={() => navigate('/students/add')}
          >
            Add Student
          </Button>
        </Box>

        <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              <TextField
                label="Search by Name"
                variant="outlined"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ minWidth: 280, flex: 1, bgcolor: 'white', borderRadius: 1 }}
              />
              <FormControl sx={{ minWidth: 220, flex: 1, bgcolor: 'white', borderRadius: 1 }}>
                <InputLabel>Filter by Class</InputLabel>
                <Select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  label="Filter by Class"
                >
                  <MenuItem value="">
                    <em>All Classes</em>
                  </MenuItem>
                  {uniqueClasses.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 220, flex: 1, bgcolor: 'white', borderRadius: 1 }}>
                <InputLabel>Filter by Academic Year</InputLabel>
                <Select
                  value={selectedAcademicYear}
                  onChange={(e) => setselectedAcademicYear(e.target.value)}
                  label="Filter by Academic Year"
                >
                  <MenuItem value="">
                    <em>All Academic Years</em>
                  </MenuItem>
                  {uniqueAcademicYear.map((academicYear) => (
                    <MenuItem key={academicYear} value={academicYear}>
                      {academicYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <TableContainer component={Paper} sx={{ borderRadius: 1, overflowX: 'auto' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#7d3bed' }}>
                  <TableCell padding="checkbox" sx={{ color: 'white' }}>
                    <Checkbox
                      checked={selected.length === students.length && students.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected(students.map(student => student.studentId));
                        } else {
                          setSelected([]);
                        }
                      }}
                      sx={{ color: 'white' }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Student Name</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Standard</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Academic Year</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Gender</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Date of Birth</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 600 }}>Add Fee</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredStudents.map((student) => (
                  <TableRow key={student.studentId} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }} selected={selected.includes(student.studentId)}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected.includes(student.studentId)}
                        onChange={() => handleSelect(student.studentId)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="text"
                        onClick={() => navigate(`/students/${student.studentId}`, { state: { student } })}
                        sx={{ textTransform: 'none', padding: 0, minWidth: 0, justifyContent: 'flex-start' }}
                      >
                        {student.name}{student.classRollNo ? ` (Roll: ${student.classRollNo})` : ''}
                      </Button>
                    </TableCell>
                    <TableCell>{student.clsName}</TableCell>
                    <TableCell>{student.academicYear}</TableCell>
                    <TableCell>{student.gender || ''}</TableCell>
                    <TableCell>{formatDate(student.dateOfBirth)}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/add-fee?studentId=${student.studentId}&name=${encodeURIComponent(student.name)}&class=${encodeURIComponent(student.clsName)}&classId=${student.clsId || ''}&academicYear=${encodeURIComponent(student.academicYear || '')}`)}
                        sx={{ bgcolor: '#7d3bed', '&:hover': { bgcolor: '#6a2fb8' }, textTransform: 'none' }}
                      >
                        Add Fee
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            onClick={handleEdit}
            disabled={selected.length !== 1}
            sx={{ borderColor: '#7d3bed', color: '#7d3bed', '&:hover': { borderColor: '#6a2fb8', color: '#6a2fb8' }, textTransform: 'none' }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' }, textTransform: 'none' }}
          >
            Delete
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ListStudents;
