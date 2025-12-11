import React, { useState } from 'react';
import { AppView, ExerciseEntry } from '../types';
import { analyzeExerciseText } from '../services/geminiService';
import { BoltIcon, DumbbellIcon } from './Icons';

interface ExerciseLoggerProps {
  setView: (view: AppView) => void;
  onAddExercise: (entry: ExerciseEntry) => void;
  userWeight: number;
}

const ExerciseLogger: React.FC<ExerciseLoggerProps> = ({ setView, onAddExercise, userWeight }) => {
  const [text, setText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsProcessing(true);
    setError(null);

    try {
      const result = await analyzeExerciseText(text, userWeight);
      
      const newEntry: ExerciseEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        activity: result.activity,
        durationMinutes: result.durationMinutes,
        caloriesBurned: result.caloriesBurned
      };

      onAddExercise(newEntry);
      setView(AppView.DASHBOARD);
    } catch (err) {
      setError("Could not log exercise. Try being more specific (e.g., 'Ran 5km in 30 mins').");
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => setView(AppView.DASHBOARD)} className="text-zinc-400 hover:text-white mr-4">
           ← Back
        </button>
        <h2 className="text-xl font-bold">Log Workout</h2>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
            <div className="flex justify-center mb-6">
                <div className="p-4 bg-orange-500/10 rounded-full">
                    <DumbbellIcon className="w-10 h-10 text-orange-500" />
                </div>
            </div>
            
            <h3 className="text-center text-lg font-medium mb-2 text-white">Describe your activity</h3>
            <p className="text-center text-zinc-500 text-sm mb-6">
                Gemini will identify the exercise and estimate calories burned.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="e.g. I lifted weights for 45 minutes and did 10 minutes of cardio."
                    className="w-full h-32 bg-zinc-950 border border-zinc-700 rounded-xl p-4 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all"
                    disabled={isProcessing}
                />
                
                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900/20 p-2 rounded">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isProcessing || !text.trim()}
                    className={`w-full py-3.5 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2
                        ${isProcessing || !text.trim() ? 'bg-zinc-700 cursor-not-allowed text-zinc-400' : 'bg-orange-600 hover:bg-orange-500 shadow-orange-900/20'}`}
                >
                    {isProcessing ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Calculating...
                        </>
                    ) : (
                        <>
                            <BoltIcon className="w-5 h-5" />
                            Calculate Burn
                        </>
                    )}
                </button>
            </form>
        </div>
        
        <div className="mt-8 text-center">
            <p className="text-xs text-zinc-500 uppercase tracking-wider font-bold mb-4">Examples</p>
            <div className="flex flex-wrap gap-2 justify-center">
                {["Ran 5km in 25 mins", "30 mins yoga", "High intensity interval training 20m"].map(ex => (
                    <button 
                        key={ex}
                        onClick={() => setText(ex)}
                        className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-full transition"
                    >
                        {ex}
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLogger;