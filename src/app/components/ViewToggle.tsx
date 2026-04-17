import { useView } from '../context/ViewContext';
import { Stethoscope, User, Smartphone, Shield } from 'lucide-react';

export default function ViewToggle() {
  const { viewMode, setViewMode } = useView();

  const viewLabels = {
    physician: 'Physician Dashboard',
    patient: 'Patient Desktop',
    'patient-mobile': 'Patient Mobile',
    admin: 'Admin Dashboard'
  };

  return (
    <div className="inline-flex items-center gap-3">
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Switch View:</span>
        <span className="text-xs text-gray-500">Current: <span className="font-semibold text-[#0066CC]">{viewLabels[viewMode]}</span></span>
      </div>
      <div className="inline-flex items-center bg-gray-100 rounded-lg p-1 gap-0.5 border border-gray-300">
        <button
          onClick={() => setViewMode('physician')}
          className={`flex items-center justify-center p-2.5 rounded-md transition-all ${
            viewMode === 'physician'
              ? 'bg-[#0066CC] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title="Physician Dashboard"
        >
          <Stethoscope className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('patient')}
          className={`flex items-center justify-center p-2.5 rounded-md transition-all ${
            viewMode === 'patient'
              ? 'bg-[#0066CC] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title="Patient Desktop Dashboard"
        >
          <User className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('patient-mobile')}
          className={`flex items-center justify-center p-2.5 rounded-md transition-all ${
            viewMode === 'patient-mobile'
              ? 'bg-[#0066CC] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title="Patient Mobile App"
        >
          <Smartphone className="w-5 h-5" />
        </button>
        <button
          onClick={() => setViewMode('admin')}
          className={`flex items-center justify-center p-2.5 rounded-md transition-all ${
            viewMode === 'admin'
              ? 'bg-[#0066CC] text-white shadow-md'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          }`}
          title="Admin Dashboard"
        >
          <Shield className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}