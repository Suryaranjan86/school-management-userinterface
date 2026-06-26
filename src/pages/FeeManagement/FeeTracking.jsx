import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Autocomplete,
  TextField,
  Button,
  IconButton,
  Tooltip
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet, openFileInNewTab } from '../../api';

function FeeTracking() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [feePayments, setFeePayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [academicYears, setAcademicYears] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // Column filters state - stores the search text for each column
  // combine month and year into a single filter key `payMonthYear`
  const [columnFilters, setColumnFilters] = useState({
    studentName: '',
    clsName: '',
    payMonthYear: '',
    modeOfPay: ''
  });

  // Filter the fee payments based on active filters
  const getFilteredPayments = () => {
    return feePayments.filter(payment => {
      return Object.keys(columnFilters).every(key => {
        if (!columnFilters[key]) return true;
        const filterValue = columnFilters[key].toLowerCase();
        let paymentValue = '';
        if (key === 'payMonthYear') {
          // combine month and year for filtering (e.g., "Jan-2024")
          const month = payment.payMonth || '';
          const year = payment.payYear || '';
          paymentValue = `${month}-${year}`.toLowerCase();
        } else {
          paymentValue = String(payment[key] || '').toLowerCase();
        }
        return paymentValue.includes(filterValue);
      });
    });
  };

  // Handle filter input change
  const handleFilterInputChange = (columnKey, value) => {
    setColumnFilters({
      ...columnFilters,
      [columnKey]: value
    });
  };

  // Clear specific filter
  const handleClearFilter = (columnKey) => {
    setColumnFilters({
      ...columnFilters,
      [columnKey]: ''
    });
  };

  // Clear all filters
  const handleClearAllFilters = () => {
    setColumnFilters({
      studentName: '',
      clsName: '',
      payMonthYear: '',
      modeOfPay: ''
    });
  };

  // Fetch all students and academic years on component mount
  useEffect(() => {
    fetchStudents();
    fetchAcademicYears();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiGet('api/students');
      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students. Please check if the backend is running.');
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicYears = async () => {
    try {
      const data = await apiGet('api/students/academic/academic-years');
      setAcademicYears(data || []);
    } catch (err) {
      console.error('Error fetching academic years:', err);
      setAcademicYears([]);
    }
  };

  const fetchFeePayments = async (academicYear, studentId = null) => {
    if (!academicYear) {
      setError('Academic year is mandatory');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      let endpoint = `api/fee-payments/student/${academicYear}`;
      if (studentId) {
        endpoint += `?studentId=${studentId}`;
      }
      const data = await apiGet(endpoint);
      setFeePayments(data || []);
      // Reset filters when new data is loaded
      handleClearAllFilters();
    } catch (err) {
      console.error('Error fetching fee payments:', err);
      setError('Failed to load fee payment details.');
      setFeePayments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (event, value) => {
    const studentId = value ? value.studentId : '';
    setSelectedStudent(studentId);
    setHasSearched(false);
  };

  const handleAcademicYearChange = (e) => {
    const year = e.target.value;
    setSelectedAcademicYear(year);
    setHasSearched(false);
  };

  const handleSearch = () => {
    if (!selectedAcademicYear) {
      setError('Please select an academic year before searching');
      setFeePayments([]);
      return;
    }
    setHasSearched(true);
    fetchFeePayments(selectedAcademicYear, selectedStudent || null);
  };

  const handleUnpaidFees = () => {
    navigate('/unpaid-fees');
  };

  const handleDownloadReceipt = async (paymentId, receiptNo) => {
    try {
      console.log(`Opening receipt in a new tab for payment ID: ${paymentId}`);
      await openFileInNewTab(`api/receipt/${paymentId}`);
      console.log('Receipt opened in new tab successfully');
      setError(null);
    } catch (err) {
      console.error('Error downloading receipt:', err);
      setError(`Failed to open receipt: ${err.message}`);
    }
  };

  // FilterHeader component
  const FilterHeader = ({ columnKey, label }) => {
    return (
      <TableCell sx={{ color: 'white', fontWeight: 600, p: 0.5, whiteSpace: 'nowrap' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
            {label}
          </Typography>
          <TextField
            size="small"
            placeholder="Search..."
            value={columnFilters[columnKey]}
            onChange={(e) => handleFilterInputChange(columnKey, e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
                fontSize: '0.8rem',
                '& fieldset': {
                  borderColor: 'rgba(255,255,255,0.3)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(255,255,255,0.5)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                },
              },
              '& .MuiOutlinedInput-input': {
                p: '6px 8px',
                '&::placeholder': {
                  color: 'rgba(255,255,255,0.6)',
                  opacity: 1,
                },
              },
            }}
            InputProps={{
              endAdornment: columnFilters[columnKey] && (
                <IconButton
                  size="small"
                  onClick={() => handleClearFilter(columnKey)}
                  sx={{ p: 0.3, color: 'white' }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              ),
            }}
          />
        </Box>
      </TableCell>
    );
  };

  const filteredPayments = getFilteredPayments();

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2, width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
              Fee Payment Tracking
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Track and manage student fee payments by selecting a student and academic year
            </Typography>
          </Box>

          <Button
            variant="contained"
            size="small"
            onClick={handleUnpaidFees}
            sx={{
              bgcolor: '#d32f2f',
              color: 'white',
              fontWeight: 600,
              px: 2,
              py: 0.8,
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                bgcolor: '#b71c1c'
              }
            }}
          >
            Unpaid Fees
          </Button>
        </Box>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Selection Dropdowns */}
        <Card sx={{ mb: 3, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Filter Payment Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <Autocomplete
                sx={{ minWidth: 200, flex: 1, bgcolor: 'white', borderRadius: 1 }}
                options={students}
                getOptionLabel={(option) =>
                  option.name
                    ? `${option.name} (${option.classRollNo ? `Roll: ${option.classRollNo}` : 'No Roll'})`
                    : ''
                }
                value={students.find(s => s.studentId === selectedStudent) || null}
                onChange={handleStudentChange}
                isOptionEqualToValue={(option, value) => option.studentId === value?.studentId}
                renderInput={(params) => (
                  <TextField {...params} label="Select Student (Optional)" placeholder="Type to search..." />
                )}
                noOptionsText="No students found"
              />

              <FormControl sx={{ minWidth: 180, flex: 1, bgcolor: 'white', borderRadius: 1 }}>
                <InputLabel id="academic-year-select-label">Select Academic Year *</InputLabel>
                <Select
                  labelId="academic-year-select-label"
                  value={selectedAcademicYear}
                  onChange={handleAcademicYearChange}
                  label="Select Academic Year *"
                >
                  <MenuItem value="">
                    <em>-- Choose a Year --</em>
                  </MenuItem>
                  {academicYears.map((year) => (
                    <MenuItem key={year} value={year}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Button
                variant="contained"
                onClick={handleSearch}
                sx={{
                  bgcolor: '#7d3bed',
                  color: 'white',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontSize: '1rem',
                  '&:hover': {
                    bgcolor: '#6a2fb5'
                  }
                }}
              >
                Search
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Fee Payment Details Table */}
        {selectedAcademicYear && (
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Payment Details ({filteredPayments.length} of {feePayments.length})
                </Typography>
                {Object.values(columnFilters).some(val => val !== '') && (
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={handleClearAllFilters}
                    sx={{ textTransform: 'none' }}
                  >
                    Clear All Filters
                  </Button>
                )}
              </Box>

               {loading ? (
                 <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                   <CircularProgress />
                 </Box>
               ) : hasSearched && feePayments.length === 0 ? (
                 <Alert severity="info">
                   No payment records found for the selected student and academic year.
                 </Alert>
               ) : !hasSearched ? (
                 <Typography sx={{ color: '#999', textAlign: 'center', p: 2 }}>
                   Click the Search button to view payment details
                 </Typography>
               ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
                  <Table sx={{ width: '100%' }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#7d3bed' }}>
                        <FilterHeader columnKey="studentName" label="Student Name" />
                        <FilterHeader columnKey="clsName" label="Standard" />
                        <FilterHeader columnKey="payMonthYear" label="Month-Year" />
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 100 }}>Date</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 100 }}>Amount</TableCell>
                        <FilterHeader columnKey="modeOfPay" label="Mode of Payment" />
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 140 }}>Transaction / Reference No.</TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap', minWidth: 70 }}>Receipt</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredPayments.map((payment, index) => (
                        <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                          <TableCell sx={{ fontWeight: 500, whiteSpace: 'normal', minWidth: 120 }}>
                            {payment.studentName
                              ? `${payment.studentName}${payment.academicRollNo ? ` (Roll:${payment.academicRollNo})` : ''}`
                              : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 70 }}>{payment.clsName || 'N/A'}</TableCell>
                           <TableCell sx={{ whiteSpace: 'normal', minWidth: 120 }}>{(payment.payMonth || 'N/A') + '-' + (payment.payYear || 'N/A')}</TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 100 }}>{payment.paymentDate || 'N/A'}</TableCell>
                          <TableCell sx={{ fontWeight: 600, color: '#2e7d32', whiteSpace: 'normal', minWidth: 100 }}>
                            ₹{payment.amount?.toFixed(2) || '0.00'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 130 }}>
                            <Typography
                              sx={{
                                display: 'inline-block',
                                px: 1.5,
                                py: 0.5,
                                bgcolor: payment.modeOfPay === 'ONLINE' ? '#e3f2fd' : '#f3e5f5',
                                color: payment.modeOfPay === 'ONLINE' ? '#1976d2' : '#7b1fa2',
                                borderRadius: 1,
                                fontWeight: 500,
                                fontSize: '0.85rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {payment.modeOfPay || 'N/A'}
                            </Typography>
                          </TableCell>
                           <TableCell sx={{ whiteSpace: 'normal', minWidth: 140 }}>
                             {payment.modeOfPay === 'ONLINE'
                               ? (payment.transactionId || 'N/A')
                               : (payment.slipNo || 'N/A')}
                           </TableCell>
                          <TableCell sx={{ textAlign: 'center', whiteSpace: 'nowrap', minWidth: 70 }}>
                            <Tooltip title="Download Receipt">
                              <IconButton
                                size="small"
                                onClick={() => handleDownloadReceipt(payment.id, payment.receiptNo)}
                                sx={{
                                  color: '#d32f2f',
                                  '&:hover': {
                                    bgcolor: '#ffebee',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                <PictureAsPdfIcon />
                              </IconButton>
                            </Tooltip>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {!selectedStudent && !selectedAcademicYear && (
          <Card sx={{ textAlign: 'center', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="body1" sx={{ color: '#999' }}>
              Please select a student and academic year to view payment details
            </Typography>
          </Card>
        )}
      </Box>
    </Box>
  );
}

export default FeeTracking;