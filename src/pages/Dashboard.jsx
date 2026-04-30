import { Container, Typography, Grid, Card, CardContent, Box, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, school } = useAuth();
}

export default Dashboard;
