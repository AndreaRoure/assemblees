
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

interface PersonsTabProps {
  filteredPersonData: Array<{
    name: string;
    totalAssemblies: number;
    attended: number;
    absent: number;
    percentage: string;
    attendanceByType: {
      online: string;
      "in-person": string;
    };
  }>;
  onDownload: () => void;
}

const PersonsTab = ({ filteredPersonData, onDownload }: PersonsTabProps) => {
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
  );
};

export default PersonsTab;
