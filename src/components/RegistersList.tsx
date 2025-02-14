
import React, { useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { fetchInterventions } from '@/lib/supabase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const RegistersList = () => {
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');

  const { data: interventions = [] } = useQuery({
    queryKey: ['interventions'],
    queryFn: fetchInterventions
  });

  // Get unique years from interventions
  const years = useMemo(() => {
    const uniqueYears = [...new Set(interventions.map(i => 
      new Date(i.timestamp).getFullYear()
    ))].sort((a, b) => b - a); // Sort descending
    return uniqueYears;
  }, [interventions]);

  // Filter interventions based on selected filters
  const filteredInterventions = useMemo(() => {
    return interventions.filter(i => {
      const year = new Date(i.timestamp).getFullYear();
      const matchesYear = selectedYear === 'all' || year.toString() === selectedYear;
      const matchesGender = selectedGender === 'all' || i.gender === selectedGender;
      return matchesYear && matchesGender;
    });
  }, [interventions, selectedYear, selectedGender]);

  // Calculate totals
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

  // Handle CSV download
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

  return (
    <div className="space-y-6">
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

      <div className="text-sm text-muted-foreground text-center">
        Total d&apos;intervencions: {filteredInterventions.length}
      </div>
    </div>
  );
};

export default RegistersList;
