
import React from 'react';
import { Card } from '@/components/ui/card';

interface TotalAssembliesCardProps {
  count: number;
}

const TotalAssembliesCard = ({ count }: TotalAssembliesCardProps) => {
  return (
    <Card className="p-4 hover:shadow-md transition-all bg-primary text-white">
      <h3 className="text-lg font-semibold">Assemblees Totals</h3>
      <p className="text-3xl font-bold">{count}</p>
    </Card>
  );
};

export default TotalAssembliesCard;
