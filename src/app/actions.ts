
'use server';

import { predictWorkloadAndTaskCompletion } from '@/ai/flows/workload-prediction';
import { askAssistant } from '@/ai/flows/assistant-flow';
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
        const fallbackCharacteristics = {
            task_type: typedTask.fields.issuetype.name,
            complexity: typedTask.fields.customfield_25904?.value,
            actions: typedTask.fields.customfield_25903?.value,
            base_minutes: 60
        }
        console.warn('Could not find matching task characteristics in pccps.csv, using fallback');
        const taskCharacteristics = JSON.stringify(fallbackCharacteristics, null, 2);
        const prediction = await predictWorkloadAndTaskCompletion({
            taskHistory,
            taskCharacteristics,
            publicHolidays: holidaysData,
        });
        return { success: true, data: prediction };
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

const askAssistantSchema = z.object({
    query: z.string(),
    history: z.array(z.object({
        role: z.enum(['user', 'model']),
        content: z.string(),
    })).optional(),
});

export async function getAssistantResponse(input: z.infer<typeof askAssistantSchema>) {
    try {
        const parsedInput = askAssistantSchema.parse(input);
        const response = await askAssistant(parsedInput);
        return { success: true, data: response };
    } catch (error) {
        console.error('Error in getAssistantResponse server action:', error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        return { success: false, error: errorMessage };
    }
}
