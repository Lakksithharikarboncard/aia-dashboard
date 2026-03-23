import React from 'react';
import { Box, Group, Text } from '@mantine/core';
import { formatCurrency } from '../../utils/formatters';

interface CustomerBarProps {
  name: string;
  amount: number;
  percent: number;
  color: string;
  opacity?: number;
}

export const CustomerBar: React.FC<CustomerBarProps> = ({ name, amount, percent, color, opacity = 1 }) => {
  return (
    <Box style={{ width: '100%' }}>
      <Group justify="space-between" mb={4} wrap="nowrap">
        <Text ff="Space Grotesk" fw={500} size="13px" c="var(--color-text-secondary)" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {name}
        </Text>
        <Text
          ff="Albert Sans"
          fw={600}
          size="13px"
          c="var(--color-text-primary)"
          className="num"
        >
          {formatCurrency(amount)}
        </Text>
      </Group>
      <Box style={{ backgroundColor: 'var(--color-bg-hover)', height: 6, borderRadius: 3, width: '100%', overflow: 'hidden' }}>
        <Box
          style={{
            backgroundColor: color,
            opacity,
            height: '100%',
            borderRadius: 3,
            width: `${percent}%`,
            transition: 'width 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />
      </Box>
    </Box>
  );
};
