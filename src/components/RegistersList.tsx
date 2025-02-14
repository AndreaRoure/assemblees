
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchInterventions } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from "@/components/ui/scroll-area";

const RegistersList = () => {
  const isMobile = useIsMobile();
  const [selectedYear, setSelectedYear] = React.useState<string>('all');
  const [selectedGender, setSelectedGender] = React.useState<string>('all');

  const { data: interventions = [], isLoading: isLoadingInterventions } = useQuery({
    queryKey: ['interventions'],
    queryFn: fetchInterventions
  });

  const years = useMemo(() => {
    const uniqueYears = [...new Set(interventions.map(i => 
      new Date(i.timestamp).getFullYear()
    ))].sort((a, b) => b - a);
    return uniqueYears;
  }, [interventions]);

  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const year = new Date(i.timestamp).getFullYear();
      const matchesYear = selectedYear === 'all' || year.toString() === selectedYear;
      const matchesGender = selectedGender === 'all' || i.gender === selectedGender;
      return matchesYear && matchesGender;
    });
  }, [interventions, selectedYear, selectedGender]);

  const totals = useMemo(() => {
    const counts = {
      intervencio: 0,
      dinamitza: 0,
      interrupcio: 0,
      llarga: 0,
      ofensiva: 0,
      explica: 0,
    };
    
    filteredInterventions.forEach(i => {
      if (i.type in counts) {
        counts[i.type]++;
      }
    });
    
    return counts;
  }, [filteredInterventions]);

  const genderTotals = useMemo(() => {
    const initialCounts = {
      intervencio: 0,
      dinamitza: 0,
      interrupcio: 0,
      llarga: 0,
      ofensiva: 0,
      explica: 0
    };

    const totals = {
      man: { ...initialCounts },
      woman: { ...initialCounts },
      'non-binary': { ...initialCounts }
    };

    filteredInterventions.forEach(i => {
      if (i.gender in totals && i.type in totals[i.gender]) {
        totals[i.gender][i.type]++;
      }
    });

    return Object.entries(totals).map(([gender, counts]) => ({
      gender: gender === 'man' ? 'Homes' :
             gender === 'woman' ? 'Dones' :
             'Persones No Binàries',
      ...counts
    }));
  }, [filteredInterventions]);

  const downloadCSV = () => {
    const headers = ['Data', 'Tipus', 'Gènere', 'Assembly ID'];
    const rows = filteredInterventions.map(i => [
      new Date(i.timestamp).toLocaleDateString('ca-ES'),
      i.type,
      i.gender,
      i.assembly_id
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `interventions_${selectedYear}_${selectedGender}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingInterventions) {
    return <div className="text-center text-muted-foreground">Carregant...</div>;
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      <div className="grid grid-cols-1 gap-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Select
            value={selectedYear}
            onValueChange={setSelectedYear}
          >
            <SelectTrigger className="h-11 md:h-10 text-sm">
              <SelectValue placeholder="Selecciona l'any" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots els anys</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedGender}
            onValueChange={setSelectedGender}
          >
            <SelectTrigger className="h-11 md:h-10 text-sm">
              <SelectValue placeholder="Selecciona el gènere" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots els gèneres</SelectItem>
              <SelectItem value="man">Homes</SelectItem>
              <SelectItem value="woman">Dones</SelectItem>
              <SelectItem value="non-binary">Persones No Binàries</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={downloadCSV}
          className="h-11 md:h-10 text-sm w-full md:w-auto md:self-end"
        >
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="whitespace-nowrap">Descarregar CSV</span>
        </Button>
      </div>

      <div className="w-full overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(totals).map(([type, count]) => (
            <Card key={type} className="p-4">
              <div className="text-base md:text-lg font-semibold">{count}</div>
              <div className="text-xs md:text-sm text-muted-foreground break-words">
                {type === 'intervencio' && 'Intervencions'}
                {type === 'dinamitza' && 'Dinamitza'}
                {type === 'interrupcio' && 'Interrupcions'}
                {type === 'llarga' && 'Inter. llargues'}
                {type === 'ofensiva' && 'Inter. ofensives'}
                {type === 'explica' && 'Explica'}
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-4 w-full overflow-hidden">
        <div className="font-semibold mb-4 text-sm md:text-base">
          Intervencions per Gènere
        </div>
        <div className="w-full h-[300px] md:h-[350px] -mx-4 md:mx-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={genderTotals}
              margin={{ 
                top: 20, 
                right: isMobile ? 16 : 30, 
                left: isMobile ? 0 : 40, 
                bottom: isMobile ? 80 : 40 
              }}
            >
              <XAxis 
                dataKey="gender"
                angle={isMobile ? -45 : 0}
                textAnchor={isMobile ? "end" : "middle"}
                height={80}
                interval={0}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 20 : 10}
              />
              <YAxis 
                width={isMobile ? 35 : 40}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip 
                contentStyle={{ 
                  fontSize: isMobile ? '12px' : '14px',
                  padding: '8px 12px'
                }}
                wrapperStyle={{
                  zIndex: 1000
                }}
              />
              <Legend 
                verticalAlign="bottom"
                height={isMobile ? 60 : 36}
                wrapperStyle={{ 
                  fontSize: isMobile ? '11px' : '12px',
                  paddingTop: '16px'
                }}
              />
              <Bar dataKey="intervencio" stackId="a" fill="#8884d8" name="Intervenció" />
              <Bar dataKey="dinamitza" stackId="a" fill="#82ca9d" name="Dinamitza" />
              <Bar dataKey="interrupcio" stackId="a" fill="#ffc658" name="Interrupció" />
              <Bar dataKey="llarga" stackId="a" fill="#ff8042" name="Inter. llarga" />
              <Bar dataKey="ofensiva" stackId="a" fill="#ff6b6b" name="Inter. ofensiva" />
              <Bar dataKey="explica" stackId="a" fill="#4ecdc4" name="Explica" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default RegistersList;
