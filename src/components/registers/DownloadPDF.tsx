
import React, { ReactNode } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface DownloadPDFProps {
  children: ReactNode;
}

export const DownloadPDF = ({ children }: DownloadPDFProps) => {
  const handleDownload = async () => {
    toast.info('Preparant el PDF, si us plau espera un moment...');
    
    try {
      const element = document.querySelector('.animate-fade-in');
      if (!element) {
        toast.error('No s\'ha pogut trobar el contingut per descarregar');
        return;
      }
      
      // Improved PDF generation approach
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Informe d\'Assemblees i Intervencions', pageWidth / 2, 15, { align: 'center' });
      pdf.setFontSize(12);
      
      // Add date
      const today = new Date();
      pdf.text(`Generat el: ${today.toLocaleDateString('ca-ES')}`, pageWidth / 2, 25, { align: 'center' });
      
      // Process each chart and table separately for better reliability
      const sections = element.querySelectorAll('.transform');
      let yPosition = 40;
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        try {
          // Create canvas from the section
          const canvas = await html2canvas(section as HTMLElement, {
            scale: 1.5,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          // Calculate dimensions to fit on page
          const imgWidth = pageWidth - 20; // 10mm margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Check if we need a new page
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20;
          }
          
          // Add the image
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 0.95), // Use JPEG with high quality for better compatibility
            'JPEG',
            10, // x position (10mm margin)
            yPosition,
            imgWidth,
            imgHeight
          );
          
          // Update position for next section
          yPosition += imgHeight + 15; // Add 15mm spacing between sections
        } catch (sectionError) {
          console.log(`Error processing section ${i}:`, sectionError);
          // Continue with the next section
        }
      }
      
      // Save the PDF
      pdf.save('informe-assemblees.pdf');
      toast.success('PDF descarregat correctament!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Hi ha hagut un error en generar el PDF');
    }
  };
  
  return (
    <div onClick={handleDownload} className="cursor-pointer">
      {children}
    </div>
  );
};
