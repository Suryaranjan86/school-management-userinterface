import { Container, Typography, Button, TextField, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BASE_URL } from '../../config';

function EditTeacher() {
  const { id } = useParams();
  const [teacher, setTeacher] = useState({
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

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/teachers/${id}`);
      if (response.ok) {
        const data = await response.json();
        setTeacher(data);
      } else {
        console.error('Failed to fetch teacher');
      }
    } catch (error) {
      console.error('Error fetching teacher:', error);
    }
  };

  const handleInputChange = (e) => {
    setTeacher({ ...teacher, [e.target.name]: e.target.value });
  };

  const handleUpdateTeacher = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/teachers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(teacher),
      });
      if (response.ok) {
        console.log('Teacher updated successfully');
        navigate('/teachers');
      } else {
        console.error('Failed to update teacher');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Box sx={{ bgcolor: '#f8f9fa', minHeight: '100vh', p: 2 }}>
      <Container maxWidth="sm">
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
          Edit Teacher
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Name"
            name="name"
            value={teacher.name}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Email"
            name="email"
            value={teacher.email}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="Contact Number"
            name="contactNumber"
            value={teacher.contactNumber}
            onChange={handleInputChange}
            fullWidth
            sx={{ bgcolor: 'white', borderRadius: 1 }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
            <FormControl sx={{ flex: 1 }}>
              <InputLabel>Highest Qualification</InputLabel>
              <Select
                name="highestQualification"
                value={teacher.highestQualification}
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
            {teacher.highestQualification === 'Other' && (
              <TextField
                label="Specify Other"
                name="otherQualification"
                value={teacher.otherQualification}
                onChange={handleInputChange}
                sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
              />
            )}
          </Box>
          <FormControl fullWidth>
            <InputLabel>Subject</InputLabel>
            <Select
              name="subject"
              value={teacher.subject}
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
            value={teacher.joiningDate}
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
                value={teacher.permanentAddress}
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
                    value={teacher.permanentState}
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
                  value={teacher.permanentDistrict}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
                <TextField
                  label="Pin Code"
                  name="permanentPin"
                  value={teacher.permanentPin}
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
                value={teacher.currentAddress}
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
                    value={teacher.currentState}
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
                  value={teacher.currentDistrict}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
                <TextField
                  label="Pin Code"
                  name="currentPin"
                  value={teacher.currentPin}
                  onChange={handleInputChange}
                  sx={{ flex: 1, bgcolor: 'white', borderRadius: 1 }}
                />
              </Box>
            </Box>
          </Box>
          <Button
            variant="contained"
            onClick={handleUpdateTeacher}
            sx={{
              bgcolor: '#7d3bed',
              '&:hover': { bgcolor: '#6a2fb8' },
              width: 200,
              height: 45,
              borderRadius: 2.5,
              mt: 2
            }}
          >
            Update
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default EditTeacher;
