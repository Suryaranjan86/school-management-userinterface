import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const attendanceData = [
  { id: 1, name: 'John Doe', date: '2023-10-01', checkIn: '09:00', checkOut: '17:00', status: 'Present' },
  { id: 2, name: 'Jane Smith', date: '2023-10-01', checkIn: '08:30', checkOut: '16:30', status: 'Present' },
];

function Attendance() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Attendance
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Check In</TableCell>
              <TableCell>Check Out</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {attendanceData.map((att) => (
              <TableRow key={att.id}>
                <TableCell>{att.id}</TableCell>
                <TableCell>{att.name}</TableCell>
                <TableCell>{att.date}</TableCell>
                <TableCell>{att.checkIn}</TableCell>
                <TableCell>{att.checkOut}</TableCell>
                <TableCell>{att.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Attendance;
