import React from 'react';
import { Group, Text, Box } from '@mantine/core';
import { IconArrowUp, IconArrowDown } from '@tabler/icons-react';

export type TrendDirection = 'up' | 'down' | 'neutral';
export type TrendSentiment = 'positive' | 'negative' | 'neutral';

interface TrendBadgeProps {
  value: number;
  label: string;
  sentiment?: TrendSentiment; // Manual override if logic is complex
  type?: 'revenue' | 'cash' | 'profit' | 'dso' | 'ar_overdue' | 'ap_overdue' | 'generic';
}

/**
 * Delta badge:
 * display: inline-flex
 * align-items: center
 * gap: 4px
 * padding: 2px 6px
 * border-radius: var(--radius-badge)
 * background: positive-bg or critical-bg
 * font: Space Grotesk 600 12px
 */
export const TrendBadge: React.FC<TrendBadgeProps> = ({ value, label, sentiment: manualSentiment, type = 'generic' }) => {
  const isUp = value > 0;
  
  // Determine sentiment based on type (Section 6.3)
  let sentiment: TrendSentiment = 'neutral';
  
  if (manualSentiment) {
    sentiment = manualSentiment;
  } else {
    switch (type) {
      case 'revenue':
      case 'cash':
      case 'profit':
        sentiment = isUp ? 'positive' : 'negative';
        break;
      case 'dso':
      case 'ar_overdue':
      case 'ap_overdue':
        sentiment = isUp ? 'negative' : 'positive';
        break;
      default:
        sentiment = 'neutral';
    }
  }

  const getColors = () => {
    switch (sentiment) {
      case 'positive':
        return { bg: 'var(--color-positive-bg)', text: 'var(--color-positive)' };
      case 'negative':
        return { bg: 'var(--color-critical-bg)', text: 'var(--color-critical)' };
      default:
        return { bg: 'var(--color-bg-hover)', text: 'var(--color-text-muted)' };
    }
  };

  const { bg, text } = getColors();
  const Icon = isUp ? IconArrowUp : IconArrowDown;

  return (
    <Group gap={8} align="center" wrap="nowrap">
      <Box
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 6px',
          borderRadius: 'var(--radius-badge)',
          backgroundColor: bg,
        }}
      >
        {value !== 0 && <Icon size={12} color={text} stroke={3} />}
        <Text
          ff="Space Grotesk"
          size="12px"
          fw={600}
          c={text}
          style={{ lineHeight: 1 }}
        >
          {Math.abs(value).toFixed(1)}%
        </Text>
      </Box>
      <Text ff="Space Grotesk" size="12px" c="var(--color-text-muted)" style={{ lineHeight: 1 }}>
        {label}
      </Text>
    </Group>
  );
};
