
'use client';

import * as React from 'react';
import { getProjects, getJiraIssues } from '@/lib/data';
import Header from '@/components/dashboard/header';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Project, JiraIssue } from '@/lib/types';
import { ProjectDialog } from '@/components/projects/project-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>([]);
  const [allIssues, setAllIssues] = React.useState<JiraIssue[]>([]);
  const [selectedProject, setSelectedProject] = React.useState<Project | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [dialogMode, setDialogMode] = React.useState<'create' | 'edit'>('create');
  const [projectToDelete, setProjectToDelete] = React.useState<Project | null>(null);

  React.useEffect(() => {
    async function fetchData() {
      const projectsData = await getProjects();
      const issuesData = await getJiraIssues();
      setProjects(projectsData);
      setAllIssues(issuesData);
      if (projectsData.length > 0) {
        setSelectedProject(projectsData[0]);
      }
    }
    fetchData();
  }, []);

  const handleCreateProject = () => {
    setSelectedProject(null);
    setDialogMode('create');
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProject(project);
    setDialogMode('edit');
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (project: Project) => {
    // Here you would typically call an action to delete the project from your data source.
    // For now, we'll just filter it out from the local state.
    setProjects(projects.filter((p) => p.id !== project.id));
    setProjectToDelete(null);
  };
  
  const handleSaveProject = (project: Project) => {
    if (dialogMode === 'create') {
        // In a real app, this would be an ID from the database
        const newProject = { ...project, id: `proj-${Date.now()}`};
        setProjects([...projects, newProject]);
    } else {
        setProjects(projects.map((p) => (p.id === project.id ? project : p)));
    }
  }


  if (!selectedProject) {
    return (
        <div className="flex min-h-screen w-full flex-col bg-background">
            {/* You can add a loading spinner here */}
        </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header projects={projects} selectedProject={selectedProject} />
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Проекты</CardTitle>
              <CardDescription>Управляйте вашими проектами здесь.</CardDescription>
            </div>
            <Button size="sm" className="gap-1" onClick={handleCreateProject}>
              <PlusCircle className="h-4 w-4" />
              Создать проект
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Название</TableHead>
                  <TableHead>Описание</TableHead>
                  <TableHead>Статус</TableHead>
                  <TableHead>
                    <span className="sr-only">Действия</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>{project.description}</TableCell>
                    <TableCell>
                      <Badge variant={project.status === 'Активен' ? 'default' : 'secondary'}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Открыть меню</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Действия</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEditProject(project)}>
                            Редактировать
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => setProjectToDelete(project)}
                          >
                            Удалить
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
                 {projects.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            Проекты не найдены.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <ProjectDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveProject}
        project={selectedProject}
        mode={dialogMode}
      />
       <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Проект "{projectToDelete?.name}" будет удален навсегда.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProjectToDelete(null)}>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={() => projectToDelete && handleDeleteProject(projectToDelete)}>Удалить</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
