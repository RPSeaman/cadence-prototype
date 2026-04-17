import { ReactNode } from 'react';
import {
  Calendar,
  Inbox,
  FileSearch,
  FlaskConical,
  ClipboardList,
  Users,
  Pill,
  Sparkles
} from 'lucide-react';

interface EMRFrameProps {
  children: ReactNode;
}

const menuItems = [
  { icon: Calendar, label: 'Schedule' },
  { icon: Inbox, label: 'In Basket', badge: 12 },
  { icon: FileSearch, label: 'Chart Review' },
  { icon: ClipboardList, label: 'Orders' },
  { icon: FlaskConical, label: 'Results' },
  { icon: Pill, label: 'Pharmacy' },
  { icon: Users, label: 'Registries' }
];

export default function EMRFrame({ children }: EMRFrameProps) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Fake EMR sidebar — conveys "embedded in Epic" illusion */}
      <aside className="hidden md:flex w-16 bg-slate-800 flex-col items-center py-3 flex-shrink-0 sticky top-0 h-screen z-30">
        <div className="w-10 h-10 rounded-md bg-slate-700 flex items-center justify-center mb-4">
          <span className="text-slate-300 text-xs tracking-tight">EMR</span>
        </div>
        <div className="w-8 h-px bg-slate-700 mb-3" />
        <nav className="flex flex-col gap-1 w-full px-2">
          {menuItems.map(({ icon: Icon, label, badge }) => (
            <button
              key={label}
              className="group relative flex flex-col items-center gap-1 py-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
              title={label}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] leading-none">{label}</span>
              {badge ? (
                <span className="absolute top-0.5 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] flex items-center justify-center">
                  {badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="mt-auto w-full px-2">
          <div className="flex flex-col items-center gap-1 py-2 rounded-md bg-blue-600 text-white">
            <Sparkles className="w-4 h-4" />
            <span className="text-[9px] leading-none">Cadence</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Integration ribbon */}
        <div className="hidden md:flex items-center justify-between px-4 py-1 bg-slate-900 text-slate-300 text-xs border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span>Cadence plugin — embedded in Epic Hyperspace</span>
          </div>
          <span className="text-slate-500">Dr. Sarah Mitchell · Primary Care · MGH</span>
        </div>
        {children}
      </div>
    </div>
  );
}
