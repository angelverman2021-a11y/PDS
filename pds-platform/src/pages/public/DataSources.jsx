import { Database, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import Card from '../../components/common/Card';
import { getDataSourceDisclosure } from '../../services/dataSourceService';
import { DEMO_MODE } from '../../config/platformConfig';

const disclosure = getDataSourceDisclosure();

export default function DataSources() {
  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <div className="bg-gray-900 text-white px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
            <Database size={15} />
            Transparency · Data Sources
          </div>
          <h1 className="text-3xl font-bold mb-3">Data Sources</h1>
          <p className="text-gray-300 max-w-2xl leading-relaxed">
            Every dataset is labeled by source, type, last update, and verification status. No data is described as government-issued unless it actually comes from an authorized source.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 mt-8 space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-amber-900">
              {DEMO_MODE ? 'Demo Mode Enabled' : 'Production Mode'}
            </p>
            <p className="text-sm text-amber-800 mt-1">{disclosure.affiliation}</p>
            <p className="text-sm text-amber-800 mt-1">{disclosure.currentMode}</p>
          </div>
        </div>

        {disclosure.sources.map(source => (
          <Card key={source.key}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{source.name}</h2>
                <p className="text-sm text-gray-500 mt-1">{source.description}</p>
              </div>
              <span className="rounded-full bg-gray-100 text-gray-700 px-3 py-1 text-xs font-semibold">
                {source.type}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-3 mt-5">
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400">Source Name</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{source.sourceName}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400 flex items-center gap-1"><Clock size={12} /> Last Updated</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{source.lastUpdated}</p>
              </div>
              <div className="rounded-xl bg-gray-50 p-3">
                <p className="text-xs text-gray-400 flex items-center gap-1"><CheckCircle size={12} /> Verification Status</p>
                <p className="text-sm font-semibold text-gray-800 mt-1">{source.verificationStatus}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-3">
              <p className="text-xs font-semibold text-blue-700">Production Plan</p>
              <p className="text-sm text-blue-800 mt-1">{source.productionPlan}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
