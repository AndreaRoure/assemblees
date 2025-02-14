
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AssemblyStats as AssemblyStatsType } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

const InfoPopup = ({ term }: { term: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-700">
          <Info className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="p-4">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{term}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">{descriptions[term]}</p>
      </DialogContent>
    </Dialog>
  );
};

const AssemblyStats = ({ stats }: AssemblyStatsProps) => {
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

  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 pt-4">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3" style={{ backgroundColor: entry.color }} />
            <span className="text-sm">{entry.value}</span>
            <InfoPopup term={entry.value} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-200 animate-fade-in">
      <h3 className="text-base md:text-lg font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
        Estadístiques per Gènere i Tipus
      </h3>
      <div className="h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ top: 20, right: 30, left: 20, bottom: isMobile ? 100 : 80 }}
          >
            <XAxis 
              dataKey="name" 
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
            <Legend content={CustomLegend} />
            <Bar dataKey="Dinamitza" stackId="a" fill="#FF69B4" />
            <Bar dataKey="Explica" stackId="a" fill="#9B59D0" />
            <Bar dataKey="Interrupció" stackId="a" fill="#FF8B3D" />
            <Bar dataKey="Intervenció curta" stackId="a" fill="#4EA8DE" />
            <Bar dataKey="Intervenció llarga" stackId="a" fill="#50C878" />
            <Bar dataKey="Ofensiva" stackId="a" fill="#FFD700" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default AssemblyStats;
