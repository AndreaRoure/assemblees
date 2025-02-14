
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GenderChartProps {
  data: Array<{
    gender: string;
    intervencio: number;
    dinamitza: number;
    interrupcio: number;
    llarga: number;
    ofensiva: number;
    explica: number;
  }>;
}

const GenderChart = ({ data }: GenderChartProps) => {
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="font-semibold mb-6 text-lg bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        Intervencions per Gènere
      </div>
      <div className="h-[400px]"> {/* Increased height for better visibility */}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis 
              dataKey="gender" 
              tick={{ fill: '#4B5563' }} 
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              tick={{ fill: '#4B5563' }} 
              tickLine={{ stroke: '#4B5563' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend 
              wrapperStyle={{
                paddingTop: '20px'
              }}
            />
            <Bar dataKey="intervencio" stackId="a" fill="#8B5CF6" name="Intervenció" />
            <Bar dataKey="dinamitza" stackId="a" fill="#10B981" name="Dinamitza" />
            <Bar dataKey="interrupcio" stackId="a" fill="#F59E0B" name="Interrupció" />
            <Bar dataKey="llarga" stackId="a" fill="#3B82F6" name="Intervenció llarga" />
            <Bar dataKey="ofensiva" stackId="a" fill="#EF4444" name="Ofensiva" />
            <Bar dataKey="explica" stackId="a" fill="#6366F1" name="Explica" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GenderChart;
