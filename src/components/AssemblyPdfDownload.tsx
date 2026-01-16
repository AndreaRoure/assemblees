import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import { useToast } from '@/hooks/use-toast';
import observatoriLogo from '@/assets/observatori-logo.png';
import { fetchAssemblies } from '@/lib/supabase';
import { fetchAssemblyAsistencias, AsistenciaWithSocia } from '@/lib/supabase-asistencias';
import { AssemblyStats } from '@/types';

interface AssemblyPdfDownloadProps {
  assemblyId: string;
  stats: AssemblyStats | null | undefined;
}

const AssemblyPdfDownload = ({ assemblyId, stats }: AssemblyPdfDownloadProps) => {
  const { toast } = useToast();

  const { data: assemblies = [] } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies,
  });

  const { data: asistencias = [] } = useQuery({
    queryKey: ['asistencias', assemblyId],
    queryFn: () => fetchAssemblyAsistencias(assemblyId),
  });

  const currentAssembly = assemblies.find(a => a.id === assemblyId);

  const handleDownloadPdf = async () => {
    if (!currentAssembly) {
      toast({
        title: "Error",
        description: "No s'ha trobat l'assemblea",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Generant PDF...",
      description: "Això pot trigar uns segons",
    });

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let yPosition = 45;

    // Header with color
    doc.setFillColor(147, 51, 234);
    doc.rect(0, 0, pageWidth, 25, 'F');

    // Add logo in white color for the purple header
    try {
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      
      await new Promise<void>((resolve, reject) => {
        logoImg.onload = () => resolve();
        logoImg.onerror = () => reject();
        logoImg.src = observatoriLogo;
      });

      const canvas = document.createElement('canvas');
      const targetWidth = 100;
      const targetHeight = 100;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Draw the logo
        ctx.drawImage(logoImg, 0, 0, targetWidth, targetHeight);
        
        const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
        const data = imageData.data;
        
        // Apply white color to non-transparent pixels
        for (let i = 0; i < data.length; i += 4) {
          if (data[i + 3] > 50) { // If pixel is not transparent
            data[i] = 255;     // R - white
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
          }
        }
        
        ctx.putImageData(imageData, 0, 0);
        const coloredLogo = canvas.toDataURL('image/png');
        doc.addImage(coloredLogo, 'PNG', 12, 4, 16, 16);
      }
    } catch (error) {
      console.error('Error loading logo:', error);
    }

    // Title - Observatori d'Assemblees
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text("Observatori d'Assemblees", pageWidth / 2, 15, { align: 'center' });

    // Assembly info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(currentAssembly.name, 15, yPosition);
    yPosition += 8;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Data: ${currentAssembly.date}`, 15, yPosition);
    yPosition += 6;

    if (currentAssembly.description) {
      doc.text(`Descripció: ${currentAssembly.description}`, 15, yPosition);
      yPosition += 6;
    }

    // Calculate attendance by gender
    const attendanceCounts = { dona: 0, home: 0 };
    const attendeesList: { nom: string; cognoms: string; genere: string }[] = [];
    
    asistencias.forEach((asistencia) => {
      if (asistencia.asistio && asistencia.socia) {
        if (asistencia.socia.genere === 'dona') {
          attendanceCounts.dona++;
        } else if (asistencia.socia.genere === 'home') {
          attendanceCounts.home++;
        }
        attendeesList.push({
          nom: asistencia.socia.nom,
          cognoms: asistencia.socia.cognoms,
          genere: asistencia.socia.genere,
        });
      }
    });

    const totalAttendees = attendanceCounts.dona + attendanceCounts.home;

    // Moderator and Secretary info
    const moderator = asistencias.find(a => a.socia_id === currentAssembly.moderador_id)?.socia;
    const secretary = asistencias.find(a => a.socia_id === currentAssembly.secretari_id)?.socia;

    if (moderator) {
      doc.text(`Moderador/a: ${moderator.nom} ${moderator.cognoms}`, 15, yPosition);
      yPosition += 6;
    }
    if (secretary) {
      doc.text(`Secretari/ària: ${secretary.nom} ${secretary.cognoms}`, 15, yPosition);
      yPosition += 6;
    }

    yPosition += 8;

    // Attendance by gender section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(147, 51, 234);
    doc.text('Assistència per Gènere', 15, yPosition);
    yPosition += 8;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total assistents: ${totalAttendees}`, 20, yPosition);
    yPosition += 7;

    // Draw bars for attendance
    const barHeight = 8;
    const maxBarWidth = pageWidth - 110;

    doc.setFont('helvetica', 'bold');
    doc.text('Dones:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    const femalePercent = totalAttendees > 0 ? ((attendanceCounts.dona / totalAttendees) * 100).toFixed(1) : '0';
    doc.text(`${attendanceCounts.dona} (${femalePercent}%)`, 45, yPosition);
    
    const femaleBarWidth = totalAttendees > 0 ? (attendanceCounts.dona / totalAttendees) * maxBarWidth : 0;
    doc.setFillColor(236, 72, 153); // pink
    doc.rect(85, yPosition - 5, femaleBarWidth, barHeight, 'F');
    yPosition += 12;

    doc.setFont('helvetica', 'bold');
    doc.text('Homes:', 20, yPosition);
    doc.setFont('helvetica', 'normal');
    const malePercent = totalAttendees > 0 ? ((attendanceCounts.home / totalAttendees) * 100).toFixed(1) : '0';
    doc.text(`${attendanceCounts.home} (${malePercent}%)`, 45, yPosition);
    
    const maleBarWidth = totalAttendees > 0 ? (attendanceCounts.home / totalAttendees) * maxBarWidth : 0;
    doc.setFillColor(59, 130, 246); // blue
    doc.rect(85, yPosition - 5, maleBarWidth, barHeight, 'F');
    yPosition += 15;

    // Intervention stats section
    if (stats && stats.totalInterventions > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 51, 234);
      doc.text('Intervencions per Gènere', 15, yPosition);
      yPosition += 8;

      const getTotalInterventions = (gender: 'man' | 'woman') => {
        const genderStats = stats.byGender[gender];
        return Object.values(genderStats).reduce((sum, count) => sum + count, 0);
      };

      const menInterventions = getTotalInterventions('man');
      const womenInterventions = getTotalInterventions('woman');
      const totalInterventions = menInterventions + womenInterventions;

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.text(`Total intervencions: ${totalInterventions}`, 20, yPosition);
      yPosition += 7;

      // Interventions by gender bars
      doc.setFont('helvetica', 'bold');
      doc.text('Dones:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      const womenPercent = totalInterventions > 0 ? ((womenInterventions / totalInterventions) * 100).toFixed(1) : '0';
      doc.text(`${womenInterventions} (${womenPercent}%)`, 45, yPosition);
      
      const womenIntBarWidth = totalInterventions > 0 ? (womenInterventions / totalInterventions) * maxBarWidth : 0;
      doc.setFillColor(236, 72, 153);
      doc.rect(85, yPosition - 5, womenIntBarWidth, barHeight, 'F');
      yPosition += 12;

      doc.setFont('helvetica', 'bold');
      doc.text('Homes:', 20, yPosition);
      doc.setFont('helvetica', 'normal');
      const menPercent = totalInterventions > 0 ? ((menInterventions / totalInterventions) * 100).toFixed(1) : '0';
      doc.text(`${menInterventions} (${menPercent}%)`, 45, yPosition);
      
      const menIntBarWidth = totalInterventions > 0 ? (menInterventions / totalInterventions) * maxBarWidth : 0;
      doc.setFillColor(59, 130, 246);
      doc.rect(85, yPosition - 5, menIntBarWidth, barHeight, 'F');
      yPosition += 15;

      // Intervention per attendee stats
      if (totalAttendees > 0) {
        const womenIntPerAttendee = attendanceCounts.dona > 0 ? (womenInterventions / attendanceCounts.dona).toFixed(1) : '0';
        const menIntPerAttendee = attendanceCounts.home > 0 ? (menInterventions / attendanceCounts.home).toFixed(1) : '0';
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(147, 51, 234);
        doc.text('Intervencions per Assistent', 15, yPosition);
        yPosition += 8;

        doc.setTextColor(0, 0, 0);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Mitjana dones: ${womenIntPerAttendee} intervencions/persona`, 20, yPosition);
        yPosition += 7;
        doc.text(`Mitjana homes: ${menIntPerAttendee} intervencions/persona`, 20, yPosition);
        yPosition += 7;
        doc.text(`Mitjana global: ${(totalInterventions / totalAttendees).toFixed(1)} intervencions/persona`, 20, yPosition);
        yPosition += 15;
      }

      // Intervention types breakdown
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 51, 234);
      doc.text('Desglossament per Tipus', 15, yPosition);
      yPosition += 10;

      const typeLabels: Record<string, string> = {
        intervencio: 'Intervenció curta',
        dinamitza: 'Dinamitza',
        interrupcio: 'Interrupció',
        llarga: 'Intervenció llarga',
        ofensiva: 'Ofensiva',
        explica: 'Explica',
      };

      // Table header
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(147, 51, 234);
      doc.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
      doc.text('Tipus', 20, yPosition);
      doc.text('Dones', 90, yPosition);
      doc.text('Homes', 120, yPosition);
      doc.text('Total', 150, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      const types = ['intervencio', 'dinamitza', 'interrupcio', 'llarga', 'ofensiva', 'explica'] as const;
      
      types.forEach((type, index) => {
        const womenCount = stats.byGender.woman[type];
        const menCount = stats.byGender.man[type];
        const total = womenCount + menCount;

        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(15, yPosition - 5, pageWidth - 30, 7, 'F');
        }

        doc.text(typeLabels[type], 20, yPosition);
        doc.text(womenCount.toString(), 90, yPosition);
        doc.text(menCount.toString(), 120, yPosition);
        doc.text(total.toString(), 150, yPosition);
        yPosition += 7;
      });

      yPosition += 8;
    }

    // Attendees list section (new page if needed)
    if (attendeesList.length > 0) {
      if (yPosition > 200) {
        doc.addPage();
        yPosition = 30;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(147, 51, 234);
      doc.text('Llistat d\'Assistència', 15, yPosition);
      yPosition += 10;

      // Sort attendees by surname
      const sortedAttendees = [...attendeesList].sort((a, b) => 
        a.cognoms.localeCompare(b.cognoms)
      );

      // Table header
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.setFillColor(147, 51, 234);
      doc.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
      doc.text('Nom', 20, yPosition);
      doc.text('Cognoms', 70, yPosition);
      doc.text('Gènere', 150, yPosition);
      yPosition += 8;

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);

      sortedAttendees.forEach((attendee, index) => {
        // Check if we need a new page
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 30;
          
          // Repeat header on new page
          doc.setFontSize(10);
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(255, 255, 255);
          doc.setFillColor(147, 51, 234);
          doc.rect(15, yPosition - 5, pageWidth - 30, 8, 'F');
          doc.text('Nom', 20, yPosition);
          doc.text('Cognoms', 70, yPosition);
          doc.text('Gènere', 150, yPosition);
          yPosition += 8;
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(0, 0, 0);
        }

        if (index % 2 === 0) {
          doc.setFillColor(245, 245, 245);
          doc.rect(15, yPosition - 5, pageWidth - 30, 7, 'F');
        }

        doc.text(attendee.nom, 20, yPosition);
        doc.text(attendee.cognoms, 70, yPosition);
        doc.text(attendee.genere === 'dona' ? 'Dona' : 'Home', 150, yPosition);
        yPosition += 7;
      });
    }

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generat el ${new Date().toLocaleDateString('ca-ES')} - Pàgina ${i} de ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    // Save
    const fileName = `assemblea_${currentAssembly.name.replace(/\s+/g, '_')}_${currentAssembly.date}.pdf`;
    doc.save(fileName);

    toast({
      title: "PDF descarregat",
      description: `S'ha generat ${fileName}`,
    });
  };

  return (
    <Button onClick={handleDownloadPdf} variant="outline" size="sm" className="gap-2">
      <Download className="h-4 w-4" />
      <span className="hidden sm:inline">Descarregar PDF</span>
    </Button>
  );
};

export default AssemblyPdfDownload;
