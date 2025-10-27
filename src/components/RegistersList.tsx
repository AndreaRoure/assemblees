
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import InterventionStats from './InterventionStats';
import GenderChart from './registers/GenderChart';
import FilterToolbar from './registers/FilterToolbar';
import TotalAssembliesCard from './registers/TotalAssembliesCard';
import GenderDistributionChart from './registers/GenderDistributionChart';
import YearlyEvolutionChart from './registers/YearlyEvolutionChart';
import AveragesSection from './registers/AveragesSection';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';

interface YearlyData {
  year: string;
  man: number;
  woman: number;
  'non-binary': number;
  total: number;
}

const RegistersList = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const { data: asistencias = [], isLoading: isLoadingAsistencias } = useQuery({
    queryKey: ['asistencias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('asistencias')
        .select('*');
      if (error) throw error;
      return data;
    }
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
    const yearData: Record<string, YearlyData> = {};
    
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
    return Object.values(yearData).sort((a, b) => parseInt(a.year) - parseInt(b.year));
  }, [interventions, years]);

  // Calculate averages for the new section
  const averages = useMemo(() => {
    // Calculate average assembly time
    const assembliesWithTime = assemblies.filter(a => a.start_time && a.end_time);
    let totalMinutes = 0;
    assembliesWithTime.forEach(a => {
      const start = new Date(a.start_time!);
      const end = new Date(a.end_time!);
      const diffMs = end.getTime() - start.getTime();
      totalMinutes += diffMs / (1000 * 60);
    });
    const avgMinutes = assembliesWithTime.length > 0 ? totalMinutes / assembliesWithTime.length : 0;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    const averageTime = `${hours}h ${minutes}m`;

    // Calculate average male/female participation based on interventions
    const totalInterventions = interventions.length;
    const maleInterventions = interventions.filter(i => i.gender === 'man').length;
    const femaleInterventions = interventions.filter(i => i.gender === 'woman').length;
    const avgMaleParticipation = totalInterventions > 0 ? (maleInterventions / totalInterventions) * 100 : 0;
    const avgFemaleParticipation = totalInterventions > 0 ? (femaleInterventions / totalInterventions) * 100 : 0;

    // Calculate average attendance and absences per assembly
    const attendanceByAssembly: Record<string, { attended: number; absent: number }> = {};
    asistencias.forEach(a => {
      if (!attendanceByAssembly[a.assembly_id]) {
        attendanceByAssembly[a.assembly_id] = { attended: 0, absent: 0 };
      }
      if (a.asistio) {
        attendanceByAssembly[a.assembly_id].attended++;
      } else {
        attendanceByAssembly[a.assembly_id].absent++;
      }
    });

    const assemblyIds = Object.keys(attendanceByAssembly);
    const totalAttended = assemblyIds.reduce((sum, id) => sum + attendanceByAssembly[id].attended, 0);
    const totalAbsent = assemblyIds.reduce((sum, id) => sum + attendanceByAssembly[id].absent, 0);
    const avgAttendance = assemblyIds.length > 0 ? totalAttended / assemblyIds.length : 0;
    const avgAbsences = assemblyIds.length > 0 ? totalAbsent / assemblyIds.length : 0;

    return {
      averageTime,
      averageMaleParticipation: avgMaleParticipation,
      averageFemaleParticipation: avgFemaleParticipation,
      averageAttendance: avgAttendance,
      averageAbsences: avgAbsences,
    };
  }, [assemblies, interventions, asistencias]);

  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yPosition = 20;

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text('Observatori d\'Assemblees - Registres', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;

      // Filter info
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const filterText = selectedYear === 'all' ? 'Tots els anys' : `Any: ${selectedYear}`;
      doc.text(filterText, 20, yPosition);
      yPosition += 10;

      // Total assemblies
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Total Assemblees: ${attendanceSummary.assemblyCount}`, 20, yPosition);
      yPosition += 10;

      // Total interventions
      doc.text(`Total Intervencions: ${attendanceSummary.totalInterventions}`, 20, yPosition);
      yPosition += 15;

      // Gender distribution
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Distribució per Gènere:', 20, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Homes: ${attendanceSummary.interventionsByGender.man} (${attendanceSummary.percentageByGender.man.toFixed(1)}%)`, 30, yPosition);
      yPosition += 7;
      doc.text(`Dones: ${attendanceSummary.interventionsByGender.woman} (${attendanceSummary.percentageByGender.woman.toFixed(1)}%)`, 30, yPosition);
      yPosition += 7;
      doc.text(`No binàries: ${attendanceSummary.interventionsByGender['non-binary']} (${attendanceSummary.percentageByGender['non-binary'].toFixed(1)}%)`, 30, yPosition);
      yPosition += 15;

      // Intervention types by gender
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Tipus d\'Intervencions per Gènere:', 20, yPosition);
      yPosition += 10;

      const types = [
        { key: 'intervencio', label: 'Intervenció' },
        { key: 'dinamitza', label: 'Dinamitza' },
        { key: 'interrupcio', label: 'Interrupció' },
        { key: 'llarga', label: 'Llarga' },
        { key: 'ofensiva', label: 'Ofensiva' },
        { key: 'explica', label: 'Explica' }
      ];

      genderTotals.forEach((genderData, index) => {
        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${genderData.gender}:`, 25, yPosition);
        yPosition += 7;
        
        doc.setFont('helvetica', 'normal');
        types.forEach(type => {
          doc.text(`  ${type.label}: ${genderData[type.key as keyof typeof genderData]}`, 30, yPosition);
          yPosition += 6;
        });
        yPosition += 5;
      });

      // Save the PDF
      const fileName = `registres_${selectedYear === 'all' ? 'tots' : selectedYear}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF generat",
        description: "El fitxer s'ha descarregat correctament",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "No s'ha pogut generar el PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoadingInterventions || isLoadingAssemblies || isLoadingAsistencias) {
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
        onDownloadPdf={handleDownloadPdf}
      />

      <AveragesSection 
        averageTime={averages.averageTime}
        averageMaleParticipation={averages.averageMaleParticipation}
        averageFemaleParticipation={averages.averageFemaleParticipation}
        averageAttendance={averages.averageAttendance}
        averageAbsences={averages.averageAbsences}
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
              female_count: 10,
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
