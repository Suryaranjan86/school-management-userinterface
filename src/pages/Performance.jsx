import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const performanceData = [
  { id: 1, name: 'John Doe', rating: 4.5, review: 'Excellent performance' },
  { id: 2, name: 'Jane Smith', rating: 4.0, review: 'Good work' },
];

function Performance() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Performance Reviews
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Review</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {performanceData.map((perf) => (
              <TableRow key={perf.id}>
                <TableCell>{perf.id}</TableCell>
                <TableCell>{perf.name}</TableCell>
                <TableCell>{perf.rating}</TableCell>
                <TableCell>{perf.review}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Performance;
