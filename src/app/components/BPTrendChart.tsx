import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { VitalReading } from '../data/mockData';
import { format } from 'date-fns';

interface BPTrendChartProps {
  vitals: VitalReading[];
  compact?: boolean;
}

export default function BPTrendChart({ vitals, compact = false }: BPTrendChartProps) {
  const data = vitals.map(v => ({
    date: format(new Date(v.timestamp), 'MMM d'),
    systolic: v.systolic,
    diastolic: v.diastolic,
    fullDate: v.timestamp
  })).filter(d => d.systolic && d.diastolic);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 text-sm">
        No blood pressure data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={compact ? 200 : 300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid key="cartesian-grid" strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          key="x-axis"
          dataKey="date" 
          stroke="#6b7280"
          style={{ fontSize: compact ? '11px' : '12px' }}
        />
        <YAxis 
          key="y-axis"
          stroke="#6b7280"
          domain={[60, 180]}
          style={{ fontSize: compact ? '11px' : '12px' }}
        />
        <Tooltip
          key="tooltip"
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            fontSize: '12px'
          }}
          formatter={(value: number) => [`${value} mmHg`]}
        />
        {!compact && <Legend key="legend" />}
        
        {/* Goal lines */}
        <ReferenceLine key="ref-line-120" y={120} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Target', position: 'right', fill: '#10b981', fontSize: 11 }} />
        <ReferenceLine key="ref-line-80" y={80} stroke="#10b981" strokeDasharray="3 3" />
        <ReferenceLine key="ref-line-140" y={140} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Elevated', position: 'right', fill: '#f59e0b', fontSize: 11 }} />
        <ReferenceLine key="ref-line-150" y={150} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'High', position: 'right', fill: '#ef4444', fontSize: 11 }} />
        
        <Line 
          key="line-systolic"
          type="monotone" 
          dataKey="systolic" 
          stroke="#0066CC" 
          strokeWidth={2}
          dot={{ fill: '#0066CC', r: 4 }}
          name="Systolic"
        />
        <Line 
          key="line-diastolic"
          type="monotone" 
          dataKey="diastolic" 
          stroke="#7c3aed" 
          strokeWidth={2}
          dot={{ fill: '#7c3aed', r: 4 }}
          name="Diastolic"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}