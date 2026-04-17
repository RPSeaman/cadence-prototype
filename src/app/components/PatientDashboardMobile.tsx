import { useState } from 'react';
import { Calendar, Activity, MessageSquare, Heart, Menu, X, Pill, User, Home, FileText, Sparkles, ShieldCheck, AlertTriangle, Phone, Check } from 'lucide-react';
import { format } from 'date-fns';
import AIChatAssistant from './AIChatAssistant';
import { mockCheckIns, mockVitals } from '../data/mockData';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router';
import ViewToggle from './ViewToggle';
import CadenceLogo from './CadenceLogo';
import MedicationTrackerMobile from './MedicationTrackerMobile';

export default function PatientDashboardMobile() {
  const [showChat, setShowChat] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'records' | 'checkin'>('home');
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
    date: format(new Date(v.timestamp), 'M/d'),
    systolic: v.systolic,
    diastolic: v.diastolic
  }));

  const latestVitals = myVitals[myVitals.length - 1];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
      {/* iPhone Frame */}
      <div className="relative">
        {/* Phone bezel */}
        <div className="w-[390px] h-[844px] bg-black rounded-[60px] shadow-2xl p-3 relative">
          {/* Screen */}
          <div className="w-full h-full bg-gray-50 rounded-[48px] overflow-hidden relative">
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50"></div>

            {/* Actual app content */}
            <div className="w-full h-full overflow-y-auto">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40 pt-8">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <CadenceLogo size="sm" />
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              {showMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
              <span className="text-blue-700 text-sm">MC</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900">Hi, Margaret</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-green-600" />
                <p className="text-green-700 text-xs">Care verified by Dr. Mitchell</p>
              </div>
            </div>
          </div>
          {/* View Toggle - Always Visible */}
          <div className="pb-2">
            <ViewToggle />
          </div>
        </div>

        {/* Expandable Menu */}
        {showMenu && (
          <div className="border-t border-gray-200 px-4 py-3 bg-gray-50">
            <div className="space-y-2">
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white rounded-lg transition-colors">
                My Profile
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white rounded-lg transition-colors">
                Medical Records
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white rounded-lg transition-colors">
                Messages
              </button>
              <button className="w-full px-4 py-2 text-left text-gray-700 hover:bg-white rounded-lg transition-colors">
                Settings
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                <Heart className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-gray-600">BP</p>
            </div>
            <p className="text-gray-900 mb-1">{latestVitals?.systolic}/{latestVitals?.diastolic}</p>
            <p className="text-gray-500">mmHg</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-gray-600">Heart Rate</p>
            </div>
            <p className="text-gray-900 mb-1">{latestVitals?.heartRate}</p>
            <p className="text-gray-500">bpm</p>
          </div>
        </div>

        {/* Next Check-in */}
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 className="text-gray-900">Next Check-in</h3>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Due Soon</span>
          </div>
          <p className="text-gray-700 mb-3">{format(new Date(nextCheckIn), 'EEEE, MMMM d')}</p>
          <button
            onClick={() => navigate('/check-in')}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Complete Now
          </button>
        </div>

        {/* Blood Pressure Trend */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Blood Pressure Trend</h3>
            <button className="text-blue-600 text-sm">7 Days</button>
          </div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={chartData}>
              <XAxis
                key="xaxis-mobile"
                dataKey="date"
                stroke="#9ca3af"
                style={{ fontSize: '12px' }}
                tickLine={false}
              />
              <YAxis
                key="yaxis-mobile"
                stroke="#9ca3af"
                domain={[60, 160]}
                style={{ fontSize: '12px' }}
                tickLine={false}
              />
              <Line
                key="systolic-mobile"
                type="monotone"
                dataKey="systolic"
                stroke="#ef4444"
                strokeWidth={2.5}
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line
                key="diastolic-mobile"
                type="monotone"
                dataKey="diastolic"
                stroke="#f97316"
                strokeWidth={2.5}
                dot={{ fill: '#f97316', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-gray-600 text-sm">Systolic</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span className="text-gray-600 text-sm">Diastolic</span>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <p className="text-gray-700 text-xs">AI-Generated Summary</p>
            </div>
            <p className="text-gray-900 text-sm leading-relaxed">
              Your trends are stable this week — no changes needed. Keep taking your medication as usual.
            </p>
            <div className="mt-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-green-600" />
              <span className="text-green-700 text-xs">Verified by your Doctor</span>
            </div>
          </div>
        </div>

        {/* Current Medication */}
        <MedicationTrackerMobile />

        {/* My Doctor */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">My Doctor</h3>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="text-white">SM</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-900">{doctorName}</p>
              <p className="text-gray-500 text-sm">Primary Care Physician</p>
            </div>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors">
              Message
            </button>
          </div>
          {nextAppointment && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Next visit: {format(new Date(nextAppointment), 'MMM d, yyyy')}</span>
              </div>
            </div>
          )}
        </div>

        {/* Recent Check-ins */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-gray-900 mb-3">Recent Check-ins</h3>
          <div className="space-y-3">
            {myCheckIns.slice(0, 3).map((checkIn) => (
              <div
                key={checkIn.id}
                className={`p-3 rounded-lg border ${
                  checkIn.flagged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-900 text-sm">{format(new Date(checkIn.timestamp), 'MMM d')}</p>
                  {checkIn.flagged && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs">
                      Reviewed
                    </span>
                  )}
                </div>
                {checkIn.vitals && (
                  <div className="flex gap-3 mb-2 text-sm">
                    <span className="text-gray-700">BP: {checkIn.vitals.systolic}/{checkIn.vitals.diastolic}</span>
                    <span className="text-gray-700">HR: {checkIn.vitals.heartRate}</span>
                  </div>
                )}
                <p className="text-gray-600 text-sm">{checkIn.aiSummary}</p>
                <div className="mt-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-3 h-3 text-green-600" />
                  <span className="text-green-700 text-xs">Verified by your Doctor</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Refill Rx
          </button>
          <button className="px-4 py-3 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm">
            Lab Results
          </button>
        </div>

        {/* Persistent escalation */}
        <button
          onClick={() => setEscalation('menu')}
          className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-red-50 text-red-700 border-2 border-red-200 rounded-2xl hover:bg-red-100 transition-colors mb-24"
        >
          <AlertTriangle className="w-5 h-5" />
          <span>Something feels off</span>
        </button>
      </div>

      {/* Bottom Navigation Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-6 pt-2 px-4">
        <div className="flex items-end justify-around relative">
          {/* Home */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'home' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>

          {/* Records */}
          <button
            onClick={() => setActiveTab('records')}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'records' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <FileText className="w-6 h-6" />
            <span className="text-xs">Records</span>
          </button>

          {/* AI Assistant - Centerpiece */}
          <button
            onClick={() => setShowChat(true)}
            className="relative -top-6"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 shadow-lg flex items-center justify-center border-4 border-white relative">
              {/* Cadence Logo Bars */}
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8">
                <rect x="4" y="10" width="2" height="4" fill="white" rx="1" />
                <rect x="8" y="7" width="2" height="10" fill="white" rx="1" />
                <rect x="12" y="5" width="2" height="14" fill="white" rx="1" />
                <rect x="16" y="8" width="2" height="8" fill="white" rx="1" />
              </svg>
              {/* Single sparkle badge */}
              <div className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center shadow-md">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs text-gray-600 whitespace-nowrap">AI Assistant</span>
          </button>

          {/* Check-in */}
          <button
            onClick={() => {
              setActiveTab('checkin');
              navigate('/check-in');
            }}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              activeTab === 'checkin' ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            <Activity className="w-6 h-6" />
            <span className="text-xs">Check-in</span>
          </button>

          {/* Profile */}
          <button
            className="flex flex-col items-center gap-1 p-2 text-gray-600 transition-colors"
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>

      {/* Escalation Modal */}
      {escalation && (
        <div className="absolute inset-0 bg-black/50 z-50 flex items-end rounded-[48px] overflow-hidden">
          <div className="w-full bg-white rounded-t-3xl p-5 pb-8">
            {escalation === 'menu' ? (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-gray-900">Something feels off?</h3>
                    <p className="text-gray-500 text-sm">We'll route this to Dr. Mitchell.</p>
                  </div>
                </div>
                <div className="space-y-2 mb-3">
                  <button
                    onClick={() => setEscalation('sent')}
                    className="w-full text-left px-4 py-4 border-2 border-red-200 rounded-2xl hover:bg-red-50 transition-colors"
                  >
                    <p className="text-gray-900">Message my care team</p>
                    <p className="text-gray-500 text-xs mt-0.5">Response within a few hours</p>
                  </button>
                  <a
                    href="tel:5551234567"
                    className="flex items-center gap-3 px-4 py-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-gray-900">Call the office</p>
                      <p className="text-gray-500 text-xs">(555) 123-4567</p>
                    </div>
                  </a>
                  <a
                    href="tel:911"
                    className="flex items-center gap-3 px-4 py-4 border-2 border-red-300 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
                  >
                    <Phone className="w-5 h-5 text-red-700" />
                    <div>
                      <p className="text-red-800">Emergency — 911</p>
                      <p className="text-red-700 text-xs">Chest pain, trouble breathing</p>
                    </div>
                  </a>
                </div>
                <button
                  onClick={() => setEscalation(null)}
                  className="w-full py-3 text-gray-500"
                >
                  Cancel
                </button>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="text-gray-900 mb-1">Message sent</h3>
                <p className="text-gray-600 text-sm mb-5">
                  Dr. Mitchell's team got it. Expect a response within a few hours.
                </p>
                <button
                  onClick={() => setEscalation(null)}
                  className="w-full py-3 bg-blue-600 text-white rounded-2xl"
                >
                  OK
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Chat Modal - Full Screen on Mobile */}
      {showChat && (
        <div className="absolute inset-0 bg-white z-50 flex flex-col rounded-[48px] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 mt-8 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-gray-900 text-base font-semibold">Cadence AI Assistant</h2>
                <p className="text-gray-600 text-xs mt-0.5">Blood Pressure Support</p>
              </div>
            </div>
            <button
              onClick={() => setShowChat(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors p-2 -mr-2"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <AIChatAssistant patientName={patientName} condition={patientCondition} />
          </div>
        </div>
      )}
            </div>
          </div>
        </div>

        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
      </div>
    </div>
  );
}