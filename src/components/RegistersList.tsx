
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import YearSelect from './registers/YearSelect';
import GenderSelect from './registers/GenderSelect';
import InterventionStats from './registers/InterventionStats';
import GenderChart from './registers/GenderChart';

const RegistersList = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('interventions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'interventions' 
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['interventions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: interventions = [], isLoading: isLoadingInterventions } = useQuery({
    queryKey: ['interventions'],
    queryFn: fetchInterventions
  });

  const { data: assemblies = [], isLoading: isLoadingAssemblies } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies
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
      counts[i.type]++;
    });
    
    return counts;
  }, [filteredInterventions]);

  const genderTotals = useMemo(() => {
    const totals = {
      man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0 },
      woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0 },
      'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0 }
    };

    interventions.forEach(i => {
      totals[i.gender][i.type]++;
    });

    return Object.entries(totals).map(([gender, counts]) => ({
      gender: gender === 'man' ? 'Homes' :
             gender === 'woman' ? 'Dones' :
             'No binàries',
      ...counts
    }));
  }, [interventions]);

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

  if (isLoadingInterventions || isLoadingAssemblies) {
    return <div className="text-center text-muted-foreground">Carregant...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <YearSelect 
          value={selectedYear}
          years={years}
          onValueChange={setSelectedYear}
        />

        <GenderSelect
          value={selectedGender}
          onValueChange={setSelectedGender}
        />

        <Button
          variant="outline"
          onClick={downloadCSV}
          className="ml-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Descarregar CSV
        </Button>
      </div>

      <InterventionStats stats={totals} />
      <GenderChart data={genderTotals} />

      <div className="text-sm text-muted-foreground text-center">
        Total d&apos;intervencions: {filteredInterventions.length}
      </div>
    </div>
  );
};

export default RegistersList;
