
import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Users } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface AttendanceCounterProps {
  label: string;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

const AttendanceCounter = ({ label, count, onIncrement, onDecrement }: AttendanceCounterProps) => {
  return (
    <Card className="p-4">
      <div className="flex flex-col space-y-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onDecrement}
            disabled={count <= 0}
            className="h-8 w-8 p-0"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-lg font-semibold">{count}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={onIncrement}
            className="h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AttendanceCounter;
