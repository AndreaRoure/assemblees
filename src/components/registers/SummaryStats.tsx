import { Card } from '@/components/ui/card';

interface SummaryStatsProps {
  totalAssemblies: number;
  totalHours: number;
  averageHoursPerAssembly: number;
  averageAttendeesPerAssembly: number;
  averageAttendeesByGender: {
    female: number;
    male: number;
    nonBinary: number;
  };
}

const SummaryStats = ({ 
  totalAssemblies, 
  totalHours, 
  averageHoursPerAssembly,
  averageAttendeesPerAssembly,
  averageAttendeesByGender
}: SummaryStatsProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:shadow-lg transition-all duration-200 animate-fade-in">
          <div className="text-sm font-medium opacity-90 mb-2">
            Total Assemblees
          </div>
          <div className="text-4xl font-bold">
            {totalAssemblies}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-secondary to-secondary/80 hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Total Hores
          </div>
          <div className="text-4xl font-bold">
            {totalHours.toFixed(1)}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-accent to-accent/80 hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Promig Hores/Assemblea
          </div>
          <div className="text-4xl font-bold">
            {averageHoursPerAssembly.toFixed(1)}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-muted to-muted/80 hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="text-sm font-medium text-muted-foreground mb-2">
            Promig Assistents/Assemblea
          </div>
          <div className="text-4xl font-bold">
            {averageAttendeesPerAssembly.toFixed(1)}
          </div>
        </Card>
      </div>

      <Card className="p-6 hover:shadow-lg transition-all duration-200 animate-fade-in" style={{ animationDelay: '400ms' }}>
        <div className="text-sm font-medium text-muted-foreground mb-4">
          Promig Assistents per Gènere
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Dones</span>
            <span className="text-2xl font-bold">{averageAttendeesByGender.female.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">Homes</span>
            <span className="text-2xl font-bold">{averageAttendeesByGender.male.toFixed(1)}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
            <span className="text-sm font-medium">No Binàries</span>
            <span className="text-2xl font-bold">{averageAttendeesByGender.nonBinary.toFixed(1)}</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SummaryStats;
