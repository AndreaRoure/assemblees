
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface GenderDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  interventionsByGender: {
    man: number;
    woman: number;
  };
  percentageByGender: {
    man: number;
    woman: number;
  };
  attendanceByGender: {
    man: number;
    woman: number;
  };
  totalInterventions: number;
}

const GenderDistributionChart = ({ data, interventionsByGender, percentageByGender, attendanceByGender, totalInterventions }: GenderDistributionChartProps) => {
  const genderData = [
    {
      key: 'man',
      label: 'Homes',
      interventions: interventionsByGender.man,
      interventionPercentage: percentageByGender.man,
      attendancePercentage: attendanceByGender.man,
      color: 'bg-blue-500',
      emoji: '👨'
    },
    {
      key: 'woman',
      label: 'Dones',
      interventions: interventionsByGender.woman,
      interventionPercentage: percentageByGender.woman,
      attendancePercentage: attendanceByGender.woman,
      color: 'bg-green-500',
      emoji: '👩'
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold px-2">Distribució per Gènere</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {genderData.map((gender) => (
          <Card key={gender.key} className="overflow-hidden">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{gender.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{gender.label}</h4>
                  <p className="text-2xl font-bold">{gender.interventions}</p>
                  <p className="text-xs text-muted-foreground">intervencions</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Intervencions</span>
                    <span className="font-medium">{gender.interventionPercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={gender.interventionPercentage} className="h-2" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Assistència</span>
                    <span className="font-medium">{gender.attendancePercentage.toFixed(1)}%</span>
                  </div>
                  <Progress value={gender.attendancePercentage} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GenderDistributionChart;
