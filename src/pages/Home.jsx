import { Link } from 'react-router-dom';
import {
  ShieldCheck, QrCode, AlertTriangle, ArrowRight,
  LogIn, Store, CheckCircle, Users, TrendingUp, FileText,
  Truck,
} from 'lucide-react';

const stats = [
  { label: 'Ration Shops',         value: '1,45,000+', icon: Store,       color: 'green' },
  { label: 'Citizens Served',      value: '80 Crore+', icon: Users,       color: 'blue' },
  { label: 'Complaints Resolved',  value: '98,400+',   icon: CheckCircle, color: 'purple' },
  { label: 'Verifications Done',   value: '2.1 Crore', icon: QrCode,      color: 'amber' },
];

const features = [
  {
    icon: QrCode,
    title: 'Verify Stock',
    desc: 'Scan any receipt QR code to instantly verify if your ration was genuinely distributed.',
    to: '/verify',
    color: 'green',
  },
  {
    icon: FileText,
    title: 'Check Allocation',
    desc: 'View your monthly entitlement, collection status, and digital receipts anytime.',
    to: '/dashboard',
    color: 'blue',
  },
  {
    icon: AlertTriangle,
    title: 'Report Corruption',
    desc: 'File complaints against overcharging, stock diversion, or denial of service.',
    to: '/complaints/new',
    color: 'red',
  },
];

const steps = [
  { step: '01', title: 'Login Securely', desc: 'Use your Ration Card number and OTP to access your account.' },
  { step: '02', title: 'View Allocation', desc: 'Check your monthly entitlement and what has been collected.' },
  { step: '03', title: 'Report Issues', desc: 'Submit complaints with evidence. Track resolution in real time.' },
];

export default function Home() {
  return (
    <div className="bg-white">

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-green-800 via-green-700 to-emerald-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '60px 60px' }}
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28 text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5 text-sm mb-6">
            <ShieldCheck size={14} />
            Government of India · Public Distribution System
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-5">
            Transparent Rations.<br />
            <span className="text-emerald-300">Empowered Citizens.</span>
          </h1>
          <p className="text-lg md:text-xl text-green-100 max-w-2xl mx-auto mb-10">
            Track your food entitlements, verify receipts, and report corruption — all in one platform built for accountability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-all shadow-lg text-base"
            >
              <LogIn size={18} /> Get Started
            </Link>
            <Link
              to="/shops"
              className="inline-flex items-center justify-center gap-2 bg-white/15 border border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/25 transition-all text-base"
            >
              <Store size={18} /> Find Your Shop
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="space-y-2">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-${color}-500/20 mx-auto`}>
                <Icon size={22} className={`text-${color}-400`} />
              </div>
              <p className="text-3xl font-extrabold text-white">{value}</p>
              <p className="text-sm text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">What You Can Do</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Everything you need to ensure your ration rights are protected.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, to, color }) => (
              <Link
                key={title}
                to={to}
                className="group bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-${color}-100 mb-5`}>
                  <Icon size={26} className={`text-${color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
                <span className={`inline-flex items-center gap-1 text-${color}-600 text-sm font-semibold group-hover:gap-2 transition-all`}>
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">How It Works</h2>
            <p className="text-gray-500">Three simple steps to take control of your ration rights.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-green-200 to-green-400" />
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-700 text-white text-xl font-extrabold mb-5 shadow-lg">
                  {step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-green-700 to-emerald-600 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Truck size={40} className="mx-auto mb-4 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Your Ration. Your Right.</h2>
          <p className="text-green-100 mb-8 text-lg">
            Join millions of citizens using PDS Platform to ensure fair and transparent food distribution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-800 font-bold px-8 py-4 rounded-xl hover:bg-green-50 transition-all shadow-lg"
            >
              <LogIn size={18} /> Login Now
            </Link>
            <Link
              to="/verify"
              className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-all"
            >
              <QrCode size={18} /> Verify a Receipt
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
