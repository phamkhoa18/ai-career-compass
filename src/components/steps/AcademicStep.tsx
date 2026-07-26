'use client';

import React, { useEffect, useState } from 'react';
import { InputNumber } from 'antd';
import { useAssessment } from '@/contexts/AssessmentContext';
import { subjects } from '@/data/subjects';
import { BarChart3, Microscope, BookOpen, Globe, Bookmark, Heart, ChevronDown, ChevronUp } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const categoryMeta: Record<string, { text: string; Icon: LucideIcon; color: string; bg: string }> = {
  natural: { text: 'Khoa học Tự nhiên', Icon: Microscope, color: '#7CB8CC', bg: 'from-sky-50 to-blue-50' },
  social: { text: 'Khoa học Xã hội', Icon: BookOpen, color: '#E8899D', bg: 'from-pink-50 to-rose-50' },
  language: { text: 'Ngoại ngữ', Icon: Globe, color: '#B896D6', bg: 'from-purple-50 to-violet-50' },
  other: { text: 'Môn khác', Icon: Bookmark, color: '#7CC9A8', bg: 'from-emerald-50 to-green-50' },
};

function getScoreColor(score: number): string {
  if (score === 0) return '#E8E0E2';
  if (score < 5) return '#D85545';
  if (score < 6.5) return '#E8A838';
  if (score < 8) return '#7CB8CC';
  return '#2EAF7D';
}

function getScoreLabel(score: number): string {
  if (score === 0) return '';
  if (score < 5) return 'Yếu';
  if (score < 6.5) return 'TB';
  if (score < 8) return 'Khá';
  return 'Giỏi';
}

export default function AcademicStep() {
  const { state, updateData } = useAssessment();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (state.data.academicScores.length === 0) {
      updateData({ academicScores: subjects.map((sub) => ({ subject: sub.name, subjectKey: sub.key, score: 0 })) });
    }
  }, []);

  const handleScoreChange = (key: string, value: number | null) => {
    updateData({ academicScores: state.data.academicScores.map((item) => item.subjectKey === key ? { ...item, score: value || 0 } : item) });
  };

  const handleFavToggle = (name: string) => {
    const fav = state.data.favoriteSubjects;
    updateData({ favoriteSubjects: fav.includes(name) ? fav.filter((s) => s !== name) : [...fav, name] });
  };

  const grouped = subjects.reduce((acc, sub) => {
    if (!acc[sub.category]) acc[sub.category] = [];
    acc[sub.category].push(sub);
    return acc;
  }, {} as Record<string, typeof subjects>);

  const filledCount = state.data.academicScores.filter((s) => s.score > 0).length;
  const avgScore = filledCount > 0
    ? (state.data.academicScores.reduce((sum, s) => sum + s.score, 0) / filledCount).toFixed(1)
    : '0.0';

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-main mb-1">Học lực các môn</h2>
        <p className="text-sm text-text-secondary">Nhập điểm trung bình năm & chọn ❤️ môn yêu thích</p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 mb-5 text-center">
        <div>
          <div className="text-2xl font-bold text-text-main">{filledCount}</div>
          <div className="text-[10px] text-text-light font-semibold">Đã nhập</div>
        </div>
        <div className="w-px h-8 bg-border-soft" />
        <div>
          <div className="text-2xl font-bold" style={{ color: getScoreColor(parseFloat(avgScore)) }}>{avgScore}</div>
          <div className="text-[10px] text-text-light font-semibold">Điểm TB</div>
        </div>
        <div className="w-px h-8 bg-border-soft" />
        <div>
          <div className="text-2xl font-bold text-primary">{state.data.favoriteSubjects.length}</div>
          <div className="text-[10px] text-text-light font-semibold">Yêu thích</div>
        </div>
      </div>

      {/* Subject groups */}
      <div className="space-y-3">
        {Object.entries(grouped).map(([cat, subs]) => {
          const meta = categoryMeta[cat];
          const isCollapsed = collapsed[cat];

          return (
            <div key={cat} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
              {/* Header */}
              <button onClick={() => setCollapsed({ ...collapsed, [cat]: !isCollapsed })}
                className={`w-full flex items-center justify-between p-3.5 md:p-4 bg-gradient-to-r ${meta.bg} cursor-pointer transition-all`}>
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: meta.color }}>
                    <meta.Icon size={16} className="text-white" strokeWidth={2} />
                  </div>
                  <span className="font-bold text-sm text-text-main">{meta.text}</span>
                  <span className="text-[10px] font-semibold text-text-light bg-white/70 px-2 py-0.5 rounded-full">{subs.length} môn</span>
                </div>
                {isCollapsed ? <ChevronDown size={16} className="text-text-light" /> : <ChevronUp size={16} className="text-text-light" />}
              </button>

              {/* Subjects */}
              {!isCollapsed && (
                <div className="divide-y divide-gray-50">
                  {subs.map((sub) => {
                    const score = state.data.academicScores.find((s) => s.subjectKey === sub.key)?.score || 0;
                    const isFav = state.data.favoriteSubjects.includes(sub.name);
                    const scoreColor = getScoreColor(score);
                    const scoreLabel = getScoreLabel(score);

                    return (
                      <div key={sub.key} className="flex items-center gap-2 px-3.5 md:px-4 py-2.5 md:py-3 hover:bg-gray-50/50 transition-colors">
                        {/* Fav button */}
                        <button onClick={() => handleFavToggle(sub.name)}
                          className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 cursor-pointer
                            ${isFav ? 'bg-primary text-white shadow-sm scale-105' : 'bg-gray-100 text-text-light hover:bg-primary-light hover:text-primary'}`}>
                          <Heart size={14} strokeWidth={2} fill={isFav ? 'currentColor' : 'none'} />
                        </button>

                        {/* Name */}
                        <span className="flex-1 font-semibold text-sm text-text-main">{sub.name}</span>

                        {/* Score label */}
                        {scoreLabel && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: scoreColor }}>
                            {scoreLabel}
                          </span>
                        )}

                        {/* Score visual bar */}
                        <div className="w-12 h-1.5 rounded-full bg-gray-100 overflow-hidden hidden md:block">
                          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${(score / 10) * 100}%`, backgroundColor: scoreColor }} />
                        </div>

                        {/* Input */}
                        <InputNumber min={0} max={10} step={0.1} value={score || undefined} placeholder="0.0"
                          onChange={(val) => handleScoreChange(sub.key, val)}
                          className="!w-[72px] !rounded-xl" size="small"
                          style={{ borderColor: score > 0 ? scoreColor : undefined }}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Favorites summary */}
      {state.data.favoriteSubjects.length > 0 && (
        <div className="mt-4 p-3.5 bg-gradient-to-r from-primary-light/40 to-lavender-light/40 rounded-2xl animate-fade-in">
          <p className="text-xs font-bold text-text-main mb-2 flex items-center gap-1.5">
            <Heart size={14} className="text-primary" fill="currentColor" /> Môn yêu thích ({state.data.favoriteSubjects.length}):
          </p>
          <div className="flex flex-wrap gap-1.5">
            {state.data.favoriteSubjects.map((sub) => (
              <span key={sub} className="px-2.5 py-1 bg-white/80 text-primary-dark text-xs font-semibold rounded-full shadow-sm">{sub}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
