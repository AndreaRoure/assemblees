
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, ArrowRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface AssembliesTabProps {
  filteredData: Array<{
    name: string;
    date: string;
    type: string;
    inPersonAttendees: number;
    onlineAttendees: number;
  }>;
  onDownload: () => void;
}

const AssembliesTab = ({ filteredData, onDownload }: AssembliesTabProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          onClick={onDownload}
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
                        {record.type === 'online' ? 'En línia' : record.type === 'hybrid' ? 'Híbrid' : 'Presencial'}
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
  );
};

export default AssembliesTab;
