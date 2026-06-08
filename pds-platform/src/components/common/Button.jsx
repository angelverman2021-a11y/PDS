const variants = {
  primary:   'bg-green-700 hover:bg-green-800 text-white',
  secondary: 'bg-blue-700 hover:bg-blue-800 text-white',
  danger:    'bg-red-600 hover:bg-red-700 text-white',
  outline:   'border-2 border-green-700 text-green-700 hover:bg-green-50',
  ghost:     'text-gray-600 hover:bg-gray-100',
  purple:    'bg-purple-700 hover:bg-purple-800 text-white',
};

const sizes = {
  sm:  'px-3 py-1.5 text-sm',
  md:  'px-4 py-2 text-sm',
  lg:  'px-6 py-3 text-base',
  xl:  'px-8 py-4 text-lg',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
