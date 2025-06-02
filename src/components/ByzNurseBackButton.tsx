import React from 'react';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface ByzNurseBackButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

const ByzNurseBackButton: React.FC<ByzNurseBackButtonProps> = ({ onClick, children }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      startIcon={<ArrowBackIcon />}
      onClick={onClick}
      sx={{
        borderRadius: 2,
        textTransform: 'none',
        minWidth: 100,
      }}
    >
      {children || 'Geri'}
    </Button>
  );
};

export default ByzNurseBackButton; 