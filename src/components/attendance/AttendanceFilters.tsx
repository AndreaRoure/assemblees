
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AttendanceFiltersProps {
  selectedMonth: string;
  selectedType: string;
  months: Array<{ value: string; label: string; }>;
  onMonthChange: (value: string) => void;
  onTypeChange: (value: string) => void;
}

const AttendanceFilters = ({
  selectedMonth,
  selectedType,
  months,
  onMonthChange,
  onTypeChange,
}: AttendanceFiltersProps) => {
  return (
    <div className="flex flex-col space-y-2">
      <Select
        value={selectedMonth}
        onValueChange={onMonthChange}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Selecciona el mes" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tots els mesos</SelectItem>
          {months.map(month => (
            <SelectItem key={month.value} value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={selectedType}
        onValueChange={onTypeChange}
      >
        <SelectTrigger className="h-9 text-sm">
          <SelectValue placeholder="Tipus d'assemblea" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tots els tipus</SelectItem>
          <SelectItem value="in-person">Presencial</SelectItem>
          <SelectItem value="online">En línia</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default AttendanceFilters;
