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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for now - we'll replace this with real data later
const mockAttendanceData = [
  { 
    name: "Assemblea General",
    date: "2024-03-15",
    type: "in-person",
    inPersonAttendees: 25,
    onlineAttendees: 0
  },
  { 
    name: "Reunió Extraordinària",
    date: "2024-03-10",
    type: "online",
    inPersonAttendees: 0,
    onlineAttendees: 18
  },
  { 
    name: "Assemblea Mensual",
    date: "2024-02-28",
    type: "hybrid",
    inPersonAttendees: 20,
    onlineAttendees: 10
  }
];

// Mock data for individual attendance
const mockPersonAttendanceData = [
  {
    name: "Maria García",
    totalAssemblies: 15,
    attended: 13,
    absent: 2,
    percentage: "86.7%",
    attendanceByType: {
      online: "90%",
      "in-person": "83.3%"
    }
  },
  {
    name: "Joan Puig",
    totalAssemblies: 15,
    attended: 15,
    absent: 0,
    percentage: "100%",
    attendanceByType: {
      online: "100%",
      "in-person": "100%"
    }
  },
  {
    name: "Anna Martí",
    totalAssemblies: 15,
    attended: 12,
    absent: 3,
    percentage: "80%",
    attendanceByType: {
      online: "85.7%",
      "in-person": "75%"
    }
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

  const filteredPersonData = useMemo(() => {
    // In the future, we'll filter based on selected month and type
    return mockPersonAttendanceData;
  }, []);

  const downloadCSV = (type: 'assemblies' | 'persons') => {
    if (type === 'assemblies') {
      const headers = ['Nom', 'Data', 'Tipus', 'Assistents Presencials', 'Assistents Online'];
      const rows = filteredData.map(record => [
        record.name,
        record.date,
        record.type === 'online' 
          ? 'En línia' 
          : record.type === 'hybrid'
            ? 'Híbrid'
            : 'Presencial',
        record.inPersonAttendees,
        record.onlineAttendees
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `assistencia_assemblees_${selectedMonth}_${selectedType}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['Nom', 'Total Assemblees', 'Assistències', 'Absències', 'Percentatge Total', 'Percentatge Online', 'Percentatge Presencial'];
      const rows = filteredPersonData.map(record => [
        record.name,
        record.totalAssemblies,
        record.attended,
        record.absent,
        record.percentage,
        record.attendanceByType.online,
        record.attendanceByType["in-person"]
      ]);
      
      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `assistencia_persones_${selectedMonth}_${selectedType}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
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
              <SelectItem value="hybrid">Híbrid</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs defaultValue="assemblies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="assemblies">Per Assemblea</TabsTrigger>
          <TabsTrigger value="persons">Per Persona</TabsTrigger>
        </TabsList>

        <TabsContent value="assemblies">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => downloadCSV('assemblies')}
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
                    <TableHead className="text-right">Assistents Presencials</TableHead>
                    <TableHead className="text-right">Assistents Online</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell>{new Date(record.date).toLocaleDateString('ca-ES')}</TableCell>
                      <TableCell>
                        {record.type === 'online' 
                          ? 'En línia' 
                          : record.type === 'hybrid'
                            ? 'Híbrid'
                            : 'Presencial'}
                      </TableCell>
                      <TableCell className="text-right">{record.inPersonAttendees}</TableCell>
                      <TableCell className="text-right">{record.onlineAttendees}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="persons">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => downloadCSV('persons')}
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
                    <TableHead className="text-right">Total Assemblees</TableHead>
                    <TableHead className="text-right">Assistències</TableHead>
                    <TableHead className="text-right">Absències</TableHead>
                    <TableHead className="text-right">% Total</TableHead>
                    <TableHead className="text-right">% Online</TableHead>
                    <TableHead className="text-right">% Presencial</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPersonData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{record.name}</TableCell>
                      <TableCell className="text-right">{record.totalAssemblies}</TableCell>
                      <TableCell className="text-right">{record.attended}</TableCell>
                      <TableCell className="text-right">{record.absent}</TableCell>
                      <TableCell className="text-right">{record.percentage}</TableCell>
                      <TableCell className="text-right">{record.attendanceByType.online}</TableCell>
                      <TableCell className="text-right">{record.attendanceByType["in-person"]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

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
