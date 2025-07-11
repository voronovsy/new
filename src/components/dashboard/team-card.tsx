
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, User, Briefcase, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import type { JiraIssue, Project } from "@/lib/types"

type TeamCardProps = {
    issues: JiraIssue[];
    project: Project;
    className?: string;
}

const teamMembers = [
    { name: "Andrey Ivanov", role: "Team Lead", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d" },
    { name: "Elena Petrova", role: "Developer", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704e" },
    { name: "Sergey Sidorov", role: "QA Engineer", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704f" },
    { name: "Olga Smirnova", role: "Analyst", avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704g" },
]

export default function TeamCard({ issues, project, className }: TeamCardProps) {
    const openTasks = issues.filter(issue => !issue.fields.resolutiondate).length;
    const totalTasks = issues.length;
    const workloadPercentage = totalTasks > 0 ? ((totalTasks - openTasks) / totalTasks) * 100 : 0;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          {project.name} Team
        </CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between space-x-4">
            <div className="flex items-center space-x-4">
                <User className="h-6 w-6" />
                <div>
                    <p className="text-sm font-medium leading-none">Team Leader</p>
                    <p className="text-sm text-muted-foreground">Andrey Ivanov</p>
                </div>
            </div>
            <div className="flex items-center space-x-4 text-right">
                <Users className="h-6 w-6" />
                <div>
                    <p className="text-sm font-medium leading-none">Team Size</p>
                    <p className="text-sm text-muted-foreground">12 People</p>
                </div>
            </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Team Workload</h3>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>{openTasks} open tasks</span>
            </div>
            <span>{Math.round(workloadPercentage)}% done</span>
          </div>
          <Progress value={workloadPercentage} className="mt-2 h-2" />
        </div>
        
        <div>
            <h3 className="text-sm font-medium mb-4">Team Members</h3>
            <div className="space-y-4">
                {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{member.name}</p>
                            <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </CardContent>
    </Card>
  )
}
