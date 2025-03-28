
import React, { ReactNode } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface DownloadPDFProps {
  children: ReactNode;
}

export const DownloadPDF = ({ children }: DownloadPDFProps) => {
  const handleDownload = async () => {
    toast.info('Preparant el PDF, si us plau espera un moment...');
    
    try {
      // Target the entire page content
      const element = document.querySelector('.animate-fade-in');
      if (!element) {
        toast.error('No s\'ha pogut trobar el contingut per descarregar');
        return;
      }
      
      // Create canvas from the element
      const canvas = await html2canvas(element as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // Calculate dimensions for A4 paper
      const imgWidth = 210; // mm (A4 width)
      const pageHeight = 297; // mm (A4 height)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Add title
      pdf.setFontSize(16);
      pdf.text('Informe d\'Assemblees i Intervencions', 105, 15, { align: 'center' });
      pdf.setFontSize(12);
      
      // Add date
      const today = new Date();
      pdf.text(`Generat el: ${today.toLocaleDateString('ca-ES')}`, 105, 25, { align: 'center' });
      
      // Add the image
      let position = 30;
      pdf.addImage(
        canvas.toDataURL('image/png'), 
        'PNG', 
        0, 
        position, 
        imgWidth, 
        imgHeight
      );
      
      // If the image is taller than the page, add new pages
      let heightLeft = imgHeight;
      
      while (heightLeft > pageHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(
          canvas.toDataURL('image/png'),
          'PNG',
          0,
          -position,
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
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
