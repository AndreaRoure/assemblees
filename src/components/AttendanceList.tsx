import React, { useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import AttendanceFilters from './attendance/AttendanceFilters';
import AssembliesTab from './attendance/AssembliesTab';
import PersonsTab from './attendance/PersonsTab';

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
      <AttendanceFilters
        selectedMonth={selectedMonth}
        selectedType={selectedType}
        months={months}
        onMonthChange={setSelectedMonth}
        onTypeChange={setSelectedType}
      />

      <Tabs defaultValue="assemblies" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="assemblies" className="text-sm">Per Assemblees</TabsTrigger>
          <TabsTrigger value="persons" className="text-sm">Per Persones</TabsTrigger>
        </TabsList>

        <TabsContent value="assemblies">
          <AssembliesTab 
            filteredData={filteredData}
            onDownload={() => downloadCSV('assemblies')}
          />
        </TabsContent>

        <TabsContent value="persons">
          <PersonsTab 
            filteredPersonData={filteredPersonData}
            onDownload={() => downloadCSV('persons')}
          />
        </TabsContent>
      </Tabs>

      <div className="text-sm text-muted-foreground text-center">
        Total d&apos;assemblees: {filteredData.length}
      </div>
    </div>
  );
};

export default AttendanceList;
