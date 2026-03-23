import React, { useState } from 'react';
import { Card, Text, Box, Group } from '@mantine/core';
import { useDashboard } from '../../context/DashboardContext';
import { LoadingState, EmptyState, ErrorState } from '../shared/StateOverlays';

export type WidgetStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface WidgetCardProps {
  id: string;
  title: string;
  colSpan: number;
  status?: WidgetStatus;
  isZoneA?: boolean;
  onRetry?: () => void;
  summaryData?: any;
  /** Optional element rendered inline after the title (e.g. a Live badge) */
  titleExtra?: React.ReactNode;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  id,
  title,
  colSpan,
  status = 'success',
  onRetry,
  summaryData,
  titleExtra,
  children,
  style,
}) => {
  const { openPanel } = useDashboard();
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    openPanel(id, 'summary', summaryData);
  };

  return (
    <Card
      style={{
        gridColumn: `span ${colSpan}`,
        position: 'relative',
        cursor: 'pointer',
        backgroundColor: 'var(--color-bg-card)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-card)',
        boxShadow: hovered ? '0 4px 12px rgba(0,0,0,0.08)' : 'var(--shadow-card)',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        overflow: 'visible',
        ...style,
      }}
      p="20px 24px"
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Card Header */}
      <Group justify="space-between" align="center" mb={16} wrap="nowrap">
        <Text
          ff="Space Grotesk"
          fw={500}
          size="13px"
          c="var(--color-text-muted)"
          style={{ letterSpacing: '0.01em' }}
        >
          {title}
        </Text>
        {titleExtra && (
          <Box onClick={(e) => e.stopPropagation()}>
            {titleExtra}
          </Box>
        )}
      </Group>

      {/* Card Content */}
      <Box style={{ flex: 1, position: 'relative' }}>
        {status === 'loading' && <LoadingState />}
        {status === 'empty'   && <EmptyState />}
        {status === 'error'   && <ErrorState onRetry={onRetry} />}
        {status === 'success' && children}
      </Box>
    </Card>
  );
};
