
import React, { useState, useEffect } from 'react';
import { Assembly } from '@/types';
import { Card } from '@/components/ui/card';
import { format, isPast, parseISO, differenceInMinutes } from 'date-fns';
import { ca } from 'date-fns/locale';
import { UserCircle2, Pencil, Trash2, Calendar, MessageCircle, Users, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteAssembly } from '@/lib/supabase';
import EditAssemblyDialog from './EditAssemblyDialog';
import { Badge } from '@/components/ui/badge';
import { fetchAssemblyInterventions } from '@/lib/supabase';
import { fetchAssemblyAttendeesCount } from '@/lib/supabase-asistencias';
import { useSwipeable } from 'react-swipeable';

interface AssemblyCardProps {
  assembly: Assembly;
  onClick: () => void;
  onEdited: () => void;
}

const AssemblyCard = ({ assembly, onClick, onEdited }: AssemblyCardProps) => {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [totalInterventions, setTotalInterventions] = useState<number>(0);
  const [attendeesCount, setAttendeesCount] = useState<number>(0);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const isPastAssembly = isPast(parseISO(assembly.date));

  const calculateDuration = () => {
    if (!assembly.start_time || !assembly.end_time) return null;
    
    const start = new Date(assembly.start_time);
    const end = new Date(assembly.end_time);
    const minutes = differenceInMinutes(end, start);
    
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

  useEffect(() => {
    const loadData = async () => {
      try {
        const [interventions, attendees] = await Promise.all([
          fetchAssemblyInterventions(assembly.id),
          fetchAssemblyAttendeesCount(assembly.id)
        ]);
        setTotalInterventions(interventions.length);
        setAttendeesCount(attendees);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [assembly.id]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Estàs segur que vols eliminar aquesta assemblea?')) {
      await deleteAssembly(assembly.id);
      onEdited();
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditDialog(true);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: (e) => {
      e.event.stopPropagation();
      setShowEditDialog(true);
    },
    onSwipedRight: (e) => {
      e.event.stopPropagation();
      onClick();
    },
    onSwiping: (e) => {
      setSwipeOffset(e.deltaX);
    },
    onSwiped: () => {
      setSwipeOffset(0);
    },
    trackMouse: false,
    preventScrollOnSwipe: true,
  });

  return (
    <>
      <div className="relative" {...swipeHandlers}>
        {swipeOffset < -50 && (
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-primary/10 flex items-center justify-center rounded-r-xl">
            <Pencil className="h-5 w-5 text-primary" />
          </div>
        )}
        {swipeOffset > 50 && (
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-blue-500/10 flex items-center justify-center rounded-l-xl">
            <Users className="h-5 w-5 text-blue-600" />
          </div>
        )}
        <Card
          className="group relative p-4 md:p-6 rounded-xl bg-white shadow-sm hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-purple-50/30 transition-all duration-300 ease-in-out transform hover:scale-[1.02] cursor-pointer border border-gray-100/50 hover:border-purple-100"
          onClick={onClick}
          style={{ transform: `translateX(${Math.max(-80, Math.min(80, swipeOffset))}px)` }}
        >
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-xs md:text-sm text-gray-500 font-medium">
                {format(new Date(assembly.date), 'PPP', { locale: ca })}
              </span>
            </div>
            <Badge 
              variant={isPastAssembly ? "default" : "secondary"}
              className={`${isPastAssembly ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
            >
              {isPastAssembly ? 'Realitzada' : 'Pendent'}
            </Badge>
          </div>

          <h3 className="text-base md:text-lg font-semibold text-gray-900 group-hover:bg-clip-text group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-blue-600 transition-colors duration-300">
            {assembly.name}
          </h3>

          {assembly.description && (
            <p className="text-xs md:text-sm text-gray-600 line-clamp-2">
              {assembly.description}
            </p>
          )}

          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{attendeesCount} assistents</span>
            </div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
              <MessageCircle className="h-4 w-4" />
              <span>{totalInterventions} intervencions</span>
            </div>
            {duration && (
              <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>{duration}</span>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 md:gap-0 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
              <UserCircle2 className="h-4 w-4" />
              <span>Registrat per: {assembly.register.name}</span>
            </div>
            <div className="flex gap-2 justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit} 
                className="h-7 w-7 md:h-8 md:w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-purple-100 hover:text-purple-700 transition-all duration-200"
              >
                <Pencil className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDelete} 
                className="h-7 w-7 md:h-8 md:w-8 p-0 opacity-0 group-hover:opacity-100 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
              >
                <Trash2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </Button>
            </div>
          </div>
        </div>
        </Card>
      </div>

      <EditAssemblyDialog
        assembly={assembly}
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onAssemblyEdited={onEdited}
      />
    </>
  );
};

export default AssemblyCard;
