import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Chip, Checkbox } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiDelete } from '../../api';


function ListTeachers() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await apiGet('api/teachers');
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSelect = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const handleEdit = () => {
    if (selected.length === 1) {
      navigate(`/teachers/edit/${selected[0]}`);
    } else {
      alert('Please select one teacher to edit.');
    }
  };

  const handleDelete = async () => {
    if (selected.length > 0) {
      if (window.confirm(`Delete ${selected.length} teacher(s)?`)) {
        try {
          for (const id of selected) {
            await apiDelete(`api/teachers/${id}`);
          }
          setSelected([]);
          fetchTeachers(); // Refetch after deletion
        } catch (error) {
          console.error('Error deleting teachers:', error);
        }
      }
    }
  };

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Teachers
          </Typography>
          <Button
            variant="contained"
            sx={{ bgcolor: '#7d3bed', '&:hover': { bgcolor: '#6a2fb8' } }}
            onClick={() => navigate('/teachers/add')}
          >
            Add Teacher
          </Button>
        </Box>
        <TextField
          label="Search"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 2, width: 400, bgcolor: 'white', borderRadius: 1 }}
        />
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.length === teachers.length}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelected(teachers.map(teacher => teacher.id));
                      } else {
                        setSelected([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Contact Number</TableCell>
                <TableCell>Highest Qualification</TableCell>
                <TableCell>Subject</TableCell>
                <TableCell>Joining Date</TableCell>
                <TableCell>Permanent Address</TableCell>
                <TableCell>Current Address</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTeachers.map((teacher) => (
                <TableRow key={teacher.id} selected={selected.includes(teacher.id)}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(teacher.id)}
                      onChange={() => handleSelect(teacher.id)}
                    />
                  </TableCell>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.contactNumber}</TableCell>
                  <TableCell>{teacher.highestQualification === 'Other' ? teacher.otherQualification : teacher.highestQualification}</TableCell>
                  <TableCell>{teacher.subject}</TableCell>
                  <TableCell>{teacher.joiningDate}</TableCell>
                  <TableCell>{teacher.permanentAddress}</TableCell>
                  <TableCell>{teacher.currentAddress}</TableCell>
                  <TableCell>
                    <Chip
                      label={teacher.status}
                      sx={{
                        bgcolor: teacher.status === 'Active' ? '#34b853' : '#e63946',
                        color: 'white',
                      }}
                    />
                  </TableCell>
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

export default ListTeachers;
