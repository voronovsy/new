
import { getJiraIssues, getProjects, teamMembers } from '@/lib/data';
import Header from '@/components/dashboard/header';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ListTodo, CheckCircle, Activity, Users, Briefcase } from 'lucide-react';
import type { AssignedJiraIssue, TeamMember } from '@/lib/types';
import Link from 'next/link';
import WorkloadOverview from '@/components/teams/workload-overview';

export default async function TeamPage({ params }: { params: { id: string } }) {
  const allProjects = await getProjects();
  const project = allProjects.find(p => p.id === params.id);
  
  if (!project) {
    notFound();
  }
  
  const allIssues = await getJiraIssues();
  
  // For now, all team members are considered part of the PCCPS team
  // and all issues are considered part of this project.
  const teamIssues = allIssues;

  const totalTasks = teamIssues.length;
  const completedTasks = teamIssues.filter(issue => issue.fields.resolutiondate).length;
  const openTasks = totalTasks - completedTasks;

  const memberWorkload = teamMembers.map(member => {
    const assignedIssues = allIssues.filter(issue => issue.assignee.id === member.id);
    const completed = assignedIssues.filter(issue => issue.fields.resolutiondate).length;
    const total = assignedIssues.length;
    const open = total - completed;
    return {
      member,
      total,
      open,
      completed,
    };
  });

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header projects={allProjects} selectedProject={project} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="grid gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-3xl font-bold">
                        <Briefcase className="h-8 w-8" />
                        Команда {project.name}
                    </CardTitle>
                    <CardDescription className="text-lg">{project.description}</CardDescription>
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

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                     <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-5 w-5" />
                                Участники команды
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {teamMembers.map((member) => (
                                <Link href={`/employees/${member.id}`} key={member.id} className="flex items-center hover:bg-muted/50 p-2 rounded-lg -m-2 transition-all duration-200 ease-in-out hover:translate-x-1">
                                    <Avatar className="h-10 w-10 border">
                                        <AvatarImage src={member.avatar} alt={member.name} />
                                        <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{member.name}</p>
                                        <p className="text-sm text-muted-foreground">{member.role}</p>
                                    </div>
                                </Link>
                            ))}
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                   <WorkloadOverview memberWorkload={memberWorkload} />
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
