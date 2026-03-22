import React from 'react';
import { Box, Text, Button, Skeleton, Center } from '@mantine/core';
import { IconAlertTriangle, IconDatabaseOff } from '@tabler/icons-react';

export const LoadingState = () => (
  <Box style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
    <Skeleton height={40} width="60%" radius={0} />
    <Skeleton height={20} width="40%" radius={0} />
    <Skeleton height={120} width="100%" radius={0} mt="md" />
  </Box>
);

export const EmptyState = ({ message = "No data for this period" }: { message?: string }) => (
  <Center style={{ height: '100%', minHeight: 150, flexDirection: 'column', gap: 8, opacity: 0.6 }}>
    <IconDatabaseOff size={32} color="#979797" />
    <Text ff="Space Grotesk" size="sm" c="dimmed">{message}</Text>
  </Center>
);

export const ErrorState = ({ code = "ERR_500", onRetry }: { code?: string, onRetry?: () => void }) => (
  <Center style={{ height: '100%', minHeight: 150, flexDirection: 'column', gap: 12 }}>
    <IconAlertTriangle size={32} color="#F82B2B" />
    <Text ff="Space Grotesk" fw={500} size="sm" c="#12131A">Unable to load data</Text>
    <Text ff="Space Grotesk" size="xs" c="dimmed">Error code: {code}</Text>
    {onRetry && (
      <Button variant="light" color="gray" size="xs" onClick={onRetry} styles={{ label: { fontFamily: 'Space Grotesk' } }}>
        Retry
      </Button>
    )}
  </Center>
);

export const DataQualityBadge = ({ onClick }: { onClick: (e: React.MouseEvent) => void }) => (
  <Box 
    onClick={onClick}
    style={{ 
      display: 'inline-flex', 
      alignItems: 'center', 
      gap: 4, 
      backgroundColor: '#FEF3C7', // Amber light
      padding: '4px 8px', 
      borderRadius: 0,
      cursor: 'pointer',
      position: 'absolute',
      top: 24,
      right: 28,
      zIndex: 2
    }}
  >
    <IconAlertTriangle size={14} color="#D97706" />
    <Text ff="Space Grotesk" size="xs" fw={600} c="#D97706">Needs Review</Text>
  </Box>
);
