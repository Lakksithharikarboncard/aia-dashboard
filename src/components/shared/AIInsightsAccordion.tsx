import { useState } from 'react';
import { Box, Group, Text, UnstyledButton, Collapse } from '@mantine/core';
import { IconChevronDown, IconSparkles } from '@tabler/icons-react';

type Severity = 'critical' | 'watch' | 'positive';
type Source = 'Receivables' | 'Payables' | 'Overview';

interface Insight {
  id: string;
  severity: Severity;
  source: Source;
  title: string;
  summary: string;
  whatFound: string;
  whyMatters: string;
  suggestedReview: string;
  basedOn: string;
}

const INSIGHTS_DATA: Insight[] = [
  {
    id: 'insight-1',
    severity: 'critical',
    source: 'Receivables',
    title: 'Overdue receivables up 34% vs last month',
    summary: '₹4,20,000 overdue across 8 invoices — up from ₹3,12,000',
    whatFound: 'Overdue AR increased from ₹3,12,000 last month to ₹4,20,000 this month — a 34.6% rise across 8 open invoices.',
    whyMatters: 'Sustained growth in overdue balances may indicate collections slippage and could pressure working capital within 30–45 days.',
    suggestedReview: 'Review the 61–90 day aging bucket in Payables & Receivables for customers approaching write-off risk.',
    basedOn: 'AR Outstanding · AR Aging · This Month vs Last Month',
  },
  {
    id: 'insight-2',
    severity: 'watch',
    source: 'Overview',
    title: 'DSO increased 12% — Acme Corp contributing 14 days',
    summary: '45 days vs 40 days target — Acme Corp is the primary driver',
    whatFound: 'DSO rose from 40 days last month to 45 days this month. Acme Corp accounts for 14 of those 45 days based on outstanding invoice value.',
    whyMatters: 'A single customer driving more than 30% of DSO is a concentration risk. If collection delays continue, it may distort overall receivables health.',
    suggestedReview: 'Verify whether Acme Corp invoices have a contested status or recurring delay pattern over the last 2–3 periods.',
    basedOn: 'DSO · AR Outstanding · Customer Ledger · This Month',
  },
  {
    id: 'insight-3',
    severity: 'positive',
    source: 'Overview',
    title: 'Operating margin improved to 26.7%',
    summary: '+5.2pp vs prior period — driven by stable COGS and lower indirect expense',
    whatFound: 'Operating margin reached 26.7% this month, up from 21.5% last month (+5.2pp). Revenue grew 7.1% while operating expense held flat.',
    whyMatters: 'Margin expansion alongside revenue growth suggests operating leverage is beginning to work — a signal worth monitoring for consistency.',
    suggestedReview: 'Assess whether the expense reduction is structural or timing-related by comparing against the prior quarter average.',
    basedOn: 'P&L Summary · Revenue Trend · This Month vs Last Month',
  },
];

const SeverityDot = ({ severity }: { severity: Severity }) => {
  const color = severity === 'critical' ? '#DC2626' : severity === 'watch' ? '#D97706' : '#16A34A';
  return <Box style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: color, flexShrink: 0 }} />;
};

const SectionLabel = ({ label }: { label: string }) => (
  <Text ff="Space Grotesk" fw={600} size="10px" c="var(--color-text-ghost)" style={{ textTransform: 'uppercase', letterSpacing: '0.5px' }} mb={4}>
    {label}
  </Text>
);

export const AIInsightsAccordion = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggle = (id: string) => setExpandedId(expandedId === id ? null : id);

  return (
    <Box>
      {/* Header Row */}
      <Group justify="space-between" p="0 0 16px" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Group gap={8}>
          <IconSparkles size={16} color="#D97706" />
          <Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)">
            AI Insights
          </Text>
          <Box
            style={{
              border: '1px solid #D97706',
              borderRadius: 'var(--radius-badge)',
              backgroundColor: '#FFFBEB',
              padding: '2px 6px',
            }}
          >
            <Text ff="Space Grotesk" fw={600} size="10px" c="#D97706" style={{ textTransform: 'uppercase' }}>
              BETA
            </Text>
          </Box>
        </Group>
        <Text ff="Space Grotesk" size="11px" c="var(--color-text-ghost)">
          Updated just now
        </Text>
      </Group>

      {/* Insight Rows */}
      {INSIGHTS_DATA.map((insight) => (
        <Box key={insight.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
          <UnstyledButton
            onClick={() => toggle(insight.id)}
            style={{ width: '100%', padding: '12px 20px', height: 48 }}
          >
            <Group justify="space-between" align="center" wrap="nowrap">
              <Group gap={12} style={{ flex: 1, minWidth: 0 }}>
                <SeverityDot severity={insight.severity} />
                <Text ff="Space Grotesk" fw={600} size="13px" c="var(--color-text-primary)" style={{ whiteSpace: 'nowrap' }}>
                  {insight.title}
                </Text>
                <Text
                  ff="Space Grotesk"
                  fw={400}
                  size="13px"
                  c="var(--color-text-muted)"
                  style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 520 }}
                >
                  {insight.summary}
                </Text>
              </Group>
              <Group gap={12}>
                <Box
                  style={{
                    border: '1px solid var(--color-border)',
                    borderRadius: 20,
                    backgroundColor: '#F9FAFB',
                    padding: '2px 8px',
                  }}
                >
                  <Text ff="Space Grotesk" fw={500} size="11px" c="var(--color-text-muted)">
                    {insight.source}
                  </Text>
                </Box>
                <IconChevronDown
                size={16}
                color="#9CA3AF"
                style={{
                  transform: expandedId === insight.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 150ms ease',
                  flexShrink: 0,
                }}
              />
              </Group>
            </Group>
          </UnstyledButton>

          <Collapse in={expandedId === insight.id}>
            <Box p="0 20px 20px">
              <Box
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 'var(--radius-inner)',
                  padding: '16px 20px',
                  margin: '8px 0 8px 20px',
                  borderLeft: `2px solid ${insight.severity === 'critical' ? '#DC2626' : insight.severity === 'watch' ? '#D97706' : '#16A34A'}`,
                }}
              >
                <Box mb={12}>
                  <SectionLabel label="WHAT WE FOUND" />
                  <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">
                    {insight.whatFound}
                  </Text>
                </Box>
                <Box mb={12}>
                  <SectionLabel label="WHY IT MATTERS" />
                  <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">
                    {insight.whyMatters}
                  </Text>
                </Box>
                <Box mb={12}>
                  <SectionLabel label="SUGGESTED REVIEW" />
                  <Text ff="Space Grotesk" size="13px" c="var(--color-text-secondary)">
                    {insight.suggestedReview}
                  </Text>
                </Box>
                <Box>
                  <SectionLabel label="BASED ON" />
                  <Group gap={6}>
                    {insight.basedOn.split(' · ').map((source, i) => (
                      <Box
                        key={i}
                        style={{
                          border: '1px solid #E5E7EB',
                          borderRadius: 'var(--radius-badge)',
                          backgroundColor: '#F3F4F6',
                          padding: '2px 7px',
                        }}
                      >
                        <Text ff="Space Grotesk" fw={500} size="11px" c="#374151">
                          {source}
                        </Text>
                      </Box>
                    ))}
                  </Group>
                </Box>

                <Group justify="flex-end" mt={16} gap={12}>
                  <UnstyledButton style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)" style={{ transition: 'color 0.1s' }} className="feedback-btn">
                      👍 Helpful
                    </Text>
                  </UnstyledButton>
                  <UnstyledButton style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Text ff="Space Grotesk" size="12px" c="var(--color-text-ghost)" style={{ transition: 'color 0.1s' }} className="feedback-btn">
                      👎 Not helpful
                    </Text>
                  </UnstyledButton>
                </Group>
              </Box>
            </Box>
          </Collapse>
        </Box>
      ))}
    </Box>
  );
};
