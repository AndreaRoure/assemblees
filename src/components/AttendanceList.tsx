
import React, { useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, Users } from 'lucide-react';

// Mock data for now - we'll replace this with real data later
const mockAttendanceData = [
  { 
    name: "Assemblea General",
    date: "2024-03-15",
    totalAttendees: 25,
    totalAbsent: 5,
    type: "in-person",
    percentage: "83.3%"
  },
  { 
    name: "Reunió Extraordinària",
    date: "2024-03-10",
    totalAttendees: 18,
    totalAbsent: 12,
    type: "online",
    percentage: "60%"
  },
  { 
    name: "Assemblea Mensual",
    date: "2024-02-28",
    totalAttendees: 30,
    totalAbsent: 0,
    type: "in-person",
    percentage: "100%"
  }
];

const AttendanceList = () => {
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [selectedMonth, setSelectedMonth] = React.useState<string>('all');

  const months = useMemo(() => {
    return [
      { value: '01', label: 'Gener' },
      { value: '02', label: 'Febrer' },
      { value: '03', label: 'Març' },
      { value: '04', label: 'Abril' },
      { value: '05', label: 'Maig' },
      { value: '06', label: 'Juny' },
      { value: '07', label: 'Juliol' },
      { value: '08', label: 'Agost' },
      { value: '09', label: 'Setembre' },
      { value: '10', label: 'Octubre' },
      { value: '11', label: 'Novembre' },
      { value: '12', label: 'Desembre' }
    ];
  }, []);

  const filteredData = useMemo(() => {
    return mockAttendanceData.filter(record => {
      const matchesType = selectedType === 'all' || record.type === selectedType;
      const matchesMonth = selectedMonth === 'all' || record.date.split('-')[1] === selectedMonth;
      return matchesType && matchesMonth;
    });
  }, [selectedType, selectedMonth]);

  const downloadCSV = () => {
    const headers = ['Nom', 'Data', 'Tipus', 'Assistents', 'Absents', 'Percentatge'];
    const rows = filteredData.map(record => [
      record.name,
      record.date,
      record.type === 'online' ? 'En línia' : 'Presencial',
      record.totalAttendees,
      record.totalAbsent,
      record.percentage
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `assistencia_${selectedMonth}_${selectedType}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <Select
            value={selectedMonth}
            onValueChange={setSelectedMonth}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Selecciona el mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots els mesos</SelectItem>
              {months.map(month => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedType}
            onValueChange={setSelectedType}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Tipus d'assemblea" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tots els tipus</SelectItem>
              <SelectItem value="in-person">Presencial</SelectItem>
              <SelectItem value="online">En línia</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={downloadCSV}
          className="w-full md:w-auto"
        >
          <Download className="w-4 h-4 mr-2" />
          Descarregar CSV
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipus</TableHead>
              <TableHead className="text-right">Assistents</TableHead>
              <TableHead className="text-right">Absents</TableHead>
              <TableHead className="text-right">Percentatge</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{record.name}</TableCell>
                <TableCell>{new Date(record.date).toLocaleDateString('ca-ES')}</TableCell>
                <TableCell>{record.type === 'online' ? 'En línia' : 'Presencial'}</TableCell>
                <TableCell className="text-right">{record.totalAttendees}</TableCell>
                <TableCell className="text-right">{record.totalAbsent}</TableCell>
                <TableCell className="text-right">{record.percentage}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>Total d&apos;assemblees: {filteredData.length}</span>
        </div>
      </Card>
    </div>
  );
};

export default AttendanceList;
