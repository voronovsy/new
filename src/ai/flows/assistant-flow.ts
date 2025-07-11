'use server';

/**
 * @fileOverview An AI assistant that can answer questions about project data.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { getJiraIssues, getProjects } from '@/lib/data';

const AssistantInputSchema = z.object({
  query: z.string().describe('The user\'s question about the project data.'),
  history: z.array(z.object({
    role: z.enum(['user', 'model']),
    content: z.string(),
  })).optional().describe('The conversation history.'),
});
export type AssistantInput = z.infer<typeof AssistantInputSchema>;

const AssistantOutputSchema = z.object({
  response: z.string().describe('The AI\'s response to the user\'s query.'),
});
export type AssistantOutput = z.infer<typeof AssistantOutputSchema>;

export async function askAssistant(input: AssistantInput): Promise<AssistantOutput> {
  return assistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'assistantPrompt',
  input: { schema: AssistantInputSchema },
  output: { schema: AssistantOutputSchema },
  context: [
    { role: 'user', content: 'You are a helpful AI assistant for the EffortVision application. Your role is to answer questions about project management data from Jira. Be concise and helpful.' },
    { role: 'model', content: 'Understood. I am the EffortVision AI assistant. I will answer questions about Jira projects, tasks, and teams based on the data provided. I will keep my answers concise.' },
  ],
  prompt: `
    Here is the project data:
    Jira Issues: {{{json issues}}}
    Projects: {{{json projects}}}

    Here is the conversation history:
    {{#each history}}
      {{#if (eq this.role 'user')}}
        User: {{{this.content}}}
      {{else}}
        Assistant: {{{this.content}}}
      {{/if}}
    {{/each}}

    And here is the user's latest question:
    User: {{{query}}}

    Based on all of this information, please provide a helpful and concise response to the user's question.
  `,
});

const assistantFlow = ai.defineFlow(
  {
    name: 'assistantFlow',
    inputSchema: AssistantInputSchema,
    outputSchema: AssistantOutputSchema,
  },
  async (input) => {
    const issues = await getJiraIssues();
    const projects = await getProjects();

    const { output } = await prompt({
      ...input,
      issues,
      projects,
    });
    return output!;
  }
);
