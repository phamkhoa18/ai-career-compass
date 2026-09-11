'use client';

import React, { useEffect, useState } from 'react';
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

// Mức học lực với giá trị quy đổi nội bộ
const GRADE_LEVELS = [
  { label: 'Xuất sắc', value: 9.5, color: '#16A34A', bg: 'bg-green-50', activeBg: 'bg-green-600', emoji: '🌟' },
  { label: 'Giỏi', value: 8.0, color: '#2563EB', bg: 'bg-blue-50', activeBg: 'bg-blue-600', emoji: '💪' },
  { label: 'Khá', value: 7.0, color: '#7C3AED', bg: 'bg-violet-50', activeBg: 'bg-violet-600', emoji: '👍' },
  { label: 'Trung bình', value: 6.0, color: '#D97706', bg: 'bg-amber-50', activeBg: 'bg-amber-600', emoji: '📖' },
  { label: 'Yếu', value: 4.0, color: '#EA580C', bg: 'bg-orange-50', activeBg: 'bg-orange-600', emoji: '📝' },
  { label: 'Kém', value: 2.0, color: '#DC2626', bg: 'bg-red-50', activeBg: 'bg-red-600', emoji: '⚠️' },
];

function getGradeFromScore(score: number): typeof GRADE_LEVELS[number] | null {
  if (score === 0) return null;
  // Find closest matching grade level
  return GRADE_LEVELS.reduce((closest, grade) =>
    Math.abs(grade.value - score) < Math.abs(closest.value - score) ? grade : closest
  );
}

function getScoreColor(score: number): string {
  const grade = getGradeFromScore(score);
  return grade?.color || '#E8E0E2';
}

export default function AcademicStep() {
  const { state, updateData } = useAssessment();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (state.data.academicScores.length === 0) {
      updateData({
        academicScores: subjects.filter(s => !['myThuat', 'amNhac', 'gdtc'].includes(s.key)).map((sub) => ({ subject: sub.name, subjectKey: sub.key, score: 0 })),
        aptitudeSubjects: subjects.filter(s => ['myThuat', 'amNhac', 'gdtc'].includes(s.key)).map((sub) => ({ subject: sub.name, subjectKey: sub.key, isLiked: false }))
      });
    }
  }, []);

  const handleGradeSelect = (key: string, gradeValue: number) => {
    const currentScore = state.data.academicScores.find(s => s.subjectKey === key)?.score || 0;
    // Toggle: if same grade is already selected, deselect it (set to 0)
    const newScore = currentScore === gradeValue ? 0 : gradeValue;
    updateData({ academicScores: state.data.academicScores.map((item) => item.subjectKey === key ? { ...item, score: newScore } : item) });
  };

  const handleAptitudeChange = (key: string, isLiked: boolean) => {
    updateData({ aptitudeSubjects: state.data.aptitudeSubjects.map((item) => item.subjectKey === key ? { ...item, isLiked } : item) });
  };

  const handleFavToggle = (name: string) => {
    const fav = state.data.favoriteSubjects;
    updateData({ favoriteSubjects: fav.includes(name) ? fav.filter((s) => s !== name) : [...fav, name] });
  };

  const academicSubjectsList = subjects.filter(s => !['myThuat', 'amNhac', 'gdtc'].includes(s.key));
  const aptitudeSubjectsList = subjects.filter(s => ['myThuat', 'amNhac', 'gdtc'].includes(s.key));

  const grouped = academicSubjectsList.reduce((acc, sub) => {
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
        <p className="text-sm text-text-secondary">Chọn mức học lực cho từng môn & chọn ❤️ môn yêu thích</p>
      </div>

      {/* Stats bar */}
      <div className="flex items-center justify-center gap-6 mb-5 text-center">
        <div>
          <div className="text-2xl font-bold text-text-main">{filledCount}</div>
          <div className="text-[10px] text-text-light font-semibold">Đã chọn</div>
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

      {/* Grade Legend */}
      <div className="flex flex-wrap justify-center gap-2 mb-4 px-2">
        {GRADE_LEVELS.map(g => (
          <div key={g.label} className="flex items-center gap-1 text-[10px] font-semibold" style={{ color: g.color }}>
            <span>{g.emoji}</span> {g.label}
          </div>
        ))}
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
                    const selectedGrade = getGradeFromScore(score);

                    return (
                      <div key={sub.key} className="px-3.5 md:px-4 py-3 hover:bg-gray-50/50 transition-colors">
                        {/* Top row: Fav + Subject name + selected grade badge */}
                        <div className="flex items-center gap-2 mb-2">
                          {/* Fav button */}
                          <button onClick={() => handleFavToggle(sub.name)}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 cursor-pointer
                              ${isFav ? 'bg-primary text-white shadow-sm scale-105' : 'bg-gray-100 text-text-light hover:bg-primary-light hover:text-primary'}`}>
                            <Heart size={13} strokeWidth={2} fill={isFav ? 'currentColor' : 'none'} />
                          </button>

                          {/* Name */}
                          <span className="flex-1 font-semibold text-sm text-text-main">{sub.name}</span>

                          {/* Selected grade badge */}
                          {selectedGrade && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white transition-all duration-300" style={{ backgroundColor: selectedGrade.color }}>
                              {selectedGrade.emoji} {selectedGrade.label}
                            </span>
                          )}
                        </div>

                        {/* Grade level pills */}
                        <div className="grid grid-cols-6 gap-1 pl-9">
                          {GRADE_LEVELS.map((grade) => {
                            const isSelected = score === grade.value;
                            return (
                              <button
                                key={grade.label}
                                onClick={() => handleGradeSelect(sub.key, grade.value)}
                                className={`relative flex flex-col items-center justify-center py-1.5 md:py-2 rounded-lg border-2 cursor-pointer transition-all duration-200
                                  ${isSelected
                                    ? 'border-current shadow-md scale-[1.03] text-white'
                                    : 'border-transparent bg-gray-50 hover:border-gray-200 text-gray-500 hover:text-gray-700'
                                  }`}
                                style={isSelected ? {
                                  borderColor: grade.color,
                                  backgroundColor: grade.color,
                                  color: '#fff',
                                } : undefined}
                              >
                                <span className={`text-[9px] md:text-[10px] font-bold leading-tight text-center`}>
                                  {grade.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Aptitude Subjects (Thích / Không thích) */}
      <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white">
        <div className="w-full flex items-center justify-between p-3.5 md:p-4 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ backgroundColor: '#F59E0B' }}>
              <Heart size={16} className="text-white" strokeWidth={2} />
            </div>
            <span className="font-bold text-sm text-text-main">Môn năng khiếu / Thể chất</span>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {aptitudeSubjectsList.map((sub) => {
            const isLiked = state.data.aptitudeSubjects?.find((s) => s.subjectKey === sub.key)?.isLiked || false;
            return (
              <div key={sub.key} className="flex items-center justify-between gap-2 px-3.5 md:px-4 py-3 hover:bg-gray-50/50 transition-colors">
                <span className="font-semibold text-sm text-text-main">{sub.name}</span>
                <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
                  <button onClick={() => handleAptitudeChange(sub.key, true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${isLiked ? 'bg-primary text-white shadow-sm' : 'text-text-secondary hover:text-text-main'}`}>
                    👍 Thích
                  </button>
                  <button onClick={() => handleAptitudeChange(sub.key, false)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${!isLiked ? 'bg-gray-300 text-text-main shadow-sm' : 'text-text-secondary hover:text-text-main'}`}>
                    👎 Không thích
                  </button>
                </div>
              </div>
            );
          })}
        </div>
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
