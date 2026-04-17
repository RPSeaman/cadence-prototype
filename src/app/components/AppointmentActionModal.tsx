import { useState } from 'react';
import { X, Calendar, AlertCircle, CheckCircle, Clock, Pill } from 'lucide-react';
import { Patient } from '../data/mockData';

interface AppointmentActionModalProps {
  patient: Patient;
  actionType: 'expedite' | 'skip';
  onClose: () => void;
  onConfirm: (data: AppointmentActionData) => void;
}

export interface AppointmentActionData {
  actionType: 'expedite' | 'skip';
  scheduledDate?: string;
  scheduledTime?: string;
  reason: string;
  notifyPatient: boolean;
  prescriptionRefill?: boolean;
  labOrders?: boolean;
  followUpInstructions?: string;
}

export default function AppointmentActionModal({ patient, actionType, onClose, onConfirm }: AppointmentActionModalProps) {
  const [formData, setFormData] = useState<AppointmentActionData>({
    actionType,
    scheduledDate: '',
    scheduledTime: '',
    reason: '',
    notifyPatient: true,
    prescriptionRefill: false,
    labOrders: false,
    followUpInstructions: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            {actionType === 'expedite' ? (
              <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            )}
            <div>
              <h2 className="text-gray-900">
                {actionType === 'expedite' ? 'Expedite Appointment' : 'Skip Scheduled Appointment'}
              </h2>
              <p className="text-gray-600 mt-1">{patient.name} • MRN {patient.mrn}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {actionType === 'expedite' ? (
            <>
              {/* Expedite Appointment */}
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-gray-900 mb-2">⚠️ Patient requires urgent attention</p>
                <p className="text-gray-700">
                  Schedule an earlier appointment to address concerning health trends or symptoms.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">Preferred Time</label>
                  <select
                    value={formData.scheduledTime}
                    onChange={(e) => setFormData({ ...formData, scheduledTime: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select time</option>
                    <option value="08:00">8:00 AM</option>
                    <option value="09:00">9:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="13:00">1:00 PM</option>
                    <option value="14:00">2:00 PM</option>
                    <option value="15:00">3:00 PM</option>
                    <option value="16:00">4:00 PM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Reason for Expediting</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="E.g., Blood pressure trending upward despite medication compliance, new symptoms reported"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-900">Pre-Appointment Actions</h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.labOrders}
                    onChange={(e) => setFormData({ ...formData, labOrders: e.target.checked })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-gray-900">Order Labs</p>
                    <p className="text-gray-600">Request labs before appointment for faster diagnosis</p>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.prescriptionRefill}
                    onChange={(e) => setFormData({ ...formData, prescriptionRefill: e.target.checked })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-gray-900">Refill Current Prescription</p>
                    <p className="text-gray-600">Ensure patient has medication until appointment</p>
                  </div>
                </label>
              </div>
            </>
          ) : (
            <>
              {/* Skip Appointment */}
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-900 mb-2">✓ Patient is stable</p>
                <p className="text-gray-700">
                  Skip the scheduled appointment and continue remote monitoring. You can still handle routine tasks.
                </p>
              </div>

              {patient.nextScheduled && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gray-600" />
                    <p className="text-gray-900">Current Scheduled Appointment</p>
                  </div>
                  <p className="text-gray-700">{new Date(patient.nextScheduled).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}

              <div>
                <label className="block text-gray-700 mb-2">Reason for Skipping</label>
                <textarea
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  placeholder="E.g., Vitals stable, medication effective, no new symptoms reported"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-gray-900">Actions to Complete Remotely</h3>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.prescriptionRefill}
                    onChange={(e) => setFormData({ ...formData, prescriptionRefill: e.target.checked })}
                    className="mt-1"
                  />
                  <div className="flex items-start gap-2">
                    <Pill className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-gray-900">Approve Prescription Refill</p>
                      <p className="text-gray-600">Send refill to patient's pharmacy</p>
                    </div>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.labOrders}
                    onChange={(e) => setFormData({ ...formData, labOrders: e.target.checked })}
                    className="mt-1"
                  />
                  <div>
                    <p className="text-gray-900">Order Routine Labs</p>
                    <p className="text-gray-600">Request labs for next quarterly review</p>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Instructions to Patient (Optional)</label>
                <textarea
                  value={formData.followUpInstructions}
                  onChange={(e) => setFormData({ ...formData, followUpInstructions: e.target.value })}
                  placeholder="E.g., Continue current medication, complete weekly check-ins, schedule next appointment in 3 months"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-24"
                />
              </div>
            </>
          )}

          {/* Notification */}
          <div className="border-t border-gray-200 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.notifyPatient}
                onChange={(e) => setFormData({ ...formData, notifyPatient: e.target.checked })}
                className="mt-1"
              />
              <div>
                <p className="text-gray-900">Notify Patient</p>
                <p className="text-gray-600">
                  Send automated notification to patient via SMS and email
                </p>
              </div>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-6 py-3 text-white rounded-lg transition-colors ${
                actionType === 'expedite'
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {actionType === 'expedite' ? 'Schedule Urgent Appointment' : 'Skip Appointment & Proceed'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
