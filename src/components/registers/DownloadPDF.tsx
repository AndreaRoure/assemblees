
import React, { ReactNode } from 'react';
import jsPDF from 'jspdf';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';

interface DownloadPDFProps {
  children: ReactNode;
  selectedYear?: string;
}

export const DownloadPDF = ({ children, selectedYear = 'all' }: DownloadPDFProps) => {
  const handleDownload = async () => {
    toast.info('Preparant el PDF, si us plau espera un moment...');
    
    try {
      // Target the main content container that holds all charts and tables
      const element = document.querySelector('.animate-fade-in');
      if (!element) {
        toast.error('No s\'ha pogut trobar el contingut per descarregar');
        return;
      }
      
      // Improved PDF generation approach
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Add title with filter information
      pdf.setFontSize(16);
      pdf.text('Informe d\'Assemblees i Intervencions', pageWidth / 2, 15, { align: 'center' });
      
      // Add filter information
      pdf.setFontSize(12);
      const filterText = selectedYear === 'all' ? 'Tots els anys' : `Any: ${selectedYear}`;
      pdf.text(`Filtre: ${filterText}`, pageWidth / 2, 25, { align: 'center' });
      
      // Add date
      const today = new Date();
      pdf.text(`Generat el: ${today.toLocaleDateString('ca-ES')}`, pageWidth / 2, 35, { align: 'center' });
      
      // Process each chart and table separately for better reliability
      const sections = element.querySelectorAll('.transform');
      let yPosition = 45;
      
      // If no sections found, check for other content-bearing elements
      if (!sections || sections.length === 0) {
        toast.error('No s\'ha trobat contingut per generar el PDF');
        return;
      }
      
      console.log(`Found ${sections.length} sections to process`);
      
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        try {
          console.log(`Processing section ${i + 1}/${sections.length}`);
          
          // Create canvas from the section
          const canvas = await html2canvas(section as HTMLElement, {
            scale: 1.5, // Higher scale for better quality
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false, // Disable logging for cleaner console
            onclone: (clonedDoc) => {
              // Make sure any hidden elements are visible in the clone
              const clonedElement = clonedDoc.querySelector('.animate-fade-in');
              if (clonedElement) {
                clonedElement.classList.add('opacity-100');
              }
            }
          });
          
          // Calculate dimensions to fit on page
          const imgWidth = pageWidth - 20; // 10mm margin on each side
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          // Check if we need a new page
          if (yPosition + imgHeight > pageHeight - 20) {
            pdf.addPage();
            yPosition = 20; // Reset position for new page
          }
          
          // Add the image
          pdf.addImage(
            canvas.toDataURL('image/jpeg', 0.95), // Use JPEG with high quality
            'JPEG',
            10, // x position (10mm margin)
            yPosition,
            imgWidth,
            imgHeight
          );
          
          // Update position for next section
          yPosition += imgHeight + 15; // Add 15mm spacing between sections
          
          console.log(`Section ${i + 1} processed successfully`);
        } catch (sectionError) {
          console.error(`Error processing section ${i + 1}:`, sectionError);
          // Continue with the next section
        }
      }
      
      // Save the PDF with year in filename if filtered
      const filename = selectedYear === 'all' 
        ? 'informe-assemblees.pdf' 
        : `informe-assemblees-${selectedYear}.pdf`;
        
      pdf.save(filename);
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
