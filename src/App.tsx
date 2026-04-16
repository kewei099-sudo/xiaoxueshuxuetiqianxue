import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Dashboard from './components/Dashboard';
import LearningView from './components/LearningView';
import { ViewType } from './types';

export default function App() {
  const [view, setView] = useState<ViewType>('dashboard');
  const [learnedIds, setLearnedIds] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('math_learned_ids');
    if (saved) {
      try {
        setLearnedIds(new Set(JSON.parse(saved)));
      } catch (e) {
        console.error('Failed to parse saved progress', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('math_learned_ids', JSON.stringify(Array.from(learnedIds)));
    }
  }, [learnedIds, isLoaded]);

  const toggleLearned = (id: string) => {
    setLearnedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#fcfdfc] font-sans selection:bg-[#4caf50]/20 selection:text-[#4caf50]">
      <AnimatePresence mode="wait">
        {view === 'dashboard' ? (
          <Dashboard 
            key="dashboard" 
            learnedIds={learnedIds} 
            onNavigate={setView} 
          />
        ) : (
          <LearningView 
            key="learning" 
            learnedIds={learnedIds} 
            toggleLearned={toggleLearned} 
            onNavigate={setView} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
