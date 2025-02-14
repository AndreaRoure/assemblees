
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for now
const mockAttendance = [
  { id: 1, name: 'Joan Garcia', date: '2024-03-15', type: 'in-person' },
  { id: 2, name: 'Maria Puig', date: '2024-03-15', type: 'online' },
  { id: 3, name: 'Joan Garcia', date: '2024-03-14', type: 'in-person' },
  { id: 4, name: 'Pere Vila', date: '2024-03-14', type: 'online' },
];

const AttendanceList = () => {
  // Calculate attendance totals
  const attendanceTotals = mockAttendance.reduce((acc, curr) => {
    acc[curr.name] = (acc[curr.name] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Tipus</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockAttendance.map((record) => (
              <TableRow key={record.id}>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.date}</TableCell>
                <TableCell>{record.type === 'online' ? 'En línia' : 'Presencial'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="font-semibold mb-3">Total d&apos;assistències per persona</h3>
        <div className="space-y-2">
          {Object.entries(attendanceTotals).map(([name, total]) => (
            <div key={name} className="flex justify-between">
              <span>{name}</span>
              <span className="font-medium">{total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceList;
