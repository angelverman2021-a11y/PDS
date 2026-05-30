import { Truck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto hidden md:block">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-lg mb-2">
              <Truck size={20} />
              PDS Platform
            </div>
            <p className="text-sm text-gray-400">
              Empowering citizens with transparency in India's Public Distribution System.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-1.5 text-sm">
              <Link to="/shops" className="hover:text-white transition-colors">Find Ration Shop</Link>
              <Link to="/verify" className="hover:text-white transition-colors">Verify Receipt</Link>
              <Link to="/complaints/new" className="hover:text-white transition-colors">Report Corruption</Link>
              <Link to="/complaints/track" className="hover:text-white transition-colors">Track Complaint</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3">Helpline</h4>
            <p className="text-sm">PDS Helpline: <span className="text-white">1800-XXX-XXXX</span></p>
            <p className="text-sm mt-1">Email: <span className="text-white">help@pds.gov.in</span></p>
            <p className="text-sm mt-1 text-gray-400">Available Mon–Sat, 9AM–6PM</p>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-6 pt-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <span>© 2025 PDS Transparency Platform. Government of India Initiative.</span>
          <span className="flex items-center gap-1 mt-2 md:mt-0">
            Made with <Heart size={12} className="text-red-400 fill-red-400" /> by Kushagra and Angel
          </span>
        </div>
      </div>
    </footer>
  );
}
