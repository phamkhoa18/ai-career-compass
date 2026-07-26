'use client';

import React from 'react';
import { Input, Form } from 'antd';
import { useAssessment } from '@/contexts/AssessmentContext';
import { UserRound, School, Sparkles, Clock, ListChecks } from 'lucide-react';

export default function PersonalInfoStep() {
  const { state, updateData } = useAssessment();
  const { fullName, className } = state.data;
  const isReady = fullName.trim().length > 0 && className.trim().length > 0;

  return (
    <div className="animate-fade-in-up">
      {/* Welcome hero */}
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-text-main mb-2">Xin chào!</h2>
        <p className="text-sm md:text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          Chào mừng bạn đến với bài trắc nghiệm hướng nghiệp. Hãy bắt đầu bằng việc cho mình biết tên bạn nhé!
        </p>
      </div>

      {/* Form */}
      <div className="max-w-sm mx-auto mb-8">
        <Form layout="vertical" className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Họ và Tên</label>
            <Input
              prefix={<UserRound size={18} className="text-primary" strokeWidth={1.8} />}
              placeholder="Nguyễn Văn A"
              size="large"
              value={fullName}
              onChange={(e) => updateData({ fullName: e.target.value })}
              className="!rounded-2xl !h-14 !text-base !font-medium"
              style={{ paddingLeft: 16 }}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-text-main mb-2">Lớp</label>
            <Input
              prefix={<School size={18} className="text-secondary-dark" strokeWidth={1.8} />}
              placeholder="12A1"
              size="large"
              value={className}
              onChange={(e) => updateData({ className: e.target.value })}
              className="!rounded-2xl !h-14 !text-base !font-medium"
              style={{ paddingLeft: 16 }}
            />
          </div>
        </Form>
      </div>

      {/* What to expect */}
      <div className="max-w-md mx-auto">
        <div className={`rounded-2xl border-2 transition-all duration-500 overflow-hidden ${isReady ? 'border-accent/30 bg-accent-light/30' : 'border-border-soft bg-white/50'}`}>
          <div className="p-4 md:p-5">
            <h3 className="text-sm font-bold text-text-main mb-3 flex items-center gap-2">
              <ListChecks size={16} className="text-accent-dark" /> Bài test bao gồm:
            </h3>
            <div className="space-y-2.5">
              {[
                { step: 'Nhập điểm học lực các môn', time: '~2 phút', color: '#7CB8CC' },
                { step: '42 câu hỏi RIASEC', time: '~8 phút', color: '#B896D6' },
                { step: 'Chọn sở thích & đánh giá kỹ năng', time: '~3 phút', color: '#E8B88A' },
                { step: 'Đánh giá giá trị nghề nghiệp', time: '~2 phút', color: '#7CC9A8' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-xs md:text-sm text-text-secondary flex-1">{item.step}</span>
                  <span className="text-[10px] text-text-light font-semibold flex items-center gap-1">
                    <Clock size={10} /> {item.time}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-border-soft flex items-center justify-between">
              <span className="text-xs text-text-light font-semibold">Tổng thời gian ước tính</span>
              <span className="text-sm font-bold text-primary-dark">~15 phút</span>
            </div>
          </div>
        </div>

        {isReady && (
          <p className="text-center mt-4 text-sm font-semibold text-accent-dark animate-fade-in flex items-center justify-center gap-1.5">
            <Sparkles size={14} /> Sẵn sàng rồi! Nhấn "Tiếp theo" để bắt đầu
          </p>
        )}
      </div>
    </div>
  );
}
