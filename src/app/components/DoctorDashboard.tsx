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
  BellOff,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Users
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

type FilterKey = 'flagged' | 'non-responsive' | 'stable' | 'all';

const TODAY = new Date('2026-04-09');

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>('flagged');
  const [appointmentModal, setAppointmentModal] = useState<{
    show: boolean;
    patient: typeof mockPatients[0] | null;
    actionType: 'expedite' | 'skip';
  }>({ show: false, patient: null, actionType: 'expedite' });
  const [dismissedAssignments, setDismissedAssignments] = useState<string[]>([]);
  const [clinicalNotes, setClinicalNotes] = useState<ClinicalNote[]>(mockClinicalNotes);
  const [reviewedPatients, setReviewedPatients] = useState<string[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [showTrendFor, setShowTrendFor] = useState<string[]>([]);

  const currentPhysicianId = 'doc1';
  const newAssignments = mockPatientAssignments.filter(
    (a) => a.physicianId === currentPhysicianId && a.isNew && !dismissedAssignments.includes(a.id)
  );

  const dismissAssignment = (id: string) => setDismissedAssignments([...dismissedAssignments, id]);

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

  const toggleRowExpanded = (patientId: string) => {
    setExpandedRows((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]
    );
  };

  const toggleTrend = (patientId: string) => {
    setShowTrendFor((prev) =>
      prev.includes(patientId) ? prev.filter((id) => id !== patientId) : [...prev, patientId]
    );
  };

  const tiles: {
    key: FilterKey;
    label: string;
    count: number;
    icon: JSX.Element;
    activeClasses: string;
    iconBg: string;
  }[] = [
    {
      key: 'flagged',
      label: 'Requires Action',
      count: allFlags.length,
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      activeClasses: 'border-red-500 ring-2 ring-red-100',
      iconBg: 'bg-red-100'
    },
    {
      key: 'non-responsive',
      label: 'Non-Responsive',
      count: silentFlags.length,
      icon: <BellOff className="w-5 h-5 text-slate-600" />,
      activeClasses: 'border-slate-500 ring-2 ring-slate-100',
      iconBg: 'bg-slate-100'
    },
    {
      key: 'stable',
      label: 'Stable',
      count: stablePatients.length,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      activeClasses: 'border-green-500 ring-2 ring-green-100',
      iconBg: 'bg-green-100'
    },
    {
      key: 'all',
      label: 'All Patients',
      count: mockPatients.length,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      activeClasses: 'border-blue-500 ring-2 ring-blue-100',
      iconBg: 'bg-blue-100'
    }
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
            <h1 className="text-gray-900 text-2xl">Patient Dashboard</h1>
            <p className="text-gray-600 mt-1">Thursday, April 9, 2026 · Last sync 8:42 AM</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stat tiles — clickable filter shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {tiles.map((tile) => {
            const active = filter === tile.key;
            return (
              <button
                key={tile.key}
                onClick={() => setFilter(tile.key)}
                aria-pressed={active}
                className={`text-left bg-white rounded-xl border p-5 transition-all hover:shadow-sm ${
                  active ? tile.activeClasses : 'border-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${tile.iconBg}`}
                  >
                    {tile.icon}
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">{tile.label}</p>
                    <p className="text-gray-900 text-2xl mt-0.5">{tile.count}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* New Patient Assignments — slim banner */}
        {newAssignments.length > 0 && (
          <div className="mb-6 space-y-2">
            {newAssignments.map((assignment) => {
              const patient = mockPatients.find((p) => p.id === assignment.patientId);
              return (
                <div
                  key={assignment.id}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-50 border border-blue-100 text-sm"
                >
                  <UserPlus className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700 flex-1 min-w-0 truncate">
                    <span className="text-blue-700">New assignment:</span>{' '}
                    <span className="text-gray-900">{patient?.name}</span>
                    <span className="text-gray-500"> · {patient?.condition}</span>
                  </span>
                  <button
                    onClick={() => navigate(`/patient/${assignment.patientId}`)}
                    className="text-blue-700 hover:text-blue-800 hover:underline flex-shrink-0"
                  >
                    View
                  </button>
                  <button
                    onClick={() => dismissAssignment(assignment.id)}
                    className="text-gray-500 hover:text-gray-700 flex-shrink-0"
                    aria-label="Dismiss"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Section label reflects active filter */}
        <div className="flex items-baseline justify-between mb-3">
          <h2 className="text-gray-900">
            {filter === 'flagged' && 'Requires Action'}
            {filter === 'non-responsive' && 'Non-Responsive'}
            {filter === 'stable' && 'Stable Patients'}
            {filter === 'all' && 'All Patients'}
          </h2>
          {filter === 'non-responsive' && (
            <span className="text-gray-500 text-sm">Silence is a clinical signal</span>
          )}
        </div>

        {/* Patient list — primary surface */}
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
            const isExpanded = expandedRows.includes(patient.id);
            const isTrendShown = showTrendFor.includes(patient.id);
            const isReviewed = reviewedPatients.includes(patient.id);
            const silentDays = patient.lastCheckIn
              ? differenceInCalendarDays(TODAY, new Date(patient.lastCheckIn))
              : null;
            const hasSummary = flag && flag.bullets.length > 0;

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
                          {flag?.priority === 'non-responsive' && silentDays !== null && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs">
                              <Clock className="w-3 h-3" />
                              Silent {silentDays}d
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
                          <span>
                            Last visit:{' '}
                            {patient.lastVisit
                              ? format(new Date(patient.lastVisit), 'MMM d, yyyy')
                              : '—'}
                          </span>
                          {patient.nextScheduled && (
                            <>
                              <span>•</span>
                              <span>
                                Next appt: {format(new Date(patient.nextScheduled), 'MMM d, yyyy')}
                              </span>
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
                                {lastCheckIn && silentDays !== null && silentDays <= 1
                                  ? ` at ${format(new Date(lastCheckIn.timestamp), 'h:mm a')}`
                                  : ''}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {hasSummary && (
                        <button
                          onClick={() => toggleRowExpanded(patient.id)}
                          className="px-3 py-1.5 text-xs bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors flex items-center gap-1.5"
                          aria-expanded={isExpanded}
                        >
                          <Sparkle />
                          {isExpanded ? 'Hide' : 'AI Summary'}
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5" />
                          )}
                        </button>
                      )}
                      {patientVitals.length > 0 && patientVitals[0].systolic && (
                        <button
                          onClick={() => toggleTrend(patient.id)}
                          className="px-3 py-1.5 text-xs bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          {isTrendShown ? 'Hide Trend' : 'Trend'}
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
                        {isReviewed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        {isReviewed ? 'Unmark' : 'Mark Reviewed'}
                      </button>
                    </div>
                  </div>

                  {isExpanded && flag && (
                    <div className="mb-4 p-4 bg-blue-50/40 rounded-lg border border-blue-100">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkle />
                        <p className="text-gray-700 text-sm">AI-Generated Summary</p>
                      </div>
                      <ul className="space-y-1.5 mb-3">
                        {flag.bullets.map((b, i) => (
                          <li key={i} className="flex items-start gap-2 text-gray-900 text-sm">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-2">
                        {flag.priority === 'non-responsive' ? (
                          <button
                            onClick={() =>
                              toast.success('Outreach queued', {
                                description: `Automated text + nurse call queued for ${patient.name}.`
                              })
                            }
                            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-slate-700 text-white rounded hover:bg-slate-800 transition-colors"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            Trigger Outreach
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setAppointmentModal({
                                show: true,
                                patient,
                                actionType: 'expedite'
                              })
                            }
                            className="flex items-center gap-2 px-3 py-1.5 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                          >
                            <CalendarClock className="w-3.5 h-3.5" />
                            Expedite Appointment
                          </button>
                        )}
                        <button
                          onClick={() => navigate(`/patient/${patient.id}`)}
                          className="px-3 py-1.5 text-xs bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          Open Chart
                        </button>
                      </div>
                    </div>
                  )}

                  {isTrendShown && patientVitals.length > 0 && (
                    <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Blood Pressure Trend</h4>
                      <BPTrendChart vitals={patientVitals} compact />
                    </div>
                  )}

                  <QuickNotes patientId={patient.id} notes={clinicalNotes} onAddNote={handleAddNote} hideList />
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
