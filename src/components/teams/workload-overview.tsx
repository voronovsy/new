
'use client';

import type { TeamMember } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Activity, CheckCircle, ListTodo } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/button';

interface MemberWorkload {
  member: TeamMember;
  total: number;
  open: number;
  completed: number;
}

interface WorkloadOverviewProps {
  memberWorkload: MemberWorkload[];
}

export default function WorkloadOverview({ memberWorkload }: WorkloadOverviewProps) {
  return (
    <Card>
        <CardHeader>
            <CardTitle>Загруженность команды</CardTitle>
            <CardDescription>Обзор распределения задач и прогресса по каждому участнику.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {memberWorkload.map(({ member, total, open, completed }) => {
                const progress = total > 0 ? (completed / total) * 100 : 0;
                return (
                    <div key={member.id} className="p-4 border rounded-lg transition-all hover:shadow-md">
                         <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <Link href={`/employees/${member.id}`} className="flex items-center gap-4 group">
                                <Avatar className="h-12 w-12 border">
                                    <AvatarImage src={member.avatar} alt={member.name} />
                                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="text-base font-semibold group-hover:text-primary transition-colors">{member.name}</p>
                                    <p className="text-sm text-muted-foreground">{member.role}</p>
                                </div>
                            </Link>
                             <Button asChild variant="ghost" size="sm">
                                <Link href={`/employees/${member.id}`}>К задачам</Link>
                            </Button>
                        </div>
                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-muted-foreground">Прогресс</span>
                                <span className="text-sm font-medium">{Math.round(progress)}%</span>
                            </div>
                            <Progress value={progress} className="h-2" />
                            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <p className="text-2xl font-bold">{total}</p>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><ListTodo className="h-3 w-3" />Всего</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{open}</p>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Activity className="h-3 w-3" />В работе</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{completed}</p>
                                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><CheckCircle className="h-3 w-3" />Выполнено</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </CardContent>
    </Card>
  );
}
