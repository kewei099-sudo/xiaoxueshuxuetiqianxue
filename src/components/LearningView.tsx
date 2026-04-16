import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { KNOWLEDGE_POINTS, CATEGORIES } from '../constants';
import { KnowledgePoint, ViewType } from '../types';
import * as Icons from 'lucide-react';

interface LearningViewProps {
  key?: string;
  learnedIds: Set<string>;
  toggleLearned: (id: string) => void;
  onNavigate: (view: ViewType) => void;
}

export default function LearningView({ learnedIds, toggleLearned, onNavigate }: LearningViewProps) {
  const [search, setSearch] = useState('');
  const [selectedKp, setSelectedKp] = useState<KnowledgePoint | null>(null);
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set([CATEGORIES[0].name]));
  const [expandedSubCats, setExpandedSubCats] = useState<Set<string>>(new Set());

  const toggleCat = (cat: string) => {
    const next = new Set(expandedCats);
    if (next.has(cat)) next.delete(cat);
    else next.add(cat);
    setExpandedCats(next);
  };

  const toggleSubCat = (sub: string) => {
    const next = new Set(expandedSubCats);
    if (next.has(sub)) next.delete(sub);
    else next.add(sub);
    setExpandedSubCats(next);
  };

  const filteredPoints = useMemo(() => {
    if (!search) return KNOWLEDGE_POINTS;
    return KNOWLEDGE_POINTS.filter(kp => 
      kp.name.includes(search) || 
      kp.subCategory.includes(search) || 
      kp.category.includes(search)
    );
  }, [search]);

  const groupedData = useMemo(() => {
    const groups: Record<string, Record<string, KnowledgePoint[]>> = {};
    filteredPoints.forEach(kp => {
      if (!groups[kp.category]) groups[kp.category] = {};
      if (!groups[kp.category][kp.subCategory]) groups[kp.category][kp.subCategory] = [];
      groups[kp.category][kp.subCategory].push(kp);
    });
    return groups;
  }, [filteredPoints]);

  const exportCSV = () => {
    const unlearned = KNOWLEDGE_POINTS.filter(kp => !learnedIds.has(kp.id));
    const header = "分类,子分类,知识点名称,年级\n";
    const rows = unlearned.map(kp => `${kp.category},${kp.subCategory},${kp.name},${kp.grade}`).join('\n');
    const blob = new Blob(["\ufeff" + header + rows], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "未学知识点课程表.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col md:flex-row h-screen bg-bg-natural overflow-hidden"
    >
      {/* Sidebar */}
      <div className="w-full md:w-80 bg-white border-r border-primary-light flex flex-col h-full shadow-sm">
        <div className="p-4 border-b border-primary-light">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4 text-sm font-bold"
          >
            <Icons.ChevronLeft className="w-4 h-4" />
            返回仪表盘
          </button>
          
          <div className="relative">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              placeholder="搜索知识点..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-primary-light/30 border-none rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {Object.entries(groupedData).map(([catName, subCats]) => {
            const catInfo = CATEGORIES.find(c => c.name === catName);
            const isExpanded = expandedCats.has(catName);
            const Icon = (Icons as any)[catInfo?.icon || 'BookOpen'];

            return (
              <div key={catName} className="space-y-1">
                <button 
                  onClick={() => toggleCat(catName)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-primary-light/20 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: catInfo?.bgColor }}>
                      <Icon className="w-4 h-4" style={{ color: catInfo?.color }} />
                    </div>
                    <span className="font-bold text-text-main text-sm">{catName}</span>
                  </div>
                  <Icons.ChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden pl-4 space-y-1"
                    >
                      {Object.entries(subCats).map(([subName, points]) => {
                        const isSubExpanded = expandedSubCats.has(subName);
                        return (
                          <div key={subName} className="space-y-1">
                            <button 
                              onClick={() => toggleSubCat(subName)}
                              className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary-light/10 transition-colors"
                            >
                              <span className="text-xs font-bold text-text-muted">{subName}</span>
                              <Icons.ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${isSubExpanded ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {isSubExpanded && (
                              <div className="space-y-1 pl-2">
                                {points.map(kp => (
                                  <div 
                                    key={kp.id}
                                    className={`flex items-center gap-2 p-2 rounded-lg transition-all cursor-pointer ${selectedKp?.id === kp.id ? 'bg-primary-light text-primary' : 'hover:bg-primary-light/10 text-text-main'}`}
                                    onClick={() => setSelectedKp(kp)}
                                  >
                                    <input 
                                      type="checkbox"
                                      checked={learnedIds.has(kp.id)}
                                      onChange={(e) => {
                                        e.stopPropagation();
                                        toggleLearned(kp.id);
                                      }}
                                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                    />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold truncate">{kp.name}</p>
                                      <p className="text-[10px] opacity-60">{kp.grade}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-primary-light">
          <button 
            onClick={exportCSV}
            className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-primary text-primary rounded-2xl font-bold hover:bg-primary hover:text-white transition-all text-sm shadow-sm"
          >
            <Icons.Download className="w-4 h-4" />
            导出课程表
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedKp ? (
          <div className="flex-1 flex flex-col">
            <div className="p-4 md:p-6 border-b border-primary-light flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-primary-light text-primary text-[10px] font-bold rounded-full">{selectedKp.category}</span>
                  <span className="text-[10px] text-text-muted font-bold">{selectedKp.subCategory}</span>
                </div>
                <h2 className="text-xl font-extrabold text-text-main">{selectedKp.name}</h2>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => toggleLearned(selectedKp.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${learnedIds.has(selectedKp.id) ? 'bg-primary-light text-primary' : 'bg-gray-100 text-text-muted hover:bg-gray-200'}`}
                >
                  {learnedIds.has(selectedKp.id) ? <Icons.CheckCircle2 className="w-4 h-4" /> : <Icons.Circle className="w-4 h-4" />}
                  {learnedIds.has(selectedKp.id) ? '已掌握' : '标记掌握'}
                </button>
              </div>
            </div>
            <div className="flex-1 relative bg-bg-natural">
              <iframe 
                src={`./knowledge/${selectedKp.name}.html`}
                className="w-full h-full border-none"
                title={selectedKp.name}
                onError={(e) => console.log('Iframe load error', e)}
              />
              {/* Fallback overlay for missing files in demo */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <div className="text-center">
                  <Icons.BookOpen className="w-20 h-20 mx-auto mb-4 text-primary" />
                  <p className="text-text-muted font-bold">正在加载知识点详情...</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-bg-natural">
            <div className="w-24 h-24 bg-white rounded-3xl shadow-card flex items-center justify-center mb-6 border border-primary-light">
              <Icons.MousePointer2 className="w-10 h-10 text-primary animate-bounce" />
            </div>
            <h2 className="text-2xl font-extrabold text-text-main mb-2">准备好开始学习了吗？</h2>
            <p className="text-text-muted max-w-sm font-medium">请在左侧目录中选择一个知识点，开启你的数学探索之旅吧！</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
