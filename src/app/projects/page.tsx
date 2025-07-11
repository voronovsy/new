
import { getProjects, getJiraIssues } from '@/lib/data';
import ProjectsPageClient from '@/components/projects/projects-page-client';

export default async function ProjectsPage() {
  const projects = await getProjects();
  const allIssues = await getJiraIssues();

  return <ProjectsPageClient initialProjects={projects} initialIssues={allIssues} />;
}
