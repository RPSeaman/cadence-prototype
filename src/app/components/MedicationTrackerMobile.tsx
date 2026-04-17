import { useState } from 'react';
import { Pill, Check, X, CheckCircle } from 'lucide-react';
import { Medication, mockMedications } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

export default function MedicationTrackerMobile() {
  const [medications, setMedications] = useState<Medication[]>(mockMedications.current || []);

  const getTodayAdherence = () => {
    const today = '2026-04-14';
    let taken = 0;
    let total = 0;

    medications.forEach(med => {
      const todayLog = med.logs.find(log => log.date === today);
      total++;
      if (todayLog?.taken) taken++;
    });

    return { taken, total, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  };

  const todayAdherence = getTodayAdherence();

  const handleMarkAsTaken = (medId: string) => {
    const today = '2026-04-14';
    const now = new Date();
    const time = format(now, 'HH:mm');

    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const existingLogIndex = med.logs.findIndex(log => log.date === today);
        
        if (existingLogIndex >= 0) {
          const updatedLogs = [...med.logs];
          updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], taken: true, time };
          toast.success(`${med.name} marked as taken!`);
          return { ...med, logs: updatedLogs };
        } else {
          toast.success(`${med.name} marked as taken!`);
          return {
            ...med,
            logs: [{ date: today, time, taken: true }, ...med.logs]
          };
        }
      }
      return med;
    }));
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <Pill className="w-4 h-4 text-purple-600" />
          </div>
          <div>
            <h3 className="text-gray-900 font-medium">Today's Medications</h3>
            <p className="text-xs text-gray-600">{todayAdherence.taken}/{todayAdherence.total} taken</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{todayAdherence.percentage}%</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${todayAdherence.percentage}%` }}
          />
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-3">
        {medications.map((med) => {
          const todayLog = med.logs.find(log => log.date === '2026-04-14');
          const recentLogs = med.logs.slice(0, 7);
          
          return (
            <div key={med.id} className="border border-gray-200 rounded-lg p-3">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm">{med.name}</h4>
                  <p className="text-xs text-gray-600">{med.dosage}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{med.frequency}</p>
                </div>
                {todayLog?.taken ? (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs flex-shrink-0">
                    <Check className="w-3 h-3" />
                    Taken
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs flex-shrink-0">
                    Pending
                  </div>
                )}
              </div>

              {/* 7-day mini visualization */}
              <div className="flex items-center gap-0.5 mb-3">
                {recentLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-6 rounded flex items-center justify-center ${
                      log.taken 
                        ? 'bg-green-100' 
                        : 'bg-red-100'
                    }`}
                  >
                    {log.taken ? (
                      <Check className="w-2.5 h-2.5 text-green-700" />
                    ) : (
                      <X className="w-2.5 h-2.5 text-red-700" />
                    )}
                  </div>
                ))}
              </div>

              {/* Mark as Taken Button */}
              {!todayLog?.taken && (
                <button
                  onClick={() => handleMarkAsTaken(med.id)}
                  className="w-full px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Taken
                </button>
              )}

              {todayLog?.taken && todayLog?.time && (
                <p className="text-xs text-gray-500 text-center">Taken at {todayLog.time}</p>
              )}
            </div>
          );
        })}
      </div>

      {todayAdherence.percentage === 100 && (
        <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 text-center">
          🎉 All medications taken today!
        </div>
      )}
    </div>
  );
}
