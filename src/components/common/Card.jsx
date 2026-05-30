export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
}
