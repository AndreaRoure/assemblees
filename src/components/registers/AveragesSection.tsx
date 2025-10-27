import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, UserCheck, UserX } from 'lucide-react';

interface AveragesSectionProps {
  averageTime: string;
  averageAttendance: number;
  averageAbsences: number;
}

const AveragesSection: React.FC<AveragesSectionProps> = ({
  averageTime,
  averageAttendance,
  averageAbsences,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center">
            <Clock className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
            <div className="ml-2 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Temps Mitjà d'Assemblea</p>
              <p className="text-xl md:text-2xl font-bold">{averageTime}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
            <div className="ml-2 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Assistència Mitjana</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl md:text-2xl font-bold">{averageAttendance.toFixed(1)}</p>
                <p className="text-sm md:text-base text-muted-foreground">persones</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex items-center">
            <UserX className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            <div className="ml-2 md:ml-4">
              <p className="text-xs md:text-sm font-medium text-muted-foreground">Faltes Mitjanes</p>
              <div className="flex items-baseline gap-2">
                <p className="text-xl md:text-2xl font-bold">{averageAbsences.toFixed(1)}</p>
                <p className="text-sm md:text-base text-muted-foreground">persones</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AveragesSection;
