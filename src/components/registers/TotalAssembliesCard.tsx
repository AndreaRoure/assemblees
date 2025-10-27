
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface TotalAssembliesCardProps {
  count: number;
}

const TotalAssembliesCard = ({ count }: TotalAssembliesCardProps) => {
  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
          <div className="ml-2 md:ml-4">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">Assemblees Totals</p>
            <p className="text-xl md:text-2xl font-bold">{count}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TotalAssembliesCard;
