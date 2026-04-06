import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useState, useEffect } from 'react';
import { BASE_URL } from '../config';

function FeeTracking() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [fees, setFees] = useState([]);
  const [open, setOpen] = useState(false);
  const [newFee, setNewFee] = useState({
    amount: '',
    paymentDate: '',
    type: 'Paid',
    description: ''
  });

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

  const fetchFees = async (studentId) => {
    try {
      const response = await fetch(`${BASE_URL}api/fees/student/${studentId}`);
      if (response.ok) {
        const data = await response.json();
        setFees(data);
      } else {
        console.error('Failed to fetch fees');
      }
    } catch (error) {
      console.error('Error fetching fees:', error);
    }
  };

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedStudent('');
    setFees([]);
  };

  const handleBatchChange = (e) => {
    setSelectedBatch(e.target.value);
    setSelectedStudent('');
    setFees([]);
  };

  const handleStudentChange = (e) => {
    const studentId = e.target.value;
    setSelectedStudent(studentId);
    if (studentId) {
      fetchFees(studentId);
    } else {
      setFees([]);
    }
  };

  const handleAddFee = async () => {
    try {
      const feeData = { ...newFee, student: { id: selectedStudent } };
      const response = await fetch(`${BASE_URL}api/fees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feeData),
      });
      if (response.ok) {
        console.log('Fee added successfully');
        setOpen(false);
        setNewFee({ amount: '', paymentDate: '', type: 'Paid', description: '' });
        fetchFees(selectedStudent);
      } else {
        console.error('Failed to add fee');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Get unique classes
  const uniqueClasses = [...new Set(students.map(student => student.cls?.id).filter(Boolean))].map(id => {
    const student = students.find(s => s.cls?.id === id);
    return { id, name: student.cls.name };
  });

  // Get unique batches
  const uniqueBatches = [...new Set(students.map(student => student.batch).filter(Boolean))];

  // Filter students by selected class and batch
  let filteredStudents = students;
  if (selectedClass) {
    filteredStudents = filteredStudents.filter(student => student.cls?.id === selectedClass);
  }
  if (selectedBatch) {
    filteredStudents = filteredStudents.filter(student => student.batch === selectedBatch);
  }

  const totalPaid = fees.filter(fee => fee.type === 'Paid').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
  const totalOutstanding = fees.filter(fee => fee.type === 'Outstanding').reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
          Fee Tracking
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Filter by Class</InputLabel>
            <Select
              value={selectedClass}
              onChange={handleClassChange}
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
              onChange={handleBatchChange}
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
          <FormControl sx={{ minWidth: 200, bgcolor: 'white', borderRadius: 1 }}>
            <InputLabel>Select Student</InputLabel>
            <Select
              value={selectedStudent}
              onChange={handleStudentChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {filteredStudents.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={() => setOpen(true)}
            disabled={!selectedStudent}
            sx={{ bgcolor: '#7d3bed', '&:hover': { bgcolor: '#6a2fb8' } }}
          >
            Add Fee
          </Button>
        </Box>
        {selectedStudent && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Total Paid: ${totalPaid.toFixed(2)}</Typography>
            <Typography variant="h6">Total Outstanding: ${totalOutstanding.toFixed(2)}</Typography>
          </Box>
        )}
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Amount</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Description</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>${fee.amount}</TableCell>
                  <TableCell>{fee.paymentDate}</TableCell>
                  <TableCell>{fee.type}</TableCell>
                  <TableCell>{fee.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Add Fee</DialogTitle>
          <DialogContent>
            <TextField
              label="Amount"
              name="amount"
              type="number"
              value={newFee.amount}
              onChange={(e) => setNewFee({ ...newFee, amount: e.target.value })}
              fullWidth
              sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}
            />
            <TextField
              label="Payment Date"
              name="paymentDate"
              type="date"
              value={newFee.paymentDate}
              onChange={(e) => setNewFee({ ...newFee, paymentDate: e.target.value })}
              fullWidth
              sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newFee.type}
                onChange={(e) => setNewFee({ ...newFee, type: e.target.value })}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              >
                <MenuItem value="Paid">Paid</MenuItem>
                <MenuItem value="Outstanding">Outstanding</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Description"
              name="description"
              value={newFee.description}
              onChange={(e) => setNewFee({ ...newFee, description: e.target.value })}
              fullWidth
              sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAddFee}>Add</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}

export default FeeTracking;

