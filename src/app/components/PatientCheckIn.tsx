import { useState } from 'react';
import {
  Check,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Phone
} from 'lucide-react';
import { useNavigate } from 'react-router';
import { useView } from '../context/ViewContext';

type FeelingAnswer = 'great' | 'ok' | 'off' | 'notgood';

interface Answers {
  feeling?: FeelingAnswer;
  systolic?: string;
  diastolic?: string;
  sideEffects?: 'yes' | 'no';
  sideEffectDetail?: string;
  meds?: 'yes' | 'later' | 'no';
}

const STEPS = ['welcome', 'feeling', 'bp', 'side-effects', 'meds', 'complete'] as const;
type Step = (typeof STEPS)[number];

export default function PatientCheckIn() {
  const navigate = useNavigate();
  const { viewMode } = useView();
  const isMobile = viewMode === 'patient-mobile';

  const [step, setStep] = useState<Step>('welcome');
  const [answers, setAnswers] = useState<Answers>({});
  const [escalation, setEscalation] = useState<null | 'menu' | 'sent'>(null);

  const activeQuestionSteps: Step[] = ['feeling', 'bp', 'side-effects', 'meds'];
  const currentIdx = activeQuestionSteps.indexOf(step);
  const progress =
    step === 'welcome' ? 0 : step === 'complete' ? 100 : ((currentIdx + 1) / activeQuestionSteps.length) * 100;

  const goNext = () => {
    const idx = STEPS.indexOf(step);
    if (idx < STEPS.length - 1) setStep(STEPS[idx + 1]);
  };
  const goBack = () => {
    const idx = STEPS.indexOf(step);
    if (idx > 0) setStep(STEPS[idx - 1]);
  };

  const outer = isMobile
    ? 'h-full bg-gradient-to-b from-blue-50 via-white to-white flex flex-col'
    : 'min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-6';

  const shell = isMobile
    ? 'w-full h-full bg-white flex flex-col'
    : 'max-w-xl w-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col min-h-[640px]';

  return (
    <div className={outer}>
      <div className={shell}>
        {/* iOS top spacer */}
        {isMobile && <div className="h-8 flex-shrink-0" />}

        {/* Top bar */}
        <div className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm">Exit</span>
            </button>
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
              <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
              <span className="text-green-800 text-xs">Verified by Dr. Mitchell</span>
            </div>
          </div>
          {step !== 'welcome' && step !== 'complete' && (
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-600 h-1.5 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 min-h-0">
          {step === 'welcome' && <Welcome onStart={() => setStep('feeling')} />}
          {step === 'feeling' && (
            <FeelingStep
              value={answers.feeling}
              onSelect={(v) => {
                setAnswers({ ...answers, feeling: v });
                goNext();
              }}
            />
          )}
          {step === 'bp' && (
            <BPStep
              systolic={answers.systolic || ''}
              diastolic={answers.diastolic || ''}
              onChange={(s, d) => setAnswers({ ...answers, systolic: s, diastolic: d })}
            />
          )}
          {step === 'side-effects' && (
            <SideEffectsStep
              value={answers.sideEffects}
              detail={answers.sideEffectDetail}
              onSelect={(v, detail) => {
                setAnswers({ ...answers, sideEffects: v, sideEffectDetail: detail });
                if (v === 'no') goNext();
              }}
              onContinue={() => goNext()}
            />
          )}
          {step === 'meds' && (
            <MedsStep
              value={answers.meds}
              onSelect={(v) => {
                setAnswers({ ...answers, meds: v });
                goNext();
              }}
            />
          )}
          {step === 'complete' && <CompleteScreen answers={answers} onDone={() => navigate('/')} />}
        </div>

        {/* Footer: Continue + back + escalation */}
        <div className="flex-shrink-0 border-t border-gray-100 px-6 py-4 space-y-3">
          {step === 'bp' && (
            <button
              onClick={goNext}
              disabled={!answers.systolic || !answers.diastolic}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors text-lg"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          )}
          {step === 'side-effects' && answers.sideEffects === 'yes' && (
            <button
              onClick={goNext}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors text-lg"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          )}

          {step !== 'welcome' && step !== 'complete' && (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={goBack}
                className="text-gray-500 hover:text-gray-900 text-sm px-2 py-1"
              >
                ← Back
              </button>
              <button
                onClick={() => setEscalation('menu')}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-full hover:bg-red-100 transition-colors text-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                Something feels off
              </button>
            </div>
          )}
        </div>
      </div>

      {escalation && (
        <EscalationModal
          state={escalation}
          onClose={() => setEscalation(null)}
          onEscalate={() => setEscalation('sent')}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Screens                                   */
/* -------------------------------------------------------------------------- */

function Welcome({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col h-full justify-center py-6">
      <div className="flex items-start gap-3 mb-5">
        <DoctorAvatar />
        <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-gray-900">Hi Margaret, it's your weekly check-in.</p>
        </div>
      </div>
      <div className="flex items-start gap-3 mb-8">
        <DoctorAvatar />
        <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-gray-900">
            Just 4 quick questions — about 90 seconds. Your answers go straight to me.
          </p>
        </div>
      </div>
      <button
        onClick={onStart}
        className="w-full px-6 py-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors text-lg"
      >
        Let's start
      </button>
      <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 text-sm">
        <ShieldCheck className="w-4 h-4 text-green-600" />
        Questions personalized &amp; reviewed by Dr. Mitchell
      </div>
    </div>
  );
}

function FeelingStep({
  value,
  onSelect
}: {
  value?: FeelingAnswer;
  onSelect: (v: FeelingAnswer) => void;
}) {
  const options: { id: FeelingAnswer; label: string; icon: JSX.Element; tone: string }[] = [
    { id: 'great', label: 'Great', icon: <Smile className="w-6 h-6" />, tone: 'border-green-300 hover:bg-green-50' },
    { id: 'ok', label: 'OK', icon: <Meh className="w-6 h-6" />, tone: 'border-gray-300 hover:bg-gray-50' },
    { id: 'off', label: 'A little off', icon: <Meh className="w-6 h-6" />, tone: 'border-amber-300 hover:bg-amber-50' },
    { id: 'notgood', label: 'Not good', icon: <Frown className="w-6 h-6" />, tone: 'border-red-300 hover:bg-red-50' }
  ];
  return (
    <QuestionShell bubble="How are you feeling overall today?">
      <div className="grid grid-cols-2 gap-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 py-6 transition-colors ${
              value === o.id ? 'bg-blue-50 border-blue-500' : `bg-white ${o.tone}`
            }`}
          >
            <span className="text-gray-700">{o.icon}</span>
            <span className="text-gray-900 text-lg">{o.label}</span>
          </button>
        ))}
      </div>
    </QuestionShell>
  );
}

function BPStep({
  systolic,
  diastolic,
  onChange
}: {
  systolic: string;
  diastolic: string;
  onChange: (s: string, d: string) => void;
}) {
  return (
    <QuestionShell bubble="What did your blood pressure cuff read?">
      <div className="flex items-end justify-center gap-4 py-6">
        <div className="flex-1 max-w-[140px]">
          <input
            type="number"
            inputMode="numeric"
            placeholder="120"
            value={systolic}
            onChange={(e) => onChange(e.target.value, diastolic)}
            className="w-full text-center text-4xl py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none"
          />
          <p className="text-center text-gray-500 text-sm mt-2">Top number</p>
        </div>
        <span className="text-gray-300 text-4xl pb-12">/</span>
        <div className="flex-1 max-w-[140px]">
          <input
            type="number"
            inputMode="numeric"
            placeholder="80"
            value={diastolic}
            onChange={(e) => onChange(systolic, e.target.value)}
            className="w-full text-center text-4xl py-4 border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:outline-none"
          />
          <p className="text-center text-gray-500 text-sm mt-2">Bottom number</p>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm">Don't have a reading? Tap "Something feels off" below.</p>
    </QuestionShell>
  );
}

function SideEffectsStep({
  value,
  detail,
  onSelect,
  onContinue
}: {
  value?: 'yes' | 'no';
  detail?: string;
  onSelect: (v: 'yes' | 'no', detail?: string) => void;
  onContinue: () => void;
}) {
  const chips = ['Dizziness', 'Headache', 'Fatigue', 'Cough', 'Other'];
  return (
    <QuestionShell bubble="Any side effects since your last check-in?">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <button
          onClick={() => onSelect('no')}
          className={`py-6 rounded-2xl border-2 text-lg transition-colors ${
            value === 'no' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
          }`}
        >
          No, I feel fine
        </button>
        <button
          onClick={() => onSelect('yes', detail)}
          className={`py-6 rounded-2xl border-2 text-lg transition-colors ${
            value === 'yes' ? 'bg-amber-50 border-amber-500 text-amber-800' : 'bg-white border-gray-300 hover:bg-gray-50 text-gray-900'
          }`}
        >
          Yes, a bit
        </button>
      </div>

      {value === 'yes' && (
        <div className="mt-4">
          <p className="text-gray-600 mb-3 text-sm">Which ones? (tap all that apply)</p>
          <div className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const active = detail?.split(', ').includes(c);
              return (
                <button
                  key={c}
                  onClick={() => {
                    const current = detail ? detail.split(', ') : [];
                    const next = active ? current.filter((x) => x !== c) : [...current, c];
                    onSelect('yes', next.join(', '));
                  }}
                  className={`px-4 py-2 rounded-full border-2 transition-colors ${
                    active
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </QuestionShell>
  );
}

function MedsStep({ value, onSelect }: { value?: Answers['meds']; onSelect: (v: 'yes' | 'later' | 'no') => void }) {
  const options = [
    { id: 'yes' as const, label: 'Yes, this morning', tone: 'border-green-300 hover:bg-green-50' },
    { id: 'later' as const, label: 'Not yet — later today', tone: 'border-amber-300 hover:bg-amber-50' },
    { id: 'no' as const, label: 'No, I skipped it', tone: 'border-red-300 hover:bg-red-50' }
  ];
  return (
    <QuestionShell bubble="Did you take your Lisinopril today?">
      <div className="space-y-3">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => onSelect(o.id)}
            className={`w-full py-5 rounded-2xl border-2 text-lg transition-colors text-gray-900 text-left px-6 ${
              value === o.id ? 'bg-blue-50 border-blue-500' : `bg-white ${o.tone}`
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </QuestionShell>
  );
}

function CompleteScreen({ answers, onDone }: { answers: Answers; onDone: () => void }) {
  const systolic = parseInt(answers.systolic || '0', 10);
  const narrative = buildNarrative(answers, systolic);

  return (
    <div className="flex flex-col items-center text-center py-6">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-5">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <h2 className="text-gray-900 text-2xl mb-2">All done, Margaret</h2>
      <p className="text-gray-600 mb-6">Sent to Dr. Mitchell.</p>

      <div className="w-full bg-white rounded-2xl border border-gray-200 p-5 mb-4 text-left">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <p className="text-gray-700 text-sm">AI-Generated Summary</p>
        </div>
        <p className="text-gray-900 leading-relaxed">{narrative}</p>
      </div>

      <div className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-green-50 border border-green-200 mb-6">
        <ShieldCheck className="w-4 h-4 text-green-700" />
        <span className="text-green-800 text-sm">Verified by your Doctor</span>
      </div>

      <button
        onClick={onDone}
        className="w-full px-6 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors text-lg"
      >
        Back to Home
      </button>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

function buildNarrative(a: Answers, systolic: number): string {
  // Deliberately trend-based & humane — avoids "your A1C is 7.1" fatigue.
  const feeling = a.feeling;
  const meds = a.meds;
  const side = a.sideEffects;

  if (feeling === 'notgood' || meds === 'no' || (systolic && systolic >= 160)) {
    return "We noticed a few things worth a closer look. Dr. Mitchell's team will reach out within a day — nothing urgent, just checking in.";
  }

  if (feeling === 'off' || side === 'yes' || (systolic && systolic >= 145)) {
    return 'Your numbers are running a little higher than last week. Nothing alarming — Dr. Mitchell will see this in the morning and decide if any change is needed.';
  }

  return 'Your trends look stable this week. No changes needed — keep doing what you\'re doing. Next check-in in 7 days.';
}

function QuestionShell({ bubble, children }: { bubble: string; children: React.ReactNode }) {
  return (
    <div className="py-6">
      <div className="flex items-start gap-3 mb-8">
        <DoctorAvatar />
        <div className="bg-gray-100 rounded-2xl rounded-tl-md px-4 py-3 max-w-[85%]">
          <p className="text-gray-900 text-lg leading-snug">{bubble}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

function DoctorAvatar() {
  return (
    <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
      <span className="text-white text-xs">SM</span>
    </div>
  );
}

function EscalationModal({
  state,
  onClose,
  onEscalate
}: {
  state: 'menu' | 'sent';
  onClose: () => void;
  onEscalate: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl">
        {state === 'menu' ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-gray-900">Something feels off?</h3>
                <p className="text-gray-500 text-sm">We'll route this to Dr. Mitchell's team.</p>
              </div>
            </div>
            <div className="space-y-2 mb-4">
              <button
                onClick={onEscalate}
                className="w-full text-left px-4 py-4 border-2 border-red-200 rounded-2xl hover:bg-red-50 transition-colors"
              >
                <p className="text-gray-900">Send a message to my care team now</p>
                <p className="text-gray-500 text-sm mt-0.5">Response within a few hours during clinic hours</p>
              </button>
              <a
                href="tel:5551234567"
                className="flex items-center gap-3 px-4 py-4 border-2 border-gray-200 rounded-2xl hover:bg-gray-50 transition-colors"
              >
                <Phone className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="text-gray-900">Call the office</p>
                  <p className="text-gray-500 text-sm">(555) 123-4567</p>
                </div>
              </a>
              <a
                href="tel:911"
                className="flex items-center gap-3 px-4 py-4 border-2 border-red-300 bg-red-50 rounded-2xl hover:bg-red-100 transition-colors"
              >
                <Phone className="w-5 h-5 text-red-700" />
                <div>
                  <p className="text-red-800">Emergency — call 911</p>
                  <p className="text-red-700 text-sm">Chest pain, trouble breathing, severe symptoms</p>
                </div>
              </a>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-gray-900 text-lg mb-2">Message sent</h3>
            <p className="text-gray-600 mb-6">
              Dr. Mitchell's team got it. Expect a response within a few hours.
            </p>
            <button
              onClick={onClose}
              className="w-full py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-colors"
            >
              OK
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
