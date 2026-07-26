'use client';

import React from 'react';
import { Slider } from 'antd';
import { useAssessment } from '@/contexts/AssessmentContext';
import { interestOptions, softSkillsList } from '@/data/subjects';
import {
  Lightbulb, CheckCircle,
  MessageCircle, Users, Zap, Crown, Clock, Palette, Brain, RefreshCw,
  Monitor, Rocket, Languages, Brush, TrendingUp, Stethoscope, GraduationCap,
  Dumbbell, Music, Plane, ChefHat, TreePine, Camera, Gavel, SmilePlus,
  Building2, Gamepad2, Atom, Shield, HeartHandshake,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const skillIcons: Record<string, LucideIcon> = {
  communication: MessageCircle, teamwork: Users, problemSolving: Zap,
  leadership: Crown, timeManagement: Clock, creativity: Palette,
  criticalThinking: Brain, adaptability: RefreshCw,
};

const interestIcons: Record<string, { Icon: LucideIcon; color: string }> = {
  computer: { Icon: Monitor, color: '#6366f1' }, space: { Icon: Rocket, color: '#8b5cf6' },
  language: { Icon: Languages, color: '#ec4899' }, art: { Icon: Brush, color: '#f59e0b' },
  business: { Icon: TrendingUp, color: '#10b981' }, health: { Icon: Stethoscope, color: '#ef4444' },
  education: { Icon: GraduationCap, color: '#3b82f6' }, sport: { Icon: Dumbbell, color: '#f97316' },
  music: { Icon: Music, color: '#a855f7' }, travel: { Icon: Plane, color: '#06b6d4' },
  cooking: { Icon: ChefHat, color: '#ea580c' }, environment: { Icon: TreePine, color: '#22c55e' },
  media: { Icon: Camera, color: '#e11d48' }, law: { Icon: Gavel, color: '#64748b' },
  psychology: { Icon: SmilePlus, color: '#d946ef' }, architecture: { Icon: Building2, color: '#78716c' },
  gaming: { Icon: Gamepad2, color: '#7c3aed' }, science: { Icon: Atom, color: '#0ea5e9' },
  military: { Icon: Shield, color: '#059669' }, social: { Icon: HeartHandshake, color: '#f43f5e' },
};

const levelLabels: Record<number, { text: string; color: string; emoji: string }> = {
  1: { text: 'Yếu', color: '#ef4444', emoji: '😅' },
  2: { text: 'TB', color: '#f59e0b', emoji: '🙂' },
  3: { text: 'Khá', color: '#6b7280', emoji: '😊' },
  4: { text: 'Tốt', color: '#10b981', emoji: '😄' },
  5: { text: 'Giỏi', color: '#22c55e', emoji: '🌟' },
};

export default function InterestsStep() {
  const { state, updateData } = useAssessment();

  const handleSkillChange = (key: string, value: number) => {
    updateData({ softSkills: { ...state.data.softSkills, [key]: value } });
  };

  const handleInterestToggle = (key: string) => {
    const cur = state.data.interests;
    updateData({ interests: cur.includes(key) ? cur.filter((i) => i !== key) : [...cur, key] });
  };

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-main mb-1">Sở thích & Kỹ năng</h2>
        <p className="text-sm text-text-secondary">Tự đánh giá kỹ năng và chọn những gì bạn yêu thích</p>
      </div>

      {/* ===== Soft Skills ===== */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-primary flex items-center justify-center text-white">
            <Zap size={14} />
          </div>
          <h3 className="text-base font-bold text-text-main">Kỹ năng mềm</h3>
          <span className="text-[10px] font-semibold text-text-light bg-gray-100 px-2 py-0.5 rounded-full">Kéo thanh trượt 1→5</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {softSkillsList.map((skill) => {
            const value = state.data.softSkills[skill.key as keyof typeof state.data.softSkills];
            const level = levelLabels[value] || levelLabels[3];
            const SkillIcon = skillIcons[skill.key] || Zap;

            return (
              <div key={skill.key} className="bg-white rounded-2xl border border-gray-100 p-3.5 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2">
                    <SkillIcon size={16} style={{ color: level.color }} strokeWidth={2} />
                    <span className="font-bold text-sm text-text-main">{skill.name}</span>
                  </div>
                  <span className="text-sm">{level.emoji}</span>
                </div>
                <Slider min={1} max={5} step={1}
                  marks={{ 1: '1', 3: '3', 5: '5' }}
                  value={value}
                  onChange={(val) => handleSkillChange(skill.key, val)}
                  tooltip={{ formatter: (val) => `${levelLabels[val || 3]?.emoji} ${levelLabels[val || 3]?.text}` }}
                  styles={{ track: { backgroundColor: level.color }, handle: { borderColor: level.color } }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== Interests Grid ===== */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-cool flex items-center justify-center text-white">
            <Palette size={14} />
          </div>
          <h3 className="text-base font-bold text-text-main">Sở thích</h3>
          <span className="text-[10px] font-semibold text-text-light bg-gray-100 px-2 py-0.5 rounded-full">Nhấn để chọn</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-2.5">
          {interestOptions.map((interest) => {
            const isSelected = state.data.interests.includes(interest.key);
            const meta = interestIcons[interest.key] || { Icon: Zap, color: '#6b7280' };
            const IIcon = meta.Icon;

            return (
              <button key={interest.key} onClick={() => handleInterestToggle(interest.key)}
                className={`relative flex flex-col items-center gap-1.5 p-3 md:p-3.5 rounded-2xl border-2 cursor-pointer transition-all duration-300 text-center
                  ${isSelected
                    ? 'border-current shadow-lg scale-[1.03] -translate-y-0.5'
                    : 'border-transparent bg-gray-50 hover:bg-white hover:shadow-md hover:scale-[1.02] active:scale-[0.97]'
                  }`}
                style={isSelected ? { borderColor: meta.color, backgroundColor: `${meta.color}10` } : undefined}
              >
                <div className={`w-10 h-10 md:w-11 md:h-11 rounded-xl flex items-center justify-center transition-all
                  ${isSelected ? 'shadow-md' : 'bg-white shadow-sm'}`}
                  style={isSelected ? { backgroundColor: `${meta.color}20` } : undefined}>
                  <IIcon size={20} style={{ color: isSelected ? meta.color : '#9ca3af' }} strokeWidth={1.8} />
                </div>
                <span className={`text-[10px] md:text-xs font-semibold leading-tight
                  ${isSelected ? 'text-text-main' : 'text-text-secondary'}`}>
                  {interest.label}
                </span>
                {isSelected && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold shadow-sm"
                    style={{ backgroundColor: meta.color }}>✓</div>
                )}
              </button>
            );
          })}
        </div>

        {state.data.interests.length > 0 && (
          <div className="mt-3 text-center">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent-dark bg-accent-light/50 px-3 py-1.5 rounded-full">
              <CheckCircle size={14} /> Đã chọn {state.data.interests.length} sở thích
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
