const variants = {
  available:     'bg-green-100 text-green-800 border border-green-200',
  low:           'bg-amber-100 text-amber-800 border border-amber-200',
  out_of_stock:  'bg-red-100 text-red-800 border border-red-200',
  pending:       'bg-yellow-100 text-yellow-800 border border-yellow-200',
  collected:     'bg-green-100 text-green-800 border border-green-200',
  partial:       'bg-blue-100 text-blue-800 border border-blue-200',
  not_collected: 'bg-gray-100 text-gray-700 border border-gray-200',
  submitted:     'bg-blue-100 text-blue-800 border border-blue-200',
  under_review:  'bg-amber-100 text-amber-800 border border-amber-200',
  assigned:       'bg-purple-100 text-purple-800 border border-purple-200',
  resolved:      'bg-green-100 text-green-800 border border-green-200',
  closed:        'bg-gray-100 text-gray-600 border border-gray-200',
  flagged:       'bg-red-100 text-red-800 border border-red-200',
  warning:       'bg-amber-100 text-amber-800 border border-amber-200',
  normal:        'bg-green-100 text-green-800 border border-green-200',
  distributed:   'bg-green-100 text-green-800 border border-green-200',
  default:       'bg-gray-100 text-gray-700 border border-gray-200',
};

const labels = {
  available:     'Available',
  low:           'Low Stock',
  out_of_stock:  'Out of Stock',
  pending:       'Pending',
  collected:     'Collected',
  partial:       'Partial',
  not_collected: 'Not Collected',
  submitted:     'Submitted',
  under_review:  'Under Review',
  assigned:       'Assigned',
  resolved:      'Resolved',
  closed:        'Closed',
  flagged:       'Flagged',
  warning:       'Warning',
  normal:        'Normal',
  distributed:   'Distributed',
};

export default function Badge({ status, customLabel, size = 'sm' }) {
  const cls = variants[status] || variants.default;
  const text = customLabel || labels[status] || status;
  const sizeClass = size === 'lg' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${cls} ${sizeClass}`}>
      {text}
    </span>
  );
}
