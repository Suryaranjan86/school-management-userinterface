import { Container, Typography, Grid, Card, CardContent, Box, Divider } from '@mui/material';
import { useAuth } from '../context/AuthContext';

function Dashboard() {
  const { user, school } = useAuth();

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* School Information Card */}
      {school && (
        <Card sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
              School Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    School Name
                  </Typography>
                  <Typography variant="h6">{school.name}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Address
                  </Typography>
                  <Typography variant="h6">{school.address}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    District
                  </Typography>
                  <Typography variant="h6">{school.district || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    State
                  </Typography>
                  <Typography variant="h6">{school.state || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    PIN Code
                  </Typography>
                  <Typography variant="h6">{school.pin || 'N/A'}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    School ID
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                    {school.id}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* User Information Card */}
      {user && (
        <Card sx={{ mb: 3, backgroundColor: '#f0f4ff' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#764ba2' }}>
              User Profile
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    Username
                  </Typography>
                  <Typography variant="h6">{user.username}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#999' }}>
                    User ID
                  </Typography>
                  <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
                    {user.userId}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Dashboard Statistics */}
      <Typography variant="h5" sx={{ mt: 4, mb: 2, fontWeight: 'bold' }}>
        Quick Stats
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Total Employees</Typography>
              <Typography variant="h3">150</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Active Projects</Typography>
              <Typography variant="h3">12</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5">Pending Tasks</Typography>
              <Typography variant="h3">25</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Dashboard;
