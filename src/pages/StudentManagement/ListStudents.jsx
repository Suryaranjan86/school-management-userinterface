import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Chip, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../config';

function ListStudents() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/students`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      } else {
        console.error('Failed to fetch students');
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleEdit = () => {
    if (selected.length === 1) {
      navigate(`/students/edit/${selected[0]}`);
    } else {
      alert('Please select one student to edit.');
    }
  };

  const handleDelete = async () => {
    if (selected.length > 0) {
      if (window.confirm(`Delete ${selected.length} student(s)?`)) {
        try {
          for (const id of selected) {
            const response = await fetch(`${BASE_URL}api/students/${id}`, {
              method: 'DELETE',
            });
            if (!response.ok) {
              console.error(`Failed to delete student ${id}`);
            }
          }
          setSelected([]);
          fetchStudents(); // Refetch after deletion
        } catch (error) {
          console.error('Error deleting students:', error);
        }
      }
    }
  };

  // Get unique classes and batches
  const uniqueClasses = [...new Set(students.map(student => student.cls?.id).filter(Boolean))].map(id => {
    const student = students.find(s => s.cls?.id === id);
    return { id, name: student.cls.name };
  });

  const uniqueBatches = [...new Set(students.map(student => student.batch).filter(Boolean))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === '' || student.cls?.id === selectedClass;
    const matchesBatch = selectedBatch === '' || student.batch === selectedBatch;
    return matchesSearch && matchesClass && matchesBatch;
  });

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Students
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#7d3bed', '&:hover': { bgcolor: '#6a2fb8' } }}
            onClick={() => navigate('/students/add')}
          >
            Add Student
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            label="Search by Name"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 300, bgcolor: 'white', borderRadius: 1 }}
          />
          <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
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
          <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Filter by Batch</InputLabel>
            <Select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              label="Filter by Batch"
            >
              <MenuItem value="">
                <em>All Batches</em>
              </MenuItem>
              {uniqueBatches.map((batch) => (
                <MenuItem key={batch} value={batch}>
                  {batch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === students.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(students.map(student => student.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Father Name</TableCell>
                <TableCell>Mother Name</TableCell>
                <TableCell>Date of Birth</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Batch</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>School</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} selected={selected.includes(student.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(student.id)}
                      onChange={() => handleSelect(student.id)}
                    />
                  </TableCell>
                  <TableCell>{student.name}</TableCell>
                  <TableCell>{student.fatherName}</TableCell>
                  <TableCell>{student.motherName}</TableCell>
                  <TableCell>{student.dateOfBirth}</TableCell>
                  <TableCell>{student.address}</TableCell>
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.cls ? student.cls.name : ''}</TableCell>
                  <TableCell>{student.school ? student.school.name : ''}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
          <Button
            variant="outlined"
            onClick={handleEdit}
            disabled={selected.length !== 1}
            sx={{ borderColor: '#7d3bed', color: '#7d3bed', '&:hover': { borderColor: '#6a2fb8', color: '#6a2fb8' } }}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={selected.length === 0}
            sx={{ bgcolor: '#e63946', '&:hover': { bgcolor: '#d62839' } }}
          >
            Delete
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ListStudents;
