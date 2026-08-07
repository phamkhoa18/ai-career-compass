'use client';

import React from 'react';
import { Button, notification, Modal, Spin } from 'antd';
import { useRouter } from 'next/navigation';
import { AssessmentProvider, useAssessment } from '@/contexts/AssessmentContext';
import Navbar from '@/components/ui/Navbar';
import PersonalInfoStep from '@/components/steps/PersonalInfoStep';
import AcademicStep from '@/components/steps/AcademicStep';
import RiasecStep from '@/components/steps/RiasecStep';
import InterestsStep from '@/components/steps/InterestsStep';
import CareerValuesStep from '@/components/steps/CareerValuesStep';
import MbtiStep from '@/components/steps/MbtiStep';
import {
  UserRound, BookOpen, Microscope, Heart, Trophy,
  ArrowLeft, ArrowRight, Rocket, GraduationCap, Check, Brain,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const steps: { title: string; desc: string; Icon: LucideIcon; color: string }[] = [
  { title: 'Thông tin', desc: 'Họ tên, lớp', Icon: UserRound, color: '#E8899D' },
  { title: 'Học lực', desc: 'Điểm các môn', Icon: BookOpen, color: '#7CB8CC' },
  { title: 'RIASEC', desc: '60 câu hỏi', Icon: Microscope, color: '#B896D6' },
  { title: 'MBTI', desc: '70 câu hỏi', Icon: Brain, color: '#6366f1' },
  { title: 'Sở thích', desc: 'Kỹ năng mềm', Icon: Heart, color: '#E8B88A' },
  { title: 'Giá trị', desc: 'Nghề nghiệp', Icon: Trophy, color: '#7CC9A8' },
];

function AssessmentForm() {
  const { state, dispatch, nextStep, prevStep, clearDraft } = useAssessment();
  const router = useRouter();
  const [api, contextHolder] = notification.useNotification();
  const [modal, modalContextHolder] = Modal.useModal();
  const cur = state.currentStep;

  const validateStep = () => {
    const { data, currentStep } = state;
    switch (currentStep) {
      case 0:
        if (!data.fullName.trim() || !data.className.trim()) { api.warning({ description: 'Vui lòng nhập đầy đủ họ tên và lớp!', placement: 'topRight' }); return false; }
        return true;
      case 1:
        if (data.academicScores.filter((s) => s.score > 0).length < 3) { api.warning({ description: 'Vui lòng nhập điểm ít nhất 3 môn!', placement: 'topRight' }); return false; }
        return true;
      case 2:
        const ansRiasec = data.riasecAnswers.filter((a) => a !== -1).length;
        if (ansRiasec < 60) { api.warning({ description: `Bạn còn ${60 - ansRiasec} câu RIASEC chưa trả lời!`, placement: 'topRight' }); return false; }
        return true;
      case 3:
        const ansMbti = data.mbtiAnswers.filter((a) => a !== '').length;
        if (ansMbti < 70) { api.warning({ description: `Bạn còn ${70 - ansMbti} câu MBTI chưa trả lời!`, placement: 'topRight' }); return false; }
        return true;
      case 4:
        if (data.interests.length === 0) { api.warning({ description: 'Vui lòng chọn ít nhất 1 sở thích!', placement: 'topRight' }); return false; }
        return true;
      default: return true;
    }
  };

  const handleNext = () => { if (validateStep()) { nextStep(); window.scrollTo({ top: 0, behavior: 'smooth' }); } };

  const handleSubmit = async () => {
    if (!validateStep()) return;
    modal.confirm({
      title: 'Gửi bài đánh giá?',
      icon: null,
      content: 'AI sẽ phân tích và đưa ra gợi ý ngành nghề phù hợp nhất. Quá trình này mất khoảng 10-30 giây.',
      okText: 'Gửi ngay!', cancelText: 'Xem lại', centered: true,
      onOk: () => {
        // Run asynchronously without returning a promise so the modal closes immediately
        (async () => {
          dispatch({ type: 'SET_SUBMITTING', payload: true });
          try {
            const res = await fetch('/api/assessment', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(state.data) });
            if (!res.ok) throw new Error('Failed');
            const result = await res.json();
            dispatch({ type: 'SET_RESULT_ID', payload: result.id });
            
            // Lưu ID vào localStorage để hiển thị Lịch sử cục bộ
            const storedHistory = JSON.parse(localStorage.getItem('my_assessments') || '[]');
            if (!storedHistory.includes(result.id)) {
              storedHistory.push(result.id);
              localStorage.setItem('my_assessments', JSON.stringify(storedHistory));
            }

            clearDraft();
            api.success({ description: 'Phân tích hoàn tất!', placement: 'topRight' });
            setTimeout(() => router.push(`/result/${result.id}`), 1000);
          } catch { api.error({ description: 'Có lỗi xảy ra. Vui lòng thử lại!', placement: 'topRight' }); }
          finally { dispatch({ type: 'SET_SUBMITTING', payload: false }); }
        })();
      },
    });
  };

  const renderStep = () => {
    switch (cur) {
      case 0: return <PersonalInfoStep />;
      case 1: return <AcademicStep />;
      case 2: return <RiasecStep />;
      case 3: return <MbtiStep />;
      case 4: return <InterestsStep />;
      case 5: return <CareerValuesStep />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden has-bottom-nav">
      {contextHolder}
      {modalContextHolder}

      {/* Premium Fullscreen Loading Overlay */}
      {state.isSubmitting && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md animate-fade-in">
          <div className="relative flex items-center justify-center">
            <div className="absolute w-32 h-32 rounded-full border-[4px] border-primary/20 border-t-primary animate-spin"></div>
            <div className="absolute w-24 h-24 rounded-full border-[4px] border-accent/20 border-b-accent animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-xl shadow-primary/30 animate-pulse">
              <Rocket size={28} className="text-white" />
            </div>
          </div>
          <h3 className="mt-12 text-2xl md:text-3xl font-black bg-gradient-to-r from-primary-dark via-primary to-accent bg-clip-text text-transparent animate-pulse">
            AI đang phân tích dữ liệu...
          </h3>
          <p className="mt-3 text-sm md:text-base text-text-secondary font-medium text-center max-w-sm px-4">
            Quá trình này sẽ mất khoảng 10-15 giây để tìm ra các nhóm ngành phù hợp nhất với hồ sơ của bạn.
          </p>
        </div>
      )}

      <Navbar />

      <div className="blob w-64 h-64 bg-primary-light top-32 -left-16" />
      <div className="blob w-80 h-80 bg-secondary-light top-60 -right-24" />

      <div className="relative z-10 pt-16 md:pt-24 pb-8 md:pb-12 px-3 md:px-4">
        <div className="max-w-4xl mx-auto">

          {/* Resume banner */}
          {state.isHydrated && cur > 0 && state.data.fullName && (
            <div className="flex items-center justify-between bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2.5 mb-3 animate-fade-in">
              <span className="text-xs md:text-sm font-semibold text-text-main">
                📝 Tiếp tục bài test của <span className="text-primary-dark">{state.data.fullName}</span>
              </span>
              <Button size="small" onClick={clearDraft} className="text-[10px] border-0">Làm lại từ đầu</Button>
            </div>
          )}

          {/* ===== Custom Step Indicator ===== */}
          <div className="glass-card p-3 md:p-5 mb-4 md:mb-6">
            {/* Desktop */}
            <div className="hidden md:flex items-center justify-between">
              {steps.map((step, i) => {
                const isDone = i < cur;
                const isActive = i === cur;
                const isLast = i === steps.length - 1;
                return (
                  <React.Fragment key={i}>
                    <div className={`flex items-center gap-3 transition-all duration-300 ${isActive ? 'scale-[1.02]' : ''}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm
                        ${isDone ? 'bg-accent text-white' : isActive ? 'text-white shadow-md' : 'bg-gray-100 text-text-light'}`}
                        style={isActive ? { backgroundColor: step.color } : undefined}>
                        {isDone ? <Check size={18} strokeWidth={3} /> : <step.Icon size={18} strokeWidth={isActive ? 2.2 : 1.5} />}
                      </div>
                      <div>
                        <div className={`text-sm font-bold leading-tight ${isActive ? 'text-text-main' : isDone ? 'text-accent-dark' : 'text-text-light'}`}>
                          {step.title}
                        </div>
                        <div className="text-[10px] text-text-light font-medium">{step.desc}</div>
                      </div>
                    </div>
                    {!isLast && (
                      <div className="flex-1 mx-2">
                        <div className="h-[2px] rounded-full bg-gray-100 overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${isDone ? 'w-full bg-accent' : 'w-0'}`} />
                        </div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Mobile */}
            <div className="md:hidden">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-2">
                  {React.createElement(steps[cur].Icon, { size: 16, style: { color: steps[cur].color }, strokeWidth: 2.2 })}
                  <span className="text-sm font-bold text-text-main">{steps[cur].title}</span>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: steps[cur].color }}>
                  {cur + 1} / {steps.length}
                </span>
              </div>
              <div className="flex gap-1.5">
                {steps.map((s, i) => (
                  <div key={i} className="h-1.5 rounded-full flex-1 transition-all duration-300 overflow-hidden bg-gray-100">
                    <div className={`h-full rounded-full transition-all duration-500 ${i <= cur ? 'w-full' : 'w-0'}`}
                      style={{ backgroundColor: i <= cur ? s.color : undefined }} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ===== Content ===== */}
          <div className="glass-card p-4 md:p-8 mb-4 md:mb-6">
            {state.isSubmitting ? (
              <div className="text-center py-12">
                <GraduationCap size={48} className="text-primary mx-auto mb-4 animate-pulse-soft" />
                <Spin size="large" className="mb-4" />
                <h3 className="text-lg font-bold text-text-main mb-1">AI đang phân tích...</h3>
                <p className="text-sm text-text-secondary">Vui lòng chờ trong giây lát!</p>
              </div>
            ) : renderStep()}
          </div>

          {/* ===== Navigation ===== */}
          {!state.isSubmitting && (
            <div className="flex justify-between items-center gap-2 md:gap-4 mt-2">
              <Button
                disabled={cur === 0}
                className="h-10 px-3 md:px-5 rounded-full font-medium text-sm border-border-soft hover:border-primary/50 hover:text-primary transition-colors flex items-center justify-center min-w-[40px] md:min-w-[110px]"
                onClick={() => { prevStep(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <ArrowLeft size={18} className="md:mr-1" /> <span className="hidden md:inline">Quay lại</span>
              </Button>

              {/* Sleek Step dots */}
              <div className="flex gap-1.5 md:gap-2 items-center">
                {steps.map((s, i) => (
                  <div key={i} className={`rounded-full transition-all duration-500
                    ${i === cur ? 'w-5 md:w-8 h-1.5' : 'w-1.5 h-1.5'}
                    ${i < cur ? 'bg-accent opacity-60' : i === cur ? 'shadow-sm' : 'bg-gray-200'}`}
                    style={i === cur ? { backgroundColor: s.color } : undefined} />
                ))}
              </div>

              {cur < steps.length - 1 ? (
                <Button
                  type="primary"
                  className="h-10 px-3 md:px-5 rounded-full font-medium text-sm flex items-center justify-center min-w-[40px] md:min-w-[110px] bg-gradient-to-r from-primary to-primary-dark border-0 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
                  onClick={handleNext}
                >
                  <span className="hidden md:inline">Tiếp theo</span> <ArrowRight size={18} className="md:ml-1" />
                </Button>
              ) : (
                <Button
                  type="primary"
                  onClick={handleSubmit}
                  loading={state.isSubmitting}
                  className="h-10 px-4 md:px-6 rounded-full font-bold text-sm bg-gradient-to-r from-accent to-accent-dark border-0 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center"
                >
                  <Rocket size={18} className="mr-1.5" /> <span>Hoàn thành</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AssessmentPage() {
  return <AssessmentProvider><AssessmentForm /></AssessmentProvider>;
}
