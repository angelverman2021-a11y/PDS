import { Link } from 'react-router-dom';
import { Home, Search, AlertTriangle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <AlertTriangle size={36} className="text-red-500" />
      </div>
      <p className="text-8xl font-extrabold text-gray-200 leading-none mb-2">404</p>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h1>
      <p className="text-gray-500 max-w-sm mb-8">
        The page you are looking for does not exist or has been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-green-700 text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 transition-all"
        >
          <Home size={16} /> Go Home
        </Link>
        <Link
          to="/shops"
          className="inline-flex items-center gap-2 border border-gray-200 bg-white text-gray-700 font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all"
        >
          <Search size={16} /> Find a Shop
        </Link>
      </div>
    </div>
  );
}
