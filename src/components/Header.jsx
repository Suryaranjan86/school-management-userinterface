import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Box } from '@mui/material';
import { AccountCircle, Logout as LogoutIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BASE_URL } from '../config';

function Header() {
  const [anchorEl, setAnchorEl] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const navigate = useNavigate();
  const { user, school, logout } = useAuth();

  // Fetch the image from backend when school changes
  useEffect(() => {
    console.log('useEffect triggered! School:', school);
    
    const fetchLogoImage = async () => {
      const schoolData = Array.isArray(school) ? school[0] : school;
      console.log('fetchLogoImage called, logoUrl:', schoolData?.logoUrl);
      
      if (!schoolData || !schoolData.logoUrl) {
        console.log('School or logoUrl is missing');
        return;
      }
      
      try {
        const schoolId = localStorage.getItem('school_id');
        const logoUrl = `${BASE_URL.replace(/\/$/, '')}${schoolData.logoUrl}`;
        console.log('Fetching logo from:', logoUrl);
        
        // Fetch the image as a blob from the static resources
        const response = await fetch(logoUrl, {
          method: 'GET',
          headers: {
            'X-School-Id': schoolId || '',
          },
        });

        console.log('Fetch response status:', response.status, response.statusText);
        
        if (response.ok) {
          const blob = await response.blob();
          console.log('Blob received, size:', blob.size);
          const blobUrl = window.URL.createObjectURL(blob);
          setLogoImage(blobUrl);
          console.log('Logo set successfully');
        } else {
          const errorText = await response.text();
          console.warn('Failed to fetch logo image:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching logo image:', error);
      }
    };

    if (school) {
      fetchLogoImage();
    }

    // Cleanup blob URL on component unmount
    return () => {
      if (logoImage) {
        window.URL.revokeObjectURL(logoImage);
      }
    };
  }, [school]);

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
              {(Array.isArray(school) ? school[0] : school)?.name || 'School Name'}
            </Typography>
            {school && (
              <Typography variant="caption" sx={{ opacity: 0.9, display: 'block' }}>
                {(Array.isArray(school) ? school[0] : school)?.address}
              </Typography>
            )}
          </Box>
        </Box>

        <Box sx={{ textAlign: 'right', mr: 2, minWidth: 160 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            SMS
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.8, display: 'block' }}>
            School Management Software
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <AccountCircle />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem disabled>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="body2">Logged in as: {user?.username}</Typography>
                {user?.role && (
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Role: {user.role}
                  </Typography>
                )}
              </Box>
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
