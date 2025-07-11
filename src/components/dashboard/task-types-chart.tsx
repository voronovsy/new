
"use client"

import * as React from 'react';
import type { JiraIssue } from '@/lib/types';
import { Pie, PieChart, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type TaskTypesChartProps = {
  issues: JiraIssue[];
};

const COLORS = [
    "hsl(var(--chart-1))", 
    "hsl(var(--chart-2))", 
    "hsl(var(--chart-3))", 
    "hsl(var(--chart-4))", 
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
    "hsl(19, 90%, 55%)",
    "hsl(270, 80%, 60%)",
];

export default function TaskTypesChart({ issues }: TaskTypesChartProps) {
  const tasksByType = React.useMemo(() => {
    const typeCounts: { [key: string]: number } = {};
    issues.forEach(issue => {
      const typeName = issue.fields.issuetype.name;
      if (typeCounts[typeName]) {
        typeCounts[typeName]++;
      } else {
        typeCounts[typeName] = 1;
      }
    });
    return Object.entries(typeCounts).map(([name, value]) => ({ name, value }));
  }, [issues]);
  
  const chartConfig = tasksByType.reduce((acc, cur, i) => {
    return {
        ...acc,
        [cur.name]: {
            label: cur.name,
            color: COLORS[i % COLORS.length]
        }
    }
  }, {});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Задачи по типам</CardTitle>
        <CardDescription>Распределение различных типов задач.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent nameKey="name" hideLabel />}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Pie
                data={tasksByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                strokeWidth={2}
                >
                {tasksByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
                </Pie>
            </PieChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
