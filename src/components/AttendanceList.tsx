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
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  const [selectedMonth, setSelectedMonth] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');

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
    return mockPersonAttendanceData;
  }, []);

  const downloadCSV = (type: 'assemblies' | 'persons') => {
    if (type === 'assemblies') {
      const headers = ['Nom', 'Data', 'Tipus', 'Assistents Presencials', 'Assistents Online', 'Total Assistents'];
      const rows = filteredData.map(record => [
        record.name,
        record.date,
        record.type === 'online' 
          ? 'En línia' 
          : record.type === 'hybrid'
            ? 'Híbrid'
            : 'Presencial',
        record.inPersonAttendees,
        record.onlineAttendees,
        record.inPersonAttendees + record.onlineAttendees
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
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Select
          value={selectedMonth}
          onValueChange={setSelectedMonth}
        >
          <SelectTrigger className="h-9 text-sm">
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
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="Tipus d'assemblea" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tots els tipus</SelectItem>
            <SelectItem value="in-person">Presencial</SelectItem>
            <SelectItem value="online">En línia</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="assemblies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="assemblies" className="text-sm">Per Assemblees</TabsTrigger>
          <TabsTrigger value="persons" className="text-sm">Per Persones</TabsTrigger>
        </TabsList>

        <TabsContent value="assemblies">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => downloadCSV('assemblies')}
                className="h-9 text-sm"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="inline md:hidden">CSV</span>
                <span className="hidden md:inline">Descarregar CSV</span>
              </Button>
            </div>

            <Card>
              <ScrollArea className="w-full" type="always">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background/80 to-transparent w-8 h-full flex items-center justify-start md:hidden">
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background/80 to-transparent w-8 h-full flex items-center justify-end md:hidden">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Nom</TableHead>
                          <TableHead className="w-[120px]">Data</TableHead>
                          <TableHead className="w-[120px]">Tipus</TableHead>
                          <TableHead className="text-right w-[150px]">Assistents Presencials</TableHead>
                          <TableHead className="text-right w-[150px]">Assistents Online</TableHead>
                          <TableHead className="text-right w-[150px]">Total Assistents</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((record, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{record.name}</TableCell>
                            <TableCell>{new Date(record.date).toLocaleDateString('ca-ES')}</TableCell>
                            <TableCell>
                              {record.type === 'online' ? 'En línia' : 'Presencial'}
                            </TableCell>
                            <TableCell className="text-right">{record.inPersonAttendees}</TableCell>
                            <TableCell className="text-right">{record.onlineAttendees}</TableCell>
                            <TableCell className="text-right font-medium">
                              {record.inPersonAttendees + record.onlineAttendees}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="persons">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => downloadCSV('persons')}
                className="h-9 text-sm"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                <span className="inline md:hidden">CSV</span>
                <span className="hidden md:inline">Descarregar CSV</span>
              </Button>
            </div>

            <Card>
              <ScrollArea className="w-full" type="always">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-background/80 to-transparent w-8 h-full flex items-center justify-start md:hidden">
                    <ArrowLeft className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-background/80 to-transparent w-8 h-full flex items-center justify-end md:hidden">
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[200px]">Nom</TableHead>
                          <TableHead className="text-right w-[120px]">Total Assemblees</TableHead>
                          <TableHead className="text-right w-[120px]">Assistències</TableHead>
                          <TableHead className="text-right w-[120px]">Absències</TableHead>
                          <TableHead className="text-right w-[100px]">% Total</TableHead>
                          <TableHead className="text-right w-[100px]">% Online</TableHead>
                          <TableHead className="text-right w-[100px]">% Presencial</TableHead>
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
                  </div>
                </div>
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground text-center">
        Total d&apos;assemblees: {filteredData.length}
      </div>
    </div>
  );
};

export default AttendanceList;
