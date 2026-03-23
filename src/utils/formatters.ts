/**
 * Formats monetary values using the Indian number system with shorthand for lakhs and crores.
 * Rule:
 * < ₹1,000       → ₹850
 * ₹1,000–99,999  → ₹45,200 (comma-separated, no shorthand)
 * ₹1,00,000+     → ₹1.85L
 * ₹1,00,00,000+  → ₹1.2Cr
 */
export const formatCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 10000000) {
    return `${sign}₹${(absValue / 10000000).toFixed(1).replace(/\.0$/, '')}Cr`;
  }
  if (absValue >= 100000) {
    return `${sign}₹${(absValue / 100000).toFixed(2).replace(/\.00$/, '').replace(/(\.\d)0$/, '$1')}L`;
  }
  
  return `${sign}₹${new Intl.NumberFormat('en-IN').format(absValue)}`;
};

/**
 * Formats dates to "DD Mon YYYY"
 */
export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace(/ /g, ' ');
};

/**
 * Formats overdue age to "Xd overdue"
 */
export const formatOverdue = (days: number): string => {
  return `${days}d overdue`;
};

/**
 * Formats days to "X days"
 */
export const formatDays = (days: number): string => {
  return `${days} days`;
};
