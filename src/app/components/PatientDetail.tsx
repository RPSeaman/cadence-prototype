import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Calendar, Activity, AlertCircle, MessageSquare, TrendingUp, CalendarClock, CheckCircle, ShieldCheck, DollarSign } from 'lucide-react';
import { mockPatients, mockCheckIns, mockVitals, mockFlags, mockClinicalNotes, ClinicalNote } from '../data/mockData';
import QuickNotes from './QuickNotes';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import AppointmentActionModal, { AppointmentActionData } from './AppointmentActionModal';
import { toast } from 'sonner';
import EMRFrame from './EMRFrame';

export default function PatientDetail() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [appointmentModal, setAppointmentModal] = useState<{
    show: boolean;
    actionType: 'expedite' | 'skip';
  }>({ show: false, actionType: 'expedite' });

  const patient = mockPatients.find(p => p.id === patientId);
  const checkIns = mockCheckIns
    .filter(c => c.patientId === patientId)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const vitals = mockVitals[patientId || ''] || [];
  const flag = mockFlags.find(f => f.patientId === patientId);
  const [reviewed, setReviewed] = useState(false);
  const reviewedAt = reviewed ? new Date() : null;
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(mockClinicalNotes);

  const handleAddNote = (pid: string, text: string) => {
    setClinicalNotes([
      ...clinicalNotes,
      {
        id: `n${Date.now()}`,
        patientId: pid,
        text,
        author: 'Dr. Sarah Mitchell',
        timestamp: new Date().toISOString()
      }
    ]);
    toast.success('Note added');
  };

  const handleAppointmentAction = (data: AppointmentActionData) => {
    if (data.actionType === 'expedite') {
      toast.success('Urgent appointment scheduled', {
        description: `${patient?.name} scheduled for ${data.scheduledDate} at ${data.scheduledTime}`
      });
    } else {
      toast.success('Appointment skipped', {
        description: `${patient?.name}'s appointment cancelled. Patient will be notified.`
      });
    }
  };

  if (!patient) {
    return (
      <EMRFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Patient not found</p>
        </div>
      </EMRFrame>
    );
  }

  const prepareVitalsChartData = () => {
    return vitals.map(v => ({
      date: format(new Date(v.timestamp), 'MMM d'),
      ...v
    }));
  };

  const chartData = prepareVitalsChartData();

  return (
    <EMRFrame>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </button>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-700 text-xl">{patient.avatar}</span>
              </div>
              <div>
                <div className="flex items-center flex-wrap gap-3">
                  <h1 className="text-gray-900">{patient.name}</h1>
                  {/* Review Status Badge — for liability clarity */}
                  <button
                    onClick={() => {
                      setReviewed(!reviewed);
                      toast.success(!reviewed ? 'Marked as reviewed' : 'Review removed');
                    }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border transition-colors ${
                      reviewed
                        ? 'bg-green-50 border-green-300 text-green-800 hover:bg-green-100'
                        : 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-sm">
                      {reviewed ? 'Reviewed by Physician' : 'Awaiting Physician Review'}
                    </span>
                  </button>
                  {patient.ccmRpmEligible && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                      <DollarSign className="w-3.5 h-3.5" />
                      CCM/RPM Eligible
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-2 text-gray-600">
                  <span>MRN {patient.mrn}</span>
                  <span>•</span>
                  <span>Age {patient.age}</span>
                  <span>•</span>
                  <span>{patient.condition}</span>
                </div>
                <div className="flex items-center flex-wrap gap-x-4 gap-y-1 mt-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">
                      Last visit:{' '}
                      {patient.lastVisit
                        ? format(new Date(patient.lastVisit), 'MMMM d, yyyy')
                        : 'No visits yet'}
                    </span>
                  </div>
                  {reviewed && reviewedAt && (
                    <span className="text-gray-500">
                      · Reviewed {format(reviewedAt, 'MMM d, h:mm a')} by Dr. Sarah Mitchell
                    </span>
                  )}
                </div>
              </div>
            </div>
            {flag && (
              <div className={`rounded-lg border p-4 ${flag.priority === 'urgent' ? 'bg-red-50 border-red-200' : flag.priority === 'non-responsive' ? 'bg-slate-50 border-slate-300' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className={`w-5 h-5 mt-0.5 ${flag.priority === 'urgent' ? 'text-red-600' : flag.priority === 'non-responsive' ? 'text-slate-600' : 'text-amber-600'}`} />
                  <div>
                    <p className="text-gray-900 mb-1">
                      {flag.priority === 'non-responsive' ? 'Non-Responsive' : 'Flagged for Review'}
                    </p>
                    <p className="text-gray-700">{flag.message}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="col-span-2 space-y-6">
            {/* AI-Generated Summary */}
            {flag && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-gray-900 mb-4">AI-Generated Summary</h2>
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-gray-900">{flag.recommendation}</p>
                </div>
                <p className="text-gray-500 text-xs mt-3">
                  Generated from the most recent check-in data. Final clinical decisions remain with the reviewing physician.
                </p>
              </div>
            )}

            {/* Vitals Chart */}
            {vitals.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Activity className="w-5 h-5 text-gray-600" />
                  <h2 className="text-gray-900">Vitals Trend</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis key="xaxis" dataKey="date" stroke="#6b7280" />
                    <YAxis key="yaxis" stroke="#6b7280" />
                    <Tooltip
                      key="tooltip"
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #e5e7eb',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend key="legend" />
                    {vitals[0]?.systolic && (
                      <>
                        <Line key="systolic" type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic BP" strokeWidth={2} />
                        <Line key="diastolic" type="monotone" dataKey="diastolic" stroke="#f97316" name="Diastolic BP" strokeWidth={2} />
                      </>
                    )}
                    {vitals[0]?.bloodSugar && (
                      <Line key="bloodSugar" type="monotone" dataKey="bloodSugar" stroke="#8b5cf6" name="Blood Sugar (mg/dL)" strokeWidth={2} />
                    )}
                    {vitals[0]?.weight && (
                      <Line key="weight" type="monotone" dataKey="weight" stroke="#06b6d4" name="Weight (lbs)" strokeWidth={2} />
                    )}
                    {vitals[0]?.heartRate && !vitals[0]?.systolic && (
                      <Line key="heartRate" type="monotone" dataKey="heartRate" stroke="#10b981" name="Heart Rate" strokeWidth={2} />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Check-in Timeline */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="w-5 h-5 text-gray-600" />
                <h2 className="text-gray-900">Check-in History</h2>
              </div>
              <div className="space-y-4">
                {checkIns.map((checkIn) => (
                  <div
                    key={checkIn.id}
                    className={`rounded-lg border p-5 ${
                      checkIn.flagged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-900">{format(new Date(checkIn.timestamp), 'MMMM d, yyyy')}</p>
                        <p className="text-gray-500">{format(new Date(checkIn.timestamp), 'h:mm a')}</p>
                      </div>
                      {checkIn.flagged && (
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700">
                          <AlertCircle className="w-4 h-4" />
                          Flagged
                        </span>
                      )}
                    </div>

                    {/* Vitals */}
                    {checkIn.vitals && (
                      <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-white rounded-lg border border-gray-200">
                        {checkIn.vitals.systolic && (
                          <div>
                            <p className="text-gray-500">Blood Pressure</p>
                            <p className="text-gray-900 mt-1">{checkIn.vitals.systolic}/{checkIn.vitals.diastolic}</p>
                          </div>
                        )}
                        {checkIn.vitals.bloodSugar && (
                          <div>
                            <p className="text-gray-500">Blood Sugar</p>
                            <p className="text-gray-900 mt-1">{checkIn.vitals.bloodSugar} mg/dL</p>
                          </div>
                        )}
                        {checkIn.vitals.heartRate && (
                          <div>
                            <p className="text-gray-500">Heart Rate</p>
                            <p className="text-gray-900 mt-1">{checkIn.vitals.heartRate} bpm</p>
                          </div>
                        )}
                        {checkIn.vitals.weight && (
                          <div>
                            <p className="text-gray-500">Weight</p>
                            <p className="text-gray-900 mt-1">{checkIn.vitals.weight} lbs</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Q&A */}
                    <div className="space-y-3 mb-4">
                      {checkIn.responses.map((response, idx) => (
                        <div key={idx}>
                          <p className="text-gray-600">{response.question}</p>
                          <p className="text-gray-900 mt-1">{response.answer}</p>
                        </div>
                      ))}
                    </div>

                    {/* AI Summary */}
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-start gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-gray-600 mb-1">AI Summary</p>
                          <p className="text-gray-900">{checkIn.aiSummary}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Scheduled Appointment */}
            {patient.nextScheduled && (
              <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h3 className="text-gray-900">Scheduled Appointment</h3>
                </div>
                <p className="text-gray-900 mb-1">{format(new Date(patient.nextScheduled), 'MMMM d, yyyy')}</p>
                <p className="text-gray-600">Follow-up visit</p>
                {!flag && (
                  <button
                    onClick={() => setAppointmentModal({ show: true, actionType: 'skip' })}
                    className="mt-4 w-full px-4 py-2 bg-white text-green-700 border border-green-300 rounded-lg hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Patient is stable - Skip this appointment
                  </button>
                )}
              </div>
            )}

            {/* Clinical Notes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <QuickNotes
                patientId={patient.id}
                notes={clinicalNotes}
                onAddNote={handleAddNote}
              />
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600">Total Check-ins</p>
                  <p className="text-gray-900 mt-1">{checkIns.length}</p>
                </div>
                <div>
                  <p className="text-gray-600">Compliance Rate</p>
                  <p className="text-gray-900 mt-1">
                    {checkIns.filter(c => c.responses.some(r => r.question.includes('medication') && r.answer.toLowerCase().includes('yes'))).length > 0 ? '100%' : 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Last Vitals</p>
                  {vitals.length > 0 && vitals[vitals.length - 1].systolic && (
                    <p className="text-gray-900 mt-1">
                      {vitals[vitals.length - 1].systolic}/{vitals[vitals.length - 1].diastolic} mmHg
                    </p>
                  )}
                  {vitals.length > 0 && vitals[vitals.length - 1].bloodSugar && (
                    <p className="text-gray-900 mt-1">{vitals[vitals.length - 1].bloodSugar} mg/dL</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Actions</h3>
              <div className="space-y-2">
                {flag ? (
                  <button
                    onClick={() => setAppointmentModal({ show: true, actionType: 'expedite' })}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CalendarClock className="w-4 h-4" />
                    Expedite Appointment
                  </button>
                ) : patient?.nextScheduled && (
                  <button
                    onClick={() => setAppointmentModal({ show: true, actionType: 'skip' })}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Skip Scheduled Appointment
                  </button>
                )}
                <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Send Message
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Schedule Visit
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Order Labs
                </button>
                <button className="w-full px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  Update Treatment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Action Modal */}
      {appointmentModal.show && patient && (
        <AppointmentActionModal
          patient={patient}
          actionType={appointmentModal.actionType}
          onClose={() => setAppointmentModal({ show: false, actionType: 'expedite' })}
          onConfirm={handleAppointmentAction}
        />
      )}
    </EMRFrame>
  );
}
