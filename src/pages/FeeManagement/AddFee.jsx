import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { useState } from 'react';
import { BASE_URL } from '../../config';

function AddFee({ open, onClose, selectedStudent, selectedClass, selectedBatch, onFeeAdded, students }) {
  const [newFee, setNewFee] = useState({
    studentId: '',
    payMonth: '',
    payYear: '',
    paymentDate: '',
    transactionId: '',
    modeOfPay: 'ONLINE'
  });

  const handleAddFee = async () => {
    try {
      const feeData = {
        ...newFee,
        studentId: selectedStudent,
        classId: selectedClass,
        batch: selectedBatch
      };
      const response = await fetch(`${BASE_URL}api/fee-payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feeData),
      });
      if (response.ok) {
        console.log('Fee payment added successfully');
        setNewFee({
          studentId: '',
          payMonth: '',
          payYear: '',
          paymentDate: '',
          transactionId: '',
          modeOfPay: 'ONLINE'
        });
        onFeeAdded();
        onClose();
      } else {
        console.error('Failed to add fee payment');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add Fee Payment</DialogTitle>
      <DialogContent>
           <TextField
                    label="Student"
                    value={selectedStudent ? students.find(s => s.id === selectedStudent)?.name || selectedStudent : ''}
                    fullWidth
                    sx={{ mt: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
        <TextField
          label="Class"
          value={selectedClass ? students.find(s => s.cls?.id === selectedClass)?.cls?.name || selectedClass : ''}
          fullWidth
          sx={{ mt: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}
          InputProps={{
            readOnly: true,
          }}
        />
        <TextField
          label="Batch"
          value={selectedBatch || ''}
          fullWidth
          sx={{ mt: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}
          InputProps={{
            readOnly: true,
          }}
        />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Pay Month</InputLabel>
          <Select
            name="payMonth"
            value={newFee.payMonth}
            onChange={(e) => setNewFee({ ...newFee, payMonth: e.target.value })}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          >
            <MenuItem value="January">January</MenuItem>
            <MenuItem value="February">February</MenuItem>
            <MenuItem value="March">March</MenuItem>
            <MenuItem value="April">April</MenuItem>
            <MenuItem value="May">May</MenuItem>
            <MenuItem value="June">June</MenuItem>
            <MenuItem value="July">July</MenuItem>
            <MenuItem value="August">August</MenuItem>
            <MenuItem value="September">September</MenuItem>
            <MenuItem value="October">October</MenuItem>
            <MenuItem value="November">November</MenuItem>
            <MenuItem value="December">December</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Pay Year"
          name="payYear"
          type="number"
          value={newFee.payYear}
          onChange={(e) => setNewFee({ ...newFee, payYear: e.target.value })}
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
        <TextField
          label="Transaction ID"
          name="transactionId"
          value={newFee.transactionId}
          onChange={(e) => setNewFee({ ...newFee, transactionId: e.target.value })}
          fullWidth
          sx={{ mt: 2, bgcolor: 'white', borderRadius: 1 }}
        />
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Mode of Payment</InputLabel>
          <Select
            name="modeOfPay"
            value={newFee.modeOfPay}
            onChange={(e) => setNewFee({ ...newFee, modeOfPay: e.target.value })}
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          >
            <MenuItem value="ONLINE">Online</MenuItem>
            <MenuItem value="OFFLINE">Offline</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleAddFee}>Add</Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddFee;
