
import React from 'react';
import YearSelect from './YearSelect';
import { DownloadPDF } from './DownloadPDF';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

interface FilterToolbarProps {
  selectedYear: string;
  years: number[];
  onYearChange: (year: string) => void;
}

const FilterToolbar = ({ selectedYear, years, onYearChange }: FilterToolbarProps) => {
  return (
    <div className="p-4 md:p-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
      <div className="flex flex-wrap gap-4 justify-between items-center w-full">
        <div>
          <YearSelect 
            value={selectedYear}
            years={years}
            onValueChange={onYearChange}
          />
        </div>
        <div>
          <DownloadPDF>
            <Button variant="outline" className="flex items-center gap-2">
              <FileDown className="h-4 w-4" />
              <span className="hidden sm:inline">Descarregar PDF</span>
            </Button>
          </DownloadPDF>
        </div>
      </div>
    </div>
  );
};

export default FilterToolbar;
