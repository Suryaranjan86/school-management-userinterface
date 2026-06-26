import { Container, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Alert, Paper, Grid, Stack, Chip, Divider } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiGet, apiPut } from '../../api';

function EditStudent() {
  const { id } = useParams();
  const [student, setStudent] = useState({
    studentId: '',
    name: '',
    fatherName: '',
    motherName: '',
    dateOfBirth: '',
    address: '',
    email: '',
    academicYear: '',
    classRollNo: '',
    gender: '',
    clsId: '',
    clsName: ''
  });
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudent();
    fetchClasses();
  }, []);

  const fetchStudent = async () => {
    try {
      const data = await apiGet(`api/students/${id}`);
      // Convert timestamp to date string in YYYY-MM-DD format
      if (data.dateOfBirth) {
        const date = new Date(data.dateOfBirth);
        data.dateOfBirth = date.toISOString().split('T')[0];
      }
      setStudent(data);
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


  const handleInputChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Check all required fields
    if (!student.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!student.fatherName.trim()) {
      newErrors.fatherName = "Father's Name is required";
    }
    if (!student.motherName.trim()) {
      newErrors.motherName = "Mother's Name is required";
    }
    if (!student.dateOfBirth.trim()) {
      newErrors.dateOfBirth = 'Date of Birth is required';
    }
    if (!student.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!student.email.trim()) {
      newErrors.email = 'Email is required';
    }
    if (!student.academicYear.trim()) {
      newErrors.academicYear = 'Academic Year is required';
    }
    if (!student.classRollNo.trim()) {
      newErrors.classRollNo = 'Class Roll Number is required';
    }
    if (!student.gender.trim()) {
      newErrors.gender = 'Gender is required';
    }
    if (!student.clsId.trim()) {
      newErrors.clsId = 'Class is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      student.name.trim() &&
      student.fatherName.trim() &&
      student.motherName.trim() &&
      student.dateOfBirth.trim() &&
      student.address.trim() &&
      student.email.trim() &&
      student.academicYear.trim() &&
      student.classRollNo.trim() &&
      student.gender.trim() &&
      student.clsId.trim()
    );
  };

  const handleUpdateStudent = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      setSubmitAttempted(true);
      return;
    }

    try {
      await apiPut(`api/students/${id}`, student);
      console.log('Student updated successfully');
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
                Edit Student
              </Typography>
            </Box>
            <Chip label="Student Update" color="secondary" sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 600 }} />
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
                value={student.name}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.name.trim() && submitAttempted}
                helperText={!student.name.trim() && submitAttempted ? "Name is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Father's Name"
                name="fatherName"
                value={student.fatherName}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.fatherName.trim() && submitAttempted}
                helperText={!student.fatherName.trim() && submitAttempted ? "Father's Name is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Mother's Name"
                name="motherName"
                value={student.motherName}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.motherName.trim() && submitAttempted}
                helperText={!student.motherName.trim() && submitAttempted ? "Mother's Name is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                value={student.dateOfBirth}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.dateOfBirth.trim() && submitAttempted}
                helperText={!student.dateOfBirth.trim() && submitAttempted ? "Date of Birth is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                name="address"
                value={student.address}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.address.trim() && submitAttempted}
                helperText={!student.address.trim() && submitAttempted ? "Address is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Email"
                name="email"
                value={student.email}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.email.trim() && submitAttempted}
                helperText={!student.email.trim() && submitAttempted ? "Email is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!student.academicYear.trim() && submitAttempted}>
                <InputLabel>Academic Year</InputLabel>
                <Select
                  name="academicYear"
                  value={student.academicYear}
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
                {!student.academicYear.trim() && submitAttempted && (
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
                value={student.classRollNo}
                onChange={handleInputChange}
                fullWidth
                required
                error={!student.classRollNo.trim() && submitAttempted}
                helperText={!student.classRollNo.trim() && submitAttempted ? "Class Roll Number is required" : ""}
                sx={{ bgcolor: 'white', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!student.gender.trim() && submitAttempted}>
                <InputLabel>Gender</InputLabel>
                <Select
                  name="gender"
                  value={student.gender}
                  onChange={handleInputChange}
                  sx={{ bgcolor: 'white', borderRadius: 2 }}
                  label="Gender"
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {!student.gender.trim() && submitAttempted && (
                  <Typography sx={{ color: '#d32f2f', fontSize: '0.75rem', mt: 0.75, ml: 1.75 }}>
                    Gender is required
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required error={!student.clsId.trim() && submitAttempted}>
                <InputLabel>Class</InputLabel>
                <Select
                  name="clsId"
                  value={student.clsId}
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
                {!student.clsId.trim() && submitAttempted && (
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
              onClick={handleUpdateStudent}
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
              Update Student
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default EditStudent;
