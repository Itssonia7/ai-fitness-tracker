import React, { useEffect, useState } from 'react';
import { DailyStats, FoodEntry, ExerciseEntry, UserProfile, AppView } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { getDailyInsight } from '../services/geminiService';
import { PlusIcon, FireIcon, BoltIcon } from './Icons';

interface DashboardProps {
  stats: DailyStats;
  foodLog: FoodEntry[];
  exerciseLog: ExerciseEntry[];
  userProfile: UserProfile;
  setView: (view: AppView) => void;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b']; // Protein, Carbs, Fat

const Dashboard: React.FC<DashboardProps> = ({ stats, foodLog, exerciseLog, userProfile, setView }) => {
  const [insight, setInsight] = useState<string>("Analyzing your data...");

  useEffect(() => {
    getDailyInsight(stats, userProfile.goal).then(setInsight);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats]); // Update insight when stats change

  const macroData = [
    { name: 'Protein', value: stats.protein },
    { name: 'Carbs', value: stats.carbs },
    { name: 'Fat', value: stats.fat },
  ];

  // If no data, show empty state placeholders
  const hasMacroData = stats.protein > 0 || stats.carbs > 0 || stats.fat > 0;
  const chartData = hasMacroData ? macroData : [{ name: 'Empty', value: 1 }];
  const chartColors = hasMacroData ? COLORS : ['#27272a'];

  const caloriesRemaining = userProfile.calorieTarget - stats.caloriesConsumed + stats.caloriesBurned;
  const progressPercent = Math.min((stats.caloriesConsumed / (userProfile.calorieTarget + stats.caloriesBurned)) * 100, 100);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
            Hello, {userProfile.name}
          </h2>
          <p className="text-zinc-400 text-sm">Let's crush your goals today.</p>
        </div>
        <div className="bg-zinc-800 p-2 rounded-full">
            <div className="text-xs font-bold text-emerald-400 text-center">{Math.round(caloriesRemaining)}</div>
            <div className="text-[10px] text-zinc-500 text-center">Left</div>
        </div>
      </div>

      {/* Main Calorie Card */}
      <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
            <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
                style={{ width: `${progressPercent}%`}}
            />
        </div>
        <div className="flex justify-between items-center mt-2">
            <div className="text-center">
                <p className="text-sm text-zinc-400">Eaten</p>
                <p className="text-xl font-bold text-white">{stats.caloriesConsumed}</p>
            </div>
            <div className="flex flex-col items-center">
                <div className="w-24 h-24 relative flex items-center justify-center">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={32}
                            outerRadius={40}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                            ))}
                        </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <FireIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                    </div>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm text-zinc-400">Burned</p>
                <p className="text-xl font-bold text-orange-400">{stats.caloriesBurned}</p>
            </div>
        </div>
        
        {/* Insight */}
        <div className="mt-4 bg-zinc-950/50 rounded-lg p-3 text-sm text-zinc-300 border border-zinc-800/50 flex items-start gap-2">
            <BoltIcon className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
            <p className="italic">"{insight}"</p>
        </div>
      </div>

      {/* Macros */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 mb-1">Protein</p>
            <p className="text-lg font-bold text-emerald-400">{stats.protein}g</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 mb-1">Carbs</p>
            <p className="text-lg font-bold text-blue-400">{stats.carbs}g</p>
        </div>
        <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 mb-1">Fat</p>
            <p className="text-lg font-bold text-amber-400">{stats.fat}g</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
            onClick={() => setView(AppView.FOOD_LOG)}
            className="flex flex-col items-center justify-center p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition border border-zinc-700 hover:border-emerald-500/50 group"
        >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center mb-2 group-hover:bg-emerald-500/30">
                <PlusIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="font-medium text-sm">Log Food</span>
        </button>
        <button 
             onClick={() => setView(AppView.EXERCISE_LOG)}
            className="flex flex-col items-center justify-center p-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition border border-zinc-700 hover:border-orange-500/50 group"
        >
             <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center mb-2 group-hover:bg-orange-500/30">
                <BoltIcon className="w-6 h-6 text-orange-400" />
            </div>
            <span className="font-medium text-sm">Log Exercise</span>
        </button>
      </div>

      {/* Recent Activity */}
      <div>
        <h3 className="text-lg font-bold mb-3 text-zinc-200">Today's Log</h3>
        <div className="space-y-3">
            {foodLog.length === 0 && exerciseLog.length === 0 && (
                <div className="text-zinc-500 text-sm text-center py-6 bg-zinc-900 rounded-xl border border-zinc-800 border-dashed">
                    No activity recorded yet.
                </div>
            )}
            {/* Combine and sort logs by timestamp */}
            {[...foodLog, ...exerciseLog]
                .sort((a, b) => b.timestamp - a.timestamp)
                .map((item) => {
                    const isFood = 'protein' in item;
                    return (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isFood ? 'bg-emerald-900/30' : 'bg-orange-900/30'}`}>
                                    {isFood ? (
                                        item.imageUrl ? <img src={item.imageUrl} alt="" className="w-full h-full object-cover rounded-full opacity-80" /> : <div className="text-lg">🍎</div>
                                    ) : (
                                        <div className="text-lg">🏃</div>
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-sm text-zinc-200">{isFood ? (item as FoodEntry).name : (item as ExerciseEntry).activity}</p>
                                    <p className="text-xs text-zinc-500">
                                        {isFood 
                                            ? `${(item as FoodEntry).calories} kcal • P:${(item as FoodEntry).protein}g` 
                                            : `${(item as ExerciseEntry).durationMinutes} min`
                                        }
                                    </p>
                                </div>
                            </div>
                            <span className={`text-sm font-bold ${isFood ? 'text-zinc-300' : 'text-orange-400'}`}>
                                {isFood ? `+${(item as FoodEntry).calories}` : `-${(item as ExerciseEntry).caloriesBurned}`}
                            </span>
                        </div>
                    );
                })
            }
        </div>
      </div>
    </div>
  );
};

export default Dashboard;