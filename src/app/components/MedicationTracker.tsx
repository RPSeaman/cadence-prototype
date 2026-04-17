import { useState } from 'react';
import { Pill, Check, X, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { Medication, mockMedications } from '../data/mockData';
import { format, parseISO } from 'date-fns';
import { toast } from 'sonner';

interface MedicationTrackerProps {
  onAskAI?: (question: string) => void;
  compact?: boolean;
}

export default function MedicationTracker({ onAskAI, compact = false }: MedicationTrackerProps) {
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

  const getWeekAdherence = () => {
    const logs: { taken: boolean }[] = [];
    medications.forEach(med => {
      med.logs.forEach(log => logs.push(log));
    });
    
    const taken = logs.filter(l => l.taken).length;
    const total = logs.length;
    
    return { taken, total, percentage: total > 0 ? Math.round((taken / total) * 100) : 0 };
  };

  const todayAdherence = getTodayAdherence();
  const weekAdherence = getWeekAdherence();

  const handleAskAboutMed = (medName: string) => {
    if (onAskAI) {
      onAskAI(`Can you tell me more about ${medName} and what I should watch for?`);
    }
  };

  const handleMarkAsTaken = (medId: string) => {
    const today = '2026-04-14';
    const now = new Date();
    const time = format(now, 'HH:mm');

    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const existingLogIndex = med.logs.findIndex(log => log.date === today);
        
        if (existingLogIndex >= 0) {
          // Update existing log
          const updatedLogs = [...med.logs];
          updatedLogs[existingLogIndex] = { ...updatedLogs[existingLogIndex], taken: true, time };
          toast.success(`Marked ${med.name} as taken!`);
          return { ...med, logs: updatedLogs };
        } else {
          // Add new log
          toast.success(`Marked ${med.name} as taken!`);
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
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
            <Pill className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-gray-900 font-medium">Medications</h2>
            <p className="text-sm text-gray-600">{todayAdherence.taken}/{todayAdherence.total} taken today</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">This Week</p>
          <p className="text-lg font-medium text-gray-900">{weekAdherence.percentage}%</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all duration-300"
            style={{ width: `${weekAdherence.percentage}%` }}
          />
        </div>
      </div>

      {/* Medication List */}
      <div className="space-y-4">
        {medications.map((med) => {
          const todayLog = med.logs.find(log => log.date === '2026-04-14');
          const recentLogs = med.logs.slice(0, 7);
          
          return (
            <div key={med.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{med.name}</h3>
                  <p className="text-sm text-gray-600">{med.dosage} · {med.frequency}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAskAboutMed(med.name)}
                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Ask AI about this medication"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                  {todayLog?.taken ? (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                      <Check className="w-3.5 h-3.5" />
                      Taken
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                      <Clock className="w-3.5 h-3.5" />
                      Pending
                    </div>
                  )}
                </div>
              </div>

              {/* 7-day adherence visualization */}
              <div className="flex items-center gap-1 mb-3">
                {recentLogs.map((log, idx) => (
                  <div
                    key={idx}
                    className={`flex-1 h-8 rounded flex flex-col items-center justify-center text-xs ${
                      log.taken 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}
                    title={`${format(parseISO(log.date), 'MMM d')}: ${log.taken ? 'Taken' : 'Missed'}${log.notes ? ` - ${log.notes}` : ''}`}
                  >
                    {log.taken ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <X className="w-3.5 h-3.5" />
                    )}
                    <span className="text-[10px] mt-0.5">{format(parseISO(log.date), 'EEE')}</span>
                  </div>
                ))}
              </div>

              {/* Mark as Taken Button */}
              {!todayLog?.taken && (
                <button
                  onClick={() => handleMarkAsTaken(med.id)}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Mark as Taken
                </button>
              )}

              {todayLog?.notes && (
                <p className="text-xs text-gray-600 mt-2 italic">Note: {todayLog.notes}</p>
              )}
            </div>
          );
        })}
      </div>

      {weekAdherence.percentage === 100 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          🎉 Perfect adherence this week! Keep up the great work!
        </div>
      )}
    </div>
  );
}