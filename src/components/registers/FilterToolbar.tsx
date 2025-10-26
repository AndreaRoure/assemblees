
import React from 'react';
import YearSelect from './YearSelect';

interface FilterToolbarProps {
  selectedYear: string;
  years: number[];
  onYearChange: (year: string) => void;
}

const FilterToolbar = ({ selectedYear, years, onYearChange }: FilterToolbarProps) => {
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
      </div>
    </div>
  );
};

export default FilterToolbar;
