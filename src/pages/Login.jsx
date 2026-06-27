import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Card,
  Alert,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    const success = await login(username, password);

    if (success) {
      navigate('/');
    } else {
      setError('Invalid username or password');
    }

    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1d4ed8 45%, #7c3aed 100%)',
        py: { xs: 3, md: 6 },
      }}
    >
      <Container maxWidth="lg">
        <Card
          sx={{
            overflow: 'hidden',
            borderRadius: 4,
            boxShadow: '0 24px 80px rgba(15, 23, 42, 0.28)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            minHeight: { md: 560 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 100%)',
              color: 'white',
              p: { xs: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.9 }}>
              School Portal
            </Typography>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1.5 }}>
              Manage your school with confidence.
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.7, opacity: 0.95, maxWidth: 360 }}>
              Streamline student, teacher, and fee management from one modern dashboard.
            </Typography>

            <Box
              sx={{
                mt: 3,
                p: 2,
                borderRadius: 2,
                backgroundColor: 'rgba(255,255,255,0.16)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Why teams prefer it
              </Typography>
              <Stack spacing={1} sx={{ mt: 1.5 }}>
                <Typography variant="body2">• Secure sign-in experience</Typography>
                <Typography variant="body2">• Fast record updates</Typography>
                <Typography variant="body2">• Clear, organized workflows</Typography>
              </Stack>
            </Box>
          </Box>

          <Box sx={{ flex: 1, p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%' }}>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 700, color: '#1e293b', mb: 1 }}>
                Welcome back
              </Typography>
              <Typography variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                Sign in to continue to your dashboard.
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Box component="form" onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  label="Username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  autoFocus
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  margin="normal"
                  variant="outlined"
                  disabled={loading}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#f8fafc',
                    },
                  }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  sx={{
                    mt: 3,
                    mb: 2,
                    py: 1.2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
                    boxShadow: '0 10px 25px rgba(37, 99, 235, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #1d4ed8 0%, #6d28d9 100%)',
                    },
                  }}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>

                <Typography variant="body2" sx={{ textAlign: 'center', color: '#94a3b8', mt: 2 }}>
                  Demo Credentials: admin / password123
                </Typography>
              </Box>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default Login;

