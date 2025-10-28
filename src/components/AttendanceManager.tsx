import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, UserCheck, X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { fetchSocias } from '@/lib/supabase-socias';
import { 
  fetchAssemblyAsistencias, 
  upsertAsistencia, 
  deleteAsistencia,
  AsistenciaWithSocia 
} from '@/lib/supabase-asistencias';
import { 
  updateAssemblyModerator, 
  updateAssemblySecretary,
  fetchAssemblies
} from '@/lib/supabase';
import { toast } from 'sonner';
import { Socia } from '@/types/socias';

interface AttendanceManagerProps {
  assemblyId: string;
}

const AttendanceManager = ({ assemblyId }: AttendanceManagerProps) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isListOpen, setIsListOpen] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  const { data: socias = [] } = useQuery({
    queryKey: ['socias'],
    queryFn: fetchSocias,
  });

  const { data: asistencias = [], refetch: refetchAsistencias } = useQuery({
    queryKey: ['asistencias', assemblyId],
    queryFn: () => fetchAssemblyAsistencias(assemblyId),
  });

  const { data: assemblies = [] } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies,
  });

  const currentAssembly = assemblies.find(a => a.id === assemblyId);

  // Calculate gender counts from actual attendees
  const genderCounts = React.useMemo(() => {
    const counts = { dona: 0, home: 0 };
    asistencias.forEach((asistencia) => {
      if (asistencia.asistio && asistencia.socia) {
        if (asistencia.socia.genere === 'dona' || asistencia.socia.genere === 'home') {
          counts[asistencia.socia.genere]++;
        }
      }
    });
    return counts;
  }, [asistencias]);

  // Get IDs of socias already added to this assembly (both present and absent)
  const addedSociaIds = React.useMemo(() => 
    new Set(asistencias.map(a => a.socia_id)),
    [asistencias]
  );

  // Separate attendees by status
  const presentAttendees = React.useMemo(() => 
    asistencias.filter(a => a.asistio === true),
    [asistencias]
  );

  const absentAttendees = React.useMemo(() => 
    asistencias.filter(a => a.asistio === false),
    [asistencias]
  );

  // Filter available socias (not yet added) with search
  const availableSocias = React.useMemo(() => {
    return socias.filter(s => {
      if (addedSociaIds.has(s.id)) return false;
      
      const matchesSearch = searchQuery === '' || 
        `${s.nom} ${s.cognoms}`.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    });
  }, [socias, addedSociaIds, searchQuery]);

  const handleAddSocia = async (sociaId: string) => {
    try {
      await upsertAsistencia(sociaId, assemblyId, true);
      await refetchAsistencias();
      queryClient.invalidateQueries({ queryKey: ['sociasWithStats'] });
      queryClient.invalidateQueries({ queryKey: ['socias'] });
      setIsModalOpen(false);
      setSearchQuery('');
      toast.success('Sòcia afegida');
    } catch (error) {
      console.error('Error adding socia:', error);
      toast.error('Error afegint sòcia');
    }
  };


  const handleRemoveSocia = async (sociaId: string) => {
    try {
      // Instead of deleting, mark as absent (asistio = false)
      await upsertAsistencia(sociaId, assemblyId, false);
      await refetchAsistencias();
      queryClient.invalidateQueries({ queryKey: ['sociasWithStats'] });
      queryClient.invalidateQueries({ queryKey: ['socias'] });
      toast.success('Marcada com a falta');
    } catch (error) {
      console.error('Error marking absence:', error);
      toast.error('Error marcant falta');
    }
  };

  const handleToggleAttendance = async (sociaId: string, currentStatus: boolean) => {
    try {
      // Toggle between present and absent
      await upsertAsistencia(sociaId, assemblyId, !currentStatus);
      await refetchAsistencias();
      queryClient.invalidateQueries({ queryKey: ['sociasWithStats'] });
      queryClient.invalidateQueries({ queryKey: ['socias'] });
      toast.success(!currentStatus ? 'Marcada com a present' : 'Marcada com a falta');
    } catch (error) {
      console.error('Error toggling attendance:', error);
      toast.error('Error canviant estat');
    }
  };

  const handleDeleteAttendance = async (sociaId: string) => {
    try {
      // Completely remove the attendance record
      await deleteAsistencia(sociaId, assemblyId);
      await refetchAsistencias();
      queryClient.invalidateQueries({ queryKey: ['sociasWithStats'] });
      queryClient.invalidateQueries({ queryKey: ['socias'] });
      toast.success('Eliminada de la llista');
    } catch (error) {
      console.error('Error deleting attendance:', error);
      toast.error('Error eliminant');
    }
  };

  const handleSetModerator = async (sociaId: string) => {
    try {
      const newModeratorId = currentAssembly?.moderador_id === sociaId ? null : sociaId;
      await updateAssemblyModerator(assemblyId, newModeratorId);
      queryClient.invalidateQueries({ queryKey: ['assemblies'] });
      toast.success(newModeratorId ? 'Moderador/a assignat/da' : 'Moderador/a desassignat/da');
    } catch (error) {
      console.error('Error setting moderator:', error);
      toast.error('Error assignant moderador/a');
    }
  };

  const handleSetSecretary = async (sociaId: string) => {
    try {
      const newSecretaryId = currentAssembly?.secretari_id === sociaId ? null : sociaId;
      await updateAssemblySecretary(assemblyId, newSecretaryId);
      queryClient.invalidateQueries({ queryKey: ['assemblies'] });
      toast.success(newSecretaryId ? 'Secretari/ària assignat/da' : 'Secretari/ària desassignat/da');
    } catch (error) {
      console.error('Error setting secretary:', error);
      toast.error('Error assignant secretari/ària');
    }
  };

  return (
    <div className="space-y-4">
      {/* Compact gender counters with Add button */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Assistents:</span>
              </div>
              <Badge variant="secondary" className="gap-1">
                <span className="text-xs">Dones:</span> {genderCounts.dona}
              </Badge>
              <Badge variant="secondary" className="gap-1">
                <span className="text-xs">Homes:</span> {genderCounts.home}
              </Badge>
            </div>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <UserCheck className="h-4 w-4" />
                  Afegir Sòcia
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Afegir assistent</DialogTitle>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  {/* Search input */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar o afegir nom"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>


                  {/* Available socias list */}
                  <div className="max-h-[400px] overflow-y-auto border rounded-md">
                    {availableSocias.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No hi ha sòcies disponibles
                      </p>
                    ) : (
                      <div className="divide-y">
                        {availableSocias.map((socia) => (
                          <div
                            key={socia.id}
                            className="flex items-center justify-between p-3 hover:bg-accent cursor-pointer transition-colors"
                            onClick={() => handleAddSocia(socia.id)}
                          >
                            <div>
                              <p className="font-medium">
                                {socia.nom} {socia.cognoms}
                              </p>
                              <p className="text-xs text-muted-foreground capitalize">
                                {socia.genere}
                              </p>
                            </div>
                            <Button size="sm" variant="ghost">
                              Afegir
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Collapsible Attendance list */}
      <Card>
        <Collapsible open={isListOpen} onOpenChange={setIsListOpen}>
          <CardHeader className="pb-3">
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-70 transition-opacity">
              <CardTitle className="text-lg flex items-center gap-2">
                Llistat d'Assistència
                <Badge variant="secondary">{asistencias.length}</Badge>
              </CardTitle>
              {isListOpen ? (
                <ChevronUp className="h-5 w-5" />
              ) : (
                <ChevronDown className="h-5 w-5" />
              )}
            </CollapsibleTrigger>
          </CardHeader>
          
          <CollapsibleContent>
            <CardContent>
              <div className="space-y-4">
                {/* Present attendees section */}
                {presentAttendees.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-green-600 flex items-center gap-2">
                      <UserCheck className="h-4 w-4" />
                      Presents ({presentAttendees.length})
                    </h3>
                    {presentAttendees.map((asistencia) => {
                      const socia = asistencia.socia;
                      const isModerator = currentAssembly?.moderador_id === socia.id;
                      const isSecretary = currentAssembly?.secretari_id === socia.id;

                      return (
                        <div
                          key={asistencia.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {socia.nom} {socia.cognoms}
                            </p>
                            <div className="flex gap-2 mt-1">
                              {isModerator && (
                                <Badge variant="outline" className="text-xs">
                                  Modera
                                </Badge>
                              )}
                              {isSecretary && (
                                <Badge variant="outline" className="text-xs">
                                  Acta
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant={isModerator ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSetModerator(socia.id)}
                              title="Assignar com a moderador/a"
                            >
                              Modera
                            </Button>
                            <Button
                              variant={isSecretary ? "default" : "outline"}
                              size="sm"
                              onClick={() => handleSetSecretary(socia.id)}
                              title="Assignar com a secretari/ària"
                            >
                              Acta
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAttendance(socia.id, true)}
                              title="Marcar com a falta"
                              className="text-amber-600 hover:text-amber-700"
                            >
                              Falta
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAttendance(socia.id)}
                              className="text-destructive hover:text-destructive"
                              title="Eliminar de la llista"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Absent attendees section */}
                {absentAttendees.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-amber-600 flex items-center gap-2">
                      <X className="h-4 w-4" />
                      Faltes ({absentAttendees.length})
                    </h3>
                    {absentAttendees.map((asistencia) => {
                      const socia = asistencia.socia;

                      return (
                        <div
                          key={asistencia.id}
                          className="flex items-center justify-between p-3 border rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-muted-foreground">
                              {socia.nom} {socia.cognoms}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleAttendance(socia.id, false)}
                              title="Marcar com a present"
                              className="text-green-600 hover:text-green-700"
                            >
                              Present
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteAttendance(socia.id)}
                              className="text-destructive hover:text-destructive"
                              title="Eliminar de la llista"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {asistencias.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hi ha sòcies afegides encara
                  </p>
                )}
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
};

export default AttendanceManager;
