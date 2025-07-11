
"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, User, Briefcase, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { JiraIssue, Project, TeamMember } from "@/lib/types"


type TeamCardProps = {
    issues: JiraIssue[];
    project: Project;
    teamMembers: TeamMember[];
    className?: string;
}

export default function TeamCard({ issues, project, teamMembers, className }: TeamCardProps) {
    const openTasks = issues.filter(issue => !issue.fields.resolutiondate).length;
    const totalTasks = issues.length;
    const workloadPercentage = totalTasks > 0 ? ((totalTasks - openTasks) / totalTasks) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Команда {project.name}
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <User className="h-6 w-6" />
                <div>
                    <p className="text-sm font-medium leading-none">Руководитель</p>
                    <p className="text-sm text-muted-foreground">Андрей Иванов</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-right">
                <Users className="h-6 w-6" />
                <div>
                    <p className="text-sm font-medium leading-none">Размер команды</p>
                    <p className="text-sm text-muted-foreground">12 человек</p>
                </div>
            </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Загруженность команды</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>{openTasks} открытых задач</span>
            </div>
            <span>{Math.round(workloadPercentage)}% выполнено</span>
          </div>
          <Progress value={workloadPercentage} className="mt-2 h-2" />
        </div>
        
        <div>
            <h3 className="text-sm font-medium mb-4">Участники команды</h3>
            <div className="space-y-4">
                {teamMembers.map((member) => (
                    <Link href={`/employees/${member.id}`} key={member.id} className="flex items-center hover:bg-muted/50 p-2 rounded-lg -m-2 transition-all duration-200 ease-in-out hover:translate-x-1">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
