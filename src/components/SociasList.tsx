import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Calendar, UserCheck, FileText } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { fetchSociasWithStats } from '@/lib/supabase-socias';
import { SociaWithStats } from '@/types/socias';
import { NewSociaDialog } from './NewSociaDialog';
import { EditSociaDialog } from './EditSociaDialog';
import { useToast } from '@/hooks/use-toast';

export const SociasList: React.FC = () => {
  const [socias, setSocias] = useState<SociaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingSocia, setEditingSocia] = useState<SociaWithStats | null>(null);
  const { toast } = useToast();

  const loadSocias = async () => {
    try {
      setLoading(true);
      const data = await fetchSociasWithStats();
      setSocias(data);
    } catch (error) {
      console.error('Error loading socias:', error);
      toast({
        title: "Error",
        description: "No s'han pogut carregar les sòcies",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSocias();
  }, []);

  const getGenderBadgeColor = (genere: string) => {
    switch (genere) {
      case 'dona': return 'bg-pink-100 text-pink-800';
      case 'home': return 'bg-blue-100 text-blue-800';
      case 'no-binari': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderLabel = (genere: string) => {
    switch (genere) {
      case 'dona': return 'Dona';
      case 'home': return 'Home';
      case 'no-binari': return 'No binari';
      default: return genere;
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'habitatge': return 'bg-orange-100 text-orange-800';
      case 'colaborador': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case 'habitatge': return 'Habitatge';
      case 'colaborador': return 'Colaborador/a';
      default: return tipo;
    }
  };

  const getCommissionLabel = (commission: string) => {
    switch (commission) {
      case 'economicas': return 'Econòmiques';
      case 'intercooperacion': return 'Intercooperació';
      case 'secretaria': return 'Secretaria';
      case 'convivencia': return 'Convivència';
      case 'subvenciones': return 'Subvencions';
      case 'arquitectura': return 'Arquitectura';
      case 'comunicacion': return 'Comunicació';
      default: return commission;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregant sòcies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end items-center">
        <Button onClick={() => setShowNewDialog(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Sòcia
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Sòcies</p>
                <p className="text-2xl font-bold">{socias.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Participació Mitjana</p>
                <p className="text-2xl font-bold">
                  {socias.length > 0 
                    ? Math.round((socias.reduce((acc, s) => acc + s.assemblies_attended, 0) / socias.reduce((acc, s) => acc + s.total_assemblies, 0)) * 100) || 0
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Moderadores</p>
                <p className="text-2xl font-bold">
                  {socias.filter(s => s.moderations > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-orange-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Secretàries</p>
                <p className="text-2xl font-bold">
                  {socias.filter(s => s.secretary_records > 0).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Socias Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Llista de Sòcies</CardTitle>
          <p className="text-muted-foreground mt-2">
            Gestiona la base de dades de sòcies i la seva participació
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Cognoms</TableHead>
                  <TableHead>Gènere</TableHead>
                  <TableHead>Comissions</TableHead>
                  <TableHead>Tipus</TableHead>
                  <TableHead className="text-center">Assisteix</TableHead>
                  <TableHead className="text-center">Falta</TableHead>
                  <TableHead className="text-center">Modera</TableHead>
                  <TableHead className="text-center">Acta</TableHead>
                  <TableHead className="text-center">Participació</TableHead>
                  <TableHead className="text-center">Accions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {socias.map((socia) => (
                  <TableRow key={socia.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{socia.nom}</TableCell>
                    <TableCell>{socia.cognoms}</TableCell>
                    <TableCell>
                      <Badge className={`${getGenderBadgeColor(socia.genere)}`}>
                        {getGenderLabel(socia.genere)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {socia.comissions && socia.comissions.length > 0 ? (
                          socia.comissions.map((commission) => (
                            <Badge 
                              key={commission} 
                              variant="outline" 
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {getCommissionLabel(commission)}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted-foreground text-xs">Cap comissió</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getTipoBadgeColor(socia.tipo)}`}>
                        {getTipoLabel(socia.tipo)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-green-600">{socia.assemblies_attended}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-red-600">{socia.assemblies_missed}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-blue-600">{socia.moderations}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium text-purple-600">{socia.secretary_records}</span>
                    </TableCell>
                    <TableCell className="text-center">
                      {socia.total_assemblies > 0 ? (
                        <span className="font-medium">
                          {Math.round((socia.assemblies_attended / socia.total_assemblies) * 100)}%
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSocia(socia)}
                        className="h-8 w-8 p-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {socias.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Cap sòcia registrada</h3>
            <p className="text-muted-foreground mb-4">
              Comença afegint la primera sòcia a la base de dades
            </p>
            <Button onClick={() => setShowNewDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Sòcia
            </Button>
          </CardContent>
        </Card>
      )}

      <NewSociaDialog 
        open={showNewDialog}
        onOpenChange={setShowNewDialog}
        onSociaCreated={loadSocias}
      />

      <EditSociaDialog
        socia={editingSocia}
        open={!!editingSocia}
        onOpenChange={(open) => !open && setEditingSocia(null)}
        onSociaUpdated={loadSocias}
      />
    </div>
  );
};