const config = {
  available:    { dot: 'bg-green-500', label: 'Available', text: 'text-green-700' },
  low:          { dot: 'bg-amber-500', label: 'Low Stock', text: 'text-amber-700' },
  out_of_stock: { dot: 'bg-red-500',   label: 'Out of Stock', text: 'text-red-700' },
};

export default function StatusIndicator({ status, showLabel = true, size = 'md' }) {
  const cfg = config[status] || config.out_of_stock;
  const dotSize = size === 'lg' ? 'w-4 h-4' : 'w-2.5 h-2.5';
  const textSize = size === 'lg' ? 'text-base font-semibold' : 'text-sm font-medium';

  return (
    <span className={`inline-flex items-center gap-1.5 ${cfg.text}`}>
      <span className={`${dotSize} rounded-full ${cfg.dot} animate-pulse`} />
      {showLabel && <span className={textSize}>{cfg.label}</span>}
    </span>
  );
}
