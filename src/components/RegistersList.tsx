
import React from 'react';
import { assemblies, interventions } from '@/data/assemblies';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const RegistersList = () => {
  const [selectedYear, setSelectedYear] = React.useState<string>('all');
  const [selectedGender, setSelectedGender] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');

  // Get unique years from assemblies where we actually have data
  const years = [...new Set(assemblies
    .filter(a => interventions.some(i => i.assemblyId === a.id))
    .map(a => new Date(a.date).getFullYear()))]
    .sort((a, b) => b - a);

  // Filter assemblies based on selected year and gender
  const filteredAssemblies = assemblies.filter(assembly => {
    const assemblyYear = new Date(assembly.date).getFullYear().toString();
    const yearMatch = selectedYear === 'all' || assemblyYear === selectedYear;
    const genderMatch = selectedGender === 'all' || assembly.register.gender === selectedGender;
    return yearMatch && genderMatch;
  });

  const getInterventionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'intervencio': '🗣️ Intervenció',
      'dinamitza': '✨ Dinamitza',
      'interrupcio': '✋ Interrupció',
      'llarga': '⏳ Llarga',
      'ofensiva': '⚠️ Ofensiva',
      'explica': '📚 Explica'
    };
    return labels[type] || type;
  };

  const countInterventionsByType = (assemblyId: string) => {
    const assemblyInterventions = interventions.filter(i => {
      const typeMatch = selectedType === 'all' || i.type === selectedType;
      return i.assemblyId === assemblyId && typeMatch;
    });

    return {
      intervencio: assemblyInterventions.filter(i => i.type === 'intervencio').length,
      dinamitza: assemblyInterventions.filter(i => i.type === 'dinamitza').length,
      interrupcio: assemblyInterventions.filter(i => i.type === 'interrupcio').length,
      llarga: assemblyInterventions.filter(i => i.type === 'llarga').length,
      ofensiva: assemblyInterventions.filter(i => i.type === 'ofensiva').length,
      explica: assemblyInterventions.filter(i => i.type === 'explica').length,
      total: assemblyInterventions.length,
    };
  };

  const getTotalStats = () => {
    const stats = filteredAssemblies.reduce((acc, assembly) => {
      const counts = countInterventionsByType(assembly.id);
      Object.keys(counts).forEach(key => {
        if (key !== 'total') { // Exclude total from the graph
          acc[key] = (acc[key] || 0) + counts[key];
        }
      });
      return acc;
    }, {} as Record<string, number>);

    return [
      { name: '🗣️ Intervenció', value: stats.intervencio || 0 },
      { name: '✨ Dinamitza', value: stats.dinamitza || 0 },
      { name: '✋ Interrupció', value: stats.interrupcio || 0 },
      { name: '⏳ Llarga', value: stats.llarga || 0 },
      { name: '⚠️ Ofensiva', value: stats.ofensiva || 0 },
      { name: '📚 Explica', value: stats.explica || 0 },
    ];
  };

  const handleDownload = () => {
    const rows = filteredAssemblies.map(assembly => {
      const counts = countInterventionsByType(assembly.id);
      return [
        new Date(assembly.date).toLocaleDateString('ca-ES'),
        assembly.name,
        assembly.register.name,
        assembly.register.gender === 'man' ? 'Home' :
        assembly.register.gender === 'woman' ? 'Dona' :
        assembly.register.gender === 'trans' ? 'Trans' : 'No binari',
        counts.total
      ].join(',');
    });

    const headers = ['Data', 'Assemblea', 'Registrador/a', 'Gènere', 'Total'].join(',');
    const csv = [headers, ...rows].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `registres_${selectedYear === 'all' ? 'tots' : selectedYear}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="p-4">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2 flex-1">
            <Label>Any</Label>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els anys</SelectItem>
                {years.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <Label>Gènere</Label>
            <Select value={selectedGender} onValueChange={setSelectedGender}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un gènere" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els gèneres</SelectItem>
                <SelectItem value="man">Home</SelectItem>
                <SelectItem value="woman">Dona</SelectItem>
                <SelectItem value="trans">Trans</SelectItem>
                <SelectItem value="non-binary">No binari</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 flex-1">
            <Label>Tipus</Label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un tipus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tots els tipus</SelectItem>
                <SelectItem value="intervencio">🗣️ Intervenció</SelectItem>
                <SelectItem value="dinamitza">✨ Dinamitza</SelectItem>
                <SelectItem value="interrupcio">✋ Interrupció</SelectItem>
                <SelectItem value="llarga">⏳ Llarga</SelectItem>
                <SelectItem value="ofensiva">⚠️ Ofensiva</SelectItem>
                <SelectItem value="explica">📚 Explica</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Descarregar CSV
          </Button>
        </div>

        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={getTotalStats()} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Assemblea</TableHead>
                <TableHead>Registrador/a</TableHead>
                <TableHead>Gènere</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAssemblies.map((assembly) => {
                const counts = countInterventionsByType(assembly.id);
                return (
                  <TableRow key={assembly.id}>
                    <TableCell>{new Date(assembly.date).toLocaleDateString('ca-ES')}</TableCell>
                    <TableCell>{assembly.name}</TableCell>
                    <TableCell>{assembly.register.name}</TableCell>
                    <TableCell>
                      {assembly.register.gender === 'man' && 'Home'}
                      {assembly.register.gender === 'woman' && 'Dona'}
                      {assembly.register.gender === 'trans' && 'Trans'}
                      {assembly.register.gender === 'non-binary' && 'No binari'}
                    </TableCell>
                    <TableCell className="text-right font-medium">{counts.total}</TableCell>
                  </TableRow>
                );
              })}
              {filteredAssemblies.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                    No s&apos;han trobat registres
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default RegistersList;
