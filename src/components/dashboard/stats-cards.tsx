
import type { JiraIssue } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, ListTodo, Users } from "lucide-react";

type StatsCardsProps = {
  issues: JiraIssue[];
};

export default function StatsCards({ issues }: StatsCardsProps) {
  const totalTasks = issues.length;
  const completedTasks = issues.filter(
    (issue) => issue.fields.resolutiondate
  ).length;
  const openTasks = totalTasks - completedTasks;
  const connectedTeams = 1; // Mocked for now

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Всего задач</CardTitle>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalTasks}</div>
          <p className="text-xs text-muted-foreground">Все задачи в проекте PCCPS</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Открытые задачи</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{openTasks}</div>
          <p className="text-xs text-muted-foreground">Задачи, находящиеся в работе</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Завершенные задачи</CardTitle>
          <CheckCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedTasks}</div>
          <p className="text-xs text-muted-foreground">Решенные и закрытые задачи</p>
        </CardContent>
      </Card>
      <Card className="transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Подключенные команды</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{connectedTeams}</div>
          <p className="text-xs text-muted-foreground">Команда PCCPS</p>
        </CardContent>
      </Card>
    </div>
  );
}
