
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

const descriptions = {
  Dinamitza: "Fomenta la conversación.",
  Explica: "Añade información extra.",
  Interrupció: "Corta la palabra a otra persona.",
  Intervenció: "Intervención breve.",
  "Intervenció llarga": "Intervención extendida.",
  Ofensiva: "Comentario agresivo.",
};

const CustomLegend = ({ payload }: any) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap justify-center gap-2 pt-2 px-2">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-1">
            <div 
              className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" 
              style={{ backgroundColor: entry.color }} 
            />
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <span className="text-xs md:text-sm font-medium">{entry.value}</span>
                  <Info className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent 
                side="top" 
                className="bg-white p-2 z-50 shadow-lg border"
              >
                <p className="text-xs md:text-sm">{descriptions[entry.value]}</p>
              </TooltipContent>
            </UITooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

const GenderChart = ({ data }: GenderChartProps) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="p-3 md:p-6 bg-gradient-to-br from-white to-gray-50">
      <div className="text-sm md:text-lg font-semibold mb-4 md:mb-6 text-foreground">
        Intervencions per Gènere
      </div>
      <div className="h-[400px] md:h-[400px] -mx-2 md:mx-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data}
            margin={isMobile ? 
              { top: 20, right: 10, left: 0, bottom: 120 } : 
              { top: 20, right: 30, left: 20, bottom: 80 }
            }
          >
            <XAxis 
              dataKey="gender" 
              angle={-45}
              textAnchor="end"
              height={80}
              interval={0}
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#9CA3AF' }}
            />
            <YAxis 
              tick={{ fontSize: isMobile ? 10 : 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#9CA3AF' }}
              width={isMobile ? 30 : 45}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                fontSize: isMobile ? '12px' : '14px'
              }}
              cursor={{ fill: 'rgba(243, 244, 246, 0.4)' }}
            />
            <Legend content={CustomLegend} />
            <Bar dataKey="dinamitza" stackId="a" fill="#EC4899" name="Dinamitza" />
            <Bar dataKey="explica" stackId="a" fill="#8B5CF6" name="Explica" />
            <Bar dataKey="interrupcio" stackId="a" fill="#F59E0B" name="Interrupció" />
            <Bar dataKey="intervencio" stackId="a" fill="#3B82F6" name="Intervenció" />
            <Bar dataKey="llarga" stackId="a" fill="#10B981" name="Intervenció llarga" />
            <Bar dataKey="ofensiva" stackId="a" fill="#EF4444" name="Ofensiva" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GenderChart;
