import {
  Database, Truck, Users, AlertTriangle, ShieldCheck,
  Clock, CheckCircle, XCircle, Info, ExternalLink,
} from 'lucide-react';
import Card from '../../components/common/Card';

const LAST_UPDATED = '30 May 2025, 10:45 AM IST';

const DATA_SOURCES = [
  {
    id: 'stock',
    icon: Truck,
    color: 'blue',
    title: 'Stock & Delivery Data',
    source: 'Dealer Self-Reporting via ePOS Terminal',
    govRef: 'Integrated Management of PDS (IM-PDS) Portal',
    updateFreq: 'Updated when dealer confirms delivery receipt',
    isLive: false,
    fields: ['Stock status (Available / Low / Out)', 'Last delivery date', 'Quantities received per commodity'],
    verification: 'Cross-verified against FCI dispatch records and supply chain challan numbers.',
    disclaimer: 'Stock quantities are dealer-reported. Exact figures are not shown publicly to prevent gaming. Status indicators (Available/Low/Out) are derived from reported quantities.',
  },
  {
    id: 'allocation',
    icon: Database,
    color: 'green',
    title: 'Beneficiary Allocation Data',
    source: 'State Food & Civil Supplies Department',
    govRef: 'National Food Security Act (NFSA) 2013 Beneficiary Database',
    updateFreq: 'Updated monthly before distribution cycle begins',
    isLive: false,
    fields: ['Monthly entitlement per commodity', 'Family size', 'Ration card category (PHH / AAY / NPHH)', 'Assigned shop'],
    verification: 'Allocations are computed based on family size and NFSA category. PHH: 5kg/person/month. AAY: 35kg/household/month.',
    disclaimer: 'Allocation data shown is based on registered beneficiary records. Any discrepancy should be reported to the district food office.',
  },
  {
    id: 'complaints',
    icon: AlertTriangle,
    color: 'red',
    title: 'Complaint Data',
    source: 'Citizen Self-Reporting via PDS Platform',
    govRef: 'District Grievance Redressal System',
    updateFreq: 'Real-time on submission',
    isLive: false,
    fields: ['Complaint category', 'Shop involved', 'Submission timestamp', 'Resolution status', 'Assigned officer'],
    verification: 'Complaints are reviewed by district field officers. Anonymous complaints are accepted but given lower priority than verified submissions.',
    disclaimer: 'Complaint counts shown publicly are aggregated. Individual complaint details are only visible to the complainant and assigned officers.',
  },
  {
    id: 'receipts',
    icon: ShieldCheck,
    color: 'green',
    title: 'Digital Receipt Data',
    source: 'Dealer ePOS Terminal + Beneficiary OTP Confirmation',
    govRef: 'Aadhaar-based Biometric Authentication System (ABBA)',
    updateFreq: 'Generated at point of distribution',
    isLive: false,
    fields: ['Items distributed', 'Quantities', 'Timestamp', 'Dealer ID', 'Beneficiary ration card', 'QR verification token'],
    verification: 'Receipts are generated only after successful beneficiary verification (OTP or biometric). Each receipt has a unique QR token stored in the audit log.',
    disclaimer: 'In this demo, receipts are pre-generated mock data. In production, receipts are generated live at the ePOS terminal after biometric/OTP confirmation.',
  },
  {
    id: 'beneficiaries',
    icon: Users,
    color: 'purple',
    title: 'Beneficiary Registry',
    source: 'State Ration Card Management System (RCMS)',
    govRef: 'One Nation One Ration Card (ONORC) Database',
    updateFreq: 'Updated on new registration, deletion, or modification',
    isLive: false,
    fields: ['Name', 'Ration card number', 'Aadhaar linkage status', 'Bank linkage status', 'Assigned FPS', 'Category'],
    verification: 'Beneficiary records are seeded from the state RCMS. Aadhaar linkage is verified via UIDAI API. Bank linkage is verified via NPCI mapper.',
    disclaimer: 'Personal beneficiary data (name, phone, Aadhaar) is never shown publicly. Only masked identifiers are displayed.',
  },
];

const colorMap = {
  blue:   { bg: 'bg-blue-50',   border: 'border-blue-100',   icon: 'bg-blue-100 text-blue-700',   badge: 'bg-blue-100 text-blue-700'   },
  green:  { bg: 'bg-green-50',  border: 'border-green-100',  icon: 'bg-green-100 text-green-700', badge: 'bg-green-100 text-green-700' },
  red:    { bg: 'bg-red-50',    border: 'border-red-100',    icon: 'bg-red-100 text-red-700',     badge: 'bg-red-100 text-red-700'     },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100', icon: 'bg-purple-100 text-purple-700', badge: 'bg-purple-100 text-purple-700' },
  amber:  { bg: 'bg-amber-50',  border: 'border-amber-100',  icon: 'bg-amber-100 text-amber-700', badge: 'bg-amber-100 text-amber-700' },
};

function SourceCard({ source }) {
  const c = colorMap[source.color];
  const Icon = source.icon;

  return (
    <Card className="space-y-4">
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${c.icon}`}>
          <Icon size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900">{source.title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex items-center gap-1 ${
              source.isLive
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {source.isLive
                ? <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live</>
                : <><span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Demo Data</>
              }
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5">{source.source}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <ExternalLink size={11} /> {source.govRef}
          </p>
        </div>
      </div>

      {/* Update Frequency */}
      <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
        <Clock size={13} className="text-gray-400 shrink-0" />
        <span><strong>Update frequency:</strong> {source.updateFreq}</span>
      </div>

      {/* Fields */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Data Fields</p>
        <div className="flex flex-wrap gap-1.5">
          {source.fields.map(f => (
            <span key={f} className={`text-xs px-2 py-0.5 rounded-full ${c.badge}`}>{f}</span>
          ))}
        </div>
      </div>

      {/* Verification */}
      <div className="bg-gray-50 rounded-lg p-3">
        <p className="text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
          <CheckCircle size={12} className="text-green-600" /> How It's Verified
        </p>
        <p className="text-xs text-gray-600 leading-relaxed">{source.verification}</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2">
        <Info size={13} className="text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800 leading-relaxed">{source.disclaimer}</p>
      </div>
    </Card>
  );
}

export default function DataSources() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">

      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Database size={15} />
            Transparency · Data Sources
          </div>
          <h1 className="text-3xl font-bold mb-3">Where Does Our Data Come From?</h1>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            Every piece of information on this platform has a source. We believe in full transparency
            about what data is live, what is demo, and how each data point is verified.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
            <Clock size={13} />
            Page last updated: {LAST_UPDATED}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-6">

        {/* Demo Banner */}
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
            <AlertTriangle size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="font-bold text-amber-900 text-lg">Demo Platform Notice</p>
            <p className="text-amber-800 text-sm mt-1 leading-relaxed">
              This is a <strong>hackathon demonstration</strong> of the PDS Transparency Platform.
              All data shown — including beneficiary records, stock levels, complaints, and receipts —
              is <strong>simulated mock data</strong> and does not represent any real government database,
              real beneficiary, or real ration shop. No real personal data is collected or stored.
            </p>
            <div className="flex gap-3 mt-3">
              <span className="inline-flex items-center gap-1 text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full font-medium">
                <XCircle size={11} /> Not connected to government APIs
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-amber-200 text-amber-900 px-2 py-1 rounded-full font-medium">
                <XCircle size={11} /> No real beneficiary data
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
                <CheckCircle size={11} /> Architecture is production-ready
              </span>
            </div>
          </div>
        </div>

        {/* Data Source Cards */}
        {DATA_SOURCES.map(source => (
          <SourceCard key={source.id} source={source} />
        ))}

        {/* Production Architecture Note */}
        <Card>
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldCheck size={18} className="text-green-600" />
            In Production — How Data Would Flow
          </h3>
          <div className="space-y-3">
            {[
              { step: '01', title: 'FCI Warehouse Dispatch', desc: 'Grain dispatch records from Food Corporation of India warehouses are pushed to the state portal via API.' },
              { step: '02', title: 'State Portal → District', desc: 'District allocation orders are generated based on NFSA entitlements and pushed to each FPS.' },
              { step: '03', title: 'Dealer ePOS Confirmation', desc: 'Dealer confirms delivery receipt on ePOS terminal. Stock levels update automatically.' },
              { step: '04', title: 'Beneficiary Biometric / OTP', desc: 'Beneficiary authenticates at ePOS via Aadhaar biometric or OTP. Receipt is generated instantly.' },
              { step: '05', title: 'Citizen Verification', desc: 'Citizen confirms receipt on platform. Mismatch between dealer records and citizen confirmations triggers an alert.' },
              { step: '06', title: 'District Audit', desc: 'All transactions are logged immutably. District officers review anomalies in real time.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-green-700 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-gray-800 text-sm">{title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Footer note */}
        <div className="text-center text-xs text-gray-400 pb-4">
          For questions about data sources, contact the District Food & Civil Supplies Office ·
          RTI requests: <span className="text-gray-600 font-medium">rti@maharashtra.gov.in</span>
        </div>
      </div>
    </div>
  );
}
