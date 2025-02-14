
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
    <div className="flex flex-col space-y-4 p-2 w-full max-w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex flex-col min-[480px]:flex-row gap-3">
        <div className="flex-1 min-w-[200px]">
          <Select
            value={selectedYear}
            onValueChange={onYearChange}
          >
            <SelectTrigger className="w-full h-11 md:h-10 text-sm">
              <SelectValue placeholder="Selecciona l'any" />
            </SelectTrigger>
            <SelectContent 
              className="w-[var(--radix-select-trigger-width)] min-w-[200px] z-[100]"
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

        <div className="flex-1 min-w-[200px]">
          <Select
            value={selectedGender}
            onValueChange={onGenderChange}
          >
            <SelectTrigger className="w-full h-11 md:h-10 text-sm">
              <SelectValue placeholder="Selecciona el gènere" />
            </SelectTrigger>
            <SelectContent 
              className="w-[var(--radix-select-trigger-width)] min-w-[200px] z-[100]"
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
      </div>

      <div className="w-full">
        <Button
          variant="outline"
          onClick={onDownload}
          className="w-full h-11 md:h-10 text-sm min-[480px]:w-auto"
        >
          <Download className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="whitespace-nowrap">Descarregar CSV</span>
        </Button>
      </div>
    </div>
  );
};

export default FiltersSection;
