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
