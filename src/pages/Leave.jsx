import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const leaveData = [
  { id: 1, name: 'John Doe', type: 'Sick Leave', startDate: '2023-10-05', endDate: '2023-10-07', status: 'Approved' },
  { id: 2, name: 'Jane Smith', type: 'Vacation', startDate: '2023-10-10', endDate: '2023-10-15', status: 'Pending' },
];

function Leave() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Leave Management
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }}>Request Leave</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {leaveData.map((leave) => (
              <TableRow key={leave.id}>
                <TableCell>{leave.id}</TableCell>
                <TableCell>{leave.name}</TableCell>
                <TableCell>{leave.type}</TableCell>
                <TableCell>{leave.startDate}</TableCell>
                <TableCell>{leave.endDate}</TableCell>
                <TableCell>{leave.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Leave;
