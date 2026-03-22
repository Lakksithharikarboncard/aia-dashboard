import React from 'react';
import { Box, Group, Text } from '@mantine/core';

interface CustomerBarProps {
  name: string;
  amount: string;
  percent: number;
  color: string;
  opacity?: number;
}

export const CustomerBar: React.FC<CustomerBarProps> = ({ name, amount, percent, color, opacity = 1 }) => {
  return (
    <Box>
      <Group justify="space-between" mb={7}>
        <Text ff="Space Grotesk" fw={500} size="sm" c="#2C2E36">{name}</Text>
        <Text
          ff="Albert Sans"
          fw={500}
          size="sm"
          c="#12131A"
          style={{ fontVariantNumeric: 'tabular-nums', fontFeatureSettings: '"tnum" on' }}
        >
          {amount}
        </Text>
      </Group>
      <Box style={{ backgroundColor: '#EBEBEE', height: 14, borderRadius: 0, width: '100%', overflow: 'hidden' }}>
        <Box
          style={{
            backgroundColor: color,
            opacity,
            height: '100%',
            borderRadius: 0,
            width: `${percent}%`,
            transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </Box>
    </Box>
  );
};
