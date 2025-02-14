
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
    <div className="flex flex-col gap-3 w-full max-w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Select
          value={selectedYear}
          onValueChange={onYearChange}
        >
          <SelectTrigger className="h-11 md:h-10 text-sm max-w-full truncate">
            <SelectValue placeholder="Selecciona l'any" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tots els anys</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={selectedGender}
          onValueChange={onGenderChange}
        >
          <SelectTrigger className="h-11 md:h-10 text-sm max-w-full truncate">
            <SelectValue placeholder="Selecciona el gènere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tots els gèneres</SelectItem>
            <SelectItem value="man">Homes</SelectItem>
            <SelectItem value="woman">Dones</SelectItem>
            <SelectItem value="non-binary">Persones No Binàries</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end w-full">
        <Button
          variant="outline"
          onClick={onDownload}
          className="h-11 md:h-10 text-sm w-full sm:w-auto"
        >
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="whitespace-nowrap">Descarregar CSV</span>
        </Button>
      </div>
    </div>
  );
};

export default FiltersSection;
