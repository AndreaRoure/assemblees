
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-200">
      <div className="text-base md:text-lg font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        Intervencions per Gènere
      </div>
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 100 : 80 }}
          >
            <XAxis 
              dataKey="gender" 
              angle={isMobile ? -45 : 0}
              textAnchor={isMobile ? "end" : "middle"}
              height={60}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#4B5563' }}
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
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ 
                paddingTop: '20px',
                fontSize: isMobile ? '10px' : '12px'
              }}
            />
            <Bar dataKey="dinamitza" stackId="a" fill="#FF69B4" name="Dinamitza" /> {/* Pink */}
            <Bar dataKey="explica" stackId="a" fill="#9B59D0" name="Explica" /> {/* Purple */}
            <Bar dataKey="interrupcio" stackId="a" fill="#FF8B3D" name="Interrupció" /> {/* Orange */}
            <Bar dataKey="intervencio" stackId="a" fill="#4EA8DE" name="Intervenció" /> {/* Blue */}
            <Bar dataKey="llarga" stackId="a" fill="#50C878" name="Intervenció llarga" /> {/* Green */}
            <Bar dataKey="ofensiva" stackId="a" fill="#FFD700" name="Ofensiva" /> {/* Yellow */}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GenderChart;
