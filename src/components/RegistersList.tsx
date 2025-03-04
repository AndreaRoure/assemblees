import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
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

  if (isLoadingInterventions || isLoadingAssemblies) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse text-lg">Carregant...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <YearSelect 
            value={selectedYear}
            years={years}
            onValueChange={setSelectedYear}
          />

          <GenderSelect
            value={selectedGender}
            onValueChange={setSelectedGender}
          />
        </div>
      </div>

      <div className="grid gap-8">
        <div className="transform hover:scale-[1.01] transition-transform duration-200">
          <InterventionStats stats={totals} />
        </div>

        <div className="transform hover:scale-[1.01] transition-transform duration-200">
          <GenderChart data={genderTotals} />
        </div>
      </div>
    </div>
  );
};

export default RegistersList;
