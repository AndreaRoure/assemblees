
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
    <div className="flex flex-col space-y-3 w-full max-w-full">
      <div className="flex flex-col min-[480px]:flex-row gap-2">
        <div className="flex-1 min-w-[160px]">
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

        <div className="flex-1 min-w-[160px]">
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

        <div className="flex-1 min-w-[160px]">
          <Select
            value="download"
            onValueChange={() => onDownload()}
          >
            <SelectTrigger className="w-full h-9 text-sm">
              <Download className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="whitespace-nowrap">Descarregar CSV</span>
            </SelectTrigger>
            <SelectContent 
              className="w-[var(--radix-select-trigger-width)] min-w-[160px] z-[100]"
              position="popper"
              sideOffset={4}
              align="start"
            >
              <SelectItem value="download">Descarregar CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default FiltersSection;
