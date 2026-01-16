import React, { useState, useEffect } from 'react';
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
      <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
        <div className="animate-pulse h-8 w-full bg-muted rounded" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border shadow-sm">
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
      <div className="flex items-center gap-2 flex-1 flex-wrap">
        <div className="flex items-center gap-1.5">
          <Label htmlFor="start-time" className="text-xs text-muted-foreground whitespace-nowrap">
            Inici:
          </Label>
          <Input
            id="start-time"
            type="time"
            value={startTime}
            onChange={handleStartTimeChange}
            onBlur={handleStartTimeBlur}
            className="h-8 w-24 text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5">
          <Label htmlFor="end-time" className="text-xs text-muted-foreground whitespace-nowrap">
            Fi:
          </Label>
          <Input
            id="end-time"
            type="time"
            value={endTime}
            onChange={handleEndTimeChange}
            onBlur={handleEndTimeBlur}
            className="h-8 w-24 text-sm"
          />
        </div>
        {duration && (
          <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded">
            {duration}
          </span>
        )}
      </div>
    </div>
  );
};

export default AssemblyTimeEditor;
