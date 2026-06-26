import { Container, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Alert, Paper, Grid, Stack, Chip, Divider } from '@mui/material';
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
    academicYear: '',
    classRollNo: '',
    gender: '',
    clsId: ''
  });
  const [errors, setErrors] = useState({});
  const [classes, setClasses] = useState([]);
  const [schools, setSchools] = useState([]);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const data = await apiGet('api/classes');
      setClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewStudent({ ...newStudent, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check all required fields
    if (!newStudent.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!newStudent.fatherName.trim()) {
      newErrors.fatherName = "Father's Name is required";
    }
    if (!newStudent.motherName.trim()) {
      newErrors.motherName = "Mother's Name is required";
    }
    if (!newStudent.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }
    if (!newStudent.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!newStudent.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!newStudent.academicYear.trim()) {
      newErrors.academicYear = 'Academic Year is required';
    }
    if (!newStudent.classRollNo.trim()) {
      newErrors.classRollNo = 'Class Roll Number is required';
    }
    if (!newStudent.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    if (!newStudent.clsId.trim()) {
      newErrors.clsId = 'Class is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      newStudent.name.trim() &&
      newStudent.fatherName.trim() &&
      newStudent.motherName.trim() &&
      newStudent.dateOfBirth.trim() &&
      newStudent.address.trim() &&
      newStudent.email.trim() &&
      newStudent.academicYear.trim() &&
      newStudent.classRollNo.trim() &&
      newStudent.gender.trim() &&
      newStudent.clsId.trim()
    );
  };

  const handleAddStudent = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      setSubmitAttempted(true);
      return;
    }

    try {
      await apiPost('api/students', newStudent);
      console.log('Student added successfully');
      navigate('/students');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, md: 3 }, background: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)' }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                Add Student
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Enroll a new student with the required academic details.
              </Typography>
            </Box>
            <Chip label="Student Enrollment" color="secondary" sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 600 }} />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {submitAttempted && !isFormValid() && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              Please fill in all required fields
            </Alert>
          )}

          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Name"
                name="name"
                value={newStudent.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.name.trim() && submitAttempted}
                helperText={!newStudent.name.trim() && submitAttempted ? "Name is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Father's Name"
                name="fatherName"
                value={newStudent.fatherName}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.fatherName.trim() && submitAttempted}
                helperText={!newStudent.fatherName.trim() && submitAttempted ? "Father's Name is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mother's Name"
                name="motherName"
                value={newStudent.motherName}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.motherName.trim() && submitAttempted}
                helperText={!newStudent.motherName.trim() && submitAttempted ? "Mother's Name is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={newStudent.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.dateOfBirth.trim() && submitAttempted}
                helperText={!newStudent.dateOfBirth.trim() && submitAttempted ? "Date of Birth is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={newStudent.address}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.address.trim() && submitAttempted}
                helperText={!newStudent.address.trim() && submitAttempted ? "Address is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={newStudent.email}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.email.trim() && submitAttempted}
                helperText={!newStudent.email.trim() && submitAttempted ? "Email is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!newStudent.academicYear.trim() && submitAttempted}>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicYear"
                  value={newStudent.academicYear}
                  onChange={handleInputChange}
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                  label="Academic Year"
                >
                  {[...Array(2035 - 2026 + 1)].map((_, idx) => {
                    const start = 2026 + idx;
                    const label = `${start}-${start + 1}`;
                    return (
                      <MenuItem key={label} value={label}>
                        {label}
                      </MenuItem>
                    );
                  })}
                </Select>
                {!newStudent.academicYear.trim() && submitAttempted && (
                  <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.75, ml: 1.75 }}>
                    Academic Year is required
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Class Roll Number"
                name="classRollNo"
                value={newStudent.classRollNo}
                onChange={handleInputChange}
                fullWidth
                required
                error={!newStudent.classRollNo.trim() && submitAttempted}
                helperText={!newStudent.classRollNo.trim() && submitAttempted ? "Class Roll Number is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!newStudent.gender.trim() && submitAttempted}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={newStudent.gender}
                  onChange={handleInputChange}
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {!newStudent.gender.trim() && submitAttempted && (
                  <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.75, ml: 1.75 }}>
                    Gender is required
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!newStudent.clsId.trim() && submitAttempted}>
                <InputLabel>Class</InputLabel>
                <Select
                  name="clsId"
                  value={newStudent.clsId}
                  onChange={handleInputChange}
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                  label="Class"
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </MenuItem>
                  ))}
                </Select>
                {!newStudent.clsId.trim() && submitAttempted && (
                  <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.75, ml: 1.75 }}>
                    Class is required
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="contained"
              onClick={handleAddStudent}
              disabled={submitAttempted && !isFormValid()}
              sx={{
                bgcolor: '#6d28d9',
                '&:hover': { bgcolor: '#5b21b6' },
                '&:disabled': { bgcolor: '#d1d5db', color: '#6b7280' },
                px: 3.5,
                py: 1.25,
                borderRadius: 2.5,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Save Student
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AddStudent;
