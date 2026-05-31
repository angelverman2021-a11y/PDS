import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, AlertTriangle, ArrowRight, Store, Star, Clock, Database, Navigation } from 'lucide-react';
import { STOCK_STATUS } from '../../constants';
import { searchShopsByPincode } from '../../services/shopService';
import Badge from '../../components/common/Badge';
import Loader from '../../components/common/Loader';

const filters = [
  { key: 'all',                    label: 'All Shops' },
  { key: STOCK_STATUS.AVAILABLE,   label: 'Available' },
  { key: STOCK_STATUS.LOW,         label: 'Low Stock' },
  { key: STOCK_STATUS.OUT_OF_STOCK,label: 'Out of Stock' },
];

export default function ShopFinder() {
  const [search, setSearch]   = useState('');
  const [pincode, setPincode] = useState('');
  const [filter, setFilter]   = useState('all');
  const [loading, setLoading] = useState(false);
  const [serviceResult, setServiceResult] = useState({
    ok: false,
    error: 'REAL_SHOP_DATA_UNAVAILABLE',
    shops: [],
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await searchShopsByPincode({ pincode });
    setServiceResult(result);
    setLoading(false);
  };

  const shops = serviceResult.shops.filter(s => {
    const matchFilter = filter === 'all' || s.stockStatus === filter;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.address.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-8">

      {/* Header */}
      <div className="bg-green-700 text-white px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-1">
            <Store size={20} />
            <p className="text-green-200 text-sm">Public Directory</p>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-5">Find Ration Shops</h1>
          <p className="text-green-100 text-sm mb-4 max-w-2xl">
            Search only returns externally sourced shop records from Google Places, OpenStreetMap, or authorized FPS datasets.
          </p>

          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by area or shop name…"
                className="w-full pl-9 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <div className="relative sm:w-40">
              <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                placeholder="Pincode"
                maxLength={6}
                className="w-full pl-9 pr-4 py-3 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              />
            </div>
            <button
              type="submit"
              className="bg-white text-green-800 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-all text-sm"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 mt-6">

        {/* Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          {filters.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === key
                  ? 'bg-green-700 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              {label}
            </button>
          ))}
          <span className="ml-auto text-sm text-gray-400 self-center">{shops.length} shops found</span>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <Database size={18} className="text-blue-700 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800 leading-relaxed">
            Real shop discovery must source shop name, full address, coordinates, ratings, reviews, maps URL, and phone from Google Places, OpenStreetMap, or authorized FPS datasets. This page does not invent shops.
          </p>
        </div>

        {!serviceResult.ok && pincode.length === 6 && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-3 mb-6 text-sm text-red-700">
            Real shop data unavailable for this location.
          </div>
        )}

        {loading ? (
          <Loader text="Finding shops…" />
        ) : shops.length === 0 ? (
          <div className="text-center py-20">
            <Store size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Real shop data unavailable for this location.</p>
            <p className="text-gray-400 text-sm mt-1">Configure Google Places, OpenStreetMap, or an FPS dataset provider to display real shops.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {shops.map((shop, index) => (
              <ShopCard key={shop.id} shop={shop} recommended={index === 0 && !!pincode} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ShopCard({ shop, recommended }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all p-5 flex flex-col">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
          <Store size={18} className="text-green-700" />
        </div>
        <div className="flex flex-col items-end gap-1">
          {recommended && (
            <span className="rounded-full bg-blue-100 text-blue-700 px-2 py-0.5 text-xs font-semibold">Recommended</span>
          )}
          <Badge status={shop.stockStatus} />
        </div>
      </div>

      <h3 className="font-bold text-gray-900 mb-1">{shop.name}</h3>
      <p className="text-xs text-gray-400 font-medium mb-2">{shop.fpsId}</p>
      <p className="text-xs text-gray-500 flex items-start gap-1 mb-3">
        <MapPin size={12} className="shrink-0 mt-0.5" />
        {shop.address}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs mb-3">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-gray-400 flex items-center gap-1"><Navigation size={10} /> Distance</p>
          <p className="font-semibold text-gray-700 mt-0.5">{shop.distanceKm.toFixed(1)} km</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-gray-400 flex items-center gap-1"><Star size={10} /> Rating</p>
          <p className="font-semibold text-gray-700 mt-0.5">{shop.rating} ({shop.reviewCount} reviews)</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs mb-4">
        <div className="bg-gray-50 rounded-lg p-2">
          <p className="text-gray-400">Last Delivery</p>
          <p className="font-semibold text-gray-700 mt-0.5">{shop.lastDelivery}</p>
        </div>
        <div className={`rounded-lg p-2 ${shop.complaintCount > 5 ? 'bg-red-50' : 'bg-gray-50'}`}>
          <p className="text-gray-400 flex items-center gap-1">
            <AlertTriangle size={10} /> Complaints
          </p>
          <p className={`font-semibold mt-0.5 ${shop.complaintCount > 5 ? 'text-red-600' : 'text-gray-700'}`}>
            {shop.complaintCount}
          </p>
        </div>
      </div>

      <div className={`rounded-lg p-2 text-xs mb-4 ${shop.isOpen ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
        <p className="font-semibold flex items-center gap-1">
          <Clock size={11} /> {shop.isOpen ? 'Open now' : 'Closed now'}
        </p>
        <p className="mt-0.5">{shop.timings}</p>
      </div>

      <div className="mt-auto">
        <Link
          to={`/shops/${shop.id}`}
          state={{ shop }}
          className="w-full inline-flex items-center justify-center gap-1.5 bg-green-700 hover:bg-green-800 text-white text-sm font-medium py-2.5 rounded-xl transition-all"
        >
          View Details <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
