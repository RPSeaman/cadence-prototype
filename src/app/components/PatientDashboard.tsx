import { useState } from 'react';
import { Calendar, Activity, MessageSquare, FileText, Clock, TrendingUp, Heart, AlertTriangle, Phone, Check, X } from 'lucide-react';
import { format } from 'date-fns';
import AIChatAssistant from './AIChatAssistant';
import { mockCheckIns, mockVitals } from '../data/mockData';
import ViewToggle from './ViewToggle';
import { useNavigate } from 'react-router';
import CadenceLogo from './CadenceLogo';
import BPTrendChart from './BPTrendChart';
import MedicationTracker from './MedicationTracker';
import CheckInHistory from './CheckInHistory';

export default function PatientDashboard() {
  const [showChat, setShowChat] = useState(false);
  const [initialQuestion, setInitialQuestion] = useState('');
  const [escalation, setEscalation] = useState<null | 'menu' | 'sent'>(null);
  const navigate = useNavigate();

  // Mock patient data (Margaret Chen)
  const patientName = 'Margaret Chen';
  const patientCondition = 'Hypertension - New Medication';
  const doctorName = 'Dr. Sarah Mitchell';
  const nextCheckIn = '2026-04-16';
  const nextAppointment = '2026-05-10';

  const myCheckIns = mockCheckIns.filter(c => c.patientId === 'p1');
  const myVitals = mockVitals['p1'] || [];

  const chartData = myVitals.map(v => ({
    date: format(new Date(v.timestamp), 'MMM d'),
    systolic: v.systolic,
    diastolic: v.diastolic
  }));

  const latestVitals = myVitals[myVitals.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <CadenceLogo size="md" />
            <div className="flex items-center gap-4">
              <ViewToggle />
              <button
                onClick={() => setShowChat(!showChat)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {showChat ? 'Close AI Assistant' : 'Ask AI Assistant'}
              </button>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 text-sm">MC</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-gray-900 text-2xl">My Health Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {patientName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Blood Pressure</p>
                    <p className="text-gray-900 mt-1">{latestVitals?.systolic}/{latestVitals?.diastolic}</p>
                  </div>
                </div>
                <p className="text-gray-500">Last reading: {format(new Date(myVitals[myVitals.length - 1]?.timestamp || new Date()), 'MMM d')}</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Heart Rate</p>
                    <p className="text-gray-900 mt-1">{latestVitals?.heartRate} bpm</p>
                  </div>
                </div>
                <p className="text-gray-500">Normal range</p>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-600">Check-ins</p>
                    <p className="text-gray-900 mt-1">{myCheckIns.length} completed</p>
                  </div>
                </div>
                <p className="text-gray-500">This month</p>
              </div>
            </div>

            {/* Upcoming */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-gray-900 mb-4">Upcoming</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">Weekly Check-in</p>
                    <p className="text-gray-600 mt-1">Answer a few quick questions about your health</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">{format(new Date(nextCheckIn), 'MMM d, yyyy')}</p>
                    <button
                      onClick={() => navigate('/check-in')}
                      className="text-blue-600 hover:text-blue-700 mt-1"
                    >
                      Complete Now
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 rounded-lg bg-gray-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">Office Visit - {doctorName}</p>
                    <p className="text-gray-600 mt-1">Follow-up appointment for medication review</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-500">{format(new Date(nextAppointment), 'MMM d, yyyy')}</p>
                    <p className="text-gray-500">10:00 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blood Pressure Trend */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <h2 className="text-gray-900">Blood Pressure Trend</h2>
              </div>
              <BPTrendChart vitals={myVitals} />
              <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                <p className="text-gray-900 mb-2">📊 Your doctor is monitoring your blood pressure</p>
                <p className="text-gray-700">
                  Your readings have been slightly elevated. Continue taking your medication as prescribed and complete your weekly check-ins.
                  {doctorName} will review your progress and may adjust your treatment plan.
                </p>
              </div>
            </div>

            {/* Medication Tracker */}
            <MedicationTracker onAskAI={(question) => {
              setInitialQuestion(question);
              setShowChat(true);
            }} />

            {/* Check-in History */}
            <CheckInHistory />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Care Team */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">My Care Team</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white">SM</span>
                  </div>
                  <div>
                    <p className="text-gray-900">{doctorName}</p>
                    <p className="text-gray-500">Primary Care Physician</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
              <h3 className="text-gray-900 mb-3">💡 Health Tip</h3>
              <p className="text-gray-700 mb-3">
                Managing blood pressure through lifestyle changes can enhance medication effectiveness.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li>• Reduce sodium intake to less than 2,300mg/day</li>
                <li>• Aim for 30 minutes of moderate exercise daily</li>
                <li>• Maintain a healthy weight</li>
                <li>• Limit alcohol consumption</li>
              </ul>
              <button className="mt-4 text-blue-600 hover:text-blue-700">
                Ask AI Assistant for more tips →
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => navigate('/check-in')}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Complete Check-in
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Message Doctor
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Request Prescription Refill
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  View Medical Records
                </button>
                <button
                  onClick={() => setEscalation('menu')}
                  className="w-full px-4 py-3 mt-2 flex items-center justify-center gap-2 bg-red-50 text-red-700 border-2 border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <AlertTriangle className="w-4 h-4" />
                  Something feels off
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Escalation Modal */}
      {escalation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {escalation === 'menu' ? (
              <>
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h2 className="text-gray-900 text-lg">Something feels off?</h2>
                      <p className="text-gray-500 text-sm mt-0.5">We'll route this to Dr. Mitchell.</p>
                    </div>
                  </div>
                  <button onClick={() => setEscalation(null)} className="text-gray-400 hover:text-gray-600 p-1">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-2 mb-4">
                  <button
                    onClick={() => setEscalation('sent')}
                    className="w-full text-left px-4 py-4 border-2 border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    <p className="text-gray-900">Message my care team</p>
                    <p className="text-gray-500 text-xs mt-0.5">Response within a few hours</p>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left"
                  >
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-gray-900">Call the office</p>
                      <p className="text-gray-500 text-xs">(555) 123-4567</p>
                    </div>
                  </button>
                  <button
                    className="w-full flex items-center gap-3 px-4 py-4 border-2 border-red-300 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left"
                  >
                    <Phone className="w-5 h-5 text-red-700" />
                    <div>
                      <p className="text-red-800">Emergency — 911</p>
                      <p className="text-red-700 text-xs">Chest pain, trouble breathing</p>
                    </div>
                  </button>
                </div>
                <button onClick={() => setEscalation(null)} className="w-full py-2 text-gray-500 text-sm hover:text-gray-700">
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h2 className="text-gray-900 text-lg mb-1">Message sent</h2>
                <p className="text-gray-600 text-sm mb-6">
                  Dr. Mitchell's team got it. Expect a response within a few hours.
                </p>
                <button
                  onClick={() => setEscalation(null)}
                  className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-gray-900 text-xl font-semibold">Cadence AI Assistant</h2>
                  <p className="text-gray-600 mt-0.5">Personalized health support and guidance</p>
                </div>
              </div>
              <button
                onClick={() => setShowChat(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AIChatAssistant patientName={patientName} condition={patientCondition} initialQuestion={initialQuestion} />
          </div>
        </div>
      )}
    </div>
  );
}