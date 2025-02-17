
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AssemblyStats as AssemblyStatsType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Info } from "lucide-react";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AssemblyStatsProps {
  stats: AssemblyStatsType;
}

const descriptions = {
  Dinamitza: "Fomenta la conversación.",
  Explica: "Añade información extra.",
  Interrupció: "Corta la palabra a otra persona.",
  "Intervenció curta": "Intervención breve.",
  "Intervenció llarga": "Intervención extendida.",
  Ofensiva: "Comentario agresivo.",
};

const CustomLegend = ({ payload }: any) => {
  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex flex-wrap justify-center gap-2 pt-2 px-2">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded" style={{ backgroundColor: entry.color }} />
            <UITooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1 cursor-help">
                  <span className="text-xs md:text-sm">{entry.value}</span>
                  <Info className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-white p-2 z-50 shadow-lg border">
                <p className="text-xs md:text-sm">{descriptions[entry.value]}</p>
              </TooltipContent>
            </UITooltip>
          </div>
        ))}
      </div>
    </TooltipProvider>
  );
};

const ResponsiveAssemblyStats = ({ stats }: AssemblyStatsProps) => {
  const isMobile = useIsMobile();

  const data = useMemo(() => [
    {
      name: 'Home',
      'Intervenció curta': stats.byGender.man.intervencio,
      'Dinamitza': stats.byGender.man.dinamitza,
      'Interrupció': stats.byGender.man.interrupcio,
      'Intervenció llarga': stats.byGender.man.llarga,
      'Ofensiva': stats.byGender.man.ofensiva,
      'Explica': stats.byGender.man.explica,
    },
    {
      name: 'Dona',
      'Intervenció curta': stats.byGender.woman.intervencio,
      'Dinamitza': stats.byGender.woman.dinamitza,
      'Interrupció': stats.byGender.woman.interrupcio,
      'Intervenció llarga': stats.byGender.woman.llarga,
      'Ofensiva': stats.byGender.woman.ofensiva,
      'Explica': stats.byGender.woman.explica,
    },
    {
      name: 'No Binari',
      'Intervenció curta': stats.byGender['non-binary'].intervencio,
      'Dinamitza': stats.byGender['non-binary'].dinamitza,
      'Interrupció': stats.byGender['non-binary'].interrupcio,
      'Intervenció llarga': stats.byGender['non-binary'].llarga,
      'Ofensiva': stats.byGender['non-binary'].ofensiva,
      'Explica': stats.byGender['non-binary'].explica,
    },
  ], [stats]);

  return (
    <Card className="p-3 md:p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-200 animate-fade-in">
      <h3 className="text-sm md:text-lg font-semibold mb-4 md:mb-6 text-foreground">
        Estadístiques per Gènere i Tipus
      </h3>
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
              dataKey="name" 
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
            <Bar dataKey="Dinamitza" stackId="a" fill="#EC4899" />
            <Bar dataKey="Explica" stackId="a" fill="#8B5CF6" />
            <Bar dataKey="Interrupció" stackId="a" fill="#F59E0B" />
            <Bar dataKey="Intervenció curta" stackId="a" fill="#3B82F6" />
            <Bar dataKey="Intervenció llarga" stackId="a" fill="#10B981" />
            <Bar dataKey="Ofensiva" stackId="a" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default ResponsiveAssemblyStats;
