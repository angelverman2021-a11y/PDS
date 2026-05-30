import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../constants';
import {
  Home, Store, QrCode, FileText, AlertTriangle,
  LayoutDashboard, LogOut, LogIn, ShieldCheck, Truck,
} from 'lucide-react';

const citizenLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/allocation', label: 'Allocation', icon: FileText },
  { to: '/receipts', label: 'Receipts', icon: QrCode },
  { to: '/complaints/track', label: 'Complaints', icon: AlertTriangle },
  { to: '/shops', label: 'Shops', icon: Store },
];

const dealerLinks = [
  { to: '/dealer', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/shops', label: 'Shops', icon: Store },
];

const adminLinks = [
  { to: '/admin/district', label: 'District', icon: ShieldCheck },
  { to: '/admin', label: 'Admin Panel', icon: LayoutDashboard },
  { to: '/shops', label: 'Shops', icon: Store },
];

const publicLinks = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shops', label: 'Shops', icon: Store },
  { to: '/verify', label: 'Verify', icon: QrCode },
  { to: '/complaints/new', label: 'Report', icon: AlertTriangle },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const links = !user
    ? publicLinks
    : user.role === ROLES.CITIZEN
    ? citizenLinks
    : user.role === ROLES.DEALER
    ? dealerLinks
    : adminLinks;

  const roleColor = !user
    ? 'bg-green-700'
    : user.role === ROLES.DEALER
    ? 'bg-blue-700'
    : user.role === ROLES.ADMIN
    ? 'bg-purple-800'
    : 'bg-green-700';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop Navbar */}
      <nav className={`${roleColor} text-white shadow-lg hidden md:block`}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Truck size={24} />
            <span>PDS Platform</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium hover:bg-white/20 ${
                  location.pathname === to ? 'bg-white/25' : ''
                }`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </div>

          {/* Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm opacity-90">
                  {user.name.split(' ')[0]} · <span className="capitalize opacity-75">{user.role}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg text-sm"
              >
                <LogIn size={15} /> Login
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Top Bar */}
      <nav className={`${roleColor} text-white shadow-md md:hidden`}>
        <div className="px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <Truck size={20} />
            <span>PDS Platform</span>
          </Link>
          {user ? (
            <button onClick={handleLogout} className="bg-white/20 p-2 rounded-lg">
              <LogOut size={18} />
            </button>
          ) : (
            <Link to="/login" className="bg-white/20 p-2 rounded-lg">
              <LogIn size={18} />
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 ${roleColor} text-white z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.15)]`}>
        <div className="flex justify-around py-2">
          {links.slice(0, 5).map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs ${
                location.pathname === to ? 'bg-white/25' : 'opacity-80'
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom padding for mobile nav */}
      <div className="md:hidden h-16" />
    </>
  );
}
