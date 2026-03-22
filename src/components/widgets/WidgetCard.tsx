import React, { useState } from 'react';
import { Card, Text, Box, Group } from '@mantine/core';
import { useDashboard } from '../../context/DashboardContext';
import { LoadingState, EmptyState, ErrorState, DataQualityBadge } from '../shared/StateOverlays';

export type WidgetStatus = 'idle' | 'loading' | 'success' | 'empty' | 'error';

interface WidgetCardProps {
  id: string;
  title: string;
  colSpan: number;
  status?: WidgetStatus;
  needsReview?: boolean;
  /** True for Overview Zone A cards — panel shows Summary only, no Detail View */
  isZoneA?: boolean;
  onRetry?: () => void;
  summaryData?: any;
  /** Optional element rendered inline after the title (e.g. a Live badge) */
  titleExtra?: React.ReactNode;
  children: React.ReactNode;
}

export const WidgetCard: React.FC<WidgetCardProps> = ({
  id,
  title,
  colSpan,
  status = 'success',
  needsReview = false,
  isZoneA = false,
  onRetry,
  summaryData,
  titleExtra,
  children,
}) => {
  const { openPanel } = useDashboard();
  const [hovered, setHovered] = useState(false);

  const handleCardClick = () => {
    openPanel(id, 'summary', { ...summaryData, isZoneA });
  };

  const handleDataQualityClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openPanel(id, 'detail', { ...summaryData, showDataQuality: true, isZoneA });
  };

  return (
    <Card
      style={{
        gridColumn: `span ${colSpan}`,
        position: 'relative',
        cursor: 'pointer',
        // Elevation lifts on hover — confirms interactivity without noise
        boxShadow: hovered
          ? '0 4px 14px rgba(18,19,26,0.09), 0 1px 4px rgba(18,19,26,0.05)'
          : '0 1px 2px rgba(18,19,26,0.05), 0 1px 4px rgba(18,19,26,0.04)',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'box-shadow 0.15s ease, transform 0.15s ease',
        zIndex: hovered ? 1 : 0,
      }}
      p={0}
      radius={0}
      withBorder={false}
      onClick={handleCardClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {needsReview && <DataQualityBadge onClick={handleDataQualityClick} />}

      <Box p="22px 26px 26px 26px" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Title row — label-weight, not competing with KPI value */}
        <Group justify="space-between" align="center" mb={14} wrap="nowrap" style={{ minHeight: 20 }}>
          <Text
            ff="Space Grotesk"
            fw={500}
            size="13px"
            c="#6B6E7A"
            style={{ lineHeight: 1.3, userSelect: 'none' }}
          >
            {title}
          </Text>
          {titleExtra && (
            <Box style={{ flexShrink: 0 }} onClick={(e) => e.stopPropagation()}>
              {titleExtra}
            </Box>
          )}
        </Group>

        <Box style={{ flex: 1, position: 'relative' }}>
          {status === 'loading' && <LoadingState />}
          {status === 'empty'   && <EmptyState />}
          {status === 'error'   && <ErrorState onRetry={onRetry} />}
          {status === 'success' && children}
        </Box>
      </Box>
    </Card>
  );
};
