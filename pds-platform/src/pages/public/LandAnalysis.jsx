import { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle, ArrowRight, BarChart3, CheckCircle, Clock,
  Gauge, Landmark, Leaf, MapPin, Network,
  ShieldCheck, SunMedium, TrendingUp,
} from 'lucide-react';
import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer,
  Tooltip, XAxis, YAxis,
} from 'recharts';
import { getLandAnalysis } from '../../services/landAnalysisService';

const metricStyles = {
  suitability: {
    icon: SunMedium,
    label: 'Suitability Score',
    color: 'text-green-700',
    bg: 'bg-green-50',
  },
  environmentalRisk: {
    icon: Leaf,
    label: 'Environmental Risk',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
  },
  infrastructureAccess: {
    icon: Network,
    label: 'Infrastructure Access',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
  },
};

export default function LandAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    getLandAnalysis()
      .then(data => {
        if (!active) return;
        setAnalysis(data);
        setError('');
      })
      .catch(() => {
        if (!active) return;
        setError('Unable to load backend analysis. Showing the expected decision format requires a working analysis API.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const chartData = useMemo(() => {
    if (!analysis) return [];
    return [
      { name: 'Solar', value: analysis.scores.solar, color: '#16a34a' },
      { name: 'Wind', value: analysis.scores.wind, color: '#2563eb' },
      { name: 'Groundwater', value: analysis.scores.groundwater, color: '#0891b2' },
      { name: 'Infra', value: analysis.scores.infrastructureAccess, color: '#7c3aed' },
    ];
  }, [analysis]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white border border-gray-100 p-8 text-center shadow-sm">
          <Gauge size={36} className="mx-auto text-green-700 mb-3 animate-pulse" />
          <p className="font-semibold text-gray-800">Loading land decision...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="rounded-2xl bg-white border border-red-100 p-8 text-center shadow-sm max-w-md">
          <AlertTriangle size={36} className="mx-auto text-red-600 mb-3" />
          <p className="font-semibold text-gray-900">No land analysis available</p>
          <p className="text-sm text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <section className="bg-gray-950 text-white px-4 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 text-green-300 text-sm mb-3">
            <Landmark size={16} />
            GRIP Decision Engine
          </div>
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-end">
            <div>
              <p className="text-gray-400 text-sm mb-2">{analysis.parcelId} - {analysis.locationName}</p>
              <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">
                Best Use: {analysis.bestUse}
              </h1>
              <p className="text-gray-300 max-w-2xl mt-4">{analysis.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <HeroStat label="Confidence" value={`${analysis.confidence}%`} icon={ShieldCheck} />
              <HeroStat label="Estimated ROI" value={`${analysis.estimatedRoiYears} yrs`} icon={Clock} />
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 mt-8 space-y-6">
        {error && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 flex items-start gap-2">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            {error}
          </div>
        )}

        <section className="grid lg:grid-cols-[0.9fr_1.1fr] gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp size={19} className="text-green-700" />
              <h2 className="font-bold text-gray-900">Decision Summary</h2>
            </div>
            <div className="rounded-2xl bg-green-50 border border-green-100 p-5 mb-5">
              <p className="text-xs text-green-700 uppercase tracking-wide font-semibold">Recommended action</p>
              <p className="text-2xl font-extrabold text-green-950 mt-1">{analysis.recommendation}</p>
            </div>
            <div className="space-y-3">
              {analysis.reasons.map(reason => (
                <div key={reason} className="flex items-start gap-3 rounded-xl bg-gray-50 p-3">
                  <CheckCircle size={17} className="text-green-700 shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{reason}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <BarChart3 size={19} className="text-blue-700" />
              <h2 className="font-bold text-gray-900">Signal Strength</h2>
            </div>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {chartData.map(item => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid md:grid-cols-3 gap-4">
          {Object.entries(metricStyles).map(([key, style]) => (
            <MetricCard key={key} style={style} value={analysis.scores[key]} />
          ))}
        </section>

        <section className="grid lg:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <MapPin size={19} className="text-purple-700" />
              <h2 className="font-bold text-gray-900">Decision Indicators</h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {analysis.indicators.map(indicator => (
                <div key={indicator.label} className="rounded-xl bg-gray-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-gray-900 text-sm">{indicator.label}</p>
                    <span className="text-xs rounded-full bg-white border border-gray-200 px-2 py-0.5 text-gray-600">
                      {indicator.status}
                    </span>
                  </div>
                  <div className="mt-3 h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div className="h-full rounded-full bg-green-600" style={{ width: `${indicator.value}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{indicator.value}/100</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <AlertTriangle size={19} className="text-amber-700" />
              <h2 className="font-bold text-gray-900">Constraints Before Approval</h2>
            </div>
            <div className="space-y-3">
              {analysis.constraints.map(item => (
                <div key={item} className="rounded-xl border border-amber-100 bg-amber-50 p-3 text-sm text-amber-900">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-5">
            <div className="flex items-center gap-2">
              <ArrowRight size={19} className="text-green-700" />
              <h2 className="font-bold text-gray-900">Alternative Uses</h2>
            </div>
            <p className="text-xs text-gray-500">Decision-first view keeps raw data secondary.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-3">
            {analysis.alternatives.map(option => (
              <div key={option.use} className="rounded-xl bg-gray-50 p-4">
                <p className="font-bold text-gray-900">{option.use}</p>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <p className="font-extrabold text-gray-900">{option.confidence}%</p>
                  </div>
                  <div className="rounded-lg bg-white p-3">
                    <p className="text-xs text-gray-500">ROI</p>
                    <p className="font-extrabold text-gray-900">{option.roiYears} yrs</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function HeroStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white/10 border border-white/10 p-5">
      <Icon size={22} className="text-green-300 mb-3" />
      <p className="text-xs text-gray-300 uppercase tracking-wide">{label}</p>
      <p className="text-3xl font-extrabold mt-1">{value}</p>
    </div>
  );
}

function MetricCard({ style, value }) {
  const Icon = style.icon;
  return (
    <div className={`rounded-2xl border border-gray-100 p-5 shadow-sm ${style.bg}`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">{style.label}</p>
          <p className={`text-3xl font-extrabold mt-1 ${style.color}`}>{value}%</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center">
          <Icon size={22} className={style.color} />
        </div>
      </div>
    </div>
  );
}
