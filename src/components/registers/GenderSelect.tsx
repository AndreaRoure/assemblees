
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface GenderSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

const GenderSelect = ({ value, onValueChange }: GenderSelectProps) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[160px]">
        <SelectValue placeholder="Selecciona el gènere" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Tots els gèneres</SelectItem>
        <SelectItem value="man">Homes</SelectItem>
        <SelectItem value="woman">Dones</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default GenderSelect;
