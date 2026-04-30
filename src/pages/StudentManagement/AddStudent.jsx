import { Container, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, apiPost } from '../../api';

function AddStudent() {
  const [newStudent, setNewStudent] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    address: '',
    email: '',
    batch: '',
    cls_id: ''
  });
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
    fetchSchools();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await apiGet('api/classes');
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchSchools = async () => {
    try {
      const data = await apiGet('api/schools');
      setSchools(data);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
  };

  const handleAddStudent = async () => {
    try {
      await apiPost('api/students', newStudent);
      console.log('Student added successfully');
      navigate('/students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Add Student
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={newStudent.name}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Father's Name"
            name="fatherName"
            value={newStudent.fatherName}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Mother's Name"
            name="motherName"
            value={newStudent.motherName}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={newStudent.dateOfBirth}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ bgcolor: 'white', borderRadius: 1 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Address"
            name="address"
            value={newStudent.address}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Email"
            name="email"
            value={newStudent.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Batch"
            name="batch"
            value={newStudent.batch}
            onChange={handleInputChange}
            fullWidth
            required
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <FormControl fullWidth required>
            <InputLabel>Class</InputLabel>
            <Select
              name="cls_id"
              value={newStudent.cls_id}
              onChange={handleInputChange}
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleAddStudent}
            sx={{
              bgcolor: '#7d3bed',
              '&:hover': { bgcolor: '#6a2fb8' },
              width: 200,
              height: 45,
              borderRadius: 2.5,
              mt: 2
            }}
          >
            Save
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddStudent;
