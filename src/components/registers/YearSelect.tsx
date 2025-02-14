
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface YearSelectProps {
  value: string;
  years: number[];
  onValueChange: (value: string) => void;
}

const YearSelect = ({ value, years, onValueChange }: YearSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[160px]">
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
  );
};

export default YearSelect;
