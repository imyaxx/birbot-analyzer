export function cn(...inputs) {
  return inputs
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'object' && item !== null) {
        return Object.entries(item)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(' ');
      }
      return item;
    })
    .join(' ');
}

export function toNumber(value, fallback = 0) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : fallback;
}

export function safeString(value, fallback) {
  return String(value ?? fallback);
}

export function formatMoney(amount, currency = '₸') {
  return (
    new Intl.NumberFormat('ru-RU', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      useGrouping: true,
    }).format(amount) + ` ${currency}`
  );
}
