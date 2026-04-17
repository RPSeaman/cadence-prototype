import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DoctorDashboard from './components/DoctorDashboard';
import PatientDashboard from './components/PatientDashboard';
import PatientDashboardMobile from './components/PatientDashboardMobile';
import AdminDashboard from './components/AdminDashboard';
import PatientDetail from './components/PatientDetail';
import PatientCheckIn from './components/PatientCheckIn';
import { ViewProvider, useView } from './context/ViewContext';
import { Toaster } from 'sonner';

function MainView() {
  const { viewMode } = useView();

  if (viewMode === 'physician') return <DoctorDashboard />;
  if (viewMode === 'patient-mobile') return <PatientDashboardMobile />;
  if (viewMode === 'admin') return <AdminDashboard />;
  return <PatientDashboard />;
}

function CheckInView() {
  const { viewMode } = useView();
  const isMobile = viewMode === 'patient-mobile';

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-8">
        <div className="relative">
          <div className="w-[390px] h-[844px] bg-black rounded-[60px] shadow-2xl p-3 relative">
            <div className="w-full h-full bg-gray-50 rounded-[48px] overflow-hidden relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[30px] bg-black rounded-b-3xl z-50"></div>
              <div className="w-full h-full">
                <PatientCheckIn />
              </div>
            </div>
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/30 rounded-full"></div>
        </div>
      </div>
    );
  }

  return <PatientCheckIn />;
}

export default function App() {
  return (
    <ViewProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/patient/:patientId" element={<PatientDetail />} />
          <Route path="/check-in" element={<CheckInView />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
    </ViewProvider>
  );
}