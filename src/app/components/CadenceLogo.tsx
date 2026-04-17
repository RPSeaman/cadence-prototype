export default function CadenceLogo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { container: 'h-8', text: 'text-lg', subtext: 'text-[10px]' },
    md: { container: 'h-10', text: 'text-xl', subtext: 'text-xs' },
    lg: { container: 'h-12', text: 'text-2xl', subtext: 'text-sm' }
  };

  const { container, text, subtext } = sizes[size];

  return (
    <div className={`flex items-center gap-3 ${container}`}>
      {/* Logo Mark */}
      <div className={`${container} aspect-square rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-sm`}>
        <svg viewBox="0 0 24 24" fill="none" className="w-[65%] h-[65%]">
          {/* Clean rhythm/pulse bars */}
          <rect x="4" y="10" width="2" height="4" fill="white" rx="1" />
          <rect x="8" y="7" width="2" height="10" fill="white" rx="1" />
          <rect x="12" y="5" width="2" height="14" fill="white" rx="1" />
          <rect x="16" y="8" width="2" height="8" fill="white" rx="1" />
        </svg>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col justify-center">
        <h1 className={`${text} font-semibold text-gray-900 leading-none tracking-tight`}>
          Cadence
        </h1>
        <p className={`${subtext} text-blue-600 font-medium uppercase tracking-wider leading-none mt-0.5`}>
          Health
        </p>
      </div>
    </div>
  );
}
