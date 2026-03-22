import React, { useState } from 'react';
import { Box, Group, Text, UnstyledButton, Collapse } from '@mantine/core';
import { IconSparkles, IconAlertCircle, IconCircleCheck, IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { useDashboard } from '../../context/DashboardContext';

interface Insight {
  id: string;
  severity: 'red' | 'amber' | 'green';
  message: string;
  evidence: string;
  widgetId: string;
}

const mockInsights: Insight[] = [
  { id: '1', severity: 'red',   message: 'DSO increased 12% vs last month', evidence: '45 days → 40 days target', widgetId: 'w4-dso' },
  { id: '2', severity: 'amber', message: 'Vendor X is 42% of total AP spend', evidence: '₹4,00,000 of ₹9,50,000', widgetId: 'w21-vendor-spend' },
  { id: '3', severity: 'green', message: 'Operating margin improved to 26.7%',  evidence: '+5.2pp vs prior period',  widgetId: 'w7-pnl-full' },
];

// Severity color tokens
const SEV: Record<string, { dot: string; text: string; bg: string }> = {
  red:   { dot: '#E0342B', text: '#E0342B', bg: 'rgba(224,52,43,0.07)' },
  amber: { dot: '#D97706', text: '#B45309', bg: 'rgba(217,119,6,0.08)' },
  green: { dot: '#14A166', text: '#0E7A4D', bg: 'rgba(20,161,102,0.07)' },
};

// ─── Compact chip for Cash / P&R tabs ────────────────────────────────────────

export const AIInsightsCompact = () => {
  const { openPanel } = useDashboard();
  const hasRed = mockInsights.some(i => i.severity === 'red');

  return (
    <Box style={{ gridColumn: 'span 12', display: 'flex', justifyContent: 'flex-end', marginBottom: -4 }}>
      <UnstyledButton
        onClick={() => openPanel(mockInsights[0].widgetId, 'detail', mockInsights[0])}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 7,
          backgroundColor: '#FCFCFC',
          border: '1px solid rgba(18,19,26,0.1)',
          borderRadius: 0,
          padding: '5px 12px',
          boxShadow: '0 1px 3px rgba(18,19,26,0.04)',
        }}
      >
        <IconSparkles size={13} color="#2268D1" />
        <Text ff="Space Grotesk" size="xs" fw={500} c="#12131A">
          {mockInsights.length} signals
        </Text>
        {hasRed && (
          <Box style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#E0342B' }} />
        )}
        <Text
          ff="Space Grotesk"
          size="10px"
          fw={700}
          c="#8A8C96"
          style={{ letterSpacing: '0.06em', backgroundColor: '#EBEBEE', padding: '1px 5px', borderRadius: 0 }}
        >
          BETA
        </Text>
      </UnstyledButton>
    </Box>
  );
};

// ─── Full strip for Overview tab ──────────────────────────────────────────────

export const AIInsightsStrip = () => {
  const [expanded, setExpanded] = useState(false);
  const { openPanel } = useDashboard();

  return (
    <Box
      style={{
        gridColumn: 'span 12',
        // Visually distinct from data cards — subtle blue-tinted background + left accent
        background: 'linear-gradient(135deg, #EEF3FF 0%, #F4F7FF 40%, #FCFCFC 100%)',
        borderRadius: 0,
        padding: expanded ? '14px 20px 16px' : '0 20px',
        // Inset left accent bar — no layout impact
        boxShadow: 'inset 3px 0 0 #2268D1, 0 1px 2px rgba(18,19,26,0.04)',
        minHeight: 52,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Group
        justify="space-between"
        align="center"
        style={{ cursor: 'pointer', padding: expanded ? 0 : '14px 0' }}
        onClick={() => setExpanded(!expanded)}
      >
        {/* Strip label */}
        <Group gap={8} align="center">
          <IconSparkles size={15} color="#2268D1" />
          <Text ff="Albert Sans" fw={600} size="14px" c="#12131A" style={{ letterSpacing: '-0.01em' }}>
            AI Insights
          </Text>
          <Text
            ff="Space Grotesk"
            size="10px"
            fw={700}
            c="#2268D1"
            style={{
              letterSpacing: '0.06em',
              backgroundColor: 'rgba(34,104,209,0.1)',
              padding: '2px 6px',
              borderRadius: 0,
              lineHeight: 1.4,
            }}
          >
            BETA
          </Text>
        </Group>

        <Group gap={10} align="center">
          {/* Inline chips — collapsed state only */}
          {!expanded && (
            <Group gap={8} wrap="nowrap">
              {mockInsights.map((insight) => (
                <InsightChip
                  key={insight.id}
                  insight={insight}
                  onClick={(e) => {
                    e.stopPropagation();
                    openPanel(insight.widgetId, 'detail', insight);
                  }}
                />
              ))}
            </Group>
          )}
          <Box style={{ color: '#8A8C96', display: 'flex', alignItems: 'center' }}>
            {expanded ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
          </Box>
        </Group>
      </Group>

      {/* Expanded rows */}
      <Collapse in={expanded}>
        <Box mt={12} style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {mockInsights.map((insight) => (
            <Box
              key={insight.id}
              style={{
                backgroundColor: SEV[insight.severity].bg,
                border: `1px solid ${SEV[insight.severity].dot}22`,
                padding: '6px 10px',
                borderRadius: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
              }}
              onClick={() => openPanel(insight.widgetId, 'detail', insight)}
            >
              <Group gap={9} wrap="nowrap">
                <SeverityDot severity={insight.severity} />
                <Text ff="Space Grotesk" size="13px" fw={500} c="#12131A">{insight.message}</Text>
              </Group>
              <Text ff="Albert Sans" size="13px" c="#6B6E7A" style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
                {insight.evidence}
              </Text>
            </Box>
          ))}
        </Box>
      </Collapse>
    </Box>
  );
};

// ─── Inline chip (collapsed state) ───────────────────────────────────────────

function InsightChip({ insight, onClick }: { insight: Insight; onClick: (e: React.MouseEvent) => void }) {
  const sev = SEV[insight.severity];
  return (
    <UnstyledButton
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.7)',
        border: '1px solid rgba(18,19,26,0.1)',
        padding: '5px 11px',
        borderRadius: 0,
        flexShrink: 0,
        backdropFilter: 'blur(4px)',
      }}
    >
      <Box style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: sev.dot, flexShrink: 0 }} />
      <Text
        ff="Space Grotesk"
        size="12px"
        fw={500}
        c="#12131A"
        style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
      >
        {insight.message}
      </Text>
      <Text ff="Albert Sans" size="12px" c="#6B6E7A" style={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
        · {insight.evidence}
      </Text>
    </UnstyledButton>
  );
}

function SeverityDot({ severity }: { severity: string }) {
  const Icon = severity === 'green' ? IconCircleCheck : IconAlertCircle;
  return <Icon size={15} color={SEV[severity]?.dot ?? '#8A8C96'} strokeWidth={2} />;
}
