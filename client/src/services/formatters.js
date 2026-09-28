export function formatCurrency(amount, showDecimals = true) {
  const val = Number(amount) || 0;
  return new Intl.NumberFormat('nl-BE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0
  }).format(val);
}

export function formatCompactCurrency(amount) {
  const val = Number(amount) || 0;
  if (Math.abs(val) >= 1000) {
    return `€ ${(val / 1000).toFixed(1)}k`;
  }
  return `€ ${val.toFixed(0)}`;
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const d = new Date(dateString);
  const now = new Date();
  
  const isToday = d.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = d.toDateString() === yesterday.toDateString();

  if (isToday) return 'Vandaag';
  if (isYesterday) return 'Gisteren';

  return d.toLocaleDateString('nl-BE', {
    day: 'numeric',
    month: 'short'
  });
}

export function getIconComponent(iconName) {
  // Safe fallback if icon string is passed
  return iconName || 'Tag';
}

export const FREQUENCIES = [
  { id: 'monthly', label: 'Maandelijks (12x/jaar)', divisor: 1, short: '/mnd' },
  { id: 'quarterly', label: 'Per 3 maanden (Trimester / Kwartaal)', divisor: 3, short: '/3 mnd' },
  { id: 'quadrimestral', label: 'Per 4 maanden (3x/jaar)', divisor: 4, short: '/4 mnd' },
  { id: 'semiannual', label: 'Per halfjaar (6 maanden)', divisor: 6, short: '/halfjaar' },
  { id: 'yearly', label: 'Per jaar (Jaarlijks)', divisor: 12, short: '/jaar' }
];

export function getMonthlyEquivalent(amount, frequency = 'monthly') {
  const num = Number(amount) || 0;
  const f = FREQUENCIES.find(x => x.id === frequency);
  const div = f ? f.divisor : 1;
  return Math.round((num / div) * 100) / 100;
}

export function formatFrequencyLabel(frequency = 'monthly') {
  const f = FREQUENCIES.find(x => x.id === frequency);
  return f ? f.short : '/mnd';
}
