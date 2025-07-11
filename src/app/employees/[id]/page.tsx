
import { getJiraIssues, teamMembers } from '@/lib/data';
import { notFound } from 'next/navigation';
import EmployeePageClient from '@/components/employees/employee-page-client';
import type { AssignedJiraIssue } from '@/lib/types';

export default async function EmployeePage({ params }: { params: { id: string } }) {
  const employee = teamMembers.find(m => m.id === params.id);
  
  if (!employee) {
    notFound();
  }
  
  const allIssues = await getJiraIssues();
  
  const employeeIssues = allIssues.filter((issue): issue is AssignedJiraIssue => {
    const assignedIssue = issue as AssignedJiraIssue;
    return assignedIssue.assignee && assignedIssue.assignee.id === employee.id;
  });

  return (
    <EmployeePageClient employee={employee} initialIssues={employeeIssues} />
  );
}
