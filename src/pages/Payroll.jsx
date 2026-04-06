import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const payrollData = [
  { id: 1, name: 'John Doe', salary: 50000, bonus: 2000, deductions: 1000, net: 51000 },
  { id: 2, name: 'Jane Smith', salary: 60000, bonus: 3000, deductions: 1500, net: 61500 },
];

function Payroll() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Payroll
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Salary</TableCell>
              <TableCell>Bonus</TableCell>
              <TableCell>Deductions</TableCell>
              <TableCell>Net Pay</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payrollData.map((pay) => (
              <TableRow key={pay.id}>
                <TableCell>{pay.id}</TableCell>
                <TableCell>{pay.name}</TableCell>
                <TableCell>${pay.salary}</TableCell>
                <TableCell>${pay.bonus}</TableCell>
                <TableCell>${pay.deductions}</TableCell>
                <TableCell>${pay.net}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Payroll;
