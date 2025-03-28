
import React from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

interface GenderDistributionChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
  interventionsByGender: {
    man: number;
    woman: number;
    'non-binary': number;
  };
  percentageByGender: {
    man: number;
    woman: number;
    'non-binary': number;
  };
  totalInterventions: number;
}

const GenderDistributionChart = ({ data, interventionsByGender, percentageByGender, totalInterventions }: GenderDistributionChartProps) => {
  // Inclusive color palette - Swapped colors between man and woman
  const COLORS = ['#0EA5E9', '#8B5CF6', '#D946EF'];

  return (
    <Card className="p-4 md:p-6">
      <h3 className="text-lg font-semibold mb-4">Distribució d'Intervencions per Gènere</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => {
                  // Ensure percent is a number before performing arithmetic
                  const numericPercent = typeof percent === 'number' ? percent : 0;
                  return `${name}: ${(numericPercent * 100).toFixed(1)}%`;
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip formatter={(value, name) => {
                // Ensure value is a number
                const numericValue = typeof value === 'number' ? value : 0;
                const percentage = totalInterventions > 0 ? ((numericValue / totalInterventions) * 100).toFixed(1) : '0.0';
                return [`${numericValue} (${percentage}%)`, name];
              }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="self-center">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gènere</TableHead>
                <TableHead className="text-right">Total Intervencions</TableHead>
                <TableHead className="text-right">Percentatge</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Homes</TableCell>
                <TableCell className="text-right">{interventionsByGender.man}</TableCell>
                <TableCell className="text-right">{percentageByGender.man.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Dones</TableCell>
                <TableCell className="text-right">{interventionsByGender.woman}</TableCell>
                <TableCell className="text-right">{percentageByGender.woman.toFixed(1)}%</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>No binàries</TableCell>
                <TableCell className="text-right">{interventionsByGender["non-binary"]}</TableCell>
                <TableCell className="text-right">{percentageByGender["non-binary"].toFixed(1)}%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </Card>
  );
};

export default GenderDistributionChart;
