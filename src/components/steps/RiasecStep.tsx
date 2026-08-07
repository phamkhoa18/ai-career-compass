'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { riasecQuestions, RIASEC_GROUP_INFO } from '@/data/riasec-questions';
import { RIASEC_ICONS } from '@/components/ui/riasec-icons';
import { ChevronLeft, ChevronRight, LayoutGrid, Check } from 'lucide-react';

const LIKERT = [
  { value: 0, emoji: '🚫', label: 'Không phù hợp', color: '#ef4444', bg: 'hover:bg-red-50' },
  { value: 1, emoji: '😐', label: 'Bình thường', color: '#6b7280', bg: 'hover:bg-gray-50' },
  { value: 2, emoji: '🙂', label: 'Có hứng thú', color: '#f59e0b', bg: 'hover:bg-amber-50' },
  { value: 3, emoji: '😊', label: 'Thích', color: '#10b981', bg: 'hover:bg-emerald-50' },
  { value: 4, emoji: '🤩', label: 'Rất phù hợp', color: '#22c55e', bg: 'hover:bg-green-50' },
];

const GROUPS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

export default function RiasecStep() {
  const { state, updateData } = useAssessment();
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);

  const activeGroup = GROUPS[activeGroupIndex];
  const groupQuestions = riasecQuestions.filter(q => q.group === activeGroup);
  const info = RIASEC_GROUP_INFO[activeGroup];
  const GroupIcon = RIASEC_ICONS[activeGroup];

  // Scroll to top when changing group
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeGroupIndex]);

  const handleAnswer = (questionIndex: number, value: number) => {
    const newAns = [...state.data.riasecAnswers];
    newAns[questionIndex] = value;
    
    // Recalculate scores
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    riasecQuestions.forEach((rq, idx) => {
      if (newAns[idx] !== -1) {
        scores[rq.group] += newAns[idx];
      }
    });
    
    updateData({ riasecAnswers: newAns, riasecScores: scores });
  };

  const setAllInGroup = (value: number) => {
    const newAns = [...state.data.riasecAnswers];
    riasecQuestions.forEach((q, idx) => {
      if (q.group === activeGroup) {
        newAns[idx] = value;
      }
    });
    
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    riasecQuestions.forEach((rq, idx) => {
      if (newAns[idx] !== -1) {
        scores[rq.group] += newAns[idx];
      }
    });
    
    updateData({ riasecAnswers: newAns, riasecScores: scores });
  };

  const groupProgress = useMemo(() => {
    return GROUPS.map(g => {
      const qInGroup = riasecQuestions.filter(q => q.group === g);
      const answered = qInGroup.filter(q => state.data.riasecAnswers[q.id - 1] !== -1).length;
      return { group: g, answered, total: qInGroup.length, isComplete: answered === qInGroup.length };
    });
  }, [state.data.riasecAnswers]);

  const totalAnswered = state.data.riasecAnswers.filter(a => a !== -1).length;

  return (
    <div className="animate-fade-in-up -mx-1 md:mx-0">
      <div className="text-center mb-4 md:mb-6">
        <h2 className="text-lg md:text-2xl font-bold text-text-main mb-2">Trắc nghiệm RIASEC</h2>
        <p className="text-sm text-text-secondary">Đã trả lời: {totalAnswered}/60 câu</p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Group Tabs Navigation */}
        <div className="flex flex-wrap md:flex-nowrap gap-2 md:gap-3 mb-6 bg-gray-50/50 p-2 rounded-2xl border border-gray-100">
          {GROUPS.map((g, idx) => {
            const isActive = idx === activeGroupIndex;
            const progress = groupProgress.find(p => p.group === g);
            const gi = RIASEC_GROUP_INFO[g];
            const Icon = RIASEC_ICONS[g];
            
            return (
              <button
                key={g}
                onClick={() => setActiveGroupIndex(idx)}
                className={`flex-1 min-w-[30%] md:min-w-0 flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-300 relative overflow-hidden
                  ${isActive ? 'bg-white shadow-md scale-[1.02]' : 'hover:bg-white/60'}`}
                style={isActive ? { borderBottom: `3px solid ${gi.color}` } : {}}
              >
                <div className={`mb-1 transition-colors ${isActive ? 'text-text-main' : 'text-gray-400'}`}
                  style={isActive ? { color: gi.color } : {}}>
                  <Icon size={isActive ? 22 : 18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <div className={`text-[10px] md:text-xs font-bold ${isActive ? 'text-text-main' : 'text-gray-500'}`}>
                  {gi.nameVi}
                </div>
                
                {/* Completion badge */}
                {progress?.isComplete && (
                  <div className="absolute top-1 right-1 md:top-2 md:right-2 text-white rounded-full p-[2px]" style={{ backgroundColor: gi.color }}>
                    <Check size={10} strokeWidth={4} />
                  </div>
                )}
                
                {/* Progress bar line for uncompleted */}
                {!progress?.isComplete && (
                  <div className="absolute bottom-0 left-0 h-1 bg-gray-100 w-full opacity-60">
                    <div className="h-full" style={{ width: `${(progress?.answered || 0) * 10}%`, backgroundColor: gi.color }} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Current Group Header */}
        <div className="bg-white rounded-3xl p-5 md:p-6 mb-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md"
              style={{ backgroundColor: info.color }}>
              <GroupIcon size={28} />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-bold text-text-main">Nhóm {info.nameVi} ({info.name})</h3>
              <p className="text-xs md:text-sm text-text-light">{info.description}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setAllInGroup(0)}
            className="text-xs font-semibold px-3 py-2 bg-gray-100 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors border border-gray-200 whitespace-nowrap"
          >
            Chọn "Không phù hợp" tất cả
          </button>
        </div>

        {/* Questions List */}
        <div className="space-y-4 md:space-y-6">
          {groupQuestions.map((q, localIdx) => {
            const globalIdx = q.id - 1;
            const currentAnswer = state.data.riasecAnswers[globalIdx];
            
            return (
              <div key={q.id} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 transition-all hover:shadow-md">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5"
                    style={{ backgroundColor: info.color }}>
                    {localIdx + 1}
                  </div>
                  <h4 className="text-sm md:text-base font-bold text-text-main leading-relaxed">
                    {q.question}
                  </h4>
                </div>

                <div className="grid grid-cols-5 gap-1.5 md:gap-3 pl-0 md:pl-10">
                  {LIKERT.map((opt) => {
                    const isSelected = currentAnswer === opt.value;
                    return (
                      <button 
                        key={opt.value} 
                        onClick={() => handleAnswer(globalIdx, opt.value)}
                        className={`group relative flex flex-col items-center justify-center gap-1 py-2 md:py-3 rounded-xl border-2 cursor-pointer transition-all duration-200
                          ${isSelected
                            ? 'border-current shadow-md scale-[1.03]'
                            : `border-transparent bg-gray-50 ${opt.bg} hover:border-gray-200`
                          }`}
                        style={isSelected ? {
                          borderColor: opt.color,
                          backgroundColor: `${opt.color}15`,
                        } : undefined}
                      >
                        <span className={`text-xl md:text-2xl transition-transform ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                          {opt.emoji}
                        </span>
                        <span className={`text-[9px] md:text-[10px] font-semibold leading-tight text-center px-0.5
                          ${isSelected ? 'text-text-main' : 'text-gray-400 group-hover:text-gray-600'}`}>
                          {opt.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Internal Pagination */}
        <div className="flex items-center justify-between mt-8 mb-4">
          <button 
            onClick={() => setActiveGroupIndex(Math.max(0, activeGroupIndex - 1))}
            disabled={activeGroupIndex === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 text-sm font-semibold text-text-secondary disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={18} /> Nhóm trước
          </button>
          
          <div className="text-sm font-bold text-text-light">
            {activeGroupIndex + 1} / 6
          </div>

          <button 
            onClick={() => setActiveGroupIndex(Math.min(5, activeGroupIndex + 1))}
            disabled={activeGroupIndex === 5}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white text-sm font-bold shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            style={{ backgroundColor: activeGroupIndex === 5 ? '#e5e7eb' : RIASEC_GROUP_INFO[GROUPS[activeGroupIndex + 1]]?.color || info.color }}
          >
            {activeGroupIndex === 5 ? 'Hết' : 'Nhóm tiếp'} <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
