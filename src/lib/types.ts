
export interface JiraIssue {
  expand: string;
  id: string;
  self: string;
  key: string;
  fields: IssueFields;
  changelog: Changelog;
}

export interface IssueFields {
  summary: string;
  issuetype: IssueType;
  customfield_26415: any; // Component
  customfield_25904: CustomField | null; // Complexity
  customfield_25903: CustomField | null; // Number of actions
  customfield_16701: any;
  priority: Priority | null;
  created: string;
  resolutiondate: string | null;
  status: Status;
}

export interface IssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avatarId: number;
}

export interface CustomField {
  self: string;
  value: string;
  id: string;
}

export interface Priority {
  self: string;
  iconUrl: string;
  name: string;
  id: string;
}

export interface Status {
    self: string;
    description: string;
    iconUrl: string;
    name: string;
    id: string;
    statusCategory: {
        self: string;
        id: number;
        key: string;
        colorName: string;
        name: string;
    };
}

export interface Changelog {
  startAt: number;
  maxResults: number;
  total: number;
  histories: History[];
}

export interface History {
  id: string;
  author: Author;
  created: string;
  items: ChangelogItem[];
}

export interface Author {
  self: string;
  name: string;
  key: string;
  emailAddress: string;
  avatarUrls: AvatarUrls;
  displayName: string;
  active: boolean;
  timeZone: string;
}

export interface AvatarUrls {
  '48x48': string;
  '24x24': string;
  '16x16': string;
  '32x32': string;
}

export interface ChangelogItem {
  field: string;
  fieldtype: string;
  from: string | null;
  fromString: string | null;
  to: string | null;
  toString: string | null;
}

export interface PccpsTask {
    task_type: string;
    complexity: string;
    actions: string;
    base_minutes: string;
}

export interface Holiday {
    date: string;
    name: string;
}


export type PredictWorkloadAndTaskCompletionOutput = {
    estimatedWorkload: string;
    estimatedCompletionDate: string;
    potentialBottlenecks: string;
    processImprovementOpportunities: string;
}
