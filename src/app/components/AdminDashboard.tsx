import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Clock, 
  TrendingUp, 
  Activity, 
  CheckCircle,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { 
  mockPhysicians, 
  mockWaitingPatients, 
  mockPatients,
  WaitingPatient,
  Physician 
} from '../data/mockData';
import { format } from 'date-fns';
import ViewToggle from './ViewToggle';
import CadenceLogo from './CadenceLogo';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [selectedWaitingPatient, setSelectedWaitingPatient] = useState<WaitingPatient | null>(null);
  const [selectedPhysician, setSelectedPhysician] = useState<Physician | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Calculate total system metrics
  const totalPatients = mockPhysicians.reduce((sum, doc) => sum + doc.totalPatients, 0);
  const totalAvailableSlots = mockPhysicians.reduce((sum, doc) => sum + doc.availableSlots, 0);
  const totalAppointmentsSaved = mockPhysicians.reduce((sum, doc) => sum + doc.appointmentsSaved, 0);
  const totalTimeSaved = mockPhysicians.reduce((sum, doc) => sum + doc.timeSavedHours, 0);
  const urgentWaiting = mockWaitingPatients.filter(p => p.priority === 'urgent').length;

  const handleAssignPatient = () => {
    if (selectedWaitingPatient && selectedPhysician) {
      toast.success('Patient assigned successfully', {
        description: `${selectedWaitingPatient.name} has been assigned to ${selectedPhysician.name}`
      });
      setShowAssignModal(false);
      setSelectedWaitingPatient(null);
      setSelectedPhysician(null);
    }
  };

  const openAssignModal = (patient: WaitingPatient) => {
    setSelectedWaitingPatient(patient);
    setShowAssignModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <CadenceLogo size="md" />
            <div className="flex items-center gap-4">
              <ViewToggle />
              <div className="text-right">
                <p className="text-gray-600">Jennifer Kim</p>
                <p className="text-gray-500 text-sm">System Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                <span className="text-white text-sm">JK</span>
              </div>
            </div>
          </div>
          <div>
            <h1 className="text-gray-900 text-2xl">System Overview</h1>
            <p className="text-gray-600 mt-1">Thursday, April 9, 2026</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* System-Wide Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-gray-600">Active Physicians</p>
                <p className="text-gray-900 mt-1">{mockPhysicians.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-gray-600">Total Patients</p>
                <p className="text-gray-900 mt-1">{totalPatients}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-gray-600">Available Slots</p>
                <p className="text-gray-900 mt-1">{totalAvailableSlots}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-gray-600">Appts Saved</p>
                <p className="text-gray-900 mt-1">{totalAppointmentsSaved}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center">
                <Clock className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-gray-600">Time Saved</p>
                <p className="text-gray-900 mt-1">{totalTimeSaved.toFixed(1)} hrs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Waiting Patients Alert */}
        {urgentWaiting > 0 && (
          <div className="mb-8 bg-red-50 border border-red-200 rounded-lg p-5">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-red-900">Urgent Assignments Needed</h3>
                <p className="text-red-700 mt-1">
                  {urgentWaiting} patient{urgentWaiting !== 1 ? 's' : ''} waiting with urgent priority
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8">
          {/* Physician Overview */}
          <div>
            <h2 className="text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Physician Availability
            </h2>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="text-gray-600">Physician</div>
                <div className="text-gray-600 text-center">Patients</div>
                <div className="text-gray-600 text-center">Available</div>
                <div className="text-gray-600 text-center">Saved</div>
              </div>
              {mockPhysicians.map((physician) => (
                <div
                  key={physician.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-700">{physician.avatar}</span>
                    </div>
                    <div>
                      <p className="text-gray-900">{physician.name}</p>
                      <p className="text-gray-500">{physician.specialty}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-gray-900">{physician.activePatients}</span>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full ${
                      physician.availableSlots > 7 
                        ? 'bg-green-100 text-green-700' 
                        : physician.availableSlots > 4
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {physician.availableSlots}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-gray-900">{physician.appointmentsSaved}</p>
                      <p className="text-gray-500 text-xs">{physician.timeSavedHours}h</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* System Efficiency Metrics */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <h3 className="text-gray-900">System Efficiency</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Capacity Utilization</p>
                  <p className="text-gray-900 mt-1 text-2xl">
                    {((totalPatients / (totalPatients + totalAvailableSlots)) * 100).toFixed(0)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Avg Time Saved/Doc</p>
                  <p className="text-gray-900 mt-1 text-2xl">
                    {(totalTimeSaved / mockPhysicians.length).toFixed(1)}h
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Waiting Patients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-gray-900 flex items-center gap-2">
                <UserPlus className="w-5 h-5" />
                Patients Waiting Assignment ({mockWaitingPatients.length})
              </h2>
            </div>
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="grid grid-cols-[2fr_1.5fr_1fr] gap-4 px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="text-gray-600">Patient</div>
                <div className="text-gray-600">Waiting Since</div>
                <div className="text-gray-600 text-center">Action</div>
              </div>
              {mockWaitingPatients.map((patient) => (
                <div
                  key={patient.id}
                  className="grid grid-cols-[2fr_1.5fr_1fr] gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900">{patient.name}</p>
                      {patient.priority === 'urgent' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs">
                          <AlertCircle className="w-3 h-3" />
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm">{patient.condition}</p>
                    <p className="text-gray-500 text-sm mt-1">Age {patient.age} • {patient.insurance}</p>
                    {patient.preferredPhysician && (
                      <p className="text-blue-600 text-sm mt-1">Prefers: {patient.preferredPhysician}</p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <div>
                      <p className="text-gray-700">{format(new Date(patient.waitingSince), 'MMM d, yyyy')}</p>
                      <p className="text-gray-500 text-sm">
                        {Math.floor((new Date('2026-04-09').getTime() - new Date(patient.waitingSince).getTime()) / (1000 * 60 * 60 * 24))} days
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <button
                      onClick={() => openAssignModal(patient)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Assign
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Modal */}
      {showAssignModal && selectedWaitingPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-gray-900 text-xl mb-4">
              Assign Patient: {selectedWaitingPatient.name}
            </h2>
            
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <p className="text-gray-600">Condition: <span className="text-gray-900">{selectedWaitingPatient.condition}</span></p>
              <p className="text-gray-600 mt-1">Age: <span className="text-gray-900">{selectedWaitingPatient.age}</span></p>
              <p className="text-gray-600 mt-1">Insurance: <span className="text-gray-900">{selectedWaitingPatient.insurance}</span></p>
              {selectedWaitingPatient.preferredPhysician && (
                <p className="text-blue-600 mt-2">Preferred: {selectedWaitingPatient.preferredPhysician}</p>
              )}
            </div>

            <h3 className="text-gray-900 mb-3">Select Physician:</h3>
            <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
              {mockPhysicians.map((physician) => (
                <button
                  key={physician.id}
                  onClick={() => setSelectedPhysician(physician)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedPhysician?.id === physician.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-700">{physician.avatar}</span>
                      </div>
                      <div>
                        <p className="text-gray-900">{physician.name}</p>
                        <p className="text-gray-500 text-sm">{physician.specialty}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">
                        {physician.activePatients} patients
                      </p>
                      <p className={`text-sm ${
                        physician.availableSlots > 7 
                          ? 'text-green-600' 
                          : physician.availableSlots > 4
                          ? 'text-amber-600'
                          : 'text-gray-600'
                      }`}>
                        {physician.availableSlots} slots available
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAssignModal(false);
                  setSelectedWaitingPatient(null);
                  setSelectedPhysician(null);
                }}
                className="flex-1 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAssignPatient}
                disabled={!selectedPhysician}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
