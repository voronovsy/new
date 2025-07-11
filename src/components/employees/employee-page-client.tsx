
'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';
import { addDays, format, isWithinInterval } from 'date-fns';
import { ru } from 'date-fns/locale';

import Header from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ListTodo, CheckCircle, Activity, Calendar as CalendarIcon } from 'lucide-react';
import type { AssignedJiraIssue, TeamMember, Project } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';

const priorityVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
    'Highest': 'destructive',
    'High': 'destructive',
    'Medium': 'secondary',
    'Low': 'outline',
    'Lowest': 'outline'
};
const getPriorityVariant = (priorityName?: string) => {
    return priorityName ? priorityVariantMap[priorityName] || 'outline' : 'outline';
};

const statusColorMap: { [key: string]: string } = {
    'Настройка': 'bg-blue-500',
    'Выполнено': 'bg-green-500',
    'В разработке': 'bg-yellow-500',
    'Тестирование': 'bg-purple-500',
    'Аналитика': 'bg-indigo-500',
};
const getStatusClass = (statusName?: string) => {
    return statusName ? statusColorMap[statusName] || 'bg-gray-500' : 'bg-gray-500';
};

interface EmployeePageClientProps {
    employee: TeamMember;
    initialIssues: AssignedJiraIssue[];
    projects: Project[];
}

export default function EmployeePageClient({ employee, initialIssues, projects }: EmployeePageClientProps) {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -30),
        to: new Date(),
    });

    const selectedProject = projects[0];

    const filteredIssues = React.useMemo(() => {
        if (!date?.from || !date?.to) {
            return initialIssues;
        }
        return initialIssues.filter(issue => {
            const issueDate = new Date(issue.fields.created);
            return isWithinInterval(issueDate, { start: date.from!, end: date.to! });
        });
    }, [initialIssues, date]);

    const totalTasks = filteredIssues.length;
    const completedTasks = filteredIssues.filter(issue => issue.fields.resolutiondate).length;
    const openTasks = totalTasks - completedTasks;

    if (!selectedProject) {
        return (
            <div className="flex min-h-screen w-full flex-col bg-background items-center justify-center">
                Загрузка данных...
            </div>
        )
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            <Header projects={projects} selectedProject={selectedProject} />
            <main className="flex-1 p-4 sm:p-6 md:p-8">
                <div className="grid gap-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-20 w-20 border">
                                <AvatarImage src={employee.avatar} alt={employee.name} />
                                <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-3xl font-bold">{employee.name}</CardTitle>
                                <CardDescription className="text-lg">{employee.role}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
                                        <ListTodo className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{totalTasks}</div>
                                        <p className="text-xs text-muted-foreground">за выбранный период</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Открытые задачи</CardTitle>
                                        <Activity className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{openTasks}</div>
                                         <p className="text-xs text-muted-foreground">за выбранный период</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Завершенные задачи</CardTitle>
                                        <CheckCircle className="h-4 w-4 text-muted-foreground" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{completedTasks}</div>
                                         <p className="text-xs text-muted-foreground">за выбранный период</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <CardTitle>Назначенные задачи</CardTitle>
                                <CardDescription>Список задач, назначенных этому сотруднику.</CardDescription>
                            </div>
                             <div className="mt-4 sm:mt-0">
                                <Popover>
                                    <PopoverTrigger asChild>
                                    <Button
                                        id="date"
                                        variant={"outline"}
                                        className={cn(
                                        "w-full sm:w-[300px] justify-start text-left font-normal",
                                        !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date?.from ? (
                                        date.to ? (
                                            <>
                                            {format(date.from, "LLL dd, y", { locale: ru })} -{" "}
                                            {format(date.to, "LLL dd, y", { locale: ru })}
                                            </>
                                        ) : (
                                            format(date.from, "LLL dd, y", { locale: ru })
                                        )
                                        ) : (
                                        <span>Выберите дату</span>
                                        )}
                                    </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={date?.from}
                                        selected={date}
                                        onSelect={setDate}
                                        numberOfMonths={2}
                                        locale={ru}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                    <TableHead>Ключ</TableHead>
                                    <TableHead>Название</TableHead>
                                    <TableHead>Тип</TableHead>
                                    <TableHead>Статус</TableHead>
                                    <TableHead>Приоритет</TableHead>
                                    <TableHead>Создана</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredIssues.map((issue: AssignedJiraIssue) => (
                                        <TableRow key={issue.id}>
                                            <TableCell className="font-medium">{issue.key}</TableCell>
                                            <TableCell>{issue.fields.summary}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{issue.fields.issuetype.name}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <span className={`h-2 w-2 rounded-full ${getStatusClass(issue.fields.status.name)}`}></span>
                                                    <span>{issue.fields.status.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={getPriorityVariant(issue.fields.priority?.name)}>{issue.fields.priority?.name || 'N/A'}</Badge>
                                            </TableCell>
                                            <TableCell>{new Date(issue.fields.created).toLocaleDateString()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredIssues.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="h-24 text-center">
                                                В выбранном периоде нет назначенных задач.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
