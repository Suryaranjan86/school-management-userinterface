import { Container, Box, TextField, Select, MenuItem, Button, Typography, Paper, Stack, Chip, Divider, Grid } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiPost, apiGet } from '../../api';

function AddFee() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [newFee, setNewFee] = useState({
    studentId: '',
    clsId: '',
    academicYear: '',
    payMonth: '',
    payYear: '',
    paymentDate: '',
    transactionId: '',
    amount: 0.0,
    modeOfPay: 'ONLINE'
  });

  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [classId, setClassId] = useState('');

  const [academicYears, setAcademicYears] = useState([]);
  const [payYears, setPayYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get student details from URL parameters
    const name = searchParams.get('name') || '';
    const cls = searchParams.get('class') || '';
    const year = searchParams.get('academicYear') || '';
    const id = searchParams.get('studentId') || '';
    const clsId = searchParams.get('classId') || '';

    setStudentName(name);
    setClassName(cls);
    setStudentId(id);
    setClassId(clsId);

    setNewFee(prev => ({
      ...prev,
      studentId: id,
      clsId: clsId,
      academicYear: year
    }));
  }, []);

  // After classes are fetched, ensure the selected class is still set
  useEffect(() => {
    if (classId && classes.length > 0 && !className) {
      const selectedClass = classes.find(c => c.classId === classId);
      if (selectedClass) {
        setClassName(selectedClass.className);
      }
    }
  }, [classes, classId]);

  // After academic years are fetched, ensure the selected year is still set
  useEffect(() => {
    if (newFee.academicYear && academicYears.length > 0 && !newFee.academicYear) {
      const yearExists = academicYears.includes(newFee.academicYear);
      if (!yearExists && academicYears.length > 0) {
        setNewFee(prev => ({
          ...prev,
          academicYear: academicYears[0]
        }));
      }
    }
  }, [academicYears]);

  // When academic year changes, derive the two pay year options (e.g. 2026-2027 -> ["2026","2027"]) and reset payYear
  useEffect(() => {
    if (newFee.academicYear) {
      const parts = newFee.academicYear.split('-').map(p => p.trim());
      if (parts.length === 2) {
        setPayYears(parts);
        setNewFee(prev => ({ ...prev, payYear: '' }));
        return;
      }

      const parts2 = newFee.academicYear.split('/').map(p => p.trim());
      if (parts2.length === 2) {
        setPayYears(parts2);
        setNewFee(prev => ({ ...prev, payYear: '' }));
        return;
      }

      setPayYears([]);
    } else {
      setPayYears([]);
    }
  }, [newFee.academicYear]);

  // Fetch academic years and classes from backend when studentId is available
  useEffect(() => {
    if (!studentId) return;

    const fetchData = async () => {
      try {
        setLoadingYears(true);
        const yearsData = await apiGet(`api/students/academic/academic-years?studentId=${studentId}`);
        setAcademicYears(yearsData || []);
      } catch (error) {
        console.error('Error fetching academic years:', error);
      } finally {
        setLoadingYears(false);
      }

      try {
        setLoadingClasses(true);
        const classesData = await apiGet(`api/students/academic/classes?studentId=${studentId}`);
        setClasses(classesData || []);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchData();
  }, [studentId]);

  const validateForm = () => {
    const validationErrors = {};

    if (!studentId) validationErrors.studentId = 'Student is required';
    if (!classId) validationErrors.clsId = 'Class is required';
    if (!newFee.academicYear) validationErrors.academicYear = 'Academic year is required';
    if (!newFee.payMonth) validationErrors.payMonth = 'Pay month is required';
    if (!newFee.payYear) validationErrors.payYear = 'Pay year is required';
    if (!newFee.paymentDate) validationErrors.paymentDate = 'Payment date is required';
    if (!newFee.transactionId) validationErrors.transactionId = 'Transaction / reference no. is required';
    if (!newFee.amount || newFee.amount <= 0) validationErrors.amount = 'Amount must be greater than zero';
    if (!newFee.modeOfPay) validationErrors.modeOfPay = 'Mode of payment is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleAddFee = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const feeData = {
        ...newFee,
        studentId: studentId,
        clsId: classId,
        academicYear: newFee.academicYear
      };
      await apiPost('api/fee-payments', feeData);
      console.log('Fee payment added successfully');
      navigate('/students');
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding fee payment. Please try again.');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4, px: { xs: 2, md: 3 }, background: 'linear-gradient(135deg, #f8f9ff 0%, #eef2ff 100%)' }}>
      <Container maxWidth="md">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, borderRadius: 4, border: '1px solid #e5e7eb', boxShadow: '0 16px 40px rgba(15, 23, 42, 0.08)' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={1.5} sx={{ mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#111827', mb: 0.5 }}>
                Add Fee Payment
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Record a new fee payment for the selected student.
              </Typography>
            </Box>
            <Chip label="Fee Entry" color="secondary" sx={{ bgcolor: '#ede9fe', color: '#6d28d9', fontWeight: 600 }} />
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={2.5}>
            <Grid item xs={12}>
              <TextField
                label="Student"
                value={studentName}
                fullWidth
                InputProps={{ readOnly: true }}
                sx={{ bgcolor: '#f9fafb', borderRadius: 2 }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Class"
                fullWidth
                value={className || ''}
                onChange={(e) => {
                  const selectedValue = e.target.value;
                  setClassName(selectedValue);
                  const selectedClass = classes.find(c => c.className === selectedValue);
                  if (selectedClass) {
                    setClassId(selectedClass.classId);
                    setNewFee(prev => ({
                      ...prev,
                      clsId: selectedClass.classId
                    }));
                  }
                }}
                sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                disabled={loadingClasses || classes.length === 0}
                error={Boolean(errors.clsId)}
                helperText={errors.clsId}
              >
                {loadingClasses ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : classes.length === 0 ? (
                  <MenuItem disabled>No classes available</MenuItem>
                ) : (
                  classes.map((cls) => (
                    <MenuItem key={cls.classId} value={cls.className}>
                      {cls.className}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Academic Year"
                fullWidth
                value={newFee.academicYear || ''}
                onChange={(e) => setNewFee({ ...newFee, academicYear: e.target.value })}
                sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                disabled={loadingYears || academicYears.length === 0}
                error={Boolean(errors.academicYear)}
                helperText={errors.academicYear}
              >
                {loadingYears ? (
                  <MenuItem disabled>Loading...</MenuItem>
                ) : academicYears.length === 0 ? (
                  <MenuItem disabled>No academic years available</MenuItem>
                ) : (
                  academicYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Pay Month"
                fullWidth
                name="payMonth"
                value={newFee.payMonth}
                onChange={(e) => setNewFee({ ...newFee, payMonth: e.target.value })}
                sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                error={Boolean(errors.payMonth)}
                helperText={errors.payMonth}
              >
                <MenuItem value="JAN">January</MenuItem>
                <MenuItem value="FEB">February</MenuItem>
                <MenuItem value="MAR">March</MenuItem>
                <MenuItem value="APR">April</MenuItem>
                <MenuItem value="MAY">May</MenuItem>
                <MenuItem value="JUN">June</MenuItem>
                <MenuItem value="JUL">July</MenuItem>
                <MenuItem value="AUG">August</MenuItem>
                <MenuItem value="SEP">September</MenuItem>
                <MenuItem value="OCT">October</MenuItem>
                <MenuItem value="NOV">November</MenuItem>
                <MenuItem value="DEC">December</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Pay Year"
                name="payYear"
                value={newFee.payYear || ''}
                onChange={(e) => setNewFee({ ...newFee, payYear: e.target.value })}
                fullWidth
                sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                disabled={payYears.length === 0}
                error={Boolean(errors.payYear)}
                helperText={errors.payYear || (payYears.length === 0 ? 'Select academic year first' : '')}
              >
                {payYears.length === 0 ? (
                  <MenuItem disabled>No pay years</MenuItem>
                ) : (
                  payYears.map((y) => (
                    <MenuItem key={y} value={y}>
                      {y}
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Payment Date"
                name="paymentDate"
                type="date"
                value={newFee.paymentDate}
                onChange={(e) => setNewFee({ ...newFee, paymentDate: e.target.value })}
                fullWidth
                sx={{ bgcolor: 'white', borderRadius: 2 }}
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.paymentDate)}
                helperText={errors.paymentDate}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Transaction / Reference No."
                name="transactionId"
                value={newFee.transactionId}
                onChange={(e) => setNewFee({ ...newFee, transactionId: e.target.value })}
                fullWidth
                sx={{ bgcolor: 'white', borderRadius: 2 }}
                error={Boolean(errors.transactionId)}
                helperText={errors.transactionId}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={newFee.amount}
                onChange={(e) => setNewFee({ ...newFee, amount: parseFloat(e.target.value) || 0.0 })}
                fullWidth
                sx={{ bgcolor: 'white', borderRadius: 2 }}
                inputProps={{ step: '0.01' }}
                error={Boolean(errors.amount)}
                helperText={errors.amount}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                select
                label="Mode of Payment"
                fullWidth
                name="modeOfPay"
                value={newFee.modeOfPay}
                onChange={(e) => setNewFee({ ...newFee, modeOfPay: e.target.value })}
                sx={{ bgcolor: 'white', '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                error={Boolean(errors.modeOfPay)}
                helperText={errors.modeOfPay}
              >
                <MenuItem value="ONLINE">Online</MenuItem>
                <MenuItem value="OFFLINE">Offline</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
            <Button
              variant="outlined"
              onClick={() => navigate('/students')}
              sx={{ flex: 1, borderColor: '#7d3bed', color: '#7d3bed', '&:hover': { borderColor: '#6a2fb8', color: '#6a2fb8' }, borderRadius: 2.5, py: 1.25 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleAddFee}
              sx={{ flex: 1, bgcolor: '#6d28d9', '&:hover': { bgcolor: '#5b21b6' }, borderRadius: 2.5, py: 1.25, textTransform: 'none', fontWeight: 600 }}
            >
              Add Fee
            </Button>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default AddFee;
