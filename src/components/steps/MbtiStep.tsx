'use client';

import React, { useRef, useEffect } from 'react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { mbtiQuestions } from '@/data/mbti-questions';
import { Brain, CheckCircle2 } from 'lucide-react';

export default function MbtiStep() {
  const { state, updateData } = useAssessment();
  const listRef = useRef<HTMLDivElement>(null);

  const answeredCount = state.data.mbtiAnswers.filter(a => a !== '').length;
  const isComplete = answeredCount === mbtiQuestions.length;

  const handleAnswer = (questionIndex: number, answer: 'A' | 'B') => {
    const newAnswers = [...state.data.mbtiAnswers];
    newAnswers[questionIndex] = answer;
    updateData({ mbtiAnswers: newAnswers });

    // Auto scroll to next question after a short delay
    if (questionIndex < mbtiQuestions.length - 1) {
      setTimeout(() => {
        const nextQ = document.getElementById(`mbti-q-${questionIndex + 1}`);
        if (nextQ) {
          nextQ.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    }
  };

  return (
    <div className="animate-fade-in-up -mx-1 md:mx-0">
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mb-3">
          <Brain size={24} />
        </div>
        <h2 className="text-lg md:text-2xl font-bold text-text-main mb-2">Trắc nghiệm MBTI</h2>
        <p className="text-sm text-text-secondary max-w-lg mx-auto">
          70 câu hỏi giúp AI phân tích sâu hơn về nhóm tính cách của bạn. Hãy chọn đáp án phù hợp nhất với bản thân một cách tự nhiên.
        </p>
      </div>

      {/* Progress Sticky Bar */}
      <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center justify-between transition-all">
        <div className="text-sm font-bold text-text-main">
          Tiến độ: <span className="text-indigo-600">{answeredCount}/70</span>
        </div>
        <div className="flex-1 mx-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-300"
              style={{ width: `${(answeredCount / 70) * 100}%` }}
            />
          </div>
        </div>
        {isComplete && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-bold animate-pulse">
            <CheckCircle2 size={16} /> Hoàn tất
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto space-y-4" ref={listRef}>
        {mbtiQuestions.map((q, idx) => {
          const currentAnswer = state.data.mbtiAnswers[idx];
          const isA = currentAnswer === 'A';
          const isB = currentAnswer === 'B';
          
          return (
            <div 
              key={q.id} 
              id={`mbti-q-${idx}`}
              className={`bg-white rounded-2xl p-4 md:p-6 border-2 transition-all duration-300 ${currentAnswer ? 'border-indigo-100 shadow-sm' : 'border-gray-100'}`}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors
                  ${currentAnswer ? 'bg-indigo-500 text-white shadow-md' : 'bg-gray-100 text-gray-500'}`}>
                  {q.id}
                </div>
                <h4 className="text-sm md:text-base font-bold text-text-main leading-relaxed">
                  {q.question}
                </h4>
              </div>

              <div className="flex flex-col gap-2 pl-0 md:pl-11">
                {/* Option A */}
                <button
                  onClick={() => handleAnswer(idx, 'A')}
                  className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                    ${isA 
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                      : 'border-transparent bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50/30'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                    ${isA ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'}`}>
                    {isA && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm md:text-base font-medium ${isA ? 'text-indigo-900' : 'text-text-main'}`}>
                    {q.optionA}
                  </span>
                </button>

                {/* Option B */}
                <button
                  onClick={() => handleAnswer(idx, 'B')}
                  className={`flex items-center gap-3 p-3 md:p-4 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer
                    ${isB 
                      ? 'border-indigo-500 bg-indigo-50 shadow-sm' 
                      : 'border-transparent bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50/30'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
                    ${isB ? 'border-indigo-500 bg-indigo-500' : 'border-gray-300 bg-white'}`}>
                    {isB && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-sm md:text-base font-medium ${isB ? 'text-indigo-900' : 'text-text-main'}`}>
                    {q.optionB}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
