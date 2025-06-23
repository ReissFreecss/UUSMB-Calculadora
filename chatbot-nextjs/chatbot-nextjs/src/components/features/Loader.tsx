'use client';
import { CircularProgress, Box } from '@mui/material';

export default function Loader() {
  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress size={60} thickness={5} />
    </Box>
  );
}