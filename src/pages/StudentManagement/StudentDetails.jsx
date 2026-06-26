import { Container, Typography, Box, Paper, Button, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { apiGet } from '../../api';

function StudentDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState(location.state?.student || null);
  const [loading, setLoading] = useState(!location.state?.student);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!student) {
      fetchStudent();
    }
  }, [id]);

  const fetchStudent = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet(`api/students/${id}`);
      setStudent(data);
    } catch (error) {
      console.error('Error fetching student details:', error);
      setError('Unable to load student details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4 }}>
        Loading student details...
      </Typography>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: 'error.main' }}>
        {error}
      </Typography>
    );
  }

  if (!student) {
    return null;
  }

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              Student Details
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              View the full profile and academic details for this student.
            </Typography>
          </Box>
          <Button
            variant="outlined"
            onClick={() => navigate('/students')}
            sx={{ borderColor: '#7d3bed', color: '#7d3bed', '&:hover': { borderColor: '#6a2fb8', color: '#6a2fb8' }, textTransform: 'none' }}
          >
            Back to Students
          </Button>
        </Box>

        <Paper sx={{ p: 3, boxShadow: '0 2px 10px rgba(0,0,0,0.08)' }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                {student.name || '—'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Class Roll Number
              </Typography>
              <Typography variant="body1">{student.classRollNo || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Class
              </Typography>
              <Typography variant="body1">{student.clsName || student.clsId || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Academic Year
              </Typography>
              <Typography variant="body1">{student.academicYear || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Date of Birth
              </Typography>
              <Typography variant="body1">{student.dateOfBirth || '—'}</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" color="textSecondary">
                Gender
              </Typography>
              <Typography variant="body1">{student.gender || '—'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Parent / Guardian
              </Typography>
              <Typography variant="body1">Father: {student.fatherName || '—'}</Typography>
              <Typography variant="body1">Mother: {student.motherName || '—'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Email
              </Typography>
              <Typography variant="body1">{student.email || '—'}</Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary">
                Address
              </Typography>
              <Typography variant="body1">{student.address || '—'}</Typography>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default StudentDetails;
