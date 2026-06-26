import {
  Container,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Alert,
  TextField,
  IconButton
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiGet } from '../../api';

function UnpaidFeeTracking() {
  const navigate = useNavigate();
  const [academicYears, setAcademicYears] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [unpaidFees, setUnpaidFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedInstallments, setSelectedInstallments] = useState([]);
  const [dialogTitle, setDialogTitle] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  // Column filters state - stores the search text for each column
  const [columnFilters, setColumnFilters] = useState({
    studentName: '',
    className: ''
  });

  // Load academic years on component mount
  useEffect(() => {
    const loadAcademicYears = async () => {
      try {
        const data = await apiGet('api/students/academic/academic-years');
        setAcademicYears(data);
        // Set the first academic year as default
        if (data && data.length > 0) {
          setSelectedAcademicYear(data[0]);
        }
      } catch (error) {
        console.error('Error fetching academic years:', error);
        setError('Failed to load academic years. Please check if the backend is running.');
      }
    };
    loadAcademicYears();
  }, []);

  // Note: we will fetch defaulters when the user clicks Search (not automatically on select)

  const handleAcademicYearChange = (e) => {
    setSelectedAcademicYear(e.target.value);
    setHasSearched(false);
  };

  const handleFeeTracking = () => {
    navigate('/fee-tracking');
  };

  const fetchDefaulters = async () => {
    if (!selectedAcademicYear) {
      setError('Please select an academic year before searching');
      return;
    }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      // Call FeeController.getDefaulters -> GET /api/fee-payments/defaulters/{academicYear}
      const data = await apiGet(`api/fee-payments/defaulters/${selectedAcademicYear}`);
      setUnpaidFees(data || []);
    } catch (error) {
      console.error('Error fetching defaulters:', error);
      setError('Failed to load unpaid fees.');
      setUnpaidFees([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePaidInstallmentsClick = (fee) => {
    setDialogTitle(`Paid Installments - ${fee.studentName}`);
    setSelectedInstallments(fee.paidInstallments || []);
    setOpenDialog(true);
  };

  const handlePendingInstallmentsClick = (fee) => {
    setDialogTitle(`Pending Installments - ${fee.studentName}`);
    setSelectedInstallments(fee.pendingInstallments || []);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedInstallments([]);
  };

  // Filter the unpaid fees based on active filters
  const getFilteredFees = () => {
    return unpaidFees.filter(fee => {
      return Object.keys(columnFilters).every(key => {
        if (!columnFilters[key]) return true;
        const filterValue = columnFilters[key].toLowerCase();
        const feeValue = String(fee[key] || '').toLowerCase();
        return feeValue.includes(filterValue);
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
      className: ''
    });
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

  const filteredFees = getFilteredFees();

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2, width: '100%' }}>
      <Box sx={{ width: '100%' }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#333', mb: 1 }}>
              Unpaid Fees Tracking
            </Typography>
            <Typography variant="body2" sx={{ color: '#666' }}>
              Track and manage unpaid student fees by academic year
            </Typography>
          </Box>
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
              Filter Unpaid Fees
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <FormControl sx={{ minWidth: 200, flex: 1, bgcolor: 'white', borderRadius: 1 }}>
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
                onClick={fetchDefaulters}
                disabled={!selectedAcademicYear || loading}
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

        {/* Unpaid Fees Table */}
        {selectedAcademicYear && (
          <Card sx={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Unpaid Fees Details ({filteredFees.length} of {unpaidFees.length})
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
               ) : hasSearched && unpaidFees.length === 0 ? (
                 <Alert severity="info">
                   No unpaid fees found for the selected academic year.
                 </Alert>
               ) : !hasSearched ? (
                 <Typography sx={{ color: '#999', textAlign: 'center', p: 2 }}>
                   Click the Search button to view unpaid fees
                 </Typography>
               ) : (
                <TableContainer component={Paper} sx={{ overflowX: 'auto', width: '100%' }}>
                  <Table sx={{ width: '100%' }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#7d3bed' }}>
                        <FilterHeader columnKey="studentName" label="Student Name" />
                        <FilterHeader columnKey="className" label="Standard" />
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 120 }}>
                          Academic Roll No.
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 110 }}>
                          Academic Year
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 140, textAlign: 'center' }}>
                          Paid Installments
                        </TableCell>
                        <TableCell sx={{ color: 'white', fontWeight: 600, whiteSpace: 'normal', minWidth: 150, textAlign: 'center' }}>
                          Pending Installments
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredFees.map((fee, index) => (
                        <TableRow key={index} sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}>
                          <TableCell sx={{ fontWeight: 500, whiteSpace: 'normal', minWidth: 120 }}>
                            {fee.studentName || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 100 }}>
                            {fee.className || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 120 }}>
                            {fee.classRollNo || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 110 }}>
                            {fee.academicYear || 'N/A'}
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 140, textAlign: 'center' }}>
                            <Link
                              component="button"
                              underline="hover"
                              onClick={() => handlePaidInstallmentsClick(fee)}
                              sx={{
                                fontWeight: 600,
                                color: '#1976d2',
                                cursor: 'pointer',
                                '&:hover': {
                                  color: '#1565c0'
                                }
                              }}
                            >
                              {fee.paidInstallments?.length || 0}
                            </Link>
                          </TableCell>
                          <TableCell sx={{ whiteSpace: 'normal', minWidth: 150, textAlign: 'center' }}>
                            <Link
                              component="button"
                              underline="hover"
                              onClick={() => handlePendingInstallmentsClick(fee)}
                              sx={{
                                fontWeight: 600,
                                color: '#d32f2f',
                                cursor: 'pointer',
                                '&:hover': {
                                  color: '#b71c1c'
                                }
                              }}
                            >
                              {fee.pendingInstallments?.length || 0}
                            </Link>
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
        {!selectedAcademicYear && (
          <Card sx={{ textAlign: 'center', p: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="body1" sx={{ color: '#999' }}>
              Please select an academic year to view unpaid fees
            </Typography>
          </Card>
        )}
      </Box>

      {/* Installment Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{dialogTitle}</DialogTitle>

        <DialogContent>
          {selectedInstallments.length > 0 ? (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><b>Installment</b></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {selectedInstallments.map((installment, index) => (
                  <TableRow key={index}>
                    <TableCell>{installment}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Typography>No installments found.</Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseDialog} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default UnpaidFeeTracking;

