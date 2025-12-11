import React, { useState, useRef } from 'react';
import { AppView, FoodEntry } from '../types';
import { analyzeFoodImage } from '../services/geminiService';
import { CameraIcon, PlusIcon } from './Icons';

interface FoodLoggerProps {
  setView: (view: AppView) => void;
  onAddFood: (entry: FoodEntry) => void;
}

const FoodLogger: React.FC<FoodLoggerProps> = ({ setView, onAddFood }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract base64 data without prefix
      const base64Data = imagePreview.split(',')[1];
      const result = await analyzeFoodImage(base64Data);

      const newEntry: FoodEntry = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        name: result.name,
        calories: result.calories,
        protein: result.protein,
        carbs: result.carbs,
        fat: result.fat,
        imageUrl: imagePreview
      };

      onAddFood(newEntry);
      setView(AppView.DASHBOARD);
    } catch (err) {
      setError("Could not analyze food. Please try again or ensure the photo is clear.");
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={() => setView(AppView.DASHBOARD)} className="text-zinc-400 hover:text-white mr-4">
           ← Back
        </button>
        <h2 className="text-xl font-bold">Log Meal</h2>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-6">
        {imagePreview ? (
          <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-zinc-700 shadow-2xl">
            <img src={imagePreview} alt="Food Preview" className="w-full h-full object-cover" />
            <button 
                onClick={() => { setImagePreview(null); setError(null); }}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70"
            >
                ✕
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm aspect-square rounded-2xl border-2 border-dashed border-zinc-700 flex flex-col items-center justify-center bg-zinc-900/50 hover:bg-zinc-900 hover:border-emerald-500/50 cursor-pointer transition-all group"
          >
            <CameraIcon className="w-16 h-16 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
            <p className="mt-4 text-zinc-500 font-medium group-hover:text-zinc-300">Tap to take photo</p>
          </div>
        )}

        <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleFileChange}
            capture="environment" // Favors rear camera on mobile
        />

        {error && (
            <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-lg text-sm text-center max-w-sm">
                {error}
            </div>
        )}

        {imagePreview && !isAnalyzing && (
            <button
                onClick={handleAnalyze}
                className="w-full max-w-sm py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-900/20 transition-all flex items-center justify-center gap-2"
            >
                <PlusIcon className="w-5 h-5" />
                Analyze & Log
            </button>
        )}

        {isAnalyzing && (
            <div className="flex flex-col items-center space-y-3">
                <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-emerald-400 animate-pulse font-medium">Gemini is analyzing...</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default FoodLogger;