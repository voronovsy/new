
"use client"

import * as React from 'react';
import type { JiraIssue } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type TaskChartsProps = {
  issues: JiraIssue[];
};

export default function TaskCharts({ issues }: TaskChartsProps) {
  const tasksByStatus = React.useMemo(() => {
    const statusCounts: { [key: string]: number } = {};
    issues.forEach(issue => {
      const statusName = issue.fields.status.name;
      if (statusCounts[statusName]) {
        statusCounts[statusName]++;
      } else {
        statusCounts[statusName] = 1;
      }
    });
    return Object.entries(statusCounts).map(([name, count]) => ({ name, count }));
  }, [issues]);

  const chartConfig = {
    count: {
      label: "Задачи",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Задачи по статусам</CardTitle>
        <CardDescription>Распределение задач по их текущим статусам в рабочем процессе.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tasksByStatus} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent />}
                />
                <Legend wrapperStyle={{ fontSize: '14px' }} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
