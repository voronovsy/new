
'use server';

import { predictWorkloadAndTaskCompletion } from '@/ai/flows/workload-prediction';
import { getHolidays, getPccpsData, getJiraIssues } from '@/lib/data';
import type { JiraIssue } from '@/lib/types';
import { z } from 'zod';

const predictWorkloadSchema = z.object({
  task: z.any(),
});

export async function predictWorkload(
  input: z.infer<typeof predictWorkloadSchema>
) {
  try {
    const { task } = predictWorkloadSchema.parse(input);
    const typedTask = task as JiraIssue;

    const allIssues = await getJiraIssues();
    const pccpsData = await getPccpsData();
    const holidays = await getHolidays();

    const taskHistory = JSON.stringify(allIssues, null, 2);
    const holidaysData = JSON.stringify(holidays, null, 2);

    const taskCharacteristicsData = pccpsData.find(
      (d) =>
        d.task_type === typedTask.fields.issuetype.name &&
        d.complexity === typedTask.fields.customfield_25904?.value
    );

    if (!taskCharacteristicsData) {
        throw new Error('Could not find matching task characteristics in pccps.csv');
    }

    const taskCharacteristics = JSON.stringify(taskCharacteristicsData, null, 2);
    
    const prediction = await predictWorkloadAndTaskCompletion({
      taskHistory,
      taskCharacteristics,
      publicHolidays: holidaysData,
    });

    return { success: true, data: prediction };
  } catch (error) {
    console.error('Error in predictWorkload server action:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
    return { success: false, error: errorMessage };
  }
}
