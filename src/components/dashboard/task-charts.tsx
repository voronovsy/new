
"use client"

import * as React from 'react';
import type { JiraIssue } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";

type TaskChartsProps = {
  issues: JiraIssue[];
};

const STATUS_COLORS = [
    "hsl(var(--chart-1))", 
    "hsl(var(--chart-2))", 
    "hsl(var(--chart-3))", 
    "hsl(var(--chart-4))", 
    "hsl(var(--chart-5))",
    "hsl(var(--primary))",
];

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

  const chartConfig = tasksByStatus.reduce((acc, cur, i) => {
    return {
        ...acc,
        [cur.name]: {
            label: cur.name,
            color: STATUS_COLORS[i % STATUS_COLORS.length]
        }
    }
  }, {});

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
                  content={<ChartTooltipContent hideLabel />}
                />
                <Legend content={({ payload }) => {
                    return (
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4 text-sm">
                            {payload?.map((entry, index) => (
                                <div key={`item-${index}`} className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                                    <span>{entry.value}</span>
                                </div>
                            ))}
                        </div>
                    )
                }}/>
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                   {tasksByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                  ))}
                </Bar>
            </BarChart>
            </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
