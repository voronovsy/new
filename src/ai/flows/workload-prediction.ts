'use server';

/**
 * @fileOverview An AI agent that predicts workload and task completion estimates.
 *
 * - predictWorkloadAndTaskCompletion - A function that handles the workload prediction process.
 * - PredictWorkloadAndTaskCompletionInput - The input type for the predictWorkloadAndTaskCompletion function.
 * - PredictWorkloadAndTaskCompletionOutput - The return type for the predictWorkloadAndTaskCompletion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictWorkloadAndTaskCompletionInputSchema = z.object({
  taskHistory: z
    .string()
    .describe(
      'Historical data of Jira tasks, including key, summary, issue type, component, complexity, number of actions, priority, created date, resolution date, and changelog.'
    ),
  taskCharacteristics: z
    .string()
    .describe(
      'Details about the current task, including type, complexity, and any relevant information from pccps.csv.'
    ),
  publicHolidays: z
    .string()
    .describe(
      'Information about public holidays that may affect task completion time.'
    ),
});
export type PredictWorkloadAndTaskCompletionInput = z.infer<
  typeof PredictWorkloadAndTaskCompletionInputSchema
>;

const PredictWorkloadAndTaskCompletionOutputSchema = z.object({
  estimatedWorkload: z
    .string()
    .describe(
      'Estimated workload in hours required to complete the task, based on historical data and task characteristics.'
    ),
  estimatedCompletionDate: z
    .string()
    .describe(
      'Estimated completion date of the task, taking into account workload, team capacity, and public holidays.'
    ),
  potentialBottlenecks: z
    .string()
    .describe(
      'Identified potential bottlenecks or challenges that may affect task completion.'
    ),
  processImprovementOpportunities: z
    .string()
    .describe(
      'Suggestions for process improvements to optimize task completion time and resource allocation.'
    ),
});
export type PredictWorkloadAndTaskCompletionOutput = z.infer<
  typeof PredictWorkloadAndTaskCompletionOutputSchema
>;

export async function predictWorkloadAndTaskCompletion(
  input: PredictWorkloadAndTaskCompletionInput
): Promise<PredictWorkloadAndTaskCompletionOutput> {
  return predictWorkloadAndTaskCompletionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictWorkloadAndTaskCompletionPrompt',
  input: {schema: PredictWorkloadAndTaskCompletionInputSchema},
  output: {schema: PredictWorkloadAndTaskCompletionOutputSchema},
  prompt: `You are an AI assistant specialized in project management and workload prediction.

  Based on the historical Jira data, task characteristics, and public holiday information, predict the workload and task completion estimates.

  Task History: {{{taskHistory}}}
  Task Characteristics: {{{taskCharacteristics}}}
  Public Holidays: {{{publicHolidays}}}

  Provide the estimated workload in hours, the estimated completion date, potential bottlenecks, and process improvement opportunities.

  Output in JSON format:
  {
    "estimatedWorkload": "estimated workload in hours",
    "estimatedCompletionDate": "estimated completion date",
    "potentialBottlenecks": "identified potential bottlenecks",
    "processImprovementOpportunities": "suggestions for process improvements"
  }`,
});

const predictWorkloadAndTaskCompletionFlow = ai.defineFlow(
  {
    name: 'predictWorkloadAndTaskCompletionFlow',
    inputSchema: PredictWorkloadAndTaskCompletionInputSchema,
    outputSchema: PredictWorkloadAndTaskCompletionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

