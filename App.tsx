import React, { useState, useEffect } from 'react';
import { AppView, UserProfile, FoodEntry, ExerciseEntry, DailyStats } from './types';
import Dashboard from './components/Dashboard';
import FoodLogger from './components/FoodLogger';
import ExerciseLogger from './components/ExerciseLogger';
import Onboarding from './components/Onboarding';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>(AppView.ONBOARDING);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Data State
  const [foodLog, setFoodLog] = useState<FoodEntry[]>([]);
  const [exerciseLog, setExerciseLog] = useState<ExerciseEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats>({
    caloriesConsumed: 0,
    caloriesBurned: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  // Calculate daily totals whenever logs change
  useEffect(() => {
    const newStats = {
      caloriesConsumed: foodLog.reduce((sum, item) => sum + item.calories, 0),
      caloriesBurned: exerciseLog.reduce((sum, item) => sum + item.caloriesBurned, 0),
      protein: foodLog.reduce((sum, item) => sum + item.protein, 0),
      carbs: foodLog.reduce((sum, item) => sum + item.carbs, 0),
      fat: foodLog.reduce((sum, item) => sum + item.fat, 0),
    };
    setDailyStats(newStats);
  }, [foodLog, exerciseLog]);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setView(AppView.DASHBOARD);
  };

  const handleAddFood = (entry: FoodEntry) => {
    setFoodLog(prev => [...prev, entry]);
  };

  const handleAddExercise = (entry: ExerciseEntry) => {
    setExerciseLog(prev => [...prev, entry]);
  };

  // Render Logic
  if (view === AppView.ONBOARDING) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans max-w-lg mx-auto shadow-2xl overflow-hidden relative">
        <div className="h-full overflow-y-auto p-4 custom-scrollbar">
            {view === AppView.DASHBOARD && userProfile && (
                <Dashboard 
                    stats={dailyStats} 
                    foodLog={foodLog} 
                    exerciseLog={exerciseLog}
                    userProfile={userProfile}
                    setView={setView}
                />
            )}
            {view === AppView.FOOD_LOG && (
                <FoodLogger setView={setView} onAddFood={handleAddFood} />
            )}
            {view === AppView.EXERCISE_LOG && userProfile && (
                <ExerciseLogger 
                    setView={setView} 
                    onAddExercise={handleAddExercise} 
                    userWeight={userProfile.weight}
                />
            )}
        </div>
    </div>
  );
};

export default App;