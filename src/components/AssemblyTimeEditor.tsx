import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { format, differenceInMinutes } from 'date-fns';

interface AssemblyTimeEditorProps {
  assemblyId: string;
}

const AssemblyTimeEditor: React.FC<AssemblyTimeEditorProps> = ({ assemblyId }) => {
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [assemblyDate, setAssemblyDate] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssemblyTimes = async () => {
      try {
        const { data, error } = await supabase
          .from('assemblies')
          .select('start_time, end_time, date')
          .eq('id', assemblyId)
          .single();

        if (error) throw error;

        if (data) {
          setAssemblyDate(data.date);
          if (data.start_time) {
            setStartTime(format(new Date(data.start_time), 'HH:mm'));
          }
          if (data.end_time) {
            setEndTime(format(new Date(data.end_time), 'HH:mm'));
          }
        }
      } catch (error) {
        console.error('Error fetching assembly times:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssemblyTimes();
  }, [assemblyId]);

  const updateTime = async (field: 'start_time' | 'end_time', timeValue: string) => {
    if (!timeValue || !assemblyDate) return;

    try {
      // Combine assembly date with the time
      const dateTimeString = `${assemblyDate}T${timeValue}:00`;
      const dateTime = new Date(dateTimeString).toISOString();

      const { error } = await supabase
        .from('assemblies')
        .update({ [field]: dateTime })
        .eq('id', assemblyId);

      if (error) throw error;

      toast({
        title: 'Hora actualitzada',
        description: field === 'start_time' ? 'Hora de començament guardada' : 'Hora de finalització guardada',
      });
    } catch (error) {
      console.error('Error updating time:', error);
      toast({
        title: 'Error',
        description: 'No s\'ha pogut actualitzar l\'hora',
        variant: 'destructive',
      });
    }
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
  };

  const handleStartTimeBlur = () => {
    if (startTime) {
      updateTime('start_time', startTime);
    }
  };

  const handleEndTimeBlur = () => {
    if (endTime) {
      updateTime('end_time', endTime);
    }
  };

  const calculateDuration = () => {
    if (!startTime || !endTime || !assemblyDate) return null;

    const start = new Date(`${assemblyDate}T${startTime}:00`);
    const end = new Date(`${assemblyDate}T${endTime}:00`);
    const minutes = differenceInMinutes(end, start);

    if (minutes <= 0) return null;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}h ${mins}m`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return `${mins}m`;
    }
  };

  const duration = calculateDuration();

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="animate-pulse h-16 bg-muted rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-medium flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Horari de l'assemblea
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start-time" className="text-sm text-muted-foreground">
              Hora de començament
            </Label>
            <Input
              id="start-time"
              type="time"
              value={startTime}
              onChange={handleStartTimeChange}
              onBlur={handleStartTimeBlur}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end-time" className="text-sm text-muted-foreground">
              Hora de finalització
            </Label>
            <Input
              id="end-time"
              type="time"
              value={endTime}
              onChange={handleEndTimeChange}
              onBlur={handleEndTimeBlur}
              className="w-full"
            />
          </div>
        </div>
        {duration && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <Clock className="h-4 w-4" />
            <span>Duració total: <span className="font-medium text-foreground">{duration}</span></span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssemblyTimeEditor;
