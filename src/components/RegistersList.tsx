
import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchInterventions } from '@/lib/supabase';
import FiltersSection from './registers/FiltersSection';
import StatsCards from './registers/StatsCards';
import InterventionsChart from './registers/InterventionsChart';

const RegistersList = () => {
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
      <FiltersSection
        selectedYear={selectedYear}
        selectedGender={selectedGender}
        years={years}
        onYearChange={setSelectedYear}
        onGenderChange={setSelectedGender}
        onDownload={downloadCSV}
      />
      <StatsCards totals={totals} />
      <InterventionsChart data={genderTotals} />
    </div>
  );
};

export default RegistersList;
