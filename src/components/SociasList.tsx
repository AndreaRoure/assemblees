import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Users, Calendar, UserCheck, FileText } from 'lucide-react';
import { fetchSociasWithStats } from '@/lib/supabase-socias';
import { SociaWithStats } from '@/types/socias';
import { NewSociaDialog } from './NewSociaDialog';
import { useToast } from '@/components/ui/use-toast';

export const SociasList: React.FC = () => {
  const [socias, setSocias] = useState<SociaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
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
      case 'trans': return 'bg-purple-100 text-purple-800';
      case 'no-binari': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGenderLabel = (genere: string) => {
    switch (genere) {
      case 'dona': return 'Dona';
      case 'home': return 'Home';
      case 'trans': return 'Trans';
      case 'no-binari': return 'No binari';
      default: return genere;
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Sòcies</h1>
          <p className="text-muted-foreground">
            Gestiona la base de dades de sòcies i la seva participació
          </p>
        </div>
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

      {/* Socias List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {socias.map((socia) => (
          <Card key={socia.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{socia.nom} {socia.cognoms}</CardTitle>
                  <Badge className={`mt-1 ${getGenderBadgeColor(socia.genere)}`}>
                    {getGenderLabel(socia.genere)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assisteix:</span>
                  <span className="font-medium text-green-600">{socia.assemblies_attended}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">No assisteix:</span>
                  <span className="font-medium text-red-600">{socia.assemblies_missed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Modera:</span>
                  <span className="font-medium text-blue-600">{socia.moderations}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Acta:</span>
                  <span className="font-medium text-purple-600">{socia.secretary_records}</span>
                </div>
                {socia.total_assemblies > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Participació:</span>
                      <span className="font-medium">
                        {Math.round((socia.assemblies_attended / socia.total_assemblies) * 100)}%
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

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
    </div>
  );
};