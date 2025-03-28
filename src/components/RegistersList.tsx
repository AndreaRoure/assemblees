
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import YearSelect from './registers/YearSelect';
import GenderSelect from './registers/GenderSelect';
import InterventionStats from './InterventionStats';
import GenderChart from './registers/GenderChart';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

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

  if (isLoadingInterventions || isLoadingAssemblies) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse text-lg">Carregant...</div>
      </div>
    );
  }

  // Inclusive color palette
  const COLORS = ['#8B5CF6', '#0EA5E9', '#D946EF'];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-4 md:p-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
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

      {/* Total Assemblees Card */}
      <Card className="p-4 hover:shadow-md transition-all bg-primary text-white">
        <h3 className="text-lg font-semibold">Assemblees Totals</h3>
        <p className="text-3xl font-bold">{attendanceSummary.assemblyCount}</p>
      </Card>

      {/* Gender Distribution Chart */}
      <Card className="p-4 md:p-6">
        <h3 className="text-lg font-semibold mb-4">Distribució d'Intervencions per Gènere</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceSummary.pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                >
                  {attendanceSummary.pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value, name) => [`${value} (${((value / attendanceSummary.totalInterventions) * 100).toFixed(1)}%)`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="self-center">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Gènere</TableHead>
                  <TableHead className="text-right">Total Intervencions</TableHead>
                  <TableHead className="text-right">Percentatge</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Homes</TableCell>
                  <TableCell className="text-right">{attendanceSummary.interventionsByGender.man}</TableCell>
                  <TableCell className="text-right">{attendanceSummary.percentageByGender.man.toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Dones</TableCell>
                  <TableCell className="text-right">{attendanceSummary.interventionsByGender.woman}</TableCell>
                  <TableCell className="text-right">{attendanceSummary.percentageByGender.woman.toFixed(1)}%</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>No binàries</TableCell>
                  <TableCell className="text-right">{attendanceSummary.interventionsByGender["non-binary"]}</TableCell>
                  <TableCell className="text-right">{attendanceSummary.percentageByGender["non-binary"].toFixed(1)}%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

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
      </div>
    </div>
  );
};

export default RegistersList;
