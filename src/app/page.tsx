
import { getJiraIssues, getHolidays } from '@/lib/data';
import Header from '@/components/dashboard/header';
import StatsCards from '@/components/dashboard/stats-cards';
import TeamCard from '@/components/dashboard/team-card';
import TaskCharts from '@/components/dashboard/task-charts';
import TasksTable from '@/components/dashboard/tasks-table';
import ProductionCalendar from '@/components/dashboard/production-calendar';
import TaskTypesChart from '@/components/dashboard/task-types-chart';

export default async function DashboardPage() {
  const issues = await getJiraIssues();
  const holidays = await getHolidays();

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
        <StatsCards issues={issues} />
        <div className="grid grid-cols-1 items-start gap-4 md:gap-8 lg:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
            <TeamCard issues={issues} />
            <ProductionCalendar holidays={holidays} />
          </div>
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <TaskCharts issues={issues} />
                <TaskTypesChart issues={issues} />
            </div>
            <TasksTable issues={issues} />
          </div>
        </div>
      </main>
    </div>
  );
}
