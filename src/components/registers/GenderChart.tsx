
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

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

const GenderChart = ({ data }: GenderChartProps) => {
  const isMobile = useIsMobile();
  
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
            <Legend content={CustomLegend} />
            <Bar dataKey="dinamitza" stackId="a" fill="#FF69B4" name="Dinamitza" />
            <Bar dataKey="explica" stackId="a" fill="#9B59D0" name="Explica" />
            <Bar dataKey="interrupcio" stackId="a" fill="#FF8B3D" name="Interrupció" />
            <Bar dataKey="intervencio" stackId="a" fill="#4EA8DE" name="Intervenció" />
            <Bar dataKey="llarga" stackId="a" fill="#50C878" name="Intervenció llarga" />
            <Bar dataKey="ofensiva" stackId="a" fill="#FFD700" name="Ofensiva" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default GenderChart;
