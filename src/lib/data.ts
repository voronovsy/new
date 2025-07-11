
import fs from 'fs/promises';
import path from 'path';
import type { JiraIssue, PccpsTask, Holiday, Project } from './types';

const dataPath = path.join(process.cwd(), 'data');

// A mock function to get projects. In a real app, this would fetch from a database.
export async function getProjects(): Promise<Project[]> {
    return [
        { id: 'pccps', name: 'PCCPS', description: 'Настройка акций на ПЦ', status: 'Активен' },
        { id: 'phoenix', name: 'Проект Феникс', description: 'Платформа лояльности клиентов', status: 'Активен' },
        { id: 'ares', name: 'Проект Арес', description: 'Инструмент внутреннего аудита безопасности', status: 'В ожидании' },
    ]
}

export async function getJiraIssues(): Promise<JiraIssue[]> {
  const filePath = path.join(dataPath, 'search.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    return data.issues as JiraIssue[];
  } catch (error) {
    console.error('Failed to read or parse search.json:', error);
    return [];
  }
}

export async function getPccpsData(): Promise<PccpsTask[]> {
  const filePath = path.join(dataPath, 'pccps.csv');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const rows = fileContents.trim().split('\n');
    const headers = rows.shift()?.split(',') || [];
    return rows.map(row => {
      const values = row.split(',');
      return headers.reduce((obj, header, index) => {
        const key = header.trim() as keyof PccpsTask;
        (obj as any)[key] = values[index].trim();
        return obj;
      }, {} as PccpsTask);
    });
  } catch (error) {
    console.error('Failed to read or parse pccps.csv:', error);
    return [];
  }
}

export async function getHolidays(): Promise<Holiday[]> {
    const filePath = path.join(dataPath, 'holidays.json');
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        return data as Holiday[];
    } catch (error) {
        console.error('Failed to read or parse holidays.json:', error);
        return [];
    }
}
