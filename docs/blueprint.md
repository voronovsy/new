# **App Name**: EffortVision

## Core Features:

- Dashboard Overview: Displays a dashboard with key metrics for the PCCPS team, including the number of connected teams, open tasks, completed tasks, and upcoming releases. It also features cards for connected systems.
- Team Metrics Card: Displays key information for the PCCPS team, including team leader, total team size, team members, and the number of tasks in progress. Shows overall team workload and individual employee workload.
- Task Metrics View: Presents views for task status, planned workload estimates, and relevant metrics and graphs. Displays all PCCPS project tasks with filters to sort based on parameters.
- Jira Synchronization: Synchronizes data from Jira to the database. Stores transition information in order to provide insight into each transition of each task in order to have better accounting and analytics data. This button will appear in the admin panel.
- AI-Powered Workload Prediction tool: Based on Jira task history and the pccps.csv file (and other files used in calculations), the system will use its understanding of typical task loads and task workflow to intelligently estimate task completion and the level of busyness of engineers; also can incorporate public holiday information. Provides task insights and process improvement opportunities for an engineer and project lead. 

## Style Guidelines:

- Primary color: Dark slate blue (#374151) to convey a sense of professionalism, focus, and reliability.
- Background color: Very light gray (#F9FAFB), providing a clean and neutral backdrop that helps the data stand out.
- Accent color: Muted indigo (#5046E5), used sparingly for key interactive elements and calls to action to draw attention without overwhelming the user.
- Body font: 'Inter', a grotesque-style sans-serif known for its modern, neutral, and readable appearance. This will be the main font for the application's text.
- Headline font: 'Space Grotesk', a proportional sans-serif with a techy feel. If longer text is anticipated, use 'Inter' for body text.
- Use a set of minimalist icons to represent different task categories and statuses, aiding quick recognition.
- Dashboard layout with a clear information hierarchy, using cards to separate different data sets.