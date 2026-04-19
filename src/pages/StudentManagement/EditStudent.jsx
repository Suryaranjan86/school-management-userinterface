import { Container, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPut } from '../../api';

function EditStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState({
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    address: '',
    email: '',
    batch: '',
    cls_id: '',
    school_id: ''
  });
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudent();
    fetchClasses();
    fetchSchools();
  }, []);

  const fetchStudent = async () => {
    try {
      const data = await apiGet(`api/students/${id}`);
      setStudent({
        ...data,
        cls_id: data.cls ? data.cls.id : '',
        school_id: data.school ? data.school.id : ''
      });
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

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
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleUpdateStudent = async () => {
    try {
      await apiPut(`api/students/${id}`, student);
      console.log('Student updated successfully');
      navigate('/students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Edit Student
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={student.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Father's Name"
            name="fatherName"
            value={student.fatherName}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Mother's Name"
            name="motherName"
            value={student.motherName}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={student.dateOfBirth}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="Address"
            name="address"
            value={student.address}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Email"
            name="email"
            value={student.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Batch"
            name="batch"
            value={student.batch}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <FormControl fullWidth>
            <InputLabel>Class</InputLabel>
            <Select
              name="cls_id"
              value={student.cls_id}
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
          <FormControl fullWidth>
            <InputLabel>School</InputLabel>
            <Select
              name="school_id"
              value={student.school_id}
              onChange={handleInputChange}
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            >
              {schools.map((school) => (
                <MenuItem key={school.id} value={school.id}>
                  {school.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleUpdateStudent}
            sx={{
              bgcolor: '#7d3bed',
              '&:hover': { bgcolor: '#6a2fb8' },
              width: 200,
              height: 45,
              borderRadius: 2.5,
              mt: 2
            }}
          >
            Update
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default EditStudent;
