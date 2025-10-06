import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Users, UserCheck, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
  const [selectedSociaId, setSelectedSociaId] = React.useState<string>('');

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
    const counts = { dona: 0, home: 0, 'no-binari': 0 };
    asistencias.forEach((asistencia) => {
      if (asistencia.asistio && asistencia.socia) {
        counts[asistencia.socia.genere]++;
      }
    });
    return counts;
  }, [asistencias]);

  // Get IDs of socias already added to this assembly
  const addedSociaIds = React.useMemo(() => 
    new Set(asistencias.map(a => a.socia_id)),
    [asistencias]
  );

  // Filter available socias (not yet added)
  const availableSocias = socias.filter(s => !addedSociaIds.has(s.id));

  const handleAddSocia = async () => {
    if (!selectedSociaId) return;

    try {
      await upsertAsistencia(selectedSociaId, assemblyId, false);
      await refetchAsistencias();
      setSelectedSociaId('');
      toast.success('Sòcia afegida');
    } catch (error) {
      console.error('Error adding socia:', error);
      toast.error('Error afegint sòcia');
    }
  };

  const handleToggleAttendance = async (sociaId: string, currentStatus: boolean) => {
    try {
      await upsertAsistencia(sociaId, assemblyId, !currentStatus);
      await refetchAsistencias();
      queryClient.invalidateQueries({ queryKey: ['assemblyStats', assemblyId] });
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Error actualitzant assistència');
    }
  };

  const handleRemoveSocia = async (sociaId: string) => {
    try {
      await deleteAsistencia(sociaId, assemblyId);
      await refetchAsistencias();
      toast.success('Sòcia eliminada');
    } catch (error) {
      console.error('Error removing socia:', error);
      toast.error('Error eliminant sòcia');
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
    <div className="space-y-6">
      {/* Gender counters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Dones</span>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {genderCounts.dona}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Homes</span>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {genderCounts.home}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">No binàries</span>
              </div>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {genderCounts['no-binari']}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add socia selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Afegir Sòcia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Select value={selectedSociaId} onValueChange={setSelectedSociaId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecciona una sòcia..." />
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                {availableSocias.map((socia) => (
                  <SelectItem key={socia.id} value={socia.id}>
                    {socia.nom} {socia.cognoms}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              onClick={handleAddSocia} 
              disabled={!selectedSociaId}
            >
              Afegir
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Attendance list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Llistat d'Assistència</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {asistencias.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No hi ha sòcies afegides encara
              </p>
            ) : (
              asistencias.map((asistencia) => {
                const socia = asistencia.socia;
                const isModerator = currentAssembly?.moderador_id === socia.id;
                const isSecretary = currentAssembly?.secretari_id === socia.id;

                return (
                  <div
                    key={asistencia.id}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={asistencia.asistio}
                        onCheckedChange={() => handleToggleAttendance(socia.id, asistencia.asistio)}
                      />
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
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveSocia(socia.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceManager;
