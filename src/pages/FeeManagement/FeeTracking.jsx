import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BASE_URL } from '../../config';
import AddFee from './AddFee';

function FeeTracking() {
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [fees, setFees] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const initialized = useRef(false);

  // Initial load of students
  useEffect(() => {
    const loadStudents = async () => {
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
    loadStudents();
  }, []);

  // Handle URL parameter auto-selection after students are loaded
  useEffect(() => {
    if (students.length > 0 && !initialized.current) {
      const studentId = searchParams.get('studentId');
      const classId = searchParams.get('class');
      const batch = searchParams.get('batch');

      if (studentId) {
        setSelectedStudent(studentId);
        if (classId) {
          setSelectedClass(classId);
        }
        if (batch) {
          setSelectedBatch(batch);
        }
        fetchFees(studentId);
        initialized.current = true;
      }
    }
  }, [students]);

  const fetchFees = async (studentId) => {
    try {
      const response = await fetch(`${BASE_URL}api/fee-payments`);
      if (response.ok) {
        const data = await response.json();
        // Filter fees for the selected student
        const studentFees = data.filter(fee => fee.student && fee.student.id === studentId);
        setFees(studentFees);
      } else {
        console.error('Failed to fetch fee payments');
      }
    } catch (error) {
      console.error('Error fetching fee payments:', error);
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

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const handleFeeAdded = () => {
    if (selectedStudent) {
      fetchFees(selectedStudent);
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
            onClick={handleOpenDialog}
            disabled={!selectedStudent}
            sx={{ bgcolor: '#7d3bed', '&:hover': { bgcolor: '#6a2fb8' } }}
          >
            Add Fee
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ borderRadius: 1 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Pay Month</TableCell>
                <TableCell>Pay Year</TableCell>
                <TableCell>Payment Date</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Mode of Payment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.payMonth}</TableCell>
                  <TableCell>{fee.payYear}</TableCell>
                  <TableCell>{fee.paymentDate}</TableCell>
                  <TableCell>{fee.transactionId}</TableCell>
                  <TableCell>{fee.modeOfPay}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <AddFee
          open={open}
          onClose={handleCloseDialog}
          selectedStudent={selectedStudent}
          selectedClass={selectedClass}
          selectedBatch={selectedBatch}
          students={students}
          onFeeAdded={handleFeeAdded}
        />
      </Container>
    </Box>
  );
}

export default FeeTracking;

