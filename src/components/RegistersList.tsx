
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import GenderChart from './registers/GenderChart';
import FilterToolbar from './registers/FilterToolbar';
import GenderDistributionChart from './registers/GenderDistributionChart';
import YearlyEvolutionChart from './registers/YearlyEvolutionChart';
import SummaryStats from './registers/SummaryStats';
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

  const { data: attendanceData = [] } = useQuery({
    queryKey: ['assembly-attendance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('assembly_attendance')
        .select('*');
      
      if (error) throw error;
      return data || [];
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

  // Calculate hours and attendance statistics
  const summaryStats = useMemo(() => {
    let totalHours = 0;
    let assemblyCountWithHours = 0;
    
    assemblies.forEach(assembly => {
      if (assembly.start_time && assembly.end_time) {
        const start = new Date(assembly.start_time);
        const end = new Date(assembly.end_time);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        totalHours += hours;
        assemblyCountWithHours++;
      }
    });

    const averageHoursPerAssembly = assemblyCountWithHours > 0 
      ? totalHours / assemblyCountWithHours 
      : 0;

    // Calculate attendance statistics
    let totalFemale = 0;
    let totalMale = 0;
    let totalNonBinary = 0;
    let totalAttendees = 0;

    attendanceData.forEach(attendance => {
      totalFemale += attendance.female_count || 0;
      totalMale += attendance.male_count || 0;
      totalNonBinary += attendance.non_binary_count || 0;
    });

    totalAttendees = totalFemale + totalMale + totalNonBinary;
    const averageAttendeesPerAssembly = attendanceData.length > 0 
      ? totalAttendees / attendanceData.length 
      : 0;

    const averageAttendeesByGender = {
      female: attendanceData.length > 0 ? totalFemale / attendanceData.length : 0,
      male: attendanceData.length > 0 ? totalMale / attendanceData.length : 0,
      nonBinary: attendanceData.length > 0 ? totalNonBinary / attendanceData.length : 0,
    };

    return {
      totalHours,
      averageHoursPerAssembly,
      averageAttendeesPerAssembly,
      averageAttendeesByGender,
    };
  }, [assemblies, attendanceData]);

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

      // Total hours
      doc.text(`Total Hores: ${summaryStats.totalHours.toFixed(1)}`, 20, yPosition);
      yPosition += 10;

      // Average hours per assembly
      doc.text(`Promig Hores/Assemblea: ${summaryStats.averageHoursPerAssembly.toFixed(1)}`, 20, yPosition);
      yPosition += 10;

      // Average attendees per assembly
      doc.text(`Promig Assistents/Assemblea: ${summaryStats.averageAttendeesPerAssembly.toFixed(1)}`, 20, yPosition);
      yPosition += 15;

      // Average attendees by gender
      doc.setFontSize(12);
      doc.text('Promig Assistents per Gènere:', 20, yPosition);
      yPosition += 8;
      
      doc.setFont('helvetica', 'normal');
      doc.text(`Dones: ${summaryStats.averageAttendeesByGender.female.toFixed(1)}`, 30, yPosition);
      yPosition += 7;
      doc.text(`Homes: ${summaryStats.averageAttendeesByGender.male.toFixed(1)}`, 30, yPosition);
      yPosition += 7;
      doc.text(`No binàries: ${summaryStats.averageAttendeesByGender.nonBinary.toFixed(1)}`, 30, yPosition);
      yPosition += 15;

      // Total interventions
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
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
        onDownloadPdf={handleDownloadPdf}
      />

      <SummaryStats 
        totalAssemblies={attendanceSummary.assemblyCount}
        totalHours={summaryStats.totalHours}
        averageHoursPerAssembly={summaryStats.averageHoursPerAssembly}
        averageAttendeesPerAssembly={summaryStats.averageAttendeesPerAssembly}
        averageAttendeesByGender={summaryStats.averageAttendeesByGender}
      />

      <GenderDistributionChart
        data={attendanceSummary.pieChartData}
        interventionsByGender={attendanceSummary.interventionsByGender}
        percentageByGender={attendanceSummary.percentageByGender}
        totalInterventions={attendanceSummary.totalInterventions}
      />

      <div className="grid gap-8">
        <div className="transform hover:scale-[1.01] transition-transform duration-200">
          <GenderChart data={genderTotals} />
        </div>

        <YearlyEvolutionChart data={yearlyEvolutionData} />
      </div>
    </div>
  );
};

export default RegistersList;
