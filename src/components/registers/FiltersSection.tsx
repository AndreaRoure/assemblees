
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface FiltersSectionProps {
  selectedYear: string;
  selectedGender: string;
  years: number[];
  onYearChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onDownload: () => void;
}

const FiltersSection = ({
  selectedYear,
  selectedGender,
  years,
  onYearChange,
  onGenderChange,
  onDownload
}: FiltersSectionProps) => {
  return (
    <div className="w-full space-y-2 md:space-y-0 md:flex md:gap-2">
      <div className="w-full md:w-auto md:flex-1">
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Selecciona l'any" />
          </SelectTrigger>
          <SelectContent 
            className="w-[var(--radix-select-trigger-width)] min-w-[160px] z-[100]"
            position="popper"
            sideOffset={4}
            align="start"
          >
            <SelectItem value="all">Tots els anys</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-auto md:flex-1">
        <Select
          value={selectedGender}
          onValueChange={onGenderChange}
        >
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Selecciona el gènere" />
          </SelectTrigger>
          <SelectContent 
            className="w-[var(--radix-select-trigger-width)] min-w-[160px] z-[100]"
            position="popper"
            sideOffset={4}
            align="start"
          >
            <SelectItem value="all">Tots els gèneres</SelectItem>
            <SelectItem value="man">Homes</SelectItem>
            <SelectItem value="woman">Dones</SelectItem>
            <SelectItem value="non-binary">Persones No Binàries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-full md:w-auto md:flex-1">
        <Button
          variant="outline"
          onClick={onDownload}
          className="w-full h-9 text-sm"
        >
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          <span>Descarregar CSV</span>
        </Button>
      </div>
    </div>
  );
};

export default FiltersSection;
