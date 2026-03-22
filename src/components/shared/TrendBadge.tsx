import React from 'react';
import { Group, Text } from '@mantine/core';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';

interface TrendBadgeProps {
  value: number;
  label: string;
}

/**
 * Flat inline delta — no pill background.
 * The directional arrow + percentage are the signal; muted label provides context.
 * This is the fintech convention: let numbers speak, not decorative chips.
 */
export const TrendBadge: React.FC<TrendBadgeProps> = ({ value, label }) => {
  const isPositive = value >= 0;
  const color = isPositive ? '#14A166' : '#E0342B';
  const Icon = isPositive ? IconArrowUpRight : IconArrowDownRight;

  return (
    <Group gap={5} align="center" wrap="nowrap" style={{ display: 'inline-flex' }}>
      <Icon size={14} color={color} strokeWidth={2.5} />
      <Text
        ff="Space Grotesk"
        size="sm"
        fw={600}
        c={color}
        style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.01em', lineHeight: 1 }}
      >
        {Math.abs(value)}%
      </Text>
      <Text ff="Space Grotesk" size="xs" c="#8A8C96" style={{ lineHeight: 1 }}>
        {label}
      </Text>
    </Group>
  );
};
