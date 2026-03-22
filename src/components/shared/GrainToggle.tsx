import React from 'react';
import { Box } from '@mantine/core';

export type Grain = 'Day' | 'Week' | 'Month';

interface GrainToggleProps {
  value: Grain;
  onChange: (g: Grain) => void;
}

export const GrainToggle: React.FC<GrainToggleProps> = ({ value, onChange }) => {
  return (
    <Box
      style={{ display: 'inline-flex', backgroundColor: '#EBEBEE', borderRadius: 0, padding: 3, gap: 2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {(['Day', 'Week', 'Month'] as Grain[]).map((g) => (
        <Box
          key={g}
          component="button"
          onClick={() => onChange(g)}
          style={{
            padding: '3px 9px',
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 12,
            fontWeight: value === g ? 600 : 400,
            color: value === g ? '#12131A' : '#8A8C96',
            backgroundColor: value === g ? '#FCFCFC' : 'transparent',
            borderRadius: 0,
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.1s ease, color 0.1s ease',
            lineHeight: '1.5',
            boxShadow: value === g ? '0 1px 2px rgba(18,19,26,0.06)' : 'none',
          }}
        >
          {g}
        </Box>
      ))}
    </Box>
  );
};
