import React, { useState } from 'react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    goal: 'maintain',
    name: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'goal' || name === 'name' ? value : Number(value)
    }));
  };

  const calculateCalories = (weight: number, height: number, age: number, goal: string) => {
    // Basic BMR calculation (Mifflin-St Jeor) assuming moderate activity for simplicity
    let bmr = 10 * weight + 6.25 * height - 5 * age + 5; 
    let tdee = bmr * 1.375; // Lightly active multiplier

    if (goal === 'lose') return Math.round(tdee - 500);
    if (goal === 'gain') return Math.round(tdee + 500);
    return Math.round(tdee);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.weight || !formData.height || !formData.age) return;

    const calorieTarget = calculateCalories(formData.weight, formData.height, formData.age, formData.goal!);
    
    onComplete({
      name: formData.name,
      weight: formData.weight,
      height: formData.height,
      age: formData.age,
      goal: formData.goal as any,
      calorieTarget
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="w-full max-w-md bg-zinc-900 p-8 rounded-2xl border border-zinc-800 shadow-2xl">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500 mb-2">
            FitAI Setup
        </h1>
        <p className="text-zinc-400 mb-6">Tell us a bit about yourself to personalize your AI tracker.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">First Name</label>
                <input 
                    name="name" type="text" required
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Alex"
                    onChange={handleChange}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Weight (kg)</label>
                    <input 
                        name="weight" type="number" required
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-xs font-medium text-zinc-500 mb-1">Height (cm)</label>
                    <input 
                        name="height" type="number" required
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        onChange={handleChange}
                    />
                </div>
            </div>
            <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Age</label>
                <input 
                    name="age" type="number" required
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={handleChange}
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-zinc-500 mb-1">Goal</label>
                <select 
                    name="goal" 
                    className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={handleChange}
                    value={formData.goal}
                >
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain</option>
                    <option value="gain">Gain Muscle</option>
                </select>
            </div>

            <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl mt-4 transition shadow-lg shadow-emerald-900/20">
                Start Tracking
            </button>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;