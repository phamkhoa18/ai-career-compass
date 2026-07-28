'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Drawer } from 'antd';
import { useAssessment } from '@/contexts/AssessmentContext';
import { riasecQuestions, RIASEC_GROUP_INFO } from '@/data/riasec-questions';
import { RIASEC_ICONS } from '@/components/ui/riasec-icons';
import { Microscope, ChevronLeft, ChevronRight, ThumbsDown, Frown, Minus, Smile, ThumbsUp, LayoutGrid } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const LIKERT: { value: number; emoji: string; label: string; Icon: LucideIcon; color: string; bg: string }[] = [
  { value: 1, emoji: '😣', label: 'Rất ghét', Icon: ThumbsDown, color: '#ef4444', bg: 'hover:bg-red-50' },
  { value: 2, emoji: '😕', label: 'Không thích', Icon: Frown, color: '#f59e0b', bg: 'hover:bg-amber-50' },
  { value: 3, emoji: '😐', label: 'Bình thường', Icon: Minus, color: '#6b7280', bg: 'hover:bg-gray-50' },
  { value: 4, emoji: '😊', label: 'Thích', Icon: Smile, color: '#10b981', bg: 'hover:bg-emerald-50' },
  { value: 5, emoji: '🤩', label: 'Rất thích', Icon: ThumbsUp, color: '#22c55e', bg: 'hover:bg-green-50' },
];

const GROUPS = ['R', 'I', 'A', 'S', 'E', 'C'] as const;

export default function RiasecStep() {
  const { state, updateData } = useAssessment();
  const [currentQ, setCurrentQ] = useState(0);
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [drawerVisible, setDrawerVisible] = useState(false);

  const q = riasecQuestions[currentQ];
  const info = RIASEC_GROUP_INFO[q.group];
  const GroupIcon = RIASEC_ICONS[q.group];
  const total = riasecQuestions.length;
  const answered = state.data.riasecAnswers.filter((a) => a > 0).length;
  const pct = Math.round((answered / total) * 100);
  const currentAnswer = state.data.riasecAnswers[currentQ];

  const goTo = useCallback((idx: number) => {
    setAnimDir(idx > currentQ ? 'right' : 'left');
    setCurrentQ(idx);
  }, [currentQ]);

  const handleAnswer = useCallback((value: number) => {
    const newAns = [...state.data.riasecAnswers];
    newAns[currentQ] = value;
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    riasecQuestions.forEach((rq, idx) => { if (newAns[idx] > 0) scores[rq.group] += newAns[idx]; });
    updateData({ riasecAnswers: newAns, riasecScores: scores });
    if (currentQ < total - 1) setTimeout(() => { setAnimDir('right'); setCurrentQ(currentQ + 1); }, 350);
  }, [currentQ, state.data.riasecAnswers, total, updateData]);

  const topCode = useMemo(() => {
    return (Object.entries(state.data.riasecScores) as [string, number][])
      .sort((a, b) => b[1] - a[1]).slice(0, 3).map(([k]) => k).join('');
  }, [state.data.riasecScores]);

  return (
    <div className="animate-fade-in-up -mx-1 md:mx-0">
      {/* Minimal header */}
      <div className="text-center mb-4">
        <h2 className="text-lg md:text-xl font-bold text-text-main">Trắc nghiệm RIASEC</h2>
      </div>

      <div className="max-w-xl mx-auto">
        {/* ===== Progress ===== */}
        <div className="mb-4">
          <div className="flex items-end justify-between mb-1.5">
            <div className="flex items-end gap-3">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-text-main leading-none">{currentQ + 1}</span>
                <span className="text-sm text-text-light font-semibold">/ {total}</span>
              </div>
              <button 
                onClick={() => setDrawerVisible(true)}
                className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-white border border-gray-200 hover:border-primary/50 hover:text-primary text-text-light transition-all flex items-center justify-center shadow-sm cursor-pointer"
                title="Xem danh sách câu hỏi"
              >
                <LayoutGrid size={16} strokeWidth={2.5} />
              </button>
            </div>
            <div className="text-right">
              <span className="text-sm font-bold" style={{ color: pct >= 80 ? '#22c55e' : pct >= 50 ? '#f59e0b' : '#E8899D' }}>{pct}%</span>
            </div>
          </div>
          {/* Segmented progress */}
          <div className="flex gap-[2px] h-1.5 rounded-full overflow-hidden">
            {GROUPS.map((g) => {
              const groupQs = riasecQuestions.filter((rq) => rq.group === g);
              const groupAnswered = groupQs.filter((_, idx) => {
                const globalIdx = riasecQuestions.indexOf(groupQs[idx]);
                return state.data.riasecAnswers[globalIdx] > 0;
              }).length;
              const groupPct = (groupAnswered / groupQs.length) * 100;
              const gi = RIASEC_GROUP_INFO[g];
              return (
                <div key={g} className="flex-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${groupPct}%`, backgroundColor: gi.color }} />
                </div>
              );
            })}
          </div>
          {/* Group labels */}
          <div className="flex mt-1">
            {GROUPS.map((g) => {
              const isActive = q.group === g;
              return (
                <div key={g} className={`flex-1 text-center text-[9px] font-bold transition-all ${isActive ? 'text-text-main' : 'text-text-light/60'}`}
                  style={isActive ? { color: RIASEC_GROUP_INFO[g].color } : undefined}>
                  {g}
                </div>
              );
            })}
          </div>
        </div>

        {/* ===== Question Card ===== */}
        <div className="relative mb-4 overflow-hidden" key={`q-${currentQ}`}
          style={{ animation: `${animDir === 'right' ? 'slideInRight' : 'slideInLeft'} 0.3s ease-out` }}>
          <div className="rounded-3xl bg-white overflow-hidden">
            {/* Color bar */}
            <div className="h-1" style={{ backgroundColor: info.color }} />

            <div className="p-5 md:p-7">
              {/* Badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-white"
                  style={{ backgroundColor: info.color }}>
                  <GroupIcon size={12} strokeWidth={2.5} />
                  {info.nameVi}
                </div>
              </div>

              {/* Question */}
              <h3 className="text-lg md:text-xl font-bold text-text-main leading-snug mb-2">{q.question}</h3>
              <p className="text-xs md:text-sm text-text-light mb-6 leading-relaxed">{q.description}</p>

              {/* ===== Answer Grid ===== */}
              <div className="grid grid-cols-5 gap-2 md:gap-3">
                {LIKERT.map((opt) => {
                  const isSelected = currentAnswer === opt.value;
                  return (
                    <button key={opt.value} onClick={() => handleAnswer(opt.value)}
                      className={`group relative flex flex-col items-center gap-1.5 py-3.5 md:py-4 rounded-2xl border-2 cursor-pointer transition-all duration-300
                        ${isSelected
                          ? 'border-current shadow-xl scale-[1.08] -translate-y-1'
                          : `border-transparent bg-gray-50 ${opt.bg} hover:shadow-md hover:scale-[1.04] hover:-translate-y-0.5 active:scale-[0.97]`
                        }`}
                      style={isSelected ? {
                        borderColor: opt.color,
                        backgroundColor: `${opt.color}15`,
                        boxShadow: `0 8px 25px ${opt.color}30`,
                      } : undefined}
                    >
                      {/* Emoji */}
                      <span className={`text-2xl md:text-3xl transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`}>
                        {opt.emoji}
                      </span>

                      {/* Label */}
                      <span className={`text-[9px] md:text-[11px] font-semibold leading-tight text-center px-0.5 transition-colors
                        ${isSelected ? 'text-text-main' : 'text-text-light group-hover:text-text-secondary'}`}>
                        {opt.label}
                      </span>

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-md"
                          style={{ backgroundColor: opt.color }}>✓</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Navigation ===== */}
        <div className="flex items-center gap-3">
          <button onClick={() => goTo(Math.max(0, currentQ - 1))} disabled={currentQ === 0}
            className="w-11 h-11 rounded-xl bg-white shadow-sm border border-gray-100 flex items-center justify-center text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-md transition-all cursor-pointer">
            <ChevronLeft size={18} />
          </button>

          {/* Mini dots */}
          <div className="flex-1 flex gap-[2px] justify-center overflow-hidden max-h-3 flex-wrap">
            {Array.from({ length: total }, (_, i) => {
              const isAns = state.data.riasecAnswers[i] > 0;
              const isCur = i === currentQ;
              const gColor = RIASEC_GROUP_INFO[riasecQuestions[i].group].color;
              return (
                <button key={i} onClick={() => goTo(i)} className="cursor-pointer transition-all duration-200 rounded-full flex-shrink-0"
                  style={{ width: isCur ? 14 : 5, height: 5, backgroundColor: isCur ? gColor : isAns ? `${gColor}88` : '#E8E0E2' }} />
              );
            })}
          </div>

          <button onClick={() => goTo(Math.min(total - 1, currentQ + 1))} disabled={currentQ === total - 1}
            className="w-11 h-11 rounded-xl text-white shadow-md flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:shadow-lg transition-all cursor-pointer"
            style={{ backgroundColor: info.color }}>
            <ChevronRight size={18} />
          </button>
        </div>

        {/* ===== Live Code ===== */}
        {answered >= 6 && (
          <div className="mt-5 flex items-center justify-center gap-4 bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-sm border border-gray-100">
            <div className="text-center">
              <div className="text-[9px] text-text-light font-semibold uppercase tracking-widest mb-0.5">Mã RIASEC</div>
              <div className="text-xl md:text-2xl font-black gradient-text tracking-[0.2em]">{topCode || '...'}</div>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="flex gap-1.5">
              {GROUPS.map((g) => {
                const score = state.data.riasecScores[g];
                const gi = RIASEC_GROUP_INFO[g];
                const pctScore = Math.round((score / 35) * 100);
                return (
                  <div key={g} className="text-center">
                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg mb-0.5 flex items-center justify-center text-[10px] font-black"
                      style={{ backgroundColor: `${gi.color}20`, color: gi.color }}>{g}</div>
                    <div className="w-7 md:w-8 h-1 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pctScore}%`, backgroundColor: gi.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* ===== Question Grid Drawer ===== */}
      <Drawer
        title={<div className="font-bold text-text-main text-lg">Danh sách câu hỏi <span className="text-sm font-semibold text-text-light ml-2">({answered}/{total})</span></div>}
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        size="large"
        styles={{ body: { padding: '20px' }, header: { padding: '16px 20px', borderBottom: '1px solid #f0f0f0' } }}
        className="rounded-t-[24px]"
      >
        <div className="grid grid-cols-6 md:grid-cols-10 gap-2 md:gap-3">
          {riasecQuestions.map((rq, idx) => {
            const isAnswered = state.data.riasecAnswers[idx] > 0;
            const isCurrent = currentQ === idx;
            const info = RIASEC_GROUP_INFO[rq.group];
            return (
              <button
                key={idx}
                onClick={() => { goTo(idx); setDrawerVisible(false); }}
                className={`relative flex items-center justify-center aspect-square rounded-xl text-sm font-bold transition-all duration-300 cursor-pointer
                  ${isCurrent ? 'ring-2 ring-offset-2 scale-110 z-10 shadow-lg' : 'hover:scale-105 hover:shadow-md'}
                  ${isAnswered ? 'text-white shadow-sm' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}
                style={{
                  ...(isAnswered ? { backgroundColor: info.color, borderColor: info.color } : {}),
                  ...(isCurrent ? { ringColor: info.color } : {})
                }}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        
        <div className="mt-8 flex flex-wrap gap-3 justify-center text-xs font-semibold text-text-light">
          {GROUPS.map((g) => (
            <div key={g} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-100">
              <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: RIASEC_GROUP_INFO[g].color }} />
              <span>{g} ({RIASEC_GROUP_INFO[g].nameVi})</span>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
