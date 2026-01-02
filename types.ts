
export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
}

export interface FocusArea {
  id: number;
  title: string;
  description: string;
}

export interface DailyHabit {
  id: string;
  label: string;
  completed: boolean;
}

export interface WeeklyTarget {
  id: string;
  task: string;
  category: string;
  isCompleted: boolean;
}

export interface RoadmapContext {
  name: string;
  theme: string;
  vision: string[];
  focusAreas: FocusArea[];
  dailyOS: string[];
  weeklyOS: string[];
  businessGoals: string[];
  learningPlan: string[];
  financialDiscipline: string[];
  healthRules: string[];
  spiritualRules: string[];
}
