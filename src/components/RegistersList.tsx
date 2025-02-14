
import React, { useMemo, useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchInterventions, fetchAssemblies, supabase } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const RegistersList = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('interventions-changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'interventions' 
        }, 
        () => {
          queryClient.invalidateQueries({ queryKey: ['interventions'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const { data: interventions = [], isLoading: isLoadingInterventions } = useQuery({
    queryKey: ['interventions'],
    queryFn: fetchInterventions
  });

  const { data: assemblies = [], isLoading: isLoadingAssemblies } = useQuery({
    queryKey: ['assemblies'],
    queryFn: fetchAssemblies
  });

  const years = useMemo(() => {
    const uniqueYears = [...new Set(interventions.map(i => 
      new Date(i.timestamp).getFullYear()
    ))].sort((a, b) => b - a);
    return uniqueYears;
  }, [interventions]);

  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const year = new Date(i.timestamp).getFullYear();
      const matchesYear = selectedYear === 'all' || year.toString() === selectedYear;
      const matchesGender = selectedGender === 'all' || i.gender === selectedGender;
      return matchesYear && matchesGender;
    });
  }, [interventions, selectedYear, selectedGender]);

  const totals = useMemo(() => {
    const counts = {
      intervencio: 0,
      dinamitza: 0,
      interrupcio: 0,
      llarga: 0,
      ofensiva: 0,
      explica: 0,
    };
    
    filteredInterventions.forEach(i => {
      counts[i.type]++;
    });
    
    return counts;
  }, [filteredInterventions]);

  const genderTotals = useMemo(() => {
    const totals = {
      man: 0,
      woman: 0,
      trans: 0,
      'non-binary': 0
    };

    interventions.forEach(i => {
      totals[i.gender]++;
    });

    return Object.entries(totals).map(([gender, value]) => ({
      gender: gender === 'man' ? 'Homes' :
             gender === 'woman' ? 'Dones' :
             gender === 'trans' ? 'Persones Trans' :
             'Persones No Binàries',
      total: value
    }));
  }, [interventions]);

  const downloadCSV = () => {
    const headers = ['Data', 'Tipus', 'Gènere', 'Assembly ID'];
    const rows = filteredInterventions.map(i => [
      new Date(i.timestamp).toLocaleDateString('ca-ES'),
      i.type,
      i.gender,
      i.assembly_id
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `interventions_${selectedYear}_${selectedGender}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingInterventions || isLoadingAssemblies) {
    return <div className="text-center text-muted-foreground">Carregant...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-4">
        <Select
          value={selectedYear}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Selecciona l'any" />
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

        <Select
          value={selectedGender}
          onValueChange={setSelectedGender}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Selecciona el gènere" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tots els gèneres</SelectItem>
            <SelectItem value="man">Homes</SelectItem>
            <SelectItem value="woman">Dones</SelectItem>
            <SelectItem value="trans">Persones Trans</SelectItem>
            <SelectItem value="non-binary">Persones No Binàries</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={downloadCSV}
          className="ml-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Descarregar CSV
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {Object.entries(totals).map(([type, count]) => (
          <Card key={type} className="p-4">
            <div className="text-lg font-semibold">{count}</div>
            <div className="text-sm text-muted-foreground">
              {type === 'intervencio' && 'Intervencions'}
              {type === 'dinamitza' && 'Dinamitza'}
              {type === 'interrupcio' && 'Interrupcions'}
              {type === 'llarga' && 'Intervencions llargues'}
              {type === 'ofensiva' && 'Intervencions ofensives'}
              {type === 'explica' && 'Explica'}
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <div className="font-semibold mb-4">Intervencions per Gènere</div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={genderTotals}>
              <XAxis dataKey="gender" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" name="Total d'intervencions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-4">
        <div className="font-semibold mb-4">Registre Detallat</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Assemblea</TableHead>
              <TableHead>Registrador/a</TableHead>
              <TableHead>Tipus</TableHead>
              <TableHead>Gènere</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInterventions.map((intervention) => {
              const assembly = assemblies.find(a => a.id === intervention.assembly_id);
              return (
                <TableRow key={intervention.id}>
                  <TableCell>
                    {new Date(intervention.timestamp).toLocaleDateString('ca-ES')}
                  </TableCell>
                  <TableCell>{assembly?.name || '-'}</TableCell>
                  <TableCell>{assembly?.register?.name || '-'}</TableCell>
                  <TableCell>
                    {intervention.type === 'intervencio' && 'Intervenció'}
                    {intervention.type === 'dinamitza' && 'Dinamitza'}
                    {intervention.type === 'interrupcio' && 'Interrupció'}
                    {intervention.type === 'llarga' && 'Intervenció llarga'}
                    {intervention.type === 'ofensiva' && 'Intervenció ofensiva'}
                    {intervention.type === 'explica' && 'Explica'}
                  </TableCell>
                  <TableCell>
                    {intervention.gender === 'man' && 'Home'}
                    {intervention.gender === 'woman' && 'Dona'}
                    {intervention.gender === 'trans' && 'Persona Trans'}
                    {intervention.gender === 'non-binary' && 'Persona No Binària'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        Total d&apos;intervencions: {filteredInterventions.length}
      </div>
    </div>
  );
};

export default RegistersList;
