import { Container, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiPost } from '../../api';

function AddTeacher() {
  const [newTeacher, setNewTeacher] = useState({
    name: '',
    email: '',
    contactNumber: '',
    highestQualification: '',
    otherQualification: '',
    subject: '',
    joiningDate: '',
    permanentAddress: '',
    permanentState: '',
    permanentDistrict: '',
    permanentPin: '',
    currentAddress: '',
    currentState: '',
    currentDistrict: '',
    currentPin: '',
    status: 'Active'
  });
  const navigate = useNavigate();

  const indianStates = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttar Pradesh',
    'Uttarakhand',
    'West Bengal',
    'Delhi',
    'Jammu and Kashmir',
    'Ladakh',
    'Puducherry',
    'Chandigarh',
    'Andaman and Nicobar Islands',
    'Dadra and Nagar Haveli and Daman and Diu',
    'Lakshadweep'
  ];

  const qualifications = [
    '10th Pass',
    '12th Pass',
    'Diploma',
    'Bachelor\'s Degree',
    'Master\'s Degree',
    'PhD',
    'Other'
  ];

  const handleInputChange = (e) => {
    setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
  };

  const handleAddTeacher = async () => {
    try {
      await apiPost('api/teachers', newTeacher);
      console.log('Teacher added successfully');
      navigate('/teachers');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Add Teacher
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={newTeacher.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Email"
            name="email"
            value={newTeacher.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={newTeacher.contactNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Highest Qualification</InputLabel>
              <Select
                name="highestQualification"
                value={newTeacher.highestQualification}
                onChange={handleInputChange}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              >
                {qualifications.map((qual) => (
                  <MenuItem key={qual} value={qual}>
                    {qual}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {newTeacher.highestQualification === 'Other' && (
              <TextField
                label="Specify Other"
                name="otherQualification"
                value={newTeacher.otherQualification}
                onChange={handleInputChange}
                sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
              />
            )}
          </Box>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              value={newTeacher.subject}
              onChange={handleInputChange}
              sx={{ bgcolor: 'white', borderRadius: 1 }}
            >
              <MenuItem value="Math">Math</MenuItem>
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Science">Science</MenuItem>
              <MenuItem value="Arts">Arts</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Joining Date"
            name="joiningDate"
            type="date"
            value={newTeacher.joiningDate}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Typography variant="h6">Permanent Address</Typography>
              <TextField
                label="Address"
                name="permanentAddress"
                value={newTeacher.permanentAddress}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="permanentState"
                    value={newTeacher.permanentState}
                    onChange={handleInputChange}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  >
                    {indianStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="District"
                  name="permanentDistrict"
                  value={newTeacher.permanentDistrict}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
                <TextField
                  label="Pin Code"
                  name="permanentPin"
                  value={newTeacher.permanentPin}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
              <Typography variant="h6">Current Address</Typography>
              <TextField
                label="Address"
                name="currentAddress"
                value={newTeacher.currentAddress}
                onChange={handleInputChange}
                multiline
                rows={3}
                sx={{ bgcolor: 'white', borderRadius: 1 }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                <FormControl sx={{ flex: 1 }}>
                  <InputLabel>State</InputLabel>
                  <Select
                    name="currentState"
                    value={newTeacher.currentState}
                    onChange={handleInputChange}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  >
                    {indianStates.map((state) => (
                      <MenuItem key={state} value={state}>
                        {state}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="District"
                  name="currentDistrict"
                  value={newTeacher.currentDistrict}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
                <TextField
                  label="Pin Code"
                  name="currentPin"
                  value={newTeacher.currentPin}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={handleAddTeacher}
            sx={{
              bgcolor: '#7d3bed',
              '&:hover': { bgcolor: '#6a2fb8' },
              width: 200,
              height: 45,
              borderRadius: 2.5,
              mt: 2
            }}
          >
            Save
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default AddTeacher;
