
import React from 'react';
import YearSelect from './YearSelect';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface FilterToolbarProps {
  selectedYear: string;
  years: number[];
  onYearChange: (year: string) => void;
  onDownloadPdf: () => void;
}

const FilterToolbar = ({ selectedYear, years, onYearChange, onDownloadPdf }: FilterToolbarProps) => {
  return (
    <div className="p-3 md:p-6 rounded-lg bg-gradient-to-r from-purple-50 to-blue-50 shadow-sm">
      {/* Mobile: horizontal scrollable chips */}
      <div className="md:hidden overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-1">
          <button
            onClick={() => onYearChange('all')}
            className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
              selectedYear === 'all'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Tots els anys
          </button>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => onYearChange(year.toString())}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all ${
                selectedYear === year.toString()
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop: original select */}
      <div className="hidden md:flex flex-wrap gap-4 justify-between items-center w-full">
        <div>
          <YearSelect 
            value={selectedYear}
            years={years}
            onValueChange={onYearChange}
          />
        </div>
        <Button onClick={onDownloadPdf} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Descarregar PDF
        </Button>
      </div>

      {/* Mobile: download button */}
      <div className="md:hidden mt-3">
        <Button onClick={onDownloadPdf} variant="outline" className="w-full gap-2">
          <Download className="h-4 w-4" />
          Descarregar PDF
        </Button>
      </div>
    </div>
  );
};

export default FilterToolbar;
