import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';

const jobOpenings = [
  { id: 1, title: 'Software Engineer', department: 'IT', applicants: 15, status: 'Open' },
  { id: 2, title: 'HR Manager', department: 'HR', applicants: 8, status: 'Open' },
];

function Recruitment() {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Recruitment
      </Typography>
      <Button variant="contained" sx={{ mb: 2 }}>Post New Job</Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Job Title</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Applicants</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {jobOpenings.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{job.id}</TableCell>
                <TableCell>{job.title}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell>{job.applicants}</TableCell>
                <TableCell>{job.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}

export default Recruitment;
