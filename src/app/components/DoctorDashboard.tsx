import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Clock,
  Activity,
  CalendarClock,
  UserPlus,
  Eye,
  EyeOff,
  EyeIcon,
  BellOff,
  DollarSign
} from 'lucide-react';
import {
  mockPatients,
  mockFlags,
  mockCheckIns,
  mockPatientAssignments,
  mockVitals,
  mockClinicalNotes,
  ClinicalNote,
  DoctorFlag
} from '../data/mockData';
import { format, differenceInCalendarDays } from 'date-fns';
import ViewToggle from './ViewToggle';
import AppointmentActionModal, { AppointmentActionData } from './AppointmentActionModal';
import { toast } from 'sonner';
import CadenceLogo from './CadenceLogo';
import BPTrendChart from './BPTrendChart';
import QuickNotes from './QuickNotes';
import EMRFrame from './EMRFrame';

type FilterKey = 'flagged' | 'non-responsive' | 'all' | 'stable';

const TODAY = new Date('2026-04-09');

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>('flagged'); // Flagged-First default
  const [appointmentModal, setAppointmentModal] = useState<{
    show: boolean;
    patient: typeof mockPatients[0] | null;
    actionType: 'expedite' | 'skip';
  }>({ show: false, patient: null, actionType: 'expedite' });
  const [dismissedAssignments, setDismissedAssignments] = useState<string[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(mockClinicalNotes);
  const [reviewedPatients, setReviewedPatients] = useState<string[]>([]);
  const [expandedCharts, setExpandedCharts] = useState<string[]>([]);

  const currentPhysicianId = 'doc1';
  const newAssignments = mockPatientAssignments.filter(
    (a) => a.physicianId === currentPhysicianId && a.isNew && !dismissedAssignments.includes(a.id)
  );

  const dismissAssignment = (id: string) => setDismissedAssignments([...dismissedAssignments, id]);

  const todayCheckIns = mockCheckIns.filter(
    (c) => format(new Date(c.timestamp), 'yyyy-MM-dd') === '2026-04-09'
  );

  const urgentFlags = mockFlags.filter((f) => f.priority === 'urgent' || f.priority === 'review');
  const silentFlags = mockFlags.filter((f) => f.priority === 'non-responsive');
  const allFlags = [...urgentFlags, ...silentFlags];

  const flaggedPatientIds = new Set(allFlags.map((f) => f.patientId));
  const stablePatients = mockPatients.filter((p) => !flaggedPatientIds.has(p.id));

  const displayPatients =
    filter === 'flagged'
      ? mockPatients.filter((p) => flaggedPatientIds.has(p.id))
      : filter === 'non-responsive'
      ? mockPatients.filter((p) => silentFlags.some((f) => f.patientId === p.id))
      : filter === 'stable'
      ? stablePatients
      : mockPatients;

  const getFlagStyle = (flag?: DoctorFlag) => {
    if (!flag) return { bg: 'bg-gray-50 border-gray-200', icon: <CheckCircle className="w-5 h-5 text-green-600" /> };
    if (flag.priority === 'urgent')
      return { bg: 'bg-red-50 border-red-200', icon: <AlertCircle className="w-5 h-5 text-red-600" /> };
    if (flag.priority === 'non-responsive')
      return { bg: 'bg-slate-50 border-slate-300', icon: <BellOff className="w-5 h-5 text-slate-600" /> };
    return { bg: 'bg-amber-50 border-amber-200', icon: <TrendingUp className="w-5 h-5 text-amber-600" /> };
  };

  const flagLabel = (flag: DoctorFlag) => {
    if (flag.priority === 'urgent') return 'Urgent';
    if (flag.priority === 'non-responsive') return 'Non-Responsive';
    return 'Review';
  };

  const handleAppointmentAction = (data: AppointmentActionData) => {
    if (data.actionType === 'expedite') {
      toast.success('Urgent appointment scheduled', {
        description: `${appointmentModal.patient?.name} scheduled for ${data.scheduledDate} at ${data.scheduledTime}`
      });
    } else {
      toast.success('Appointment skipped', {
        description: `${appointmentModal.patient?.name}'s appointment cancelled. Patient will be notified.`
      });
    }
  };

  const handleAddNote = (patientId: string, text: string) => {
    setClinicalNotes([
      ...clinicalNotes,
      {
        id: `n${Date.now()}`,
        patientId,
        text,
        author: 'Dr. Sarah Mitchell',
        timestamp: new Date().toISOString()
      }
    ]);
    toast.success('Note added');
  };

  const toggleReviewed = (patientId: string) => {
    if (reviewedPatients.includes(patientId)) {
      setReviewedPatients(reviewedPatients.filter((id) => id !== patientId));
      toast.info('Marked as unreviewed');
    } else {
      setReviewedPatients([...reviewedPatients, patientId]);
      toast.success('Marked as reviewed');
    }
  };

  const toggleChartExpanded = (patientId: string) => {
    setExpandedCharts((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]
    );
  };

  const filterTabs: { key: FilterKey; label: string; count: number; tone: string }[] = [
    { key: 'flagged', label: 'Requires Action', count: allFlags.length, tone: 'bg-red-600 text-white' },
    { key: 'non-responsive', label: 'Non-Responsive', count: silentFlags.length, tone: 'bg-slate-700 text-white' },
    { key: 'stable', label: 'Stable', count: stablePatients.length, tone: 'bg-green-600 text-white' },
    { key: 'all', label: 'All Patients', count: mockPatients.length, tone: 'bg-blue-600 text-white' }
  ];

  return (
    <EMRFrame>
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <CadenceLogo size="md" />
            <div className="flex items-center gap-4">
              <ViewToggle />
              <div className="text-right">
                <p className="text-gray-600">Dr. Sarah Mitchell</p>
                <p className="text-gray-500 text-sm">Primary Care</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                <span className="text-white text-sm">SM</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-gray-900 text-2xl">Flagged Patients — Today</h1>
            <p className="text-gray-600 mt-1">Thursday, April 9, 2026 · Showing only patients that need your attention</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-gray-600">Requires Action</p>
                <p className="text-gray-900 mt-1">{allFlags.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <BellOff className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-gray-600">Non-Responsive</p>
                <p className="text-gray-900 mt-1">{silentFlags.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Check-ins Today</p>
                <p className="text-gray-900 mt-1">{todayCheckIns.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-gray-600">Time Saved</p>
                <p className="text-gray-900 mt-1">~4.5 hrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Requires Action — urgent & review */}
        {urgentFlags.length > 0 && (
          <div className="mb-10">
            <h2 className="text-gray-900 mb-4">Requires Action</h2>
            <div className="space-y-4">
              {urgentFlags.map((flag) => {
                const patient = mockPatients.find((p) => p.id === flag.patientId);
                const style = getFlagStyle(flag);
                return (
                  <div key={flag.patientId} className={`rounded-xl border p-6 ${style.bg}`}>
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">{style.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                          <h3
                            className="text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/patient/${flag.patientId}`)}
                          >
                            {patient?.name}
                          </h3>
                          <span className="text-gray-500 text-sm">MRN {patient?.mrn}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">{patient?.condition}</span>
                          {patient?.ccmRpmEligible && <CcmRpmPill />}
                        </div>
                        <p className="text-gray-700 mb-4">{flag.message}</p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkle />
                            <p className="text-gray-600 text-sm">AI-Generated Summary</p>
                          </div>
                          <p className="text-gray-900">{flag.recommendation}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              setAppointmentModal({
                                show: true,
                                patient: patient || null,
                                actionType: 'expedite'
                              })
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <CalendarClock className="w-4 h-4" />
                            Expedite Appointment
                          </button>
                          <button
                            onClick={() => navigate(`/patient/${flag.patientId}`)}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-gray-500 text-sm">{format(new Date(flag.timestamp), 'h:mm a')}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Non-Responsive — silent signal */}
        {silentFlags.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-gray-900">Non-Responsive</h2>
              <span className="text-gray-500 text-sm">Silence is a clinical signal</span>
            </div>
            <div className="space-y-4">
              {silentFlags.map((flag) => {
                const patient = mockPatients.find((p) => p.id === flag.patientId);
                const silentDays = patient?.lastCheckIn
                  ? differenceInCalendarDays(TODAY, new Date(patient.lastCheckIn))
                  : null;
                return (
                  <div key={flag.patientId} className="rounded-xl border border-slate-300 bg-slate-50 p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <BellOff className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                          <h3
                            className="text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/patient/${flag.patientId}`)}
                          >
                            {patient?.name}
                          </h3>
                          <span className="text-gray-500 text-sm">MRN {patient?.mrn}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">{patient?.condition}</span>
                          {silentDays !== null && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">
                              <Clock className="w-3 h-3" />
                              Silent {silentDays}d
                            </span>
                          )}
                          {patient?.ccmRpmEligible && <CcmRpmPill />}
                        </div>
                        <p className="text-gray-700 mb-4">{flag.message}</p>
                        <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <Sparkle />
                            <p className="text-gray-600 text-sm">AI-Generated Summary</p>
                          </div>
                          <p className="text-gray-900">{flag.recommendation}</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
                            onClick={() =>
                              toast.success('Outreach queued', {
                                description: `Automated text + nurse call queued for ${patient?.name}.`
                              })
                            }
                          >
                            <Activity className="w-4 h-4" />
                            Trigger Outreach
                          </button>
                          <button
                            onClick={() => navigate(`/patient/${flag.patientId}`)}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Full Details
                          </button>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-gray-500 text-sm">{format(new Date(flag.timestamp), 'h:mm a')}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* New Patient Assignments */}
        {newAssignments.length > 0 && (
          <div className="mb-10">
            <h2 className="text-gray-900 mb-4">New Patient Assignments</h2>
            <div className="space-y-3">
              {newAssignments.map((assignment) => {
                const patient = mockPatients.find((p) => p.id === assignment.patientId);
                return (
                  <div key={assignment.id} className="rounded-xl border border-gray-200 p-5 bg-white">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 mt-1">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-2">
                          <h3
                            className="text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/patient/${assignment.patientId}`)}
                          >
                            {patient?.name}
                          </h3>
                          <span className="text-gray-500 text-sm">MRN {patient?.mrn}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">{patient?.condition}</span>
                          {patient?.ccmRpmEligible && <CcmRpmPill />}
                        </div>
                        <p className="text-gray-700 mb-3">New patient assigned to you.</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => navigate(`/patient/${assignment.patientId}`)}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            View Full Details
                          </button>
                          <button
                            onClick={() => dismissAssignment(assignment.id)}
                            className="px-4 py-2 bg-gray-100 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
                          >
                            Dismiss
                          </button>
                        </div>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-gray-500 text-sm">
                          {format(new Date(assignment.assignedDate), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                filter === tab.key
                  ? tab.tone
                  : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              <span
                className={`inline-flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full text-xs ${
                  filter === tab.key ? 'bg-white/20' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Patient List */}
        <div className="space-y-3">
          {displayPatients.length === 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <p className="text-gray-900">Nothing in this view right now.</p>
              <p className="text-gray-500 text-sm mt-1">
                {filter === 'flagged'
                  ? 'No flagged patients — all clear.'
                  : filter === 'non-responsive'
                  ? 'Every patient has checked in recently.'
                  : 'Try a different filter.'}
              </p>
            </div>
          )}
          {displayPatients.map((patient) => {
            const flag = allFlags.find((f) => f.patientId === patient.id);
            const lastCheckIn = mockCheckIns
              .filter((c) => c.patientId === patient.id)
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
            const patientVitals = mockVitals[patient.id] || [];
            const isExpanded = expandedCharts.includes(patient.id);
            const isReviewed = reviewedPatients.includes(patient.id);
            const silentDays = patient.lastCheckIn
              ? differenceInCalendarDays(TODAY, new Date(patient.lastCheckIn))
              : null;

            return (
              <div
                key={patient.id}
                className={`bg-white rounded-xl border transition-all ${
                  isReviewed
                    ? 'border-gray-300 bg-gray-50/50'
                    : flag?.priority === 'urgent'
                    ? 'border-red-200'
                    : flag?.priority === 'non-responsive'
                    ? 'border-slate-300'
                    : flag
                    ? 'border-amber-200'
                    : 'border-gray-200'
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4 gap-4">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-700 text-sm">{patient.avatar}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mb-1">
                          <h3
                            className={`text-gray-900 hover:text-blue-600 cursor-pointer transition-colors ${
                              isReviewed ? 'line-through opacity-60' : ''
                            }`}
                            onClick={() => navigate(`/patient/${patient.id}`)}
                          >
                            {patient.name}
                          </h3>
                          <span className="text-gray-500 text-sm">MRN {patient.mrn}</span>
                          {flag && (
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                                flag.priority === 'urgent'
                                  ? 'bg-red-100 text-red-700'
                                  : flag.priority === 'non-responsive'
                                  ? 'bg-slate-200 text-slate-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {flag.priority === 'non-responsive' ? (
                                <BellOff className="w-3.5 h-3.5" />
                              ) : (
                                <AlertCircle className="w-3.5 h-3.5" />
                              )}
                              {flagLabel(flag)}
                            </span>
                          )}
                          {patient.ccmRpmEligible && <CcmRpmPill />}
                          {isReviewed && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                              <Eye className="w-3.5 h-3.5" />
                              Reviewed by Physician
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{patient.condition}</p>
                        <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                          <span>Last visit: {format(new Date(patient.lastVisit), 'MMM d, yyyy')}</span>
                          {patient.nextScheduled && (
                            <>
                              <span>•</span>
                              <span>Next: {format(new Date(patient.nextScheduled), 'MMM d, yyyy')}</span>
                            </>
                          )}
                          {patient.lastCheckIn && (
                            <>
                              <span>•</span>
                              <span>
                                Last check-in:{' '}
                                {silentDays === 0
                                  ? 'Today'
                                  : silentDays === 1
                                  ? 'Yesterday'
                                  : `${silentDays}d ago`}
                              </span>
                            </>
                          )}
                          {lastCheckIn && (
                            <>
                              <span>•</span>
                              <span>{format(new Date(lastCheckIn.timestamp), 'MMM d, h:mm a')}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {patientVitals.length > 0 && patientVitals[0].systolic && (
                        <button
                          onClick={() => toggleChartExpanded(patient.id)}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          {isExpanded ? 'Hide' : 'Show'} Trend
                        </button>
                      )}
                      <button
                        onClick={() => toggleReviewed(patient.id)}
                        className={`px-3 py-1.5 text-xs rounded transition-colors flex items-center gap-1.5 ${
                          isReviewed
                            ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            : 'bg-green-50 text-green-700 hover:bg-green-100'
                        }`}
                      >
                        {isReviewed ? <EyeOff className="w-3.5 h-3.5" /> : <EyeIcon className="w-3.5 h-3.5" />}
                        {isReviewed ? 'Unmark' : 'Mark Reviewed'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && patientVitals.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Blood Pressure Trend</h4>
                      <BPTrendChart vitals={patientVitals} compact />
                    </div>
                  )}

                  <QuickNotes patientId={patient.id} notes={clinicalNotes} onAddNote={handleAddNote} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {appointmentModal.show && appointmentModal.patient && (
        <AppointmentActionModal
          patient={appointmentModal.patient}
          actionType={appointmentModal.actionType}
          onClose={() => setAppointmentModal({ show: false, patient: null, actionType: 'expedite' })}
          onConfirm={handleAppointmentAction}
        />
      )}
    </EMRFrame>
  );
}

function CcmRpmPill() {
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs"
      title="Chronic Care Management / Remote Patient Monitoring — reimbursable"
    >
      <DollarSign className="w-3 h-3" />
      CCM/RPM Eligible
    </span>
  );
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-blue-600" fill="currentColor" aria-hidden>
      <path d="M12 2l1.8 5.4L19 9l-5.2 1.6L12 16l-1.8-5.4L5 9l5.2-1.6L12 2zM19 14l.9 2.6L22 17l-2.1.4L19 20l-.9-2.6L16 17l2.1-.4.9-2.6z" />
    </svg>
  );
}
