export enum AppView {
  DASHBOARD = 'DASHBOARD',
  FOOD_LOG = 'FOOD_LOG',
  EXERCISE_LOG = 'EXERCISE_LOG',
  ONBOARDING = 'ONBOARDING'
}

export interface UserProfile {
  name: string;
  weight: number;
  height: number;
  age: number;
  goal: 'lose' | 'maintain' | 'gain';
  calorieTarget: number;
}

export interface FoodEntry {
  id: string;
  timestamp: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
}

export interface ExerciseEntry {
  id: string;
  timestamp: number;
  activity: string;
  durationMinutes: number;
  caloriesBurned: number;
}

export interface DailyStats {
  caloriesConsumed: number;
  caloriesBurned: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface AIAnalysisResult {
  success: boolean;
  data?: any;
  error?: string;
}