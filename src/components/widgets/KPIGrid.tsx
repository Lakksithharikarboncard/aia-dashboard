import React from 'react';
import { Box } from '@mantine/core';

interface KPIGridProps {
  children: React.ReactNode;
}

export const KPIGrid: React.FC<KPIGridProps> = ({ children }) => {
  return (
    <Box 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '24px',
        gridColumn: 'span 12',
        alignContent: 'start',
        alignItems: 'stretch',
      }}
    >
      {children}
    </Box>
  );
};
