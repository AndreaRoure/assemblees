
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
    <Card className="p-4">
      <div className="font-semibold mb-4">Intervencions per Gènere</div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="gender" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="intervencio" stackId="a" fill="#8884d8" name="Intervenció" />
            <Bar dataKey="dinamitza" stackId="a" fill="#82ca9d" name="Dinamitza" />
            <Bar dataKey="interrupcio" stackId="a" fill="#ffc658" name="Interrupció" />
            <Bar dataKey="llarga" stackId="a" fill="#ff8042" name="Intervenció llarga" />
            <Bar dataKey="ofensiva" stackId="a" fill="#ff6b6b" name="Intervenció ofensiva" />
            <Bar dataKey="explica" stackId="a" fill="#4ecdc4" name="Explica" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GenderChart;
