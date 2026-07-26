'use client';

import React from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { careerValuesList } from '@/data/subjects';
import { Diamond, DollarSign, Lock, Palette, Globe, Heart, TrendingUp, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const valueIcons: Record<string, { Icon: LucideIcon; color: string }> = {
  income: { Icon: DollarSign, color: '#22c55e' },
  stability: { Icon: Lock, color: '#3b82f6' },
  creativity: { Icon: Palette, color: '#f59e0b' },
  socialImpact: { Icon: Globe, color: '#ec4899' },
  workLifeBalance: { Icon: Heart, color: '#ef4444' },
  advancement: { Icon: TrendingUp, color: '#8b5cf6' },
};

const stars = [1, 2, 3, 4, 5];
const starLabels: Record<number, string> = {
  1: 'Không quan trọng', 2: 'Ít quan trọng', 3: 'Bình thường', 4: 'Quan trọng', 5: 'Rất quan trọng',
};

export default function CareerValuesStep() {
  const { state, updateData } = useAssessment();

  const handleChange = (key: string, value: number) => {
    updateData({ careerValues: { ...state.data.careerValues, [key]: value } });
  };

  const allRated = careerValuesList.every((cv) => {
    const v = state.data.careerValues[cv.key as keyof typeof state.data.careerValues];
    return v && v > 0;
  });

  return (
    <div className="animate-fade-in-up">
      <div className="text-center mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-text-main mb-1">Giá trị nghề nghiệp</h2>
        <p className="text-sm text-text-secondary">Điều gì quan trọng nhất với bạn trong công việc?</p>
      </div>

      <div className="max-w-lg mx-auto space-y-3 stagger-children">
        {careerValuesList.map((cv) => {
          const value = state.data.careerValues[cv.key as keyof typeof state.data.careerValues];
          const meta = valueIcons[cv.key] || { Icon: Diamond, color: '#6b7280' };
          const ValIcon = meta.Icon;
          const label = value > 0 ? starLabels[value] : '';

          return (
            <div key={cv.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-4 md:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: `${meta.color}15` }}>
                    <ValIcon size={20} style={{ color: meta.color }} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm md:text-base text-text-main">{cv.name}</h4>
                    <p className="text-[10px] md:text-xs text-text-light mb-3">{cv.description}</p>

                    {/* Custom star rating */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex gap-0.5">
                        {stars.map((star) => {
                          const isFilled = value >= star;
                          return (
                            <button key={star} onClick={() => handleChange(cv.key, star)}
                              className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-200
                                ${isFilled
                                  ? 'scale-105 shadow-sm'
                                  : 'bg-gray-100 hover:bg-gray-200 hover:scale-105 active:scale-95'
                                }`}
                              style={isFilled ? { backgroundColor: `${meta.color}20` } : undefined}
                            >
                              <span className={`text-lg md:text-xl transition-all ${isFilled ? 'scale-110' : 'grayscale opacity-40'}`}>
                                ⭐
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      {label && (
                        <span className="text-[10px] md:text-xs font-semibold ml-1 hidden sm:inline"
                          style={{ color: meta.color }}>{label}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom fill bar */}
              <div className="h-1 bg-gray-50">
                <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${(value / 5) * 100}%`, backgroundColor: meta.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Ready message */}
      {allRated && (
        <div className="max-w-lg mx-auto mt-6 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2.5 bg-green-50 border border-green-200 px-5 py-3 rounded-2xl shadow-sm">
            <Rocket size={18} className="text-green-600" />
            <span className="text-sm font-bold text-green-800">
              Tuyệt vời! Nhấn "Hoàn thành" để AI đưa ra kết quả cho bạn
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
