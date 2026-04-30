import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, Logout as LogoutIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const navigate = useNavigate();
  const { user, school, logout } = useAuth();

  // Fetch the image from backend when logoUrl changes
  useEffect(() => {
    const fetchLogoImage = async () => {
      if (school?.logoUrl) {
        try {
          const schoolId = localStorage.getItem('school_id');
          // Fetch the image as a blob from the static resources
          const response = await fetch(`http://localhost:8080${school.logoUrl}`, {
            method: 'GET',
            headers: {
              'X-School-Id': schoolId || '',
            },
          });

          if (response.ok) {
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            setLogoImage(blobUrl);
          } else {
            console.warn('Failed to fetch logo image:', response.status);
          }
        } catch (error) {
          console.error('Error fetching logo image:', error);
        }
      }
    };

    fetchLogoImage();

    // Cleanup blob URL on component unmount
    return () => {
      if (logoImage) {
        window.URL.revokeObjectURL(logoImage);
      }
    };
  }, [school?.logoUrl]);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          {logoImage && (
            <Box
              component="img"
              src={logoImage}
              alt="School Logo"
              sx={{
                height: 50,
                width: 50,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid white',
              }}
            />
          )}
          <Box>
            <Typography variant="h6" component="div">
              HRMS
            </Typography>
            {school && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {school.name} • {school.address}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {user && (
            <Typography variant="body2" sx={{ mr: 1 }}>
              Welcome, {user.username}
            </Typography>
          )}
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Typography variant="body2">Logged in as: {user?.username}</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1, fontSize: 20 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
