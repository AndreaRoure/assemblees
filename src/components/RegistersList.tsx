
import React, { useMemo, useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import GenderChart from './registers/GenderChart';
import FilterToolbar from './registers/FilterToolbar';
import TotalAssembliesCard from './registers/TotalAssembliesCard';
import GenderDistributionChart from './registers/GenderDistributionChart';
import YearlyEvolutionChart from './registers/YearlyEvolutionChart';
import AveragesSection from './registers/AveragesSection';
import YearSelect from './registers/YearSelect';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useToast } from '@/hooks/use-toast';
import logo from '@/assets/logo.png';

interface YearlyData {
  year: string;
  man: number;
  woman: number;
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
        .select(`
          *,
          socia:socias(genere)
        `);
      if (error) throw error;
      return data;
    }
  });

  const { data: socias = [], isLoading: isLoadingSocias } = useQuery({
    queryKey: ['socias'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('socias')
        .select('id, genere');
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
      woman: { intervencio: 0, dinamitza: 0, interrupcio: 0, llarga: 0, ofensiva: 0, explica: 0, total: 0 }
    };

    interventions.forEach(i => {
      if (totals[i.gender]) {
        totals[i.gender][i.type]++;
        totals[i.gender].total++;
      }
    });

    return Object.entries(totals).map(([gender, counts]) => ({
      gender: gender === 'man' ? 'Homes' : 'Dones',
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
    };
    
    // Calculate percentages
    const totalPercentage = totalInterventions > 0 ? 100 : 0;
    const percentageByGender = {
      man: totalInterventions > 0 ? (interventionsByGender.man / totalInterventions) * 100 : 0,
      woman: totalInterventions > 0 ? (interventionsByGender.woman / totalInterventions) * 100 : 0,
    };
    
    // Calculate attendance percentage by gender
    const totalAssemblies = assemblies.length;
    const attendanceByGender = {
      man: 0,
      woman: 0,
    };
    
    // Count attended assemblies per gender
    const attendedByGender = {
      man: new Set(),
      woman: new Set(),
    };
    
    asistencias.forEach(asistencia => {
      if (asistencia.asistio && asistencia.socia?.genere) {
        const genderKey = asistencia.socia.genere === 'home' ? 'man' : 
                         asistencia.socia.genere === 'dona' ? 'woman' : null;
        if (genderKey) {
          attendedByGender[genderKey].add(asistencia.assembly_id);
        }
      }
    });
    
    // Calculate attendance percentage
    if (totalAssemblies > 0) {
      attendanceByGender.man = (attendedByGender.man.size / totalAssemblies) * 100;
      attendanceByGender.woman = (attendedByGender.woman.size / totalAssemblies) * 100;
    }
    
    // Prepare data for pie chart
    const pieChartData = [
      { name: 'Homes', value: interventionsByGender.man },
      { name: 'Dones', value: interventionsByGender.woman },
    ];
    
    return { 
      assemblyCount: assemblies.length,
      totalInterventions,
      interventionsByGender,
      percentageByGender,
      attendanceByGender,
      pieChartData
    };
  }, [assemblies.length, interventions, asistencias]);

  // Generate data for the yearly evolution chart
  const yearlyEvolutionData = useMemo(() => {
    const yearData: Record<string, YearlyData> = {};
    
    // Initialize years with zero counts
    years.forEach(year => {
      yearData[year] = {
        year: year.toString(),
        man: 0,
        woman: 0,
        total: 0
      };
    });
    
    // Count interventions by year and gender
    interventions.forEach(intervention => {
      const year = new Date(intervention.timestamp).getFullYear();
      if (yearData[year] && (intervention.gender === 'man' || intervention.gender === 'woman')) {
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

  const handleDownloadPdf = async () => {
    try {
      toast({
        title: "Generant PDF...",
        description: "Això pot trigar uns segons",
      });

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header with color
      doc.setFillColor(147, 51, 234); // rgb(147, 51, 234)
      doc.rect(0, 0, pageWidth, 40, 'F');

      // Add logo with mask color effect
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = logo;
      
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => reject(new Error('Failed to load logo'));
      });

      // Create a canvas to apply the purple color to the logo
      const canvas = document.createElement('canvas');
      canvas.width = 100;
      canvas.height = 100;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw logo
        ctx.drawImage(logoImg, 0, 0, 100, 100);
        
        // Apply purple color overlay
        ctx.globalCompositeOperation = 'source-in';
        ctx.fillStyle = 'rgb(147, 51, 234)';
        ctx.fillRect(0, 0, 100, 100);
        
        // Add to PDF
        const coloredLogo = canvas.toDataURL('image/png');
        doc.addImage(coloredLogo, 'PNG', 15, 10, 25, 25);
      }
      
      // Title
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Observatori d\'Assemblees', pageWidth / 2, 25, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Registres d\'Intervencions', pageWidth / 2, 33, { align: 'center' });
      
      yPosition = 50;
      doc.setTextColor(0, 0, 0);

      // Filter info box
      doc.setFillColor(240, 240, 255);
      doc.rect(15, yPosition, pageWidth - 30, 12, 'F');
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const filterText = selectedYear === 'all' ? 'Període: Tots els anys' : `Període: Any ${selectedYear}`;
      doc.text(filterText, 20, yPosition + 8);
      yPosition += 20;

      // Summary section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 51, 234);
      doc.text('Resum Global', 15, yPosition);
      yPosition += 8;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Assemblees: ${attendanceSummary.assemblyCount}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Total Intervencions: ${attendanceSummary.totalInterventions}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Temps mitjà per assemblea: ${averages.averageTime}`, 20, yPosition);
      yPosition += 7;
      doc.text(`Assistència mitjana: ${averages.averageAttendance.toFixed(1)} persones`, 20, yPosition);
      yPosition += 12;

      // Gender distribution section
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 51, 234);
      doc.text('Distribució per Gènere', 15, yPosition);
      yPosition += 8;
      
      // Draw bars for gender distribution
      const barHeight = 20;
      const maxBarWidth = pageWidth - 110;
      const totalInterventions = attendanceSummary.totalInterventions;
      
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('Homes:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(`${attendanceSummary.interventionsByGender.man} (${attendanceSummary.percentageByGender.man.toFixed(1)}%)`, 45, yPosition);
      
      // Male bar
      const maleBarWidth = totalInterventions > 0 ? (attendanceSummary.interventionsByGender.man / totalInterventions) * maxBarWidth : 0;
      doc.setFillColor(59, 130, 246); // blue
      doc.rect(85, yPosition - 5, maleBarWidth, 8, 'F');
      yPosition += 10;
      
      doc.setFont('helvetica', 'bold');
      doc.text('Dones:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      doc.text(`${attendanceSummary.interventionsByGender.woman} (${attendanceSummary.percentageByGender.woman.toFixed(1)}%)`, 45, yPosition);
      
      // Female bar
      const femaleBarWidth = totalInterventions > 0 ? (attendanceSummary.interventionsByGender.woman / totalInterventions) * maxBarWidth : 0;
      doc.setFillColor(236, 72, 153); // pink
      doc.rect(85, yPosition - 5, femaleBarWidth, 8, 'F');
      yPosition += 15;

      // Participation percentages
      doc.setFontSize(11);
      doc.text(`Participació masculina mitjana: ${averages.averageMaleParticipation.toFixed(1)}%`, 20, yPosition);
      yPosition += 7;
      doc.text(`Participació femenina mitjana: ${averages.averageFemaleParticipation.toFixed(1)}%`, 20, yPosition);
      yPosition += 15;

      // Add new page for charts
      doc.addPage();
      yPosition = 20;
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 51, 234);
      doc.text('Gràfics i Estadístiques', 15, yPosition);
      yPosition += 10;

      // Capture gender chart
      const genderChartElement = document.querySelector('[data-chart="gender"]');
      if (genderChartElement) {
        const canvas = await html2canvas(genderChartElement as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        if (yPosition + imgHeight > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Capture yearly evolution chart
      const yearlyChartElement = document.querySelector('[data-chart="yearly"]');
      if (yearlyChartElement && yPosition < pageHeight - 40) {
        if (yPosition + 80 > pageHeight) {
          doc.addPage();
          yPosition = 20;
        }
        
        const canvas = await html2canvas(yearlyChartElement as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff'
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        doc.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      }

      // Add new page for detailed intervention types
      doc.addPage();
      yPosition = 20;
      
      doc.setTextColor(147, 51, 234);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Tipus d\'Intervencions per Gènere', 15, yPosition);
      yPosition += 12;

      const types = [
        { key: 'intervencio', label: 'Intervenció' },
        { key: 'dinamitza', label: 'Dinamitza' },
        { key: 'interrupcio', label: 'Interrupció' },
        { key: 'llarga', label: 'Llarga' },
        { key: 'ofensiva', label: 'Ofensiva' },
        { key: 'explica', label: 'Explica' }
      ];

      doc.setTextColor(0, 0, 0);
      genderTotals.forEach((genderData) => {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFillColor(240, 240, 255);
        doc.rect(15, yPosition - 3, pageWidth - 30, 8, 'F');
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${genderData.gender}:`, 20, yPosition + 3);
        yPosition += 12;
        
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        types.forEach(type => {
          const value = genderData[type.key as keyof typeof genderData];
          doc.text(`${type.label}: ${value}`, 25, yPosition);
          yPosition += 6;
        });
        yPosition += 8;
      });

      // Footer on last page
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(`Generat el ${new Date().toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' })}`, 15, pageHeight - 10);

      // Save the PDF
      const fileName = `registres_${selectedYear === 'all' ? 'tots' : selectedYear}_${new Date().toISOString().split('T')[0]}.pdf`;
      doc.save(fileName);

      toast({
        title: "PDF generat correctament",
        description: "El fitxer s'ha descarregat amb èxit",
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

  if (isLoadingInterventions || isLoadingAssemblies || isLoadingAsistencias || isLoadingSocias) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-primary animate-pulse text-lg">Carregant...</div>
      </div>
    );
  }

  return (
    <div className="space-y-0 pb-20 md:pb-0">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-[hsl(var(--lavender-bg))]/95 backdrop-blur-sm border-b transition-all duration-300 shadow-sm">
        <div className="p-4 space-y-3">
          {/* Title Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">
                Registres
              </h2>
            </div>
          </div>
          
          {/* Filter Toolbar */}
          <div className="flex flex-wrap gap-4 justify-between items-center w-full">
            <div className="md:hidden overflow-x-auto scrollbar-hide w-full">
              <div className="flex gap-2 pb-1">
                <button
                  onClick={() => setSelectedYear('all')}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                    selectedYear === 'all'
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  Tots els anys
                </button>
                {years.map((year) => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year.toString())}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                      selectedYear === year.toString()
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden md:flex gap-4 items-center w-full justify-between">
              <YearSelect 
                value={selectedYear}
                years={years}
                onValueChange={setSelectedYear}
              />
              <Button onClick={handleDownloadPdf} variant="outline" className="gap-2 shrink-0">
                <Download className="h-4 w-4" />
                Descarregar PDF
              </Button>
            </div>

            <div className="md:hidden w-full">
              <Button onClick={handleDownloadPdf} variant="outline" className="w-full gap-2">
                <Download className="h-4 w-4" />
                Descarregar PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 animate-fade-in p-6">
      <TotalAssembliesCard count={attendanceSummary.assemblyCount} />

      <AveragesSection 
        averageTime={averages.averageTime}
        averageAttendance={averages.averageAttendance}
        averageAbsences={averages.averageAbsences}
      />

      <GenderDistributionChart 
        data={attendanceSummary.pieChartData}
        interventionsByGender={attendanceSummary.interventionsByGender}
        percentageByGender={attendanceSummary.percentageByGender}
        attendanceByGender={attendanceSummary.attendanceByGender}
        totalInterventions={attendanceSummary.totalInterventions}
      />

      <div className="grid gap-8">
        <div className="transform hover:scale-[1.01] transition-transform duration-200" data-chart="gender">
          <GenderChart data={genderTotals} />
        </div>

        <div data-chart="yearly">
          <YearlyEvolutionChart data={yearlyEvolutionData} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default RegistersList;
