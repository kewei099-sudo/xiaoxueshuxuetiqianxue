import React from 'react';
import { motion } from 'motion/react';
import { CATEGORIES, KNOWLEDGE_POINTS } from '../constants';
import CircularProgress from './CircularProgress';
import ProgressBar from './ProgressBar';
import * as Icons from 'lucide-react';
import { ViewType } from '../types';

interface DashboardProps {
  key?: string;
  learnedIds: Set<string>;
  onNavigate: (view: ViewType) => void;
}

export default function Dashboard({ learnedIds, onNavigate }: DashboardProps) {
  const totalPoints = KNOWLEDGE_POINTS.length;
  const totalLearned = learnedIds.size;
  const totalPercentage = (totalLearned / totalPoints) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex flex-col"
    >
      {/* Header Section */}
      <header className="h-[100px] px-6 md:px-10 flex justify-between items-center bg-white border-b-2 border-primary-light">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-2xl">
            π
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-extrabold text-primary leading-tight">小学数学提前学</h1>
            <p className="text-xs text-text-muted">探索、练习、掌握</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden xs:block">
            <p className="text-xs text-text-muted">全书学习进度</p>
            <span className="font-bold text-primary">{totalLearned} / {totalPoints} 知识点</span>
          </div>
          <div className="relative">
            <CircularProgress percentage={totalPercentage} size={64} strokeWidth={6} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center gap-10 md:gap-16 p-6 md:p-10">
        {/* Sidebar Hint (Visual Only) */}
        <div className="hidden lg:flex absolute left-5 top-[120px] w-[60px] h-[500px] bg-white rounded-[30px] flex-col items-center py-5 gap-5 shadow-sm border border-gray-50">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm">🏠</div>
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm">🔍</div>
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm">📂</div>
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm">📊</div>
          <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm mt-auto">📤</div>
        </div>

        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onNavigate('learning')}
            className="bg-primary text-white px-10 md:px-16 py-5 md:py-6 rounded-full text-2xl md:text-3xl font-bold shadow-button flex items-center gap-4 group"
          >
            <span>进入提前学目录</span>
            <Icons.ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </motion.button>
          <p className="mt-4 text-text-muted text-base md:text-lg">今日推荐：学习“图形的平移与旋转”模块</p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {CATEGORIES.map((cat, idx) => {
            const catPoints = KNOWLEDGE_POINTS.filter(kp => kp.category === cat.name);
            const catLearned = catPoints.filter(kp => learnedIds.has(kp.id)).length;
            const Icon = (Icons as any)[cat.icon];

            return (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-6 rounded-[32px] shadow-card border border-primary/10 flex flex-col gap-4 hover:translate-y-[-4px] transition-transform"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: cat.bgColor, color: cat.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-text-main">{cat.name}</h3>
                  <div className="flex justify-between text-[13px] text-text-muted mt-1">
                    <span>已学 {Math.round((catLearned / catPoints.length) * 100)}%</span>
                    <span>{catLearned}/{catPoints.length}</span>
                  </div>
                </div>

                <ProgressBar 
                  current={catLearned} 
                  total={catPoints.length} 
                  color={cat.color} 
                />
              </motion.div>
            );
          })}
        </div>
      </main>

      <footer className="p-5 text-center text-text-muted text-xs">
        本应用所有学习数据已安全存储在本地浏览器 (Local Storage)
      </footer>
    </motion.div>
  );
}
