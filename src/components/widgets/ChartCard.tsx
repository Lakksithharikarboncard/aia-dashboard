import React from 'react';
import { WidgetCard } from './WidgetCard';
import type { WidgetStatus } from './WidgetCard';
import { Box } from '@mantine/core';

interface ChartCardProps {
  id: string;
  title: string;
  colSpan: number;
  status?: WidgetStatus;
  needsReview?: boolean;
  isZoneA?: boolean;
  onRetry?: () => void;
  summaryData?: any;
  /** Optional element rendered in the title row (e.g. grain toggle) */
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
  height?: number;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  id,
  title,
  colSpan,
  status = 'success',
  needsReview = false,
  isZoneA = false,
  onRetry,
  summaryData,
  headerExtra,
  children,
  height = 250,
}) => {
  return (
    <WidgetCard
      id={id}
      title={title}
      colSpan={colSpan}
      status={status}
      needsReview={needsReview}
      isZoneA={isZoneA}
      onRetry={onRetry}
      summaryData={summaryData}
      titleExtra={headerExtra}
    >
      <Box style={{ height, marginTop: 8 }}>
        {children}
      </Box>
    </WidgetCard>
  );
};
