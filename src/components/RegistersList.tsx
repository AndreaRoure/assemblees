
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import InterventionStats from './InterventionStats';
import GenderChart from './registers/GenderChart';
import FilterToolbar from './registers/FilterToolbar';
import TotalAssembliesCard from './registers/TotalAssembliesCard';
import GenderDistributionChart from './registers/GenderDistributionChart';
import YearlyEvolutionChart from './registers/YearlyEvolutionChart';

const RegistersList = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
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
      return matchesYear;
    });
  }, [interventions, selectedYear]);

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
      man: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0, total: 0 },
      woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0, total: 0 },
      'non-binary': { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0, total: 0 }
    };

    interventions.forEach(i => {
      totals[i.gender][i.type]++;
      totals[i.gender].total++;
    });

    return Object.entries(totals).map(([gender, counts]) => ({
      gender: gender === 'man' ? 'Homes' :
             gender === 'woman' ? 'Dones' :
             'No binàries',
      ...counts
    }));
  }, [interventions]);

  // Calculate attendance per gender from all assemblies
  const attendanceSummary = useMemo(() => {
    const totalInterventions = interventions.length;
    
    // Count interventions by gender
    const interventionsByGender = {
      man: interventions.filter(i => i.gender === 'man').length,
      woman: interventions.filter(i => i.gender === 'woman').length,
      'non-binary': interventions.filter(i => i.gender === 'non-binary').length,
    };
    
    // Calculate percentages
    const totalPercentage = totalInterventions > 0 ? 100 : 0;
    const percentageByGender = {
      man: totalInterventions > 0 ? (interventionsByGender.man / totalInterventions) * 100 : 0,
      woman: totalInterventions > 0 ? (interventionsByGender.woman / totalInterventions) * 100 : 0,
      'non-binary': totalInterventions > 0 ? (interventionsByGender["non-binary"] / totalInterventions) * 100 : 0,
    };
    
    // Prepare data for pie chart
    const pieChartData = [
      { name: 'Homes', value: interventionsByGender.man },
      { name: 'Dones', value: interventionsByGender.woman },
      { name: 'No binàries', value: interventionsByGender["non-binary"] },
    ];
    
    return { 
      assemblyCount: assemblies.length,
      totalInterventions,
      interventionsByGender,
      percentageByGender,
      pieChartData
    };
  }, [assemblies.length, interventions]);

  // Generate data for the yearly evolution chart
  const yearlyEvolutionData = useMemo(() => {
    const yearData = {};
    
    // Initialize years with zero counts
    years.forEach(year => {
      yearData[year] = {
        year: year.toString(),
        man: 0,
        woman: 0,
        'non-binary': 0,
        total: 0
      };
    });
    
    // Count interventions by year and gender
    interventions.forEach(intervention => {
      const year = new Date(intervention.timestamp).getFullYear();
      if (yearData[year]) {
        yearData[year][intervention.gender]++;
        yearData[year].total++;
      }
    });
    
    // Convert to array and sort by year
    return Object.values(yearData).sort((a: any, b: any) => parseInt(a.year) - parseInt(b.year));
  }, [interventions, years]);

  if (isLoadingInterventions || isLoadingAssemblies) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse text-lg">Carregant...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <FilterToolbar 
        selectedYear={selectedYear}
        years={years}
        onYearChange={setSelectedYear}
      />

      <TotalAssembliesCard count={attendanceSummary.assemblyCount} />

      <GenderDistributionChart 
        data={attendanceSummary.pieChartData}
        interventionsByGender={attendanceSummary.interventionsByGender}
        percentageByGender={attendanceSummary.percentageByGender}
        totalInterventions={attendanceSummary.totalInterventions}
      />

      <div className="grid gap-8">
        <div className="transform hover:scale-[1.01] transition-transform duration-200">
          <InterventionStats 
            stats={{
              byGender: {
                man: { intervencio: genderTotals[0].intervencio, dinamitza: genderTotals[0].dinamitza, interrupcio: genderTotals[0].interrupcio, llarga: genderTotals[0].llarga, ofensiva: genderTotals[0].ofensiva, explica: genderTotals[0].explica },
                woman: { intervencio: genderTotals[1].intervencio, dinamitza: genderTotals[1].dinamitza, interrupcio: genderTotals[1].interrupcio, llarga: genderTotals[1].llarga, ofensiva: genderTotals[1].ofensiva, explica: genderTotals[1].explica },
                'non-binary': { intervencio: genderTotals[2].intervencio, dinamitza: genderTotals[2].dinamitza, interrupcio: genderTotals[2].interrupcio, llarga: genderTotals[2].llarga, ofensiva: genderTotals[2].ofensiva, explica: genderTotals[2].explica },
              },
              totalInterventions: attendanceSummary.totalInterventions
            }}
            attendance={{
              female_count: 10, // Placeholder values since real attendance data is not available
              male_count: 10,
              non_binary_count: 5
            }}
          />
        </div>

        <div className="transform hover:scale-[1.01] transition-transform duration-200">
          <GenderChart data={genderTotals} />
        </div>

        <YearlyEvolutionChart data={yearlyEvolutionData} />
      </div>
    </div>
  );
};

export default RegistersList;
