
import { getJiraIssues, getProjects, teamMembers } from '@/lib/data';
import Header from '@/components/dashboard/header';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ListTodo, CheckCircle, Activity } from 'lucide-react';
import type { AssignedJiraIssue } from '@/lib/types';

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

export default async function EmployeePage({ params }: { params: { id: string } }) {
  const employee = teamMembers.find(m => m.id === params.id);
  
  if (!employee) {
    notFound();
  }
  
  const allIssues = await getJiraIssues();
  const projects = await getProjects();
  const selectedProject = projects[0]; // For header consistency

  const employeeIssues = allIssues.filter(issue => issue.assignee.id === employee.id);

  const totalTasks = employeeIssues.length;
  const completedTasks = employeeIssues.filter(issue => issue.fields.resolutiondate).length;
  const openTasks = totalTasks - completedTasks;

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
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Открытые задачи</CardTitle>
                                <Activity className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{openTasks}</div>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Завершенные задачи</CardTitle>
                                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{completedTasks}</div>
                            </CardContent>
                        </Card>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Назначенные задачи</CardTitle>
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
                            {employeeIssues.map((issue: AssignedJiraIssue) => (
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
                             {employeeIssues.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                    Нет назначенных задач.
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
