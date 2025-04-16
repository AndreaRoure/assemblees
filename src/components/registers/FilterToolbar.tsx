
import React from 'react';
import YearSelect from './YearSelect';

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
      </div>
    </div>
  );
};

export default FilterToolbar;
