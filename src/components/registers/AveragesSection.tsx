import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, UserCheck, UserX } from 'lucide-react';

interface AveragesSectionProps {
  averageTime: string;
  averageMaleParticipation: number;
  averageFemaleParticipation: number;
  averageAttendance: number;
  averageAbsences: number;
}

const AveragesSection: React.FC<AveragesSectionProps> = ({
  averageTime,
  averageMaleParticipation,
  averageFemaleParticipation,
  averageAttendance,
  averageAbsences,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Temps Mitjà d'Assemblea
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageTime}</div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-secondary to-secondary/80 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Participació Mitjana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm">Homes:</span>
              <span className="text-lg font-bold">{averageMaleParticipation.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Dones:</span>
              <span className="text-lg font-bold">{averageFemaleParticipation.toFixed(1)}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-accent to-accent/80 border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Assistència Mitjana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageAttendance.toFixed(1)}</div>
          <p className="text-xs mt-1 opacity-80">persones per assemblea</p>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-destructive/80 to-destructive/60 text-destructive-foreground border-0 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <UserX className="h-4 w-4" />
            Faltes Mitjanes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageAbsences.toFixed(1)}</div>
          <p className="text-xs mt-1 opacity-80">persones per assemblea</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AveragesSection;
