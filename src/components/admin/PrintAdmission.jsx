import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Paper, Typography, Grid, Button } from '@mui/material';

const PrintAdmission = () => {
  const [admission, setAdmission] = useState(null);
  const { id } = useParams();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchAdmission();
  }, [id]);

  const fetchAdmission = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admissions/${id}`);
      const data = await response.json();
      setAdmission(data);
    } catch (error) {
      console.error('Error fetching admission:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (!admission) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container className="print-admission-container" maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, '@media print': { boxShadow: 'none' } }}>
        <Typography variant="h4" align="center" gutterBottom>
          Admission Details
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <Typography variant="h6">Personal Information</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Name:</strong> {admission.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Father's Name:</strong> {admission.fathersName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Mother's Name:</strong> {admission.mothersName}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Email:</strong> {admission.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Phone:</strong> {admission.phone}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Date of Birth:</strong> {new Date(admission.dateOfBirth).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Address:</strong> {admission.address}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mt: 2 }}>Academic Information</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Course:</strong> {admission.course}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Education:</strong> {admission.education}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Date of Admission:</strong> {new Date(admission.dateOfAdmission).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Application Date:</strong> {new Date(admission.applicationDate).toLocaleDateString()}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography><strong>Status:</strong> {admission.status}</Typography>
          </Grid>
          {admission.image && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mt: 2 }}>Photo</Typography>
              <img 
                src={admission.image} 
                alt="Student" 
                style={{ maxWidth: '200px', marginTop: '10px' }}
              />
            </Grid>
          )}
        </Grid>

        <Button
          variant="contained"
          color="primary"
          onClick={handlePrint}
          sx={{ mt: 4, '@media print': { display: 'none' } }}
        >
          Print
        </Button>
      </Paper>
    </Container>
  );
};

export default PrintAdmission;
