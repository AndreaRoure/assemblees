import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Calendar, UserCheck, FileText, Download, Upload, Search, X } from 'lucide-react';
import { Pencil } from 'lucide-react';
import { fetchSociasWithStats, addSocia } from '@/lib/supabase-socias';
import { SociaWithStats } from '@/types/socias';
import { NewSociaDialog } from './NewSociaDialog';
import { EditSociaDialog } from './EditSociaDialog';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export const SociasList: React.FC = () => {
  const [socias, setSocias] = useState<SociaWithStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDialog, setShowNewDialog] = useState(false);
  const [editingSocia, setEditingSocia] = useState<SociaWithStats | null>(null);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

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

  const filteredSocias = React.useMemo(() => {
    if (!searchQuery.trim()) return socias;
    
    const query = searchQuery.toLowerCase();
    return socias.filter(socia => 
      socia.nom.toLowerCase().includes(query) ||
      socia.cognoms?.toLowerCase().includes(query) ||
      socia.comissions?.some(c => getCommissionLabel(c).toLowerCase().includes(query))
    );
  }, [socias, searchQuery]);

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setIsScrolled(target.scrollTop > 20);
    };

    const scrollElement = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    scrollElement?.addEventListener('scroll', handleScroll);

    return () => scrollElement?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchExpanded(false);
  };

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

  const handleExport = () => {
    const headers = ['nom', 'cognoms', 'genere', 'tipo', 'comissions'];
    const csvContent = [
      headers.join(','),
      ...socias.map(socia => [
        `"${socia.nom}"`,
        `"${socia.cognoms}"`,
        socia.genere,
        socia.tipo,
        socia.comissions ? `"${socia.comissions.join(';')}"` : ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `socias_${new Date().toISOString().split('T')[0]}.csv`);
    link.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exportació completada",
      description: "Les dades s'han exportat correctament",
    });
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Read file with proper encoding detection - try windows-1252 first (common for Excel exports)
      const arrayBuffer = await file.arrayBuffer();
      const decoder = new TextDecoder('windows-1252');
      const text = decoder.decode(arrayBuffer);
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Error",
          description: "El fitxer CSV està buit",
          variant: "destructive",
        });
        return;
      }

      // Detect separator (semicolon or comma)
      const separator = lines[0].includes(';') ? ';' : ',';
      const rawHeaders = lines[0].split(separator).map(h => h.trim());
      
      // Map headers to expected field names (case-insensitive)
      const headerMap: { [key: number]: string } = {};
      rawHeaders.forEach((header, index) => {
        const normalized = header.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (normalized === 'nom') headerMap[index] = 'nom';
        else if (normalized === 'cognoms') headerMap[index] = 'cognoms';
        else if (normalized.includes('nere') || normalized === 'genere' || normalized === 'genre') headerMap[index] = 'genere';
        else if (normalized === 'tipus' || normalized === 'tipo') headerMap[index] = 'tipo';
        else if (normalized === 'comissions') headerMap[index] = 'comissions';
      });
      
      // Check if required fields are present
      const hasNom = Object.values(headerMap).includes('nom');
      const hasGenere = Object.values(headerMap).includes('genere');
      const hasTipo = Object.values(headerMap).includes('tipo');
      
      if (!hasNom || !hasGenere || !hasTipo) {
        toast({
          title: "Error",
          description: "Format CSV incorrecte. Camps requerits: Nom, Gènere, Tipus",
          variant: "destructive",
        });
        return;
      }

      const rows = lines.slice(1);
      let imported = 0;
      let errors = 0;
      
      for (const row of rows) {
        try {
          const values = row.split(separator).map(v => v.trim());
          const sociaData: any = {};
          
          // Map values using the header mapping
          Object.keys(headerMap).forEach((index) => {
            const field = headerMap[index];
            sociaData[field] = values[parseInt(index)] || '';
          });

          // Normalize gender values
          const genereNormalized = sociaData.genere?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (genereNormalized === 'home') sociaData.genere = 'home';
          else if (genereNormalized === 'dona') sociaData.genere = 'dona';
          else if (genereNormalized.includes('no') || genereNormalized.includes('binari')) sociaData.genere = 'no-binari';

          // Normalize tipo values
          const tipoNormalized = sociaData.tipo?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
          if (tipoNormalized === 'habitatge') sociaData.tipo = 'habitatge';
          else if (tipoNormalized.includes('colaborad')) sociaData.tipo = 'colaborador';

          // Handle and normalize commissions (don't filter out unmatched, just skip them)
          if (sociaData.comissions && typeof sociaData.comissions === 'string') {
            const rawCommissions = sociaData.comissions.split(',').map((c: string) => c.trim()).filter((c: string) => c);
            sociaData.comissions = rawCommissions
              .map((c: string) => {
                const normalized = c.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
                // Map CSV commission names to database values (in Catalan)
                if (normalized.includes('econom')) return 'economiques';
                if (normalized.includes('intercoop')) return 'intercooperacio';
                if (normalized.includes('secret')) return 'secretaria';
                if (normalized.includes('conviv')) return 'convivencia';
                if (normalized.includes('subven')) return 'subvencions';
                if (normalized.includes('arquit')) return 'arquitectura';
                if (normalized.includes('comun')) return 'comunicacio';
                // If not recognized, return null but don't fail the import
                console.warn(`Commission not recognized: "${c}"`);
                return null;
              })
              .filter((c: string | null) => c !== null) as string[];
          } else {
            sociaData.comissions = [];
          }

          // Import even if some fields are empty (only nom, genere, tipo are required)
          if (sociaData.nom && sociaData.genere && sociaData.tipo) {
            try {
              await addSocia({
                nom: sociaData.nom,
                cognoms: sociaData.cognoms || '',
                genere: sociaData.genere,
                tipo: sociaData.tipo,
                comissions: sociaData.comissions
              });
              imported++;
            } catch (err) {
              console.error('Error importing socia:', sociaData.nom, err);
              errors++;
            }
          } else {
            console.warn('Skipping row - missing required fields:', sociaData);
            errors++;
          }
        } catch (err) {
          console.error('Error importing row:', err);
          errors++;
        }
      }

      loadSocias();
      
      toast({
        title: "Importació completada",
        description: `${imported} sòcies importades correctament${errors > 0 ? `. ${errors} errors.` : ''}`,
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error importing:', error);
      toast({
        title: "Error",
        description: "Error en importar les dades",
        variant: "destructive",
      });
    }
  };

  const getCommissionLabel = (commission: string) => {
    switch (commission) {
      case 'economiques': return 'Econòmiques';
      case 'intercooperacio': return 'Intercooperació';
      case 'secretaria': return 'Secretaria';
      case 'convivencia': return 'Convivència';
      case 'subvencions': return 'Subvencions';
      case 'arquitectura': return 'Arquitectura';
      case 'comunicacio': return 'Comunicació';
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
    <div className="space-y-0 pb-20 md:pb-0">
      {/* Sticky Header */}
      <div className={cn(
        "sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b transition-all duration-300",
        isScrolled ? "shadow-sm" : ""
      )}>
        <div className="p-4 space-y-3">
          {/* Title Row */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className={cn(
                "font-bold transition-all duration-300",
                isScrolled ? "text-lg md:text-2xl" : "text-2xl",
                searchExpanded && "md:block hidden"
              )}>
                Sòcies
              </h2>
              <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                {filteredSocias.length}
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport} variant="outline" size="sm" className="shrink-0 hidden md:inline-flex">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
              <Button onClick={() => fileInputRef.current?.click()} variant="outline" size="sm" className="shrink-0 hidden md:inline-flex">
                <Upload className="h-4 w-4 mr-2" />
                Importar
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleImport}
                className="hidden"
              />
              <Button onClick={() => setShowNewDialog(true)} className="shrink-0 hidden md:inline-flex">
                <Plus className="mr-2 h-4 w-4" />
                Nova Sòcia
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className={cn(
            "flex items-center gap-2 transition-all duration-300",
            searchExpanded ? "w-full" : "w-auto"
          )}>
            {!searchExpanded ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchExpanded(true)}
                className="gap-2"
              >
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Cercar</span>
              </Button>
            ) : (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Cercar per nom, cognoms o comissions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-9"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <ScrollArea ref={scrollAreaRef} className="h-[calc(100vh-280px)] md:h-[calc(100vh-330px)]">
        <div className="p-4 space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                  <div className="ml-2 md:ml-4">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Total Sòcies</p>
                    <p className="text-xl md:text-2xl font-bold">{socias.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                  <div className="ml-2 md:ml-4">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Sòcies Habitatge</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl md:text-2xl font-bold">
                        {socias.filter(s => s.tipo === 'habitatge').length}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {(() => {
                          const habitatgeSocias = socias.filter(s => s.tipo === 'habitatge');
                          const totalAssemblies = habitatgeSocias.reduce((acc, s) => acc + s.total_assemblies, 0);
                          const attended = habitatgeSocias.reduce((acc, s) => acc + s.assemblies_attended, 0);
                          return totalAssemblies > 0 ? `${Math.round((attended / totalAssemblies) * 100)}% participació` : '0% participació';
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 md:p-6">
                <div className="flex items-center">
                  <UserCheck className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                  <div className="ml-2 md:ml-4">
                    <p className="text-xs md:text-sm font-medium text-muted-foreground">Sòcies Colaborador/a</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-xl md:text-2xl font-bold">
                        {socias.filter(s => s.tipo === 'colaborador').length}
                      </p>
                      <p className="text-sm md:text-base text-muted-foreground">
                        {(() => {
                          const colaboradorSocias = socias.filter(s => s.tipo === 'colaborador');
                          const totalAssemblies = colaboradorSocias.reduce((acc, s) => acc + s.total_assemblies, 0);
                          const attended = colaboradorSocias.reduce((acc, s) => acc + s.assemblies_attended, 0);
                          return totalAssemblies > 0 ? `${Math.round((attended / totalAssemblies) * 100)}% participació` : '0% participació';
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mobile Cards View */}
          <div className="md:hidden space-y-4">
            {filteredSocias.map((socia) => (
          <Card key={socia.id} className="relative">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{socia.nom} {socia.cognoms}</h3>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <Badge className={`${getGenderBadgeColor(socia.genere)}`}>
                      {getGenderLabel(socia.genere)}
                    </Badge>
                    <Badge className={`${getTipoBadgeColor(socia.tipo)}`}>
                      {getTipoLabel(socia.tipo)}
                    </Badge>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingSocia(socia)}
                  className="h-8 w-8 p-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>

              {/* Comissions */}
              {socia.comissions && socia.comissions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground mb-1">Comissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {socia.comissions.map((commission) => (
                      <Badge 
                        key={commission} 
                        variant="outline" 
                        className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {getCommissionLabel(commission)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Assisteix</p>
                  <p className="text-lg font-semibold text-green-600">{socia.assemblies_attended}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Falta</p>
                  <p className="text-lg font-semibold text-red-600">{socia.assemblies_missed}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Modera</p>
                  <p className="text-lg font-semibold text-blue-600">{socia.moderations}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Acta</p>
                  <p className="text-lg font-semibold text-purple-600">{socia.secretary_records}</p>
                </div>
              </div>

              {/* Participation */}
              <div className="mt-3 pt-3 border-t text-center">
                <p className="text-xs text-muted-foreground">Participació</p>
                <p className="text-xl font-bold">
                  {socia.total_assemblies > 0 
                    ? `${Math.round((socia.assemblies_attended / socia.total_assemblies) * 100)}%`
                    : '-'}
                </p>
              </div>
            </CardContent>
          </Card>
            ))}
            {filteredSocias.length === 0 && (
              <div className="text-center text-muted-foreground py-6">
                {searchQuery ? 'No s\'han trobat sòcies' : 'No hi ha sòcies'}
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <Card className="hidden md:block">
            <CardContent className="pt-6">
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
                    {filteredSocias.map((socia) => (
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
                {filteredSocias.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center text-muted-foreground py-8">
                      {searchQuery ? 'No s\'han trobat sòcies' : 'Cap sòcia registrada'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  </ScrollArea>

      {/* FAB for mobile */}
      <div className="md:hidden fixed bottom-6 right-6 flex gap-2 z-50">
        <button
          onClick={handleExport}
          className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Exportar"
        >
          <Download className="h-5 w-5" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="h-12 w-12 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Importar"
        >
          <Upload className="h-5 w-5" />
        </button>
        <button
          onClick={() => setShowNewDialog(true)}
          className="h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 flex items-center justify-center"
          aria-label="Nova Sòcia"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

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